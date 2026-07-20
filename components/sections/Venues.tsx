import { ChevronLeft, ChevronRight, Grid2x2, CircleDot } from 'lucide-react';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';

type Venue = {
  name: string;
  area: string;
  courts: number;
  surface: string;
};

const VENUES: Venue[] = [
  { name: 'Siri Fort Sports Complex', area: 'New Delhi', courts: 8, surface: 'Synthetic' },
  { name: 'Tilak Nagar Sports Complex', area: 'West Delhi', courts: 6, surface: 'Wooden' },
  { name: 'Paschim Vihar Sports Complex', area: 'West Delhi', courts: 7, surface: 'Synthetic' },
  { name: 'Pitampura Sports Complex', area: 'North Delhi', courts: 5, surface: 'Synthetic' },
];

export default function Venues() {
  return (
    <section id="venues" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <SectionEyebrow>Play With RCC</SectionEyebrow>
          <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">
            Great Venues. Everyday Play.
          </h2>
          <p className="mt-4 font-body text-sm text-muted sm:text-base">
            Access to 20+ premium venues across Delhi. Book, play and connect with players at
            your level, anytime.
          </p>
          <LinkButton href="#venues" variant="secondary" className="mt-6">
            Explore Venues
          </LinkButton>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            aria-label="Previous venue"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-white text-muted transition-colors hover:border-teal hover:text-teal"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next venue"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-white text-muted transition-colors hover:border-teal hover:text-teal"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {VENUES.map((venue) => (
          <div
            key={venue.name}
            className="relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border-white bg-panel sm:w-[340px]"
          >
            <PlaceholderPanel
              alt={`${venue.name} court`}
              icon={Grid2x2}
              className="h-44 w-full"
            />
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <p className="font-body text-base font-bold text-white">{venue.name}</p>
                <p className="font-body text-sm text-muted">{venue.area}</p>
              </div>
              <div className="flex items-center gap-4 font-body text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <Grid2x2 className="h-4 w-4 text-teal" aria-hidden="true" />
                  {venue.courts} Courts
                </span>
                <span className="flex items-center gap-1.5">
                  <CircleDot className="h-4 w-4 text-teal" aria-hidden="true" />
                  {venue.surface}
                </span>
              </div>
              <LinkButton href="#venues" variant="text" className="mt-auto w-fit">
                Book Now
              </LinkButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
