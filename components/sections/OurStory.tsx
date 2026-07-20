import { Users, Building2, TrendingUp } from 'lucide-react';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';

const PILLARS = [
  {
    icon: Users,
    title: 'Community First',
    copy: "We're a family of players who respect the game and each other.",
  },
  {
    icon: Building2,
    title: 'Quality Play',
    copy: 'Great venues, fair play & the best experience every time.',
  },
  {
    icon: TrendingUp,
    title: 'Grow Together',
    copy: 'We learn, compete and celebrate every win as one.',
  },
];

export default function OurStory() {
  return (
    <section id="our-story" className="relative bg-bg py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col items-start gap-6">
            <SectionEyebrow>Our Story</SectionEyebrow>
            <h2 className="font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
              Built For Players. By Players.
            </h2>
            <p className="font-body text-base text-muted-alt sm:text-lg">
              Racquets Club Community (RCC) was founded with a simple goal &mdash; create a
              space where badminton lovers of all levels can play, connect, compete and
              grow together.
            </p>
            <p className="font-body text-base text-muted-alt sm:text-lg">
              From casual sessions to competitive tournaments, we&apos;re building
              Delhi&apos;s most engaging and trusted badminton community.
            </p>
            <LinkButton href="#about" variant="secondary">
              Know More About RCC
            </LinkButton>
          </div>

          <PlaceholderPanel
            alt="RCC players group photo"
            watermark
            className="aspect-[4/3] w-full rounded-2xl border border-border-white"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col items-start gap-4 rounded-2xl border border-border-white bg-panel/60 p-6"
            >
              <pillar.icon className="h-8 w-8 text-teal" aria-hidden="true" />
              <h3 className="font-display text-2xl uppercase tracking-wide text-white">
                {pillar.title}
              </h3>
              <p className="font-body text-sm text-muted">{pillar.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
