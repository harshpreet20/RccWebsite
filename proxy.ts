import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Studio's API routes carry real Anthropic/OpenAI/Apify cost per call, so
  // they need the same admin gate as the pages -- except the handful that
  // external callers (Vercel Cron, Apify webhooks) hit with no user session,
  // which keep their own secret-based checks inside the route itself.
  const STUDIO_UNAUTHENTICATED_PATHS = [
    '/api/studio/cron/scrape',
    '/api/studio/scrape-status',
    '/api/studio/review-webhook',
  ];

  if (pathname.startsWith('/api/studio/')) {
    if (STUDIO_UNAUTHENTICATED_PATHS.some((p) => pathname.startsWith(p))) {
      return response;
    }
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', user.email)
      .maybeSingle();
    if (!adminRow) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return response;
  }

  if (!user && pathname !== '/admin/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/studio/:path*'],
};
