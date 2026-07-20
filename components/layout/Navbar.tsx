'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';

function RccBadge({ size = 44 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/rcc-crest.webp"
      alt="Racquets Club Community"
      width={size}
      height={size}
      style={{ flexShrink: 0, objectFit: 'contain' }}
    />
  );
}

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '#about' },
  { label: 'PLAY', href: '#play' },
  { label: 'EVENTS', href: '#events' },
  { label: 'MEMBERSHIP', href: '#membership' },
  { label: 'SHOP', href: 'https://store.racquetsclubcommunity.com' },
  { label: 'GALLERY', href: '#gallery' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          background: scrolled ? 'rgba(5,5,5,0.90)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        {/* ── LEFT: Logo ── */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <RccBadge size={44} />
          <div className="hidden sm:block" style={{ lineHeight: 1.1 }}>
            <div
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 900,
                fontSize: '13px',
                color: '#ffffff',
                letterSpacing: '0.08em',
              }}
            >
              RACQUETS CLUB COMMUNITY
            </div>
            <div
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 600,
                fontSize: '9px',
                color: '#D4AF37',
                letterSpacing: '0.18em',
              }}
            >
              DELHI · ESTD 2024
            </div>
          </div>
        </a>

        {/* ── CENTER: Nav links (desktop) ── */}
        <div className="hidden lg:flex" style={{ gap: '26px', alignItems: 'center' }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: pathname === link.href ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                position: 'relative',
                paddingBottom: '4px',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
              {pathname === link.href && (
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

        {/* ── RIGHT: Join RCC + menu ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href="#membership"
            className="hidden sm:inline-flex"
            style={{
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#000',
              background: '#D4AF37',
              padding: '9px 18px',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              transition: 'filter 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseOut={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
          >
            JOIN RCC <ArrowRight size={13} />
          </a>
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
          background: 'rgba(5,5,5,0.97)',
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
              letterSpacing: '0.14em',
              color: pathname === link.href ? '#D4AF37' : 'rgba(255,255,255,0.65)',
              textDecoration: 'none',
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              transition: 'color 0.2s',
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#membership"
          onClick={() => setMenuOpen(false)}
          style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.12em',
            color: '#000',
            background: '#D4AF37',
            padding: '14px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
            width: '100%',
          }}
        >
          JOIN RCC <ArrowRight size={14} />
        </a>
      </div>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.5)' }}
        />
      )}
    </>
  );
}
