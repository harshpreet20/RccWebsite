import { NextResponse } from "next/server";
import { loadDataWithFallback, getMyStats, getCompetitorStats } from "@/lib/studio/data";
import { runDualAgent } from "@/lib/studio/dual-agent";
import { wrapUntrusted } from "@/lib/studio/guardrails";
import { saveReport } from "@/lib/studio/supabase-server";
import { getLearnings, buildEnhancedPrompt } from "@/lib/studio/micro-intel";
import { buildBrainContext, injectBrainContext } from "@/lib/studio/brain";

const BASE_SYSTEM = `You are the ANALYST agent for a badminton/racquet sports Instagram account.
Your job: provide a data-driven performance report.

Output a clean, well-designed HTML report using inline styles. Use this structure:
- A heading for "Performance Analysis Report"
- A "Quick Summary" box at the top with 3-4 key metrics in a grid (likes, comments, engagement rate, views)
- A "Strengths" section with green (#10B981) accented bullet points
- A "Areas to Improve" section with amber (#F59E0B) accented bullet points
- A "Competitor Comparison" section with a simple table showing handle, posts, avg likes — use alternating row colors
- A "Growth Opportunities" section with numbered action items
- Use green (#10B981) as the primary accent, clean white cards with subtle borders
- Use simple inline CSS only (no external stylesheets, no style tags)
- Write in friendly, conversational English, explain data insights in plain language
- Be specific with numbers, don't say "good engagement", say "23 likes per post, which is 2x the niche average"
- In "Growth Opportunities", include one specific call-out on caption language: based on which posts
  (ours or competitors') performed best, say plainly whether English, Hindi, or Hinglish captions are
  currently winning with this audience, so the next batch of ideas can lean into it.

CRITICAL FORMAT RULES:
- Output ONLY raw HTML. No markdown, no code fences, no backticks, no text before or after the HTML.
- Never use em dashes or en dashes. Use " - " (space hyphen space) instead.
- Your entire response must start with < and end with >. Nothing else.`;

export async function runAnalystAgent() {
  const data = await loadDataWithFallback();
  if (!data) return { error: "No data. Run: npm run studio:scrape", status: 404 as const };

  const me = getMyStats(data);
  const competitors = getCompetitorStats(data);
  const [learnings, brain] = await Promise.all([
    getLearnings("analyst"),
    buildBrainContext(),
  ]);
  const system = injectBrainContext(buildEnhancedPrompt(BASE_SYSTEM, learnings), brain);

  const context = `MY ACCOUNT (@${me.handle}):
- ${me.postCount} posts, ${me.totalLikes} total likes, ${me.totalComments} total comments, ${me.totalViews} total views
- Average: ${me.avgLikes} likes, ${me.avgComments} comments per post
- Top post: "${me.topPost?.caption?.slice(0, 100)}" (${me.topPost?.likes} likes)

COMPETITORS:
${competitors.map((c) => `@${c.handle}: ${c.postCount} posts, avg ${c.avgLikes} likes. Top: "${c.topPost?.caption?.slice(0, 100)}" (${c.topPost?.likes} likes)`).join("\n")}

Analyze my performance and give actionable insights.`;

  const result = await runDualAgent(system, wrapUntrusted("SCRAPED ACCOUNT DATA", context), "analyst");
  const reportId = await saveReport("analyst", result);
  return { agent: "analyst" as const, result, reportId, learningsUsed: learnings.length };
}

export async function POST() {
  try {
    const outcome = await runAnalystAgent();
    if ("error" in outcome) return NextResponse.json({ error: outcome.error }, { status: outcome.status });
    return NextResponse.json(outcome);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
