import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";
import { createAdminClient } from "@/lib/studio/supabase-server";
import type { Scope } from "@/app/api/studio/cron/scrape/route";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEFAULT_COMPETITORS = "wtfpuneet,badmintonclubx,shuttlify,delhibadmintonclub,badmintonclubofindia,eastdelhisportsclub,kanikaaaa108,vibewithkanika_";
const MY_HANDLE = process.env.INSTAGRAM_HANDLE || "racquetsclubcommunity";
const COMPETITORS = (process.env.COMPETITOR_HANDLES || DEFAULT_COMPETITORS)
  .split(",")
  .filter(Boolean);
const ALL_HANDLES = [MY_HANDLE, ...COMPETITORS];

function parseScope(value: string | null): Scope {
  return value === "mine" || value === "competitors" ? value : "all";
}

function runRowId(scope: Scope) {
  return `latest_${scope}`;
}

export async function POST(request: Request) {
  const scope = parseScope(new URL(request.url).searchParams.get("scope"));
  return collectLatestRun(scope);
}

async function collectLatestRun(scope: Scope) {
  const supabase = createAdminClient();
  const { data: runData } = await supabase
    .from("scrape_runs")
    .select("*")
    .eq("id", runRowId(scope))
    .single();

  if (!runData) {
    return NextResponse.json({ status: "IDLE", message: "No scrape in progress" });
  }

  if (runData.status === "SUCCEEDED" || runData.status === "FAILED") {
    return NextResponse.json({
      status: runData.status,
      finishedAt: runData.finished_at,
    });
  }

  const apifyToken = process.env.APIFY_API_TOKEN;
  if (!apifyToken) {
    return NextResponse.json({ status: "ERROR", message: "Missing APIFY_API_TOKEN" });
  }

  try {
    const client = new ApifyClient({ token: apifyToken });
    const run = await client.run(runData.run_id).get();

    if (!run) {
      await supabase.from("scrape_runs").upsert(
        { id: runRowId(scope), status: "FAILED", finished_at: new Date().toISOString() },
        { onConflict: "id" }
      );
      return NextResponse.json({ status: "FAILED", message: "Run not found" });
    }

    if (run.status === "SUCCEEDED") {
      const { items } = await client.dataset(runData.dataset_id).listItems();

      // Only the handles this specific run actually scraped -- stored on
      // the run row by cron/scrape's startScrape(), not the module-level
      // full handle list, since "mine" and "competitors" runs each only
      // cover part of it.
      const runHandles: string[] = runData.handles || ALL_HANDLES;

      const grouped: Record<string, any[]> = {};
      for (const handle of runHandles) {
        grouped[handle] = [];
      }

      for (const item of items) {
        const owner =
          (item as any).ownerUsername ||
          (item as any).owner?.username ||
          (item as any).profileName ||
          "unknown";
        const normalizedOwner = owner.toLowerCase().replace(/^@/, "");
        const matchedHandle = runHandles.find(
          (h) => h.toLowerCase() === normalizedOwner
        );

        const post = {
          id: (item as any).id || (item as any).shortCode,
          shortCode: (item as any).shortCode,
          caption: (item as any).caption || "",
          likes: (item as any).likesCount || (item as any).likes || 0,
          comments: (item as any).commentsCount || (item as any).comments || 0,
          views: (item as any).videoViewCount || (item as any).views || 0,
          timestamp: (item as any).timestamp || (item as any).takenAtTimestamp,
          type: (item as any).type || "unknown",
          url:
            (item as any).url ||
            `https://www.instagram.com/p/${(item as any).shortCode}/`,
          hashtags: (item as any).hashtags || [],
          ownerUsername: normalizedOwner,
        };

        if (matchedHandle) {
          grouped[matchedHandle].push(post);
        } else {
          if (!grouped["_other"]) grouped["_other"] = [];
          grouped["_other"].push(post);
        }
      }

      // Merge into the most recent existing row rather than inserting a
      // partial one, so a "mine"-only or "competitors"-only run doesn't
      // wipe out the other side's most recent data -- getMyStats/
      // getCompetitorStats only ever read the single latest `scrapes` row.
      const { data: previous } = await supabase
        .from("scrapes")
        .select("data")
        .order("scraped_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const mergedProfiles = {
        ...(previous?.data?.profiles || {}),
        ...grouped,
      };
      const totalPosts = Object.values(mergedProfiles).reduce(
        (sum: number, posts) => sum + (Array.isArray(posts) ? posts.length : 0),
        0
      );

      const output = {
        scrapedAt: new Date().toISOString(),
        myHandle: MY_HANDLE,
        competitors: COMPETITORS,
        profiles: mergedProfiles,
        totalPosts,
      };

      await supabase.from("scrapes").insert({
        my_handle: MY_HANDLE,
        competitors: COMPETITORS,
        data: output,
      });

      await supabase.from("scrape_runs").upsert(
        { id: runRowId(scope), status: "SUCCEEDED", finished_at: new Date().toISOString() },
        { onConflict: "id" }
      );

      // Auto-regenerate brain context with the new data
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://racquetsclubcommunity.com";
      fetch(`${baseUrl}/api/studio/brain`, { method: "POST" }).catch(() => {});

      return NextResponse.json({
        status: "SUCCEEDED",
        scope,
        newPosts: items.length,
        totalPosts,
        scrapedAt: output.scrapedAt,
      });
    }

    if (run.status === "FAILED" || run.status === "ABORTED" || run.status === "TIMED-OUT") {
      await supabase.from("scrape_runs").upsert(
        { id: runRowId(scope), status: "FAILED", finished_at: new Date().toISOString() },
        { onConflict: "id" }
      );
      return NextResponse.json({
        status: "FAILED",
        message: `Apify run ${run.status.toLowerCase()}`,
      });
    }

    return NextResponse.json({
      status: "RUNNING",
      message: "Scrape in progress...",
    });
  } catch (e: any) {
    return NextResponse.json({ status: "ERROR", message: e.message });
  }
}

export async function GET(request: Request) {
  const scope = parseScope(new URL(request.url).searchParams.get("scope"));
  return collectLatestRun(scope);
}
