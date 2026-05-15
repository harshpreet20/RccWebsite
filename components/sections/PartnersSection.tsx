'use client';

/* ─────────────────────────────────────────────────────────────────────────────
   PartnersSection — add / remove partners by editing the PARTNERS array below.
   Each entry: { name, logo?, href? }
   - logo: URL to an image (any size — will be normalized to 48px height)
   - href: optional external link
───────────────────────────────────────────────────────────────────────────── */

interface Partner {
  name: string;
  logo?: string;
  href?: string;
}

export const PARTNERS: Partner[] = [
  { name: 'Siri Fort Sports Complex', href: '#' },
  { name: 'DDA Vasant Kunj',          href: '#' },
  { name: 'Yonex',                    href: 'https://www.yonex.com' },
  { name: 'Li-Ning',                  href: '#' },
  { name: 'Victor',                   href: '#' },
  { name: 'HotBot Studios',           href: 'https://www.hotbotstudios.com' },
];

export default function PartnersSection() {
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section
      style={{
        background: '#080810',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '32px 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)',
      }} />

      <div style={{
        display: 'flex', alignItems: 'center', gap: '32px',
        padding: '0 clamp(16px, 5vw, 80px)', marginBottom: '20px',
      }}>
        <div style={{ width: '28px', height: '1px', background: '#C21818', flexShrink: 0 }} />
        <span style={{
          fontFamily: 'var(--font-montserrat)', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          OUR PARTNERS
        </span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
      </div>

      {/* Scrolling marquee */}
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <div
          className="animate-marquee"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '48px',
            width: 'max-content',
          }}
        >
          {doubled.map((p, i) => {
            const inner = p.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={p.logo}
                alt={p.name}
                style={{
                  height: '48px',
                  maxWidth: '140px',
                  objectFit: 'contain',
                  filter: 'grayscale(1) brightness(0.6)',
                  transition: 'filter 0.3s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0) brightness(1)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(1) brightness(0.6)'; }}
              />
            ) : (
              <span style={{
                fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '11px',
                letterSpacing: '0.18em', color: 'rgba(255,255,255,0.22)',
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                padding: '8px 18px',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px',
                transition: 'color 0.3s, border-color 0.3s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLSpanElement;
                el.style.color = '#D4AF37';
                el.style.borderColor = 'rgba(212,175,55,0.3)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLSpanElement;
                el.style.color = 'rgba(255,255,255,0.22)';
                el.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
              >
                {p.name}
              </span>
            );

            return p.href && p.href !== '#' ? (
              <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                {inner}
              </a>
            ) : (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
