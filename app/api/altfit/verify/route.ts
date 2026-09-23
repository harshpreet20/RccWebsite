import { NextResponse } from "next/server";
import { verifyAltFitToken } from "@/lib/altfit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.token) return NextResponse.json({ error: "token is required" }, { status: 400 });

  const profile = verifyAltFitToken(body.token);
  if (!profile) {
    return NextResponse.json({ error: "Token is invalid or expired" }, { status: 401 });
  }

  return NextResponse.json({ profile });
}
