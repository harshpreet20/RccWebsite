"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; kind: "chat"; content: string }
  | { role: "assistant"; kind: "report"; agent: string; html: string };

const STARTERS = [
  "Give me some fresh reel ideas",
  "What's trending with competitors right now?",
  "Plan my content for next week",
  "Write hooks for a court-booking reel",
];

const AGENT_LABELS: Record<string, string> = {
  ideator: "Ideator",
  hooks: "Hook & Script",
  "reel-prompt": "AI Reel Prompt",
  planner: "Planner",
  analyst: "Analyst",
  "dm-manager": "DM Manager",
};

function sanitizeReportHtml(raw: string): string {
  let text = raw.trim();
  text = text.replace(/^```(?:html)?\s*/i, "").replace(/\s*```\s*$/, "");
  const firstTag = text.indexOf("<");
  const lastTag = text.lastIndexOf(">");
  if (firstTag !== -1 && lastTag !== -1 && lastTag > firstTag) {
    text = text.substring(firstTag, lastTag + 1);
  }
  if (!text.startsWith("<")) {
    text = `<div style="font-family:-apple-system,sans-serif;font-size:14px;line-height:1.7;color:#374151;white-space:pre-wrap">${text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</div>`;
  }
  return text;
}

export default function StudioChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      kind: "chat",
      content:
        "Hey! I'm your content brainstorming partner for @racquetsclubcommunity. Ask me for ideas, hooks, a content calendar, a stats read, DM templates, or just think out loud with me - English, Hindi, Hinglish, whatever works.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const history = messages
      .filter((m): m is Extract<ChatMessage, { role: "user" }> | Extract<ChatMessage, { kind: "chat" }> =>
        m.role === "user" || m.kind === "chat",
      )
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/studio/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", kind: "chat", content: `Something went wrong: ${data.error || res.status}` },
        ]);
      } else if (data.type === "report") {
        setMessages((prev) => [...prev, { role: "assistant", kind: "report", agent: data.agent, html: data.html }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", kind: "chat", content: data.text }]);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", kind: "chat", content: `Something went wrong: ${e.message}` },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex h-screen max-w-3xl flex-col px-4 py-6 sm:px-6">
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-gray-900">Content Studio</h1>
        <p className="text-sm text-gray-400">Brainstorm out loud - I'll pull in ideas, scripts, calendars or stats as needed</p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gray-900 px-4 py-2.5 text-sm text-white">
                {m.content}
              </div>
            </div>
          ) : m.kind === "report" ? (
            <div key={i} className="flex justify-start">
              <div className="max-w-[92%] rounded-2xl rounded-tl-sm neu-raised-sm bg-white p-1">
                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                    {AGENT_LABELS[m.agent] || m.agent}
                  </span>
                </div>
                <div className="p-4" dangerouslySetInnerHTML={{ __html: sanitizeReportHtml(m.html) }} />
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2.5 text-sm text-gray-800">
                {m.content}
              </div>
            </div>
          ),
        )}

        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full neu-btn px-3 py-1.5 text-xs font-medium text-gray-600"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type an idea, ask for a script, a calendar, stats..."
          className="flex-1 rounded-full neu-input px-4 py-3 text-sm text-gray-900 outline-none"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
