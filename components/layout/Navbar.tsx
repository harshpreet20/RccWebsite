'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Moon, X } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';

const NAV_LINKS = [
  { label: 'HOME', href: '#hero' },
  { label: 'ABOUT', href: '#our-story' },
  { label: 'PLAY', href: '#venues' },
  { label: 'EVENTS', href: '#event' },
  { label: 'MEMBERSHIP', href: '#membership' },
  { label: 'SHOP', href: '#shop' },
  { label: 'GALLERY', href: '#gallery' },
  { label: 'CONTACT', href: '#footer' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-white bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#hero" className="flex items-center gap-3">
          <Image
            src="/rcc-crest.webp"
            alt="RCC crest"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-body text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
              Racquets Club Community
            </span>
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-muted">
              Delhi &middot; Estd 2024
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-teal"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-white text-muted transition-colors hover:border-teal hover:text-teal"
          >
            <Moon className="h-4 w-4" aria-hidden="true" />
          </button>
          <LinkButton href="#hero" variant="primary" className="text-xs">
            JOIN RCC
          </LinkButton>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border-white text-white lg:hidden"
        >
          {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border-white bg-bg px-4 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-body text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-teal"
              >
                {link.label}
              </Link>
            ))}
            <LinkButton href="#hero" variant="primary" className="mt-2 w-fit text-xs">
              JOIN RCC
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}
