import { NextResponse } from "next/server";
import { loadDataWithFallback, getMyStats } from "@/lib/studio/data";
import { runDualAgent } from "@/lib/studio/dual-agent";
import { wrapUntrusted } from "@/lib/studio/guardrails";
import { saveReport } from "@/lib/studio/supabase-server";
import { getLearnings, buildEnhancedPrompt } from "@/lib/studio/micro-intel";
import { buildBrainContext, injectBrainContext } from "@/lib/studio/brain";

const BASE_SYSTEM = `You are the PLANNER agent for a badminton/racquet sports Instagram account.
Your job: create a 7-day content calendar.

Output a clean, well-designed HTML report using inline styles. Use this structure:
- A heading for "7-Day Content Calendar"
- A brief intro paragraph summarizing the strategy
- For each day, a row/card with:
  - Day name and date (starting from tomorrow)
  - Content type badge (Reel/Carousel/Story/Post) with colored background (#8B5CF6 violet for Reel, #EC4899 pink for Carousel, #F59E0B amber for Story, #3B82F6 blue for Post)
  - Topic title in bold
  - Best posting time
  - Brief description (1-2 sentences)
- A summary section at the bottom with posting tips
- Use violet (#8B5CF6) as the primary accent, clean white cards with subtle borders
- Use simple inline CSS only (no external stylesheets, no style tags)
- Write in friendly, conversational English, like a social media manager briefing
- Make it feel like a real content calendar you'd print out
- For each day's topic title, also give a one-line Hindi (Devanagari) and Hinglish (Latin script,
  natural Delhi-creator code-mixed) version in small text under the English title, so the caption
  language can be picked per post based on what's trending that week.

CRITICAL FORMAT RULES:
- Output ONLY raw HTML. No markdown, no code fences, no backticks, no text before or after the HTML.
- Never use em dashes or en dashes. Use " - " (space hyphen space) instead.
- Your entire response must start with < and end with >. Nothing else.`;

export async function runPlannerAgent() {
  const data = await loadDataWithFallback();
  if (!data) return { error: "No data. Run: npm run studio:scrape", status: 404 as const };

  const me = getMyStats(data);
  const [learnings, brain] = await Promise.all([
    getLearnings("planner"),
    buildBrainContext(),
  ]);
  const system = injectBrainContext(buildEnhancedPrompt(BASE_SYSTEM, learnings), brain);

  const recentPosts = me.posts
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const context = `MY ACCOUNT (@${me.handle}): ${me.postCount} posts, avg ${me.avgLikes} likes, avg ${me.avgComments} comments.

RECENT POSTS:
${recentPosts.map((p) => `[${p.type}] "${p.caption?.slice(0, 100)}" — ${p.likes} likes, ${p.comments} comments`).join("\n")}

Create a 7-day content calendar starting from tomorrow. Mix formats for maximum reach.`;

  const result = await runDualAgent(system, wrapUntrusted("SCRAPED ACCOUNT DATA", context), "planner");
  const reportId = await saveReport("planner", result);
  return { agent: "planner" as const, result, reportId, learningsUsed: learnings.length };
}

export async function POST() {
  try {
    const outcome = await runPlannerAgent();
    if ("error" in outcome) return NextResponse.json({ error: outcome.error }, { status: outcome.status });
    return NextResponse.json(outcome);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
