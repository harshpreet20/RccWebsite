import { type LucideIcon } from 'lucide-react';

export default function IconStat({
  icon: Icon,
  value,
  label,
  className = '',
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Icon className="h-6 w-6 shrink-0 text-teal" aria-hidden="true" />
      <div className="flex flex-col">
        <span className="font-display text-2xl leading-none text-white">{value}</span>
        <span className="font-body text-xs uppercase tracking-wide text-muted">{label}</span>
      </div>
    </div>
  );
}
