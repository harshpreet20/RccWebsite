import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/admin/login/actions';
import { deleteInquiry } from './actions';
import type { InquiryRow } from './types';

const INTEREST_LABELS: Record<string, string> = {
  general: 'General Enquiry',
  membership: 'Membership',
  corporate: 'Corporate / Industry',
  partnership: 'Partnership',
};

export default async function InquiriesPage() {
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

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<InquiryRow[]>();

  return (
    <div className="flex flex-col gap-3">
      {inquiries?.length ? (
        inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-neutral-900">{inquiry.name}</p>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {INTEREST_LABELS[inquiry.interest] ?? inquiry.interest}
                </span>
              </div>
              <p className="text-sm text-neutral-500">
                <a href={`mailto:${inquiry.email}`} className="hover:text-blue-600">
                  {inquiry.email}
                </a>
                {inquiry.phone ? ` · ${inquiry.phone}` : ''}
              </p>
              {inquiry.message && (
                <p className="mt-1 max-w-xl text-sm text-neutral-700">{inquiry.message}</p>
              )}
              <p className="mt-1 text-xs text-neutral-400">
                {new Date(inquiry.created_at).toLocaleString('en-IN')}
              </p>
            </div>
            <form action={deleteInquiry.bind(null, inquiry.id)}>
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
        <p className="text-sm text-neutral-500">No enquiries yet.</p>
      )}
    </div>
  );
}
