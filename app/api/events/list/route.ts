import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EventRow } from "@/app/admin/events/types";

export const dynamic = "force-dynamic";

// Public, read-only: RCC's published events are already shown on the
// public site, so no auth needed. AltFit's own Events section calls this
// to mirror the same list, keeping both apps' events in sync from one
// source of truth (RCC's `events` table) instead of duplicating data entry.
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, subtitle, event_date, venue, features, register_url")
    .eq("is_published", true)
    .order("event_date", { ascending: true })
    .returns<Pick<EventRow, "id" | "title" | "subtitle" | "event_date" | "venue" | "features" | "register_url">[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    events: (data || []).map((e) => ({
      ...e,
      registerUrl: e.register_url && e.register_url !== "#event" ? e.register_url : null,
    })),
  });
}
