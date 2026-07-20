import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';

export default function CTA() {
  return (
    <section
      id="join"
      className="relative overflow-hidden bg-bg-alt px-6 py-28 sm:px-10 lg:px-16"
    >
      <PlaceholderPanel
        alt=""
        className="absolute inset-y-0 left-0 hidden w-1/4 opacity-10 sm:block"
      />
      <PlaceholderPanel
        alt=""
        className="absolute inset-y-0 right-0 hidden w-1/4 opacity-10 sm:block"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <SectionEyebrow>Ready To Be Part Of RCC?</SectionEyebrow>
        <h2 className="font-display mt-4 text-5xl uppercase leading-tight tracking-wide text-white sm:text-6xl lg:text-7xl">
          Let&rsquo;s Play. Let&rsquo;s Grow. Together.
        </h2>
        <div className="mt-10">
          <LinkButton href="#join" variant="primary">
            Join The Community
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
