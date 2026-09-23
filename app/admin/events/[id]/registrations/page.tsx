import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/admin/login/actions';
import { deleteEventRegistration } from './actions';

type RegistrationRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: 'web' | 'altfit';
  created_at: string;
};

export default async function EventRegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // proxy already redirects unauthenticated visitors to /login
  }

  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', user.email)
    .maybeSingle();

  if (!adminRow) {
    return (
      <div className="flex flex-col items-start gap-4">
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

  const { data: event } = await supabase
    .from('events')
    .select('title')
    .eq('id', id)
    .maybeSingle();

  const { data: registrations } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false })
    .returns<RegistrationRow[]>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/events" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            &larr; All Events
          </Link>
          <h2 className="mt-1 text-lg font-semibold text-neutral-900">
            Registrations{event?.title ? ` — ${event.title}` : ''}
          </h2>
        </div>
        <span className="text-sm text-neutral-500">{registrations?.length ?? 0} total</span>
      </div>

      <div className="flex flex-col gap-3">
        {registrations?.length ? (
          registrations.map((r) => (
            <div
              key={r.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-neutral-900">{r.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.source === 'altfit' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {r.source === 'altfit' ? 'AltFit' : 'Website'}
                  </span>
                </div>
                <p className="text-sm text-neutral-500">
                  <a href={`mailto:${r.email}`} className="hover:text-blue-600">
                    {r.email}
                  </a>
                  {r.phone ? ` · ${r.phone}` : ''}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  {new Date(r.created_at).toLocaleString('en-IN')}
                </p>
              </div>
              <form action={deleteEventRegistration.bind(null, id, r.id)}>
                <button
                  type="submit"
                  className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </form>
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-500">No registrations yet.</p>
        )}
      </div>
    </div>
  );
}
