"""Sync Trustpilot reviews into Supabase's `reviews` table (source='trustpilot').

Same crawl4ai + Playwright technique as scripts/sync_google_reviews.py and
Dr. Kaul's project (harshpreet20/drkaul) -- no Apify. Run on a schedule by
.github/workflows/sync-studio-reviews.yml.

Requires TRUSTPILOT_URL (defaults to RCC's own review page below),
SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in the environment. Exits cleanly
(no crash, no partial writes) if the required Supabase vars are missing, or
if zero reviews could be parsed from the page.

Unverified selectors: unlike sync_google_reviews.py (copied from a script
Dr. Kaul's project already runs successfully in production), these
data-service-review-* attribute selectors were written from Trustpilot's
publicly documented review-card markup, not confirmed against a live fetch
-- the sandbox this was written in couldn't reach trustpilot.com (blocked
before this script's own bot-detection dodge even applies). Trustpilot
does front real bot detection (Cloudflare), so the first real GitHub
Actions run is the actual test. If it logs "0 reviews found": open
TRUSTPILOT_URL in a real browser, inspect a review card, and update SCHEMA
below -- data-* attributes are Trustpilot's own testing hooks, so they
should be far more stable than any class name, but they can still change.
"""

import hashlib
import json
import os
import sys
import time
from datetime import datetime, timezone

from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from supabase import create_client
import asyncio

DEFAULT_TRUSTPILOT_URL = "https://www.trustpilot.com/review/racquetsclubcommunity.com"

# Trustpilot lazy-loads only the first page of reviews; this clicks through
# a handful of "Load more" / paginated "Next page" controls (found by their
# visible label, same stable-label approach as drkaul's Google Maps script,
# since Trustpilot's own class names are equally prone to churn) before
# extraction runs.
SCROLL_JS = """
(async () => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  for (let i = 0; i < 4; i++) {
    const nextLink = Array.from(document.querySelectorAll('a, button')).find((el) => {
      const label = (el.getAttribute('aria-label') || el.textContent || '').trim().toLowerCase();
      return label === 'next page' || label.startsWith('next');
    });
    if (!nextLink) break;
    nextLink.click();
    await wait(2000);
  }
})();
"""

SCHEMA = {
    "name": "TrustpilotReviews",
    "baseSelector": "[data-service-review-card-paper]",
    "fields": [
        {"name": "review_id", "selector": ":scope", "type": "attribute", "attribute": "data-review-id"},
        {"name": "author", "selector": "[data-consumer-name-typography]", "type": "text"},
        {"name": "rating_label", "selector": "[data-service-review-rating] img", "type": "attribute", "attribute": "alt"},
        {"name": "title", "selector": "[data-service-review-title-typography]", "type": "text"},
        {"name": "text", "selector": "[data-service-review-text-typography]", "type": "text"},
        {"name": "date", "selector": "[data-service-review-date-time-ago] time", "type": "attribute", "attribute": "datetime"},
        {"name": "raw_html", "selector": ":scope", "type": "html"},
    ],
}


def parse_rating(rating_label):
    if not rating_label:
        return None
    import re

    match = re.search(r"(\d+)", rating_label)
    return int(match.group(1)) if match else None


def make_review_id(author, text):
    digest = hashlib.sha256(f"{author}|{text}".encode("utf-8")).hexdigest()
    return f"trustpilot-{digest[:24]}"


async def scrape(trustpilot_url):
    browser_config = BrowserConfig(headless=True)
    run_config = CrawlerRunConfig(
        js_code=SCROLL_JS,
        extraction_strategy=JsonCssExtractionStrategy(SCHEMA),
        wait_for="css:[data-service-review-card-paper]",
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url=trustpilot_url, config=run_config)

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
        reviews.append(
            {
                "source": "trustpilot",
                "source_review_id": make_review_id(author, text),
                "reviewer_name": author,
                "rating": parse_rating(row.get("rating_label")) or 0,
                "title": (row.get("title") or "").strip(),
                "review_text": text,
                "review_date": row.get("date") or datetime.now(timezone.utc).isoformat(),
                "data": {
                    "verified": False,
                    "reply": None,
                    "likes": 0,
                    "language": "en",
                },
            }
        )

    if rows and not reviews:
        sample_html = (rows[0].get("raw_html") or "")[:600]
        print(
            "No reviews survived filtering (missing author/text). Sample review "
            "block HTML, for updating SCHEMA's selectors:"
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
    trustpilot_url = os.environ.get("TRUSTPILOT_URL", DEFAULT_TRUSTPILOT_URL)
    supabase_url = os.environ.get("SUPABASE_URL")
    service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not service_role_key:
        print("Not configured: set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY. Skipping.")
        return

    reviews = asyncio.run(scrape(trustpilot_url))

    if not reviews:
        print("0 reviews found, nothing written. Selectors may need updating (see module docstring).")
        return

    supabase = create_client(supabase_url, service_role_key)
    upsert_with_retry(supabase, reviews)
    print(f"Synced {len(reviews)} reviews.")


if __name__ == "__main__":
    main()
    sys.exit(0)
