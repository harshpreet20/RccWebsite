'use client';

import { Mail, Phone, MapPin } from 'lucide-react';

/* ── Social icons ─────────────────────────────────────────────────── */
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4C7.7 4 4.15 7.55 4.15 11.9c0 1.4.37 2.76 1.06 3.96L4 20l4.25-1.12a7.9 7.9 0 0 0 3.8.97h.01c4.35 0 7.9-3.55 7.9-7.9a7.85 7.85 0 0 0-2.36-5.63ZM12.05 18.5a6.56 6.56 0 0 1-3.35-.92l-.24-.14-2.5.66.67-2.44-.16-.25a6.55 6.55 0 0 1-1-3.5c0-3.62 2.95-6.56 6.58-6.56a6.53 6.53 0 0 1 6.56 6.57c0 3.62-2.94 6.57-6.56 6.57Zm3.6-4.92c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.43.05a5.4 5.4 0 0 1-1.58-.98 6 6 0 0 1-1.1-1.36c-.11-.2-.01-.3.09-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35-.05-.1-.44-1.07-.6-1.46-.16-.38-.32-.33-.44-.34l-.38-.01a.72.72 0 0 0-.52.24c-.18.2-.68.67-.68 1.63 0 .96.7 1.89.8 2.02.1.13 1.38 2.1 3.34 2.95.47.2.83.32 1.11.41.47.15.9.13 1.23.08.38-.06 1.17-.48 1.33-.94.17-.46.17-.85.12-.94-.05-.08-.18-.13-.38-.23Z"/>
    </svg>
  );
}

/* ── Config (swap placeholders with real links when ready) ────────── */
const WHATSAPP_URL = 'https://chat.whatsapp.com/';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About RCC', href: '/about' },
  { label: 'Play', href: '#play' },
  { label: 'Events', href: '/events' },
  { label: 'Membership', href: '/membership' },
  { label: 'Shop', href: 'https://store.racquetsclubcommunity.com' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '/contact' },
];

const PLAY_LINKS = [
  { label: 'Venues', href: '#play' },
  { label: 'Book a Court', href: 'https://hudle.in/' },
  { label: 'Match Play', href: '#play' },
  { label: 'Rules & Guidelines', href: '/about' },
  { label: 'Player Levels', href: '/membership' },
];

const SUPPORT_LINKS = [
  { label: 'Help & FAQs', href: '/contact' },
  { label: 'Community Rules', href: '/about' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

function LinkCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">{title}</h4>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="footer-link text-[13px]">{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505]">
      <style>{`
        .footer-link { font-family: var(--font-inter); color: #8a8a99; text-decoration: none; transition: color .2s; }
        .footer-link:hover { color: #D4AF37; }
        .footer-social {
          width: 38px; height: 38px; border-radius: 9px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          display: inline-flex; align-items: center; justify-content: center;
          color: #8a8a99; text-decoration: none; transition: all .2s;
        }
        .footer-social:hover { color: #D4AF37; border-color: rgba(212,175,55,0.3); background: rgba(212,175,55,0.08); }
        .footer-contact { display: flex; align-items: flex-start; gap: 9px; font-family: var(--font-inter); font-size: 13px; color: #8a8a99; text-decoration: none; transition: color .2s; }
        .footer-contact:hover { color: #D4AF37; }
        @media (max-width: 1024px) { .footer-cols { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px) { .footer-cols { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 420px) { .footer-cols { grid-template-columns: 1fr !important; } }
      `}</style>

      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[800px] -translate-x-1/2"
        style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 70%)' }}
      />

      <div
        className="footer-cols relative mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-10"
        style={{ gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1.4fr' }}
      >
        {/* Brand */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/rcc-crest.webp" alt="RCC" className="h-11 w-11 object-contain" />
            <div className="leading-tight">
              <div className="font-[var(--font-montserrat)] text-sm font-black tracking-[0.08em] text-white">RACQUETS</div>
              <div className="font-[var(--font-montserrat)] text-[9px] font-semibold tracking-[0.15em] text-[var(--color-gold)]">CLUB COMMUNITY</div>
            </div>
          </div>
          <p className="mb-6 max-w-xs text-[13px] leading-relaxed text-white/45">
            A community of badminton lovers united by passion, respect and the love for the game.
          </p>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/racquetsclubcommunity/" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram"><InstagramIcon /></a>
            <a href="https://facebook.com/rccdelhi" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://youtube.com/@rccdelhi" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="YouTube"><YouTubeIcon /></a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="WhatsApp"><WhatsAppIcon /></a>
          </div>
        </div>

        <LinkCol title="Quick Links" links={QUICK_LINKS} />
        <LinkCol title="Play" links={PLAY_LINKS} />
        <LinkCol title="Support" links={SUPPORT_LINKS} />

        {/* Contact + WhatsApp community */}
        <div>
          <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">Contact Us</h4>
          <div className="flex flex-col gap-3">
            <a href="mailto:hello@racquetsclubcommunity.com" className="footer-contact">
              <Mail size={15} className="mt-0.5 shrink-0 text-[var(--color-gold)]" /> hello@racquetsclubcommunity.com
            </a>
            <a href="tel:+919876543210" className="footer-contact">
              <Phone size={15} className="mt-0.5 shrink-0 text-[var(--color-gold)]" /> +91 98765 43210
            </a>
            <p className="footer-contact">
              <MapPin size={15} className="mt-0.5 shrink-0 text-[var(--color-gold)]" /> Paschim Vihar, New Delhi
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--color-gold)]/20 bg-white/[0.03] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-gold)]">Join WhatsApp Community</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-white/45">Stay updated with games, events &amp; more!</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-black transition hover:brightness-110"
            >
              <WhatsAppIcon size={15} /> Join Now
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] px-6 py-6 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <span className="font-[var(--font-inter)] text-xs text-white/40">
            © 2024 Racquets Club Community. All rights reserved.
          </span>
          <span className="font-[var(--font-inter)] text-xs text-white/40">
            Made with <span className="text-[#C21818]">♥</span> for the community
          </span>
        </div>
      </div>
    </footer>
  );
}
