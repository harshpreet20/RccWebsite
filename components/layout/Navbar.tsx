'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User } from 'lucide-react';
import { cn, SOCIAL_LINKS } from '@/lib/utils';

const navLinks = [
  { href: '/',           label: 'HOME' },
  { href: '/about',      label: 'ABOUT US' },
  { href: '/events',     label: 'EVENTS' },
  { href: '/gallery',    label: 'GALLERY' },
  { href: '/sponsors',   label: 'MEMBERSHIP' },
  { href: '/guidelines', label: 'GUIDELINES' },
  { href: '/contact',    label: 'CONTACT' },
];

/* ── Circular badge logo ── */
function RccBadge({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" className="flex-shrink-0">
      <defs>
        <radialGradient id="badgeBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C21818" />
          <stop offset="100%" stopColor="#6B0000" />
        </radialGradient>
        <radialGradient id="badgeGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="26" cy="26" r="25" fill="url(#badgeBg)" />
      <circle cx="26" cy="26" r="25" fill="url(#badgeGlow)" />
      {/* Gold border ring */}
      <circle cx="26" cy="26" r="24.2" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.6" />
      <circle cx="26" cy="26" r="21.5" fill="none" stroke="#D4AF37" strokeWidth="0.4" strokeOpacity="0.3" />
      {/* Inner dark circle */}
      <circle cx="26" cy="26" r="19" fill="rgba(0,0,0,0.35)" />
      {/* Player silhouette – simplified badminton player */}
      <g fill="#D4AF37" fillOpacity="0.9" transform="translate(26,26)">
        {/* Body */}
        <ellipse cx="-3" cy="2" rx="3.5" ry="5" />
        {/* Head */}
        <circle cx="-3" cy="-5" r="2.5" />
        {/* Arm + racquet */}
        <line x1="-1" y1="0" x2="6" y2="-5" stroke="#D4AF37" strokeWidth="1.2" strokeOpacity="0.9" />
        <ellipse cx="7.5" cy="-6.5" rx="2.8" ry="3.5" fill="none" stroke="#D4AF37" strokeWidth="0.9" strokeOpacity="0.9" transform="rotate(-35 7.5 -6.5)" />
        {/* Legs */}
        <line x1="-3" y1="6" x2="-5" y2="12" stroke="#D4AF37" strokeWidth="1.2" strokeOpacity="0.9" />
        <line x1="-3" y1="6" x2="0" y2="12" stroke="#D4AF37" strokeWidth="1.2" strokeOpacity="0.9" />
      </g>
      {/* Flame at bottom */}
      <path
        d="M18 43 Q22 38 26 42 Q30 38 34 43 Q30 47 26 46 Q22 47 18 43Z"
        fill="#D4AF37"
        fillOpacity="0.6"
      />
      {/* RCC text */}
      <text
        x="26" y="31"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
        fill="#D4AF37"
        letterSpacing="0.5"
      >
        RCC
      </text>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[#09090f]/90 backdrop-blur-xl border-b border-[#D4AF37]/15 py-2.5'
            : 'bg-transparent py-3'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div whileHover={{ scale: 1.06 }} transition={{ duration: 0.2 }}>
              <RccBadge size={48} />
            </motion.div>
            <div className="hidden sm:block">
              <div
                className="text-white font-black text-sm tracking-[0.18em] leading-none"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                RACQUETS
              </div>
              <div className="text-[#D4AF37] text-[10px] tracking-[0.35em] font-semibold mt-0.5 leading-none font-[family-name:var(--font-inter)]">
                CLUB COMMUNITY
              </div>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-[11px] tracking-[0.15em] font-bold transition-all duration-300 relative group font-[family-name:var(--font-inter)]',
                    isActive ? 'text-[#D4AF37]' : 'text-white/60 hover:text-white'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[#C21818] to-[#D4AF37] transition-all duration-300 rounded-full',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── Right icons + CTA ── */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              className="text-white/50 hover:text-[#D4AF37] transition-colors duration-300 p-1.5 cursor-none"
              aria-label="Search"
            >
              <Search size={17} />
            </button>
            <Link
              href="/join"
              className="text-white/50 hover:text-[#D4AF37] transition-colors duration-300 p-1.5 cursor-none"
              aria-label="Account"
            >
              <User size={17} />
            </Link>

            <div className="w-px h-5 bg-white/10" />

            <motion.a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white text-[10px] font-black tracking-[0.2em] rounded hover:shadow-[0_0_20px_rgba(194,24,24,0.5)] transition-shadow duration-300 cursor-none font-[family-name:var(--font-inter)]"
            >
              JOIN RCC
            </motion.a>

            <button
              className="text-white/50 hover:text-white transition-colors duration-300 p-1.5 cursor-none"
              aria-label="Menu"
            >
              <Menu size={19} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white p-2 hover:text-[#D4AF37] transition-colors cursor-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-[#09090f]/97 backdrop-blur-xl" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-[#0f0f18] border-l border-[#D4AF37]/12 flex flex-col pt-24 pb-10 px-8"
            >
              <div className="flex flex-col gap-6 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'block text-xl font-black tracking-widest transition-colors duration-300 font-[family-name:var(--font-montserrat)]',
                        pathname === link.href
                          ? 'text-[#D4AF37]'
                          : 'text-white/60 hover:text-white'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-black tracking-widest text-sm rounded cursor-none font-[family-name:var(--font-inter)]"
              >
                JOIN THE COMMUNITY
              </motion.a>
            </motion.div>

            {/* Tap outside to close */}
            <div className="absolute inset-0 -z-10" onClick={() => setMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
