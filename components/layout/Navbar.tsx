'use client';

import { useState, useEffect } from 'react';
import { Search, User, Menu, X } from 'lucide-react';

/* ─── RCC Badge SVG ─────────────────────────────────────────────── */
function RccBadge({ size = 70 }: { size?: number }) {
  const r = size / 2;
  // Arc helper – returns SVG path arc string for text-on-path
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <defs>
        {/* Radial gradient for the badge background */}
        <radialGradient id="badgeBg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#8B0000" />
          <stop offset="100%" stopColor="#3D0000" />
        </radialGradient>
        {/* Text on top arc */}
        <path
          id="topArc"
          d="M 15,50 A 35,35 0 1,1 85,50"
          fill="none"
        />
        {/* Text on bottom arc */}
        <path
          id="bottomArc"
          d="M 18,56 A 33,33 0 0,0 82,56"
          fill="none"
        />
      </defs>

      {/* Outer gold ring */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity="0.5" />

      {/* Dark background fill */}
      <circle cx="50" cy="50" r="43" fill="url(#badgeBg)" />

      {/* "RACQUETS" curved text on top */}
      <text
        fontSize="9"
        fontFamily="Montserrat, sans-serif"
        fontWeight="900"
        letterSpacing="2.2"
        fill="#D4AF37"
      >
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          RACQUETS
        </textPath>
      </text>

      {/* "CLUB COMMUNITY" curved text on bottom */}
      <text
        fontSize="7"
        fontFamily="Montserrat, sans-serif"
        fontWeight="700"
        letterSpacing="1.2"
        fill="#D4AF37"
      >
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          CLUB COMMUNITY
        </textPath>
      </text>

      {/* Two badminton player silhouettes (left player) */}
      <g fill="#D4AF37" opacity="0.9">
        {/* Left player body */}
        <circle cx="35" cy="36" r="4.5" />
        <path d="M35 41 L32 55 L36 55 L37 48 L39 55 L43 55 L40 41 Z" />
        {/* Left player racket arm */}
        <line x1="40" y1="43" x2="46" y2="36" stroke="#D4AF37" strokeWidth="1.5" />
        {/* Racket head (left player) */}
        <ellipse cx="47.5" cy="34.5" rx="3.5" ry="4.5" fill="none" stroke="#D4AF37" strokeWidth="1.2" />

        {/* Right player body */}
        <circle cx="65" cy="36" r="4.5" />
        <path d="M65 41 L62 55 L66 55 L67 48 L69 55 L73 55 L70 41 Z" />
        {/* Right player racket arm */}
        <line x1="60" y1="43" x2="54" y2="36" stroke="#D4AF37" strokeWidth="1.5" />
        {/* Racket head (right player) */}
        <ellipse cx="52.5" cy="34.5" rx="3.5" ry="4.5" fill="none" stroke="#D4AF37" strokeWidth="1.2" />

        {/* Shuttlecock in center */}
        <circle cx="50" cy="32" r="2" />
        <path d="M48 30 L46 24 M50 30 L50 23 M52 30 L54 24" stroke="#D4AF37" strokeWidth="0.8" />
      </g>

      {/* Flame shapes at bottom */}
      <g opacity="0.85">
        <path
          d="M44 72 Q43 65 47 62 Q46 68 50 66 Q49 62 52 60 Q54 65 52 70 Q56 66 55 62 Q59 66 57 72 Z"
          fill="url(#flameFill)"
        />
        <defs>
          <linearGradient id="flameFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#C21818" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
}

/* ─── Nav links ──────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'HOME', href: '/', active: true },
  { label: 'ABOUT US', href: '/about' },
  { label: 'CLUBS', href: '/clubs' },
  { label: 'EVENTS', href: '/events' },
  { label: 'MEMBERSHIP', href: '/membership' },
  { label: 'SHOP', href: '/shop' },
  { label: 'CONTACT', href: '/contact' },
];

/* ─── Navbar ─────────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(16px, 3vw, 48px)',
          transition: 'background 0.35s ease, box-shadow 0.35s ease',
          background: scrolled ? 'rgba(10,10,15,0.90)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        {/* ── LEFT: Logo ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RccBadge size={62} />
          {/* Brand text: hidden on small screens via media query inline workaround */}
          <div className="hidden sm:block" style={{ lineHeight: 1.1 }}>
            <div
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 900,
                fontSize: '15px',
                color: '#ffffff',
                letterSpacing: '0.08em',
              }}
            >
              RACQUETS
            </div>
            <div
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                fontSize: '9px',
                color: '#D4AF37',
                letterSpacing: '0.15em',
              }}
            >
              CLUB COMMUNITY
            </div>
          </div>
        </div>

        {/* ── CENTER: Nav links (desktop) ── */}
        <div
          className="hidden lg:flex"
          style={{ gap: '28px', alignItems: 'center' }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.14em',
                color: link.active ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                position: 'relative',
                paddingBottom: '4px',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
              {link.active && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#D4AF37',
                    borderRadius: '1px',
                  }}
                />
              )}
            </a>
          ))}
        </div>

        {/* ── RIGHT: Icon row ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            aria-label="Search"
            style={{ background: 'none', border: 'none', padding: '4px', color: 'rgba(255,255,255,0.5)', display: 'flex' }}
          >
            <Search size={18} />
          </button>
          <button
            aria-label="Account"
            style={{ background: 'none', border: 'none', padding: '4px', color: 'rgba(255,255,255,0.7)', display: 'flex' }}
          >
            <User size={18} />
          </button>
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
            style={{ background: 'none', border: 'none', padding: '4px', color: 'rgba(255,255,255,0.9)', display: 'flex' }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 200,
          width: 'min(320px, 85vw)',
          background: 'rgba(10,10,15,0.97)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderLeft: '1px solid rgba(212,175,55,0.12)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '88px 32px 40px',
          gap: '8px',
        }}
      >
        <button
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '6px',
            color: 'rgba(255,255,255,0.7)',
            padding: '6px',
            display: 'flex',
          }}
        >
          <X size={18} />
        </button>

        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.16em',
              color: link.active ? '#D4AF37' : 'rgba(255,255,255,0.65)',
              textDecoration: 'none',
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              transition: 'color 0.2s',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Overlay when drawer open */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 150,
            background: 'rgba(0,0,0,0.5)',
          }}
        />
      )}
    </>
  );
}
