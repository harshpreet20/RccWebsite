'use client';

import { MapPin, LayoutGrid, ArrowRight } from 'lucide-react';

/**
 * Venues — "Book Now" deep-links to Hudle (RCC's booking partner). Replace
 * `hudleUrl` per venue with the real Hudle listing; images are banner
 * placeholders until real photos are added.
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
  return (
    <section id="play" className="border-t border-white/10 bg-[#0a0a0f] py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-gold)]">Play With RCC</p>
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

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {VENUES.map((v) => (
              <div key={v.name} className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111118]">
                {/* Banner placeholder */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-[#16202b] to-[#0b0f14]">
                  <div className="absolute inset-0 grid place-items-center text-white/15">
                    <LayoutGrid size={34} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="text-xs font-bold leading-tight text-white">{v.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/40">
                    <MapPin size={10} /> {v.area}
                  </p>
                  <p className="mt-2 text-[10px] text-white/50">
                    {v.courts} · {v.surface}
                  </p>
                  <a
                    href={v.hudleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[var(--color-gold)] hover:underline"
                  >
                    Book Now <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
