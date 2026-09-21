import Link from 'next/link';
import { signOut } from '@/app/admin/login/actions';

const TABS = [
  { label: 'Events', href: '/admin/events' },
  { label: 'Inquiries', href: '/admin/inquiries' },
];

export default function AdminHeader({
  title,
  subtitle,
  active,
}: {
  title: string;
  subtitle: string;
  active: 'Events' | 'Inquiries';
}) {
  return (
    <div className="border-b border-neutral-200 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
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
      <div className="mt-6 flex items-center gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab.label === active
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
