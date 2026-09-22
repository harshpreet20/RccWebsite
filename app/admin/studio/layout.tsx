import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/admin/login/actions';
import AuthProvider from '@/components/studio/AuthProvider';
import StudioShell from './StudioShell';
import './studio.css';

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // proxy.ts already redirects unauthenticated visitors to /admin/login
  }

  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', user.email)
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className="flex min-h-screen flex-col items-start justify-center gap-4 bg-neutral-50 px-6">
        <p className="text-sm text-neutral-600">
          {user.email} is signed in but isn&apos;t on the admin allowlist for this site.
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Sign Out
          </button>
        </form>
      </div>
    );
  }

  return (
    <AuthProvider>
      <StudioShell>{children}</StudioShell>
    </AuthProvider>
  );
}
