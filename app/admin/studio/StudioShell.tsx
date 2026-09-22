'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/studio/Sidebar';

export default function StudioShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="studio-root">
      <Sidebar active={pathname} />
      <main className="pt-16 md:pl-64 md:pt-0">{children}</main>
    </div>
  );
}
