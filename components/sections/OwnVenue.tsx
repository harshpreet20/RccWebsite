import { CheckCircle2, MapPinned } from 'lucide-react';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';

const FEATURES = [
  'Fully owned & operated by RCC',
  'Also listed on Hudle & other booking platforms',
  'Priority slots for RCC members',
];

export default function OwnVenue() {
  return (
    <section id="own-venue" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 overflow-hidden rounded-2xl border border-border-white bg-panel lg:grid-cols-2">
        <PlaceholderPanel
          alt="The RCC home court"
          icon={MapPinned}
          watermark
          className="h-64 w-full lg:h-full"
        />
        <div className="flex flex-col justify-center gap-5 p-8 sm:p-10">
          <SectionEyebrow>Our Own Venue</SectionEyebrow>
          <h2 className="font-display text-4xl uppercase tracking-wide text-fg sm:text-5xl">
            The RCC Home Court
          </h2>
          <p className="font-body text-sm text-muted sm:text-base">
            RCC runs its own dedicated home court — built for the community, by the
            community. It&apos;s also listed on Hudle and other booking platforms, so you
            can book a session anytime.
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
              href="https://hudle.in/"
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
