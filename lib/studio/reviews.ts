import { createAdminClient } from "@/lib/studio/supabase-server";

// Google review scraping no longer happens in this app -- it's done by
// scripts/sync_google_reviews.py, run on a schedule by GitHub Actions
// (see .github/workflows/sync-studio-reviews.yml), the same crawl4ai +
// Playwright approach as Dr. Kaul's project. That script writes straight
// into the `reviews` table below with the service role key; this app only
// reads it back.

export async function getStoredReviews(source?: string) {
  const supabase = createAdminClient();
  let query = supabase
    .from("reviews")
    .select("*")
    .order("scraped_at", { ascending: false })
    .limit(100);

  if (source) query = query.eq("source", source);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}
