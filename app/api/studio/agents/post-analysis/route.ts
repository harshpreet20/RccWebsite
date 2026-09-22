import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";
import { runDualAgent } from "@/lib/studio/dual-agent";
import { wrapUntrusted } from "@/lib/studio/guardrails";
import { saveReport } from "@/lib/studio/supabase-server";
import { getLearnings, buildEnhancedPrompt } from "@/lib/studio/micro-intel";
import { buildBrainContext, injectBrainContext } from "@/lib/studio/brain";

export const dynamic = "force-dynamic";
export const maxDuration = 280;

// Custom actor (not apify/instagram-scraper): built to deep-dive a single
// post/reel -- metadata from JSON-LD/OG tags (stable) plus comments via an
// endpoint-agnostic heuristic against Instagram's private API (fragile by
// nature, per its own README -- a low commentsScraped or
// reachedCommentLimit: false means Instagram's frontend likely shifted
// under it, not that the post has few comments).
const ACTOR_ID = "racquetsclubcommunity/instagram-post-reel-deep-scraper";

const BASE_SYSTEM = `You are the POST ANALYSIS agent for a badminton/racquet sports Instagram account.
Your job: given one specific post's metadata and its scraped comments, analyze how the audience
actually reacted and turn that into concrete next steps.

Output a clean, well-designed HTML report using inline styles. Use this structure:
- A heading "Post Deep-Dive" with the post's caption (truncated) as a subtitle
- A stats row: likes, comment count scraped, posted date
- An "Audience Sentiment" section: overall tone (positive/mixed/negative), 2-3 recurring themes in
  what people actually said, called out with short representative quotes
- A "What's Working" section: specific, concrete reasons this post landed (or didn't)
- A "Do This Next" section: 2-3 follow-up content ideas directly inspired by what commenters said
  they want more of, or reacted strongest to
- If comments are sparse or missing, say so plainly in one line instead of inventing sentiment from
  a handful of data points, and lean the analysis on caption + engagement numbers instead
- Use violet (#8B5CF6) as the primary accent, clean white cards with subtle borders
- Use simple inline CSS only (no external stylesheets, no style tags)
- Write in friendly, conversational English, no jargon

CRITICAL FORMAT RULES:
- Output ONLY raw HTML. No markdown, no code fences, no backticks, no text before or after the HTML.
- Never use em dashes or en dashes. Use " - " (space hyphen space) instead.
- Your entire response must start with < and end with >. Nothing else.`;

function pick(obj: any, keys: string[], fallback: any = undefined) {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k];
  }
  return fallback;
}

async function scrapePost(postUrl: string, maxComments: number) {
  const apifyToken = process.env.APIFY_API_TOKEN;
  if (!apifyToken) throw new Error("Missing APIFY_API_TOKEN");

  const client = new ApifyClient({ token: apifyToken });
  const run = await client.actor(ACTOR_ID).call(
    { postUrl, maxComments },
    { waitSecs: 180 }
  );

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  const item = items[0] as any;
  if (!item) return null;

  // Field names are a best guess at this actor's real output shape (it was
  // hand-built, not yet run against a live post as of this code) -- checked
  // against several plausible keys the same way this codebase's other
  // Apify integrations do, but confirm against a real run's dataset and
  // adjust here if a run comes back with post/comments both empty despite
  // the actor succeeding.
  const comments = pick(item, ["comments", "comments_data", "commentsList"], []) as any[];

  return {
    caption: pick(item, ["caption", "text"], ""),
    ownerUsername: pick(item, ["ownerUsername", "owner", "username"], ""),
    likes: pick(item, ["likesCount", "likes", "likeCount"], 0),
    commentsCount: pick(item, ["commentsCount", "commentCount"], comments.length),
    postedDate: pick(item, ["postedDate", "timestamp", "date"], ""),
    commentsScraped: comments.length,
    reachedCommentLimit: pick(item, ["reachedCommentLimit"], comments.length >= maxComments),
    comments: comments.slice(0, maxComments).map((c) => ({
      author: pick(c, ["author", "username", "ownerUsername"], "unknown"),
      text: pick(c, ["text", "comment"], ""),
    })),
  };
}

export async function runPostAnalysisAgent(postUrl: string, maxComments = 100) {
  if (!postUrl || !/instagram\.com\/(p|reel)\//i.test(postUrl)) {
    return { error: "Give me a real Instagram post or reel URL (instagram.com/p/... or /reel/...).", status: 400 as const };
  }

  let post;
  try {
    post = await scrapePost(postUrl, maxComments);
  } catch (e: any) {
    return { error: `Couldn't scrape that post: ${e.message}`, status: 502 as const };
  }
  if (!post) return { error: "The scrape ran but returned nothing for that URL.", status: 404 as const };

  const [learnings, brain] = await Promise.all([
    getLearnings("post-analysis"),
    buildBrainContext(),
  ]);
  const system = injectBrainContext(buildEnhancedPrompt(BASE_SYSTEM, learnings), brain);

  const commentBlock = post.comments.length
    ? post.comments.map((c) => `@${c.author}: "${c.text}"`).join("\n")
    : "(no comments scraped)";

  const context = `POST: ${postUrl}
Owner: @${post.ownerUsername}
Caption: "${String(post.caption).slice(0, 300)}"
Likes: ${post.likes}
Posted: ${post.postedDate || "unknown"}
Comments scraped: ${post.commentsScraped} (reached scrape limit: ${post.reachedCommentLimit})

COMMENTS:
${commentBlock}`;

  const result = await runDualAgent(system, wrapUntrusted("SCRAPED POST & COMMENTS", context), "post-analysis");
  const reportId = await saveReport("post-analysis", result);
  return { agent: "post-analysis" as const, result, reportId, learningsUsed: learnings.length };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  try {
    const outcome = await runPostAnalysisAgent(body.postUrl, body.maxComments || 100);
    if ("error" in outcome) return NextResponse.json({ error: outcome.error }, { status: outcome.status });
    return NextResponse.json(outcome);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
