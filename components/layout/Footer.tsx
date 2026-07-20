import Image from 'next/image';
import Link from 'next/link';
import {
  Share2,
  Camera,
  Video,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About RCC', href: '#our-story' },
  { label: 'Play', href: '#venues' },
  { label: 'Events', href: '#event' },
  { label: 'Membership', href: '#membership' },
  { label: 'Shop', href: '#shop' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#footer' },
];

const PLAY_LINKS = [
  { label: 'Venues', href: '#venues' },
  { label: 'Book a Court', href: '#venues' },
  { label: 'Match Play', href: '#venues' },
  { label: 'Rules & Guidelines', href: '#' },
  { label: 'Player Levels', href: '#' },
];

const SUPPORT_LINKS = [
  { label: 'Help & FAQs', href: '#' },
  { label: 'Community Rules', href: '#' },
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Privacy Policy', href: '#' },
];

// lucide-react no longer ships brand/trademarked icons (Facebook, Instagram,
// YouTube) in this version — using closest generic equivalents instead.
const SOCIALS = [
  { label: 'Facebook', icon: Share2 },
  { label: 'Instagram', icon: Camera },
  { label: 'YouTube', icon: Video },
  { label: 'WhatsApp', icon: MessageCircle },
];

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-border-white bg-bg-alt">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1 sm:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/rcc-crest.webp"
                alt="RCC crest"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
              <span className="font-body text-sm font-bold uppercase tracking-wide text-white">
                Racquets Club Community
              </span>
            </div>
            <p className="mt-4 font-body text-sm text-muted">
              A community of badminton lovers united by passion and the love for the game.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-white text-muted transition-colors hover:border-teal hover:text-teal"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg uppercase tracking-wide text-white">
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
            <h3 className="font-display text-lg uppercase tracking-wide text-white">Play</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {PLAY_LINKS.map((link) => (
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
            <h3 className="font-display text-lg uppercase tracking-wide text-white">Support</h3>
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
            <h3 className="font-display text-lg uppercase tracking-wide text-white">
              Contact Us
            </h3>
            <ul className="mt-4 flex flex-col gap-3 font-body text-sm text-muted">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                <span>hello@rackclubcommunity.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                <span>Paschim Vihar, New Delhi</span>
              </li>
            </ul>
            <div className="mt-5 rounded-lg border border-teal/30 p-4">
              <div className="flex items-center gap-2 text-teal">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span className="font-body text-xs font-semibold uppercase tracking-wide">
                  Join WhatsApp Community
                </span>
              </div>
              <p className="mt-2 font-body text-xs text-muted">
                Stay updated with games, events & more!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-white pt-8 sm:flex-row">
          <p className="font-body text-xs text-muted">
            &copy; 2024 Racquets Club Community. All rights reserved.
          </p>
          <p className="font-body text-xs text-muted">Made with &hearts; for the community</p>
        </div>
      </div>
    </footer>
  );
}
