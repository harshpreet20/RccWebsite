import { signOut } from '@/app/admin/login/actions';

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Events</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage RCC&apos;s upcoming events</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            Sign Out
          </button>
        </form>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
