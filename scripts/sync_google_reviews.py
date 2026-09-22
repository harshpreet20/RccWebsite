"""Sync Google Maps reviews into Supabase's `reviews` table (source='google').

Same technique as Dr. Kaul's project (harshpreet20/drkaul), adapted to write
into RCC's shared `reviews` table instead of a dedicated one, since Studio's
Analyst agent and the /admin/studio/reviews page already read from `reviews`.
Run on a schedule by .github/workflows/sync-studio-reviews.yml (a GitHub
Actions cron job, not Vercel Cron, since this needs a real Playwright browser
via crawl4ai, which a Vercel serverless function can't provide). Studio's own
Next.js API routes only ever read this table back; nothing else needs to
know this script exists.

Requires GOOGLE_MAPS_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in the
environment. Exits cleanly (no crash, no partial writes) if any are missing,
or if zero reviews could be parsed from the page.

Known fragility: Google Maps' review DOM uses obfuscated class names that
change over time without notice. The selectors below are current as of when
this was written (copied from drkaul's proven working script); if a run logs
"0 reviews found" after previously working, open the Google Maps listing in
a real browser, inspect a review block, and update SCHEMA/SCROLL_JS
accordingly. See drkaul's scripts/sync_google_reviews.py for the full
history of why SCROLL_JS is built the way it is (tab/sort clicking,
structural scroll-panel fallback, the SYNC_DIAG:: title-marker diagnostics
trick) -- that reasoning applies here unchanged.
"""

import asyncio
import hashlib
import json
import os
import re
import sys
import time
from datetime import datetime, timedelta, timezone

from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from supabase import create_client

SCROLL_JS = """
(async () => {
  document.title = 'SYNC_DIAG_START::' + Date.now();

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const countBlocks = () => document.querySelectorAll('div.jftiEf').length;

  let tabFound = false;
  const tabCandidates = document.querySelectorAll('button, a, [role="tab"], [role="button"]');
  for (const tab of tabCandidates) {
    const label = (tab.textContent || '').trim().toLowerCase();
    if (label.startsWith('review')) {
      tab.click();
      tabFound = true;
      await wait(1500);
      break;
    }
  }

  let sortFound = false;
  let newestFound = false;
  const sortButton = Array.from(document.querySelectorAll('button')).find((btn) =>
    ((btn.getAttribute('aria-label') || '') + ' ' + (btn.textContent || '')).toLowerCase().includes('sort'),
  );
  if (sortButton) {
    sortButton.click();
    sortFound = true;
    await wait(800);
    const newestOption = Array.from(document.querySelectorAll('[role="menuitemradio"], [role="menuitem"]')).find(
      (item) => (item.textContent || '').trim().toLowerCase() === 'newest',
    );
    if (newestOption) {
      newestOption.click();
      newestFound = true;
      await wait(1500);
    }
  }

  for (let attempt = 0; attempt < 6 && countBlocks() === 0; attempt++) {
    await wait(500);
  }
  const blocksBeforeScroll = countBlocks();

  let panel = document.querySelector('div[role="main"] div.m6QErb.DxyBCb.kA9KIf.dS8AEf')
    || document.querySelector('div.m6QErb.DxyBCb');
  let panelStrategy = panel ? 'class-match' : null;

  if (!panel) {
    const firstBlock = document.querySelector('div.jftiEf');
    let node = firstBlock ? firstBlock.parentElement : null;
    while (node && node !== document.body) {
      const style = window.getComputedStyle(node);
      const scrollable = style.overflowY === 'auto' || style.overflowY === 'scroll';
      if (scrollable && node.scrollHeight > node.clientHeight + 40) {
        panel = node;
        panelStrategy = 'scroll-walk';
        break;
      }
      node = node.parentElement;
    }
  }

  if (!panel) {
    panel = document.scrollingElement || document.documentElement;
    panelStrategy = 'fallback-body';
  }

  const expandReviews = () => {
    document.querySelectorAll('button.w8nwRe.kyuRq').forEach((btn) => btn.click());
  };

  let stableIterations = 0;
  let lastCount = countBlocks();
  for (let i = 0; i < 20 && stableIterations < 3; i++) {
    panel.scrollBy(0, 1200);
    await wait(1000);
    expandReviews();
    const currentCount = countBlocks();
    stableIterations = currentCount <= lastCount ? stableIterations + 1 : 0;
    lastCount = currentCount;
  }
  await wait(500);
  expandReviews();

  const blocksAfterScroll = countBlocks();

  document.title = 'SYNC_DIAG::' + JSON.stringify({
    tabFound, sortFound, newestFound, panelStrategy, blocksBeforeScroll, blocksAfterScroll,
  });
})();
"""

SCHEMA = {
    "name": "GoogleReviews",
    "baseSelector": "div.jftiEf",
    "fields": [
        {"name": "review_id", "selector": ":scope", "type": "attribute", "attribute": "data-review-id"},
        {"name": "review_id_nested", "selector": "[data-review-id]", "type": "attribute", "attribute": "data-review-id"},
        {"name": "author", "selector": ".d4r55", "type": "text"},
        {"name": "rating_label", "selector": ".kvMYJc", "type": "attribute", "attribute": "aria-label"},
        {"name": "text", "selector": ".wiI7pd", "type": "text"},
        {"name": "relative_date", "selector": ".rsqaWe", "type": "text"},
        {"name": "raw_html", "selector": ":scope", "type": "html"},
    ],
}


def parse_rating(rating_label):
    if not rating_label:
        return None
    match = re.search(r"(\d+)", rating_label)
    return int(match.group(1)) if match else None


def make_review_id(author, text):
    digest = hashlib.sha256(f"{author}|{text}".encode("utf-8")).hexdigest()
    return f"gmaps-{digest[:24]}"


def make_review_url(review_id):
    if not review_id:
        return None
    return f"https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1s{review_id}!7e81!9b0?hl=en"


UNIT_TO_DAYS = {"day": 1, "week": 7, "month": 30, "year": 365}


def parse_relative_date(relative_date, now=None):
    if not relative_date:
        return None
    text = relative_date.strip().lower()
    if text in ("just now", "a moment ago"):
        return (now or datetime.now(timezone.utc)).isoformat()

    match = re.search(r"(a|an|\d+)\s+(day|week|month|year)s?\s+ago", text)
    if not match:
        return None

    amount = 1 if match.group(1) in ("a", "an") else int(match.group(1))
    days = amount * UNIT_TO_DAYS[match.group(2)]
    return ((now or datetime.now(timezone.utc)) - timedelta(days=days)).isoformat()


async def scrape(maps_url):
    browser_config = BrowserConfig(headless=True)
    run_config = CrawlerRunConfig(
        js_code=SCROLL_JS,
        extraction_strategy=JsonCssExtractionStrategy(SCHEMA),
        wait_for="css:div.jftiEf",
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url=maps_url, config=run_config)

    found_any = False
    for marker_name, marker in (("final", "SYNC_DIAG::"), ("start", "SYNC_DIAG_START::")):
        for field_name in ("html", "cleaned_html"):
            field_value = getattr(result, field_name, None) or ""
            idx = field_value.find(marker)
            if idx != -1:
                print(f"Diagnostics ({marker_name} marker, found in result.{field_name}): {field_value[idx:idx + 300]}")
                found_any = True
                break
        if found_any and marker_name == "final":
            break
    if not found_any:
        print(
            f"No diagnostics marker found at all in result.html (len={len(result.html or '')}) "
            f"or result.cleaned_html (len={len(result.cleaned_html or '')}); SCROLL_JS may not be "
            f"executing against the captured page at all. metadata={result.metadata}"
        )

    if not result.success or not result.extracted_content:
        print(f"Crawl failed or returned nothing: {result.error_message}")
        return []

    rows = json.loads(result.extracted_content)
    print(f"Found {len(rows)} raw review blocks in the DOM before filtering.")
    reviews = []
    for row in rows:
        author = (row.get("author") or "").strip()
        text = (row.get("text") or "").strip()
        if not author or not text:
            continue
        review_id = row.get("review_id") or row.get("review_id_nested")
        source_review_id = make_review_id(author, text)
        reviews.append(
            {
                "source": "google",
                "source_review_id": source_review_id,
                "reviewer_name": author,
                "rating": parse_rating(row.get("rating_label")) or 0,
                "title": "",
                "review_text": text,
                "review_date": parse_relative_date(row.get("relative_date")) or "",
                "data": {
                    "reviewer_photo": None,
                    "response": None,
                    "likes": 0,
                    "review_url": make_review_url(review_id),
                },
            }
        )

    if reviews and rows and not any(r["data"]["review_url"] for r in reviews):
        sample_html = (rows[0].get("raw_html") or "")[:600]
        print(
            "review_url could not be built for any review (no data-review-id found "
            "at the tried spots). Sample review block HTML, for finding the real "
            "attribute and updating SCHEMA's review_id/review_id_nested fields:"
        )
        print(sample_html)

    return reviews


def upsert_with_retry(supabase, reviews, attempts=3, base_delay=2):
    for attempt in range(1, attempts + 1):
        try:
            supabase.table("reviews").upsert(reviews, on_conflict="source,source_review_id").execute()
            return
        except Exception as exc:
            if attempt == attempts:
                raise
            delay = base_delay * (2 ** (attempt - 1))
            print(f"Upsert attempt {attempt} failed ({exc}); retrying in {delay}s.")
            time.sleep(delay)


def main():
    maps_url = os.environ.get("GOOGLE_MAPS_URL")
    supabase_url = os.environ.get("SUPABASE_URL")
    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not maps_url or not supabase_url or not service_role_key:
        print("Not configured: set GOOGLE_MAPS_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY. Skipping.")
        return

    reviews = asyncio.run(scrape(maps_url))

    if not reviews:
        print("0 reviews found, nothing written. Selectors may need updating (see module docstring).")
        return

    supabase = create_client(supabase_url, service_role_key)
    upsert_with_retry(supabase, reviews)
    print(f"Synced {len(reviews)} reviews.")


if __name__ == "__main__":
    main()
    sys.exit(0)
