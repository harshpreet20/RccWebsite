import AdminHeader from '@/components/admin/AdminHeader';

export default function InquiriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <AdminHeader
        title="Inquiries"
        subtitle="Website enquiry form submissions"
        active="Inquiries"
      />
      <div className="mt-8">{children}</div>
    </div>
  );
}
