import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";
import { createAdminClient } from "@/lib/studio/supabase-server";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const DEFAULT_COMPETITORS = "wtfpuneet,badmintonclubx,shuttlify,delhibadmintonclub,badmintonclubofindia,eastdelhisportsclub,kanikaaaa108,vibewithkanika_";
const MY_HANDLE = process.env.INSTAGRAM_HANDLE || "racquetsclubcommunity";
const COMPETITORS = (process.env.COMPETITOR_HANDLES || DEFAULT_COMPETITORS)
  .split(",")
  .filter(Boolean);
const ALL_HANDLES = [MY_HANDLE, ...COMPETITORS];

export type Scope = "mine" | "competitors" | "all";

function handlesForScope(scope: Scope): string[] {
  if (scope === "mine") return [MY_HANDLE];
  if (scope === "competitors") return COMPETITORS;
  return ALL_HANDLES;
}

function parseScope(value: string | null): Scope {
  return value === "mine" || value === "competitors" ? value : "all";
}

// One `scrape_runs` row per scope (not a single shared "latest") so my
// daily run and the competitors' twice-weekly run can be in flight at the
// same time without one run's webhook overwriting the other's run_id
// before it's been collected.
function runRowId(scope: Scope) {
  return `latest_${scope}`;
}

async function startScrape(scope: Scope) {
  const apifyToken = process.env.APIFY_API_TOKEN;
  if (!apifyToken) throw new Error("Missing APIFY_API_TOKEN");

  const handles = handlesForScope(scope);
  const client = new ApifyClient({ token: apifyToken });

  const input = {
    directUrls: handles.map((h) => `https://www.instagram.com/${h}/`),
    resultsType: "posts",
    resultsLimit: 30,
    searchType: "hashtag",
    searchLimit: 1,
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://racquetsclubcommunity.com";
  const run = await client.actor("apify/instagram-scraper").start(input, {
    webhooks: [{
      eventTypes: ["ACTOR.RUN.SUCCEEDED"],
      requestUrl: `${baseUrl}/api/studio/scrape-status?scope=${scope}`,
    }],
  });

  const supabase = createAdminClient();
  await supabase.from("scrape_runs").upsert(
    {
      id: runRowId(scope),
      run_id: run.id,
      dataset_id: run.defaultDatasetId,
      status: "RUNNING",
      started_at: new Date().toISOString(),
      handles,
    },
    { onConflict: "id" }
  );

  return {
    success: true,
    status: "RUNNING",
    runId: run.id,
    scope,
    message: `Scraping ${handles.length} handle(s) (${scope}) — check back in a few minutes. Reviews sync separately on their own nightly GitHub Action.`,
  };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scope = parseScope(new URL(request.url).searchParams.get("scope"));

  try {
    const result = await startScrape(scope);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const scope = parseScope(new URL(request.url).searchParams.get("scope"));

  try {
    const result = await startScrape(scope);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
