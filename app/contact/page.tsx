import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Camera, Video } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import QueryForm from '@/components/ui/QueryForm';

export const metadata: Metadata = {
  title: 'Contact Us | Racquets Club Community',
  description:
    "Get in touch with Racquets Club Community: email, WhatsApp, our home court address and a map, or send us an enquiry directly.",
};

const ADDRESS = 'A-2B, A 2B Block, Paschim Vihar, New Delhi, Delhi, 110063';
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;
const MAP_LINK = 'https://maps.app.goo.gl/P9xKMFVvL1CkHGN56';
const WHATSAPP_URL = 'https://chat.whatsapp.com/FHYw4wbNQDbJfJjDMGZr96?s=cl&p=i&mlu=4&ilr=4';

const CONTACT_CARDS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@racquetsclubcommunity.com',
    href: 'mailto:hello@racquetsclubcommunity.com',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp Community',
    value: 'Join the group',
    href: WHATSAPP_URL,
  },
  {
    icon: Camera,
    label: 'Instagram',
    value: '@racquetsclubcommunity',
    href: 'https://www.instagram.com/racquetsclubcommunity/',
  },
  {
    icon: Video,
    label: 'YouTube',
    value: '@RacquetsClub',
    href: 'https://www.youtube.com/@RacquetsClub',
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg">
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <SectionEyebrow>Contact Us</SectionEyebrow>
            <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-fg sm:text-5xl">
              Let&apos;s Get You On Court.
            </h1>
            <p className="mt-4 font-body text-sm text-muted sm:text-base">
              Reach out for corporate events, partnerships, or anything else: here&apos;s
              every way to find us.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACT_CARDS.map((card) => (
              <a
                key={card.label}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex flex-col gap-3 rounded-2xl border border-border-white bg-panel/60 p-6 transition-colors hover:border-teal"
              >
                <card.icon className="h-6 w-6 text-teal" aria-hidden="true" />
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                    {card.label}
                  </p>
                  <p className="mt-1 font-body text-sm font-medium text-fg">{card.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-2xl uppercase tracking-wide text-fg">
                    Our Home Court
                  </h2>
                  <p className="mt-2 font-body text-sm text-muted sm:text-base">
                    {ADDRESS}
                  </p>
                  <p className="mt-2 font-body text-sm text-muted sm:text-base">
                    This is RCC&apos;s home court location, where our regular sessions
                    and matchplay happen.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border-white">
                <iframe
                  title="RCC home court location map"
                  src={MAP_EMBED_SRC}
                  className="h-80 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 font-body text-sm font-semibold uppercase tracking-wide text-teal transition-all hover:gap-3"
              >
                Open In Google Maps →
              </a>
            </div>

            <div className="rounded-2xl border border-border-white bg-panel/60 p-6 sm:p-8">
              <h2 className="font-display text-2xl uppercase tracking-wide text-fg">
                Send Us A Message
              </h2>
              <p className="mt-2 font-body text-sm text-muted">
                We usually reply within a day.
              </p>
              <div className="mt-6">
                <QueryForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
