import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';
import Image from 'next/image';

const HUDLE_VENUE_URL = 'https://hudle.in/venues/the-sports-store-badminton-arena/862035';

export default function Partners() {
  return (
    <section id="partners" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <SectionEyebrow>Our Partners</SectionEyebrow>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-fg sm:text-5xl">
          Who We Play With.
        </h2>
        <p className="mt-4 font-body text-sm text-muted sm:text-base">
          The venue and platform that make it possible to play, every day.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <a
          href={HUDLE_VENUE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl border border-border-white p-6"
        >
          <Image
            src="/venue/arena-1.webp"
            alt="The Sports Store Badminton Arena"
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          <div className="relative flex flex-col gap-1">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              Official Venue Partner
            </span>
            <span className="font-display text-2xl uppercase tracking-wide text-white">
              The Sports Store Badminton Arena
            </span>
          </div>
        </a>

        <a
          href={HUDLE_VENUE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-56 flex-col justify-between rounded-2xl border border-border-white bg-panel p-6 transition-colors hover:border-teal"
        >
          <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Official Booking Partner
          </span>
          <div className="flex flex-col gap-4">
            <span className="font-display text-4xl uppercase tracking-wide text-fg">Hudle</span>
            <LinkButton
              href={HUDLE_VENUE_URL}
              variant="text"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit"
            >
              Book On Hudle
            </LinkButton>
          </div>
        </a>
      </div>
    </section>
  );
}
