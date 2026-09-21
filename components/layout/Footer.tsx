import Image from 'next/image';
import Link from 'next/link';
import { Share2, Camera, Video, MessageCircle, Mail, MapPin, Globe, Phone } from 'lucide-react';

const HUDLE_VENUE_URL = 'https://hudle.in/venues/the-sports-store-badminton-arena/862035';

const QUICK_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About RCC', href: '#our-story' },
  { label: 'Play', href: '#own-venue' },
  { label: 'Events', href: '#event' },
  { label: 'Membership', href: '#membership' },
  { label: 'Partners', href: '#partners' },
  { label: 'Corporate Events', href: '#corporate' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#enquire' },
];

const PLAY_LINKS = [
  { label: 'Our Own Venue', href: '#own-venue' },
  { label: 'Book a Court', href: HUDLE_VENUE_URL, external: true },
  { label: 'Rules & Guidelines', href: '/community-rules' },
  { label: 'Player Levels', href: '#' },
];

const SUPPORT_LINKS = [
  { label: 'Help & FAQs', href: '/community-rules' },
  { label: 'Community Rules', href: '/community-rules' },
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Privacy Policy', href: '#' },
];

const WHATSAPP_URL = 'https://chat.whatsapp.com/FHYw4wbNQDbJfJjDMGZr96?s=cl&p=i&mlu=4&ilr=4';

// lucide-react no longer ships brand/trademarked icons (Facebook, Instagram,
// YouTube) in this version — using closest generic equivalents instead.
const SOCIALS = [
  { label: 'Facebook', icon: Share2, href: 'https://facebook.com/share/1CP9eke83b/' },
  { label: 'Instagram', icon: Camera, href: 'https://instagram.com/racquetsclubcommunity' },
  { label: 'YouTube', icon: Video, href: 'https://youtube.com/@rccdelhi' },
  { label: 'WhatsApp', icon: MessageCircle, href: WHATSAPP_URL },
];

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-border-white bg-bg-alt">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1 sm:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/rcc-logo.webp"
                alt="RCC logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="font-body text-sm font-bold uppercase tracking-wide text-fg">
                Racquets Club Community
              </span>
            </div>
            <p className="mt-4 font-body text-sm text-muted">
              A community of badminton lovers united by passion and the love for the game.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-white text-muted transition-colors hover:border-teal hover:text-teal"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg uppercase tracking-wide text-fg">
              Quick Links
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-muted transition-colors hover:text-teal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg uppercase tracking-wide text-fg">Play</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {PLAY_LINKS.map((link) =>
                link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-muted transition-colors hover:text-teal"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-muted transition-colors hover:text-teal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg uppercase tracking-wide text-fg">Support</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-muted transition-colors hover:text-teal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg uppercase tracking-wide text-fg">
              Contact Us
            </h3>
            <ul className="mt-4 flex flex-col gap-3 font-body text-sm text-muted">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                <a href="mailto:info@racquetsclubcommunity.com" className="hover:text-teal">
                  info@racquetsclubcommunity.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                <span>Paschim Vihar, New Delhi</span>
              </li>
            </ul>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block rounded-lg border border-teal/30 p-4 transition-colors hover:border-teal/60"
            >
              <div className="flex items-center gap-2 text-teal">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span className="font-body text-xs font-semibold uppercase tracking-wide">
                  Join WhatsApp Community
                </span>
              </div>
              <p className="mt-2 font-body text-xs text-muted">
                Stay updated with games, events & more!
              </p>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-border-white bg-panel/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-sm text-muted">
            RCC is a product owned and managed by{' '}
            <span className="font-semibold text-fg">HOTBOT STUDIOS LLP</span>.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-body text-sm text-muted">
            <a
              href="mailto:hotbotstudios@gmail.com"
              className="flex items-center gap-2 hover:text-teal"
            >
              <Mail className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
              hotbotstudios@gmail.com
            </a>
            <a
              href="https://wa.me/919700001534"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-teal"
            >
              <Phone className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
              +91 97000 01534
            </a>
            <a
              href="https://www.hotbotstudios.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-teal"
            >
              <Globe className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
              hotbotstudios.com
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-border-white pt-8 sm:flex-row">
          <p className="font-body text-xs text-muted">
            &copy; 2024 Racquets Club Community. All rights reserved.
          </p>
          <p className="font-body text-xs text-muted">Made with &hearts; for the community</p>
        </div>
      </div>
    </footer>
  );
}
