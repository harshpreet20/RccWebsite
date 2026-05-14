'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Zap, ExternalLink } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/ui/SocialIcons';
import { SOCIAL_LINKS, BRAND } from '@/lib/utils';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Guidelines', href: '/guidelines' },
  { label: 'Join RCC', href: '/join' },
  { label: '🎂 Birthdays', href: '/birthday' },
  { label: 'Contact', href: '/contact' },
];

const sponsors = ['Racquets Club Community', 'SUM India', 'Soul Stretch'];

export default function Footer() {
  return (
    <footer className="relative bg-[#030508] overflow-hidden">
      {/* Animated top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C21818] to-transparent opacity-60" />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C21818]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C21818] to-[#D4AF37] flex items-center justify-center font-black text-white">
                RCC
              </div>
              <div>
                <div className="text-white font-bold text-base tracking-widest">RACQUETS CLUB</div>
                <div className="text-[#D4AF37] text-xs tracking-[0.3em]">COMMUNITY</div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm">
              Delhi's invite-only badminton community built for sincere players.
              Smash. Connect. Compete.
            </p>

            {/* WhatsApp CTA */}
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-bold tracking-widest text-sm rounded-full hover:scale-105 hover:shadow-[0_0_25px_rgba(194,24,24,0.4)] transition-all duration-300"
            >
              <MessageCircle size={16} />
              JOIN WHATSAPP COMMUNITY
            </a>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all duration-300"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all duration-300"
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all duration-300"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#D4AF37] text-xs tracking-[0.3em] font-bold mb-6 uppercase">Navigate</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 text-sm hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-[#C21818] group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-[#D4AF37] text-xs tracking-[0.3em] font-bold mb-6 uppercase">Community</h4>
            <div className="space-y-3 mb-8">
              <p className="text-white/50 text-sm">Delhi, India</p>
              <p className="text-white/50 text-sm">Invite-Only Community</p>
              <p className="text-white/50 text-sm">Weekend Sessions</p>
              <p className="text-white/50 text-sm">Tournaments & Events</p>
            </div>
            <h4 className="text-[#D4AF37] text-xs tracking-[0.3em] font-bold mb-4 uppercase">Partners</h4>
            <ul className="space-y-2">
              {sponsors.map((s) => (
                <li key={s} className="text-white/40 text-sm">{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sponsor strip */}
        <div className="border-t border-white/5 pt-8 mb-8">
          <p className="text-center text-white/20 text-xs tracking-widest mb-4 uppercase">Community Partners</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {sponsors.map((s) => (
              <span key={s} className="text-white/30 text-sm font-bold tracking-wider hover:text-white/60 transition-colors cursor-default">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs tracking-wider text-center sm:text-left">
            © {new Date().getFullYear()} Racquets Club Community. All rights reserved.
          </p>
          <p className="text-white/30 text-xs tracking-wider text-center sm:text-right">
            Developed and Marketed by{' '}
            <a
              href="https://hotbotstudios.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors duration-300 relative group"
            >
              <span className="relative">
                HotBot Studios
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-500" />
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse-glow" />
              <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
