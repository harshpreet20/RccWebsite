import { Users, Building2, Calendar, Trophy } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';
import IconStat from '@/components/ui/IconStat';
import StarField from '@/components/ui/StarField';

const STATS = [
  { icon: Users, value: '300+', label: 'Active Members' },
  { icon: Building2, value: '20+', label: 'Venues Across Delhi' },
  { icon: Calendar, value: 'Weekly', label: 'Games & Sessions' },
  { icon: Trophy, value: '5+', label: 'Tournaments Every Year' },
];

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-bg">
      <div className="relative isolate min-h-[90vh] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/70 to-bg"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-bg via-bg/40 to-transparent"
        />
        <StarField />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 -rotate-90 font-body text-xs uppercase tracking-[0.3em] text-muted md:block"
        >
          0 &mdash; Scroll to explore
        </span>

        <div className="relative mx-auto flex min-h-[90vh] w-full max-w-7xl flex-col items-center gap-12 px-6 py-32 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex max-w-xl flex-col items-start gap-6">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              Racquets Club Community
            </p>
            <h1 className="font-display text-6xl uppercase leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
              <span className="block">One Community.</span>
              <span className="block">One Passion.</span>
              <span className="block">
                <span className="text-gold">Racquets</span>{' '}
                <span className="text-teal">Forever.</span>
              </span>
            </h1>
            <p className="font-body text-base text-muted-alt sm:text-lg">
              RCC is more than a badminton community. It&apos;s a movement of players, by
              players, united by passion, respect &amp; the love for the game.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <LinkButton href="#membership" variant="primary">
                Join The Community
              </LinkButton>
              <LinkButton href="#our-story" variant="secondary">
                Explore RCC
              </LinkButton>
            </div>
          </div>

          <div className="relative w-full max-w-md">
            <PlaceholderPanel
              alt="RCC athlete in action"
              className="aspect-[4/5] w-full rounded-2xl border border-border-white shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-6 w-56 rounded-xl border border-border-white bg-panel/80 p-4 shadow-2xl backdrop-blur-md sm:-left-10">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-teal">
                Official RCC Merch
              </p>
              <PlaceholderPanel
                alt="Official RCC merchandise"
                className="mt-3 aspect-square w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto -mt-12 w-full max-w-6xl px-6 pb-16 md:-mt-16 md:px-10">
        <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border-white bg-panel/60 px-6 py-8 backdrop-blur-md sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-border-white">
          {STATS.map((stat) => (
            <IconStat
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              className="sm:px-6 sm:first:pl-0 sm:last:pr-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
