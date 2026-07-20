import Image from 'next/image';
import { Play, Calendar, MapPin, Check } from 'lucide-react';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';

const EVENT_FEATURES = ['Exciting Matches', 'Trophies & Prizes', 'Goodies & More'];

const MEMBER_BENEFITS = [
  'Priority court bookings',
  'Exclusive tournaments',
  'Member-only events',
  'Special discounts on merch',
  'Connect with 300+ players',
];

export default function EventMembership() {
  return (
    <section id="event" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Upcoming Event */}
        <div className="relative overflow-hidden rounded-2xl border border-border-white">
          <div className="absolute inset-0">
            <PlaceholderPanel alt="RCC Cup 2024 event" watermark className="h-full w-full" />
          </div>
          <div className="relative flex flex-col gap-5 bg-bg/60 p-8 sm:p-10">
            <SectionEyebrow>Upcoming Event</SectionEyebrow>
            <h3 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">
              RCC Cup 2024
            </h3>
            <p className="flex items-center gap-2 font-body text-sm text-muted">
              <Play className="h-3.5 w-3.5 text-teal" aria-hidden="true" />
              Mix Skill Doubles Tournament
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-body text-sm text-white">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal" aria-hidden="true" />
                25th Aug 2024
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal" aria-hidden="true" />
                Siri Fort Sports Complex
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {EVENT_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 font-body text-sm text-white">
                  <Check className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <LinkButton href="#event" variant="primary">
                Register Now
              </LinkButton>
              <LinkButton href="#event" variant="text">
                View All Events
              </LinkButton>
            </div>
          </div>
        </div>

        {/* Right: Become a Member */}
        <div id="membership" className="relative overflow-hidden rounded-2xl border border-border-white">
          <div className="absolute inset-0">
            <PlaceholderPanel alt="Become an RCC member" watermark className="h-full w-full" />
          </div>
          <div className="relative flex flex-col gap-5 bg-bg/60 p-8 sm:p-10">
            <SectionEyebrow>Become a Member</SectionEyebrow>
            <h2 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">
              One Membership. Endless Benefits.
            </h2>
            <ul className="flex flex-col gap-2">
              {MEMBER_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 font-body text-sm text-white">
                  <Check className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
            <LinkButton href="#event" variant="primary" className="mt-2 w-fit">
              Join RCC Today
            </LinkButton>

            <div className="mt-4 flex w-56 items-center gap-3 rounded-xl border border-gold/50 bg-bg-alt/80 p-4 shadow-lg backdrop-blur-sm sm:absolute sm:right-8 sm:bottom-8 sm:mt-0">
              <Image
                src="/rcc-crest.webp"
                alt="RCC crest"
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-display text-lg uppercase tracking-wide text-gold-bright">
                  RCC Member
                </span>
                <span className="font-body text-[10px] uppercase tracking-[0.15em] text-muted">
                  Play. Connect. Grow.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
