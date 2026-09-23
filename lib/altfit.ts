import crypto from "crypto";

// Verifies the signed handoff token AltFit (altfit.org, a separate app/
// Supabase project) issues after a member consents to sharing their
// profile with RCC. Token shape: `${base64url(payloadJson)}.${base64url(hmac)}`,
// HMAC-SHA256 signed with the secret both apps share (ALTFIT_RCC_BRIDGE_SECRET
// / RCC_BRIDGE_SECRET -- same value, different var names per project). No
// JWT library needed for a format this small, and it keeps both sides
// dependency-free.

const AUDIENCE = "racquetsclubcommunity.com";

export interface AltFitProfile {
  name: string;
  email: string;
  phone: string | null;
}

export function verifyAltFitToken(token: string): AltFitProfile | null {
  const secret = process.env.ALTFIT_RCC_BRIDGE_SECRET;
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;

  const expectedSig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
  } catch {
    return null;
  }

  if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
  if (payload.aud !== AUDIENCE) return null;
  if (typeof payload.name !== "string" || typeof payload.email !== "string") return null;

  return {
    name: payload.name,
    email: payload.email,
    phone: typeof payload.phone === "string" ? payload.phone : null,
  };
}
