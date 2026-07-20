import Image from 'next/image';
import { type LucideIcon } from 'lucide-react';

export default function PlaceholderPanel({
  imageSrc,
  alt,
  icon: Icon,
  watermark = false,
  className = '',
}: {
  imageSrc?: string;
  alt: string;
  icon?: LucideIcon;
  watermark?: boolean;
  className?: string;
}) {
  if (imageSrc) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={imageSrc} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-panel via-teal-dark/20 to-bg ${className}`}
    >
      {watermark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid grid-cols-3 gap-8 rotate-12 opacity-5 select-none"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="font-display whitespace-nowrap text-4xl tracking-widest text-white"
            >
              RCC
            </span>
          ))}
        </div>
      )}
      {Icon && <Icon className="relative h-10 w-10 text-teal/40" aria-hidden="true" />}
    </div>
  );
}
