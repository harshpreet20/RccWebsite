import OpenAI from "openai";
import { stripDangerousHtml } from "@/lib/studio/guardrails";

let client: OpenAI | null = null;

export function hasOpenAI(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY in .env");
    client = new OpenAI({ apiKey });
  }
  return client;
}

export async function askGpt(systemPrompt: string, userMessage: string): Promise<string> {
  const openai = getClient();
  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    max_tokens: 4096,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });
  const raw = response.choices[0]?.message?.content ?? "";
  return cleanHtmlOutput(raw);
}

function cleanHtmlOutput(raw: string): string {
  let text = raw.trim();
  text = text.replace(/^```(?:html)?\s*/i, "").replace(/\s*```\s*$/, "");
  const firstTag = text.indexOf("<");
  const lastTag = text.lastIndexOf(">");
  if (firstTag !== -1 && lastTag !== -1 && lastTag > firstTag) {
    text = text.substring(firstTag, lastTag + 1);
  }
  text = text.replace(/—/g, " - ").replace(/–/g, " - ");
  return stripDangerousHtml(text);
}
