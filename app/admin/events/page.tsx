import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/admin/login/actions';
import { deleteEvent } from './actions';
import type { EventRow } from './types';

export default async function EventsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // middleware already redirects unauthenticated visitors to /login
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

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })
    .returns<EventRow[]>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Link
          href="/admin/events/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          New Event
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {events?.length ? (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-neutral-900">{event.title}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      event.is_published
                        ? 'bg-green-50 text-green-700'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {event.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-neutral-500">
                  {new Date(event.event_date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {event.venue ? ` · ${event.venue}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/events/${event.id}/registrations`}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Registrations
                </Link>
                <Link
                  href={`/admin/events/${event.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Edit
                </Link>
                <form action={deleteEvent.bind(null, event.id)}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-neutral-500">No events yet.</p>
        )}
      </div>
    </div>
  );
}
