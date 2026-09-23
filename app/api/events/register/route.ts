import { NextResponse } from "next/server";
import { verifyAltFitToken } from "@/lib/altfit";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Server-to-server: AltFit's own Events section calls this directly (the
// member is already signed into AltFit, so there's no redirect/consent
// screen here like the enquiry form's bridge -- AltFit signs its own
// member's profile and posts it straight through, same as registering
// through RCC's own web form just from a different origin).
export async function POST(request: Request) {
  let body: { token?: string; eventId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.token || !body.eventId) {
    return NextResponse.json({ error: "token and eventId are required" }, { status: 400 });
  }

  const profile = verifyAltFitToken(body.token);
  if (!profile) {
    return NextResponse.json({ error: "Token is invalid or expired" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", body.eventId)
    .eq("is_published", true)
    .maybeSingle();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const { error } = await supabase.from("event_registrations").insert({
    event_id: body.eventId,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    source: "altfit",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
