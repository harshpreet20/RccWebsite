export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-admin-root
      className="min-h-screen bg-neutral-50 font-sans text-neutral-900 [&_*]:!cursor-auto"
    >
      {children}
    </div>
  );
}
