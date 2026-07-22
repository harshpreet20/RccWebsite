/**
 * rccwebsite talks to rccadmin's internal /api/public/* routes for anything
 * that isn't a simple public read of the shared products table (which stays
 * a direct Supabase read, same pattern as store-products.ts) -- event
 * listings/registration and the join/contact/newsletter forms.
 */
export const RCCADMIN_URL = process.env.NEXT_PUBLIC_RCCADMIN_URL ?? 'https://admin.racquetsclubcommunity.com';

export async function rccadminFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`${RCCADMIN_URL}${path}`, {
    ...init,
    headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}
