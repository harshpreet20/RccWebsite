'use client';

import { useRef } from 'react';
import { MapPin, ArrowRight, ChevronLeft, ChevronRight, Grid2x2 } from 'lucide-react';
import Placeholder from '@/components/ui/Placeholder';
import { StaggerGroup, StaggerItem } from '@/components/ui/StaggerGroup';

/**
 * Venues — matches the reference mockup exactly. "Book Now" deep-links to
 * Hudle (RCC's booking partner); update `hudleUrl` per venue with the real
 * Hudle listing once available.
 */
type Venue = {
  name: string;
  area: string;
  courts: string;
  surface: string;
  hudleUrl: string;
};

const VENUES: Venue[] = [
  { name: 'Siri Fort Sports Complex', area: 'New Delhi', courts: '8 Courts', surface: 'Synthetic', hudleUrl: 'https://hudle.in/' },
  { name: 'Tilak Nagar Sports Complex', area: 'West Delhi', courts: '6 Courts', surface: 'Wooden', hudleUrl: 'https://hudle.in/' },
  { name: 'Paschim Vihar Sports Complex', area: 'West Delhi', courts: '7 Courts', surface: 'Synthetic', hudleUrl: 'https://hudle.in/' },
  { name: 'Pitampura Sports Complex', area: 'North Delhi', courts: '5 Courts', surface: 'Synthetic', hudleUrl: 'https://hudle.in/' },
];

export default function VenuesSection() {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <section id="play" className="border-t border-white/10 bg-[#050505] py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-teal)]">Play With RCC</p>
            <h2 className="mt-3 font-[var(--font-montserrat)] text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-5xl">
              Great Venues.
              <br />
              Everyday Play.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Access to 20+ premium venues across Delhi. Book, play and connect
              with players at your level, anytime.
            </p>
            <a
              href="https://hudle.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--color-gold)] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-110"
            >
              Explore Venues <ArrowRight size={15} />
            </a>
          </div>

          <div>
            {/* Carousel controls */}
            <div className="mb-4 flex justify-end gap-2">
              <button
                onClick={() => scrollBy(-1)}
                aria-label="Previous venues"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)]"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollBy(1)}
                aria-label="Next venues"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-[var(--color-gold)]/50 hover:text-[var(--color-gold)]"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <StaggerGroup
              containerRef={scroller}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {VENUES.map((v) => (
                <StaggerItem
                  key={v.name}
                  className="flex w-[220px] flex-none snap-start flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111]"
                >
                  <Placeholder className="aspect-[4/3]" />
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-sm font-bold leading-tight text-white">{v.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/40">
                      <MapPin size={11} /> {v.area}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-white/50">
                      <span className="flex items-center gap-1"><Grid2x2 size={11} /> {v.courts}</span>
                      <span>·</span>
                      <span>{v.surface}</span>
                    </div>
                    <a
                      href={v.hudleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[var(--color-teal)] hover:underline"
                    >
                      Book Now <ArrowRight size={12} />
                    </a>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
