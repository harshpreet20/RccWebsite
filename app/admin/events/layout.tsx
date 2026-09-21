import AdminHeader from '@/components/admin/AdminHeader';

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <AdminHeader title="Events" subtitle="Manage RCC's upcoming events" active="Events" />
      <div className="mt-8">{children}</div>
    </div>
  );
}
