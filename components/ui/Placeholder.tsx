/**
 * Branded image placeholder — a premium teal-tinted panel with a faint RCC
 * crest watermark. Used wherever a real photo/banner hasn't been supplied yet,
 * so empty areas read as intentional rather than broken.
 */
export default function Placeholder({
  className = '',
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          'radial-gradient(120% 120% at 30% 15%, rgba(0,108,103,0.28), #0b0f0e 60%, #070d0c 100%)',
      }}
      aria-hidden
    >
      {/* Crest watermark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/rcc-crest.webp"
        alt=""
        className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.10]"
      />
      {/* Sheen */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      {label && (
        <span className="absolute bottom-2 left-2 rounded bg-black/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-teal)]/80 backdrop-blur">
          {label}
        </span>
      )}
    </div>
  );
}
