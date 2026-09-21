import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';

const HUDLE_VENUE_URL = 'https://hudle.in/venues/the-sports-store-badminton-arena/862035';

const FEATURES = [
  'Home turf for RCC sessions & matchplay',
  'Officially listed on Hudle',
  'Priority slots for RCC members',
];

const ARENA_PHOTOS = [
  '/venue/arena-1.webp',
  '/venue/arena-2.webp',
  '/venue/arena-3.webp',
  '/venue/arena-4.webp',
];

export default function OwnVenue() {
  return (
    <section id="own-venue" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 overflow-hidden rounded-2xl border border-border-white bg-panel lg:grid-cols-2">
        <div className="grid grid-cols-2 grid-rows-2 gap-1 p-1">
          {ARENA_PHOTOS.map((src, i) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={src}
                alt={`The Sports Store Badminton Arena, photo ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-5 p-8 sm:p-10">
          <SectionEyebrow>Our Home Court</SectionEyebrow>
          <h2 className="font-display text-4xl uppercase tracking-wide text-fg sm:text-5xl">
            The Sports Store Badminton Arena
          </h2>
          <p className="font-body text-sm text-muted sm:text-base">
            This is RCC&apos;s home ground, where our regular sessions, practice and
            matchplay happen. It&apos;s officially listed on Hudle, so you can book a slot
            anytime.
          </p>
          <ul className="flex flex-col gap-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 font-body text-sm text-fg">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 sm:flex-row">
            <LinkButton
              href={HUDLE_VENUE_URL}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book On Hudle
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
