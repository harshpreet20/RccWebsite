import { type ReactNode } from 'react';

export default function SectionEyebrow({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal ${className}`}
    >
      {children}
    </p>
  );
}
