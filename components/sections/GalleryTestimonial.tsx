import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';
import GalleryGrid from '@/components/ui/GalleryGrid';

export default function GalleryTestimonial() {
  return (
    <section id="gallery" className="bg-bg px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <SectionEyebrow>Gallery</SectionEyebrow>
          <h2 className="font-display mt-3 text-4xl uppercase tracking-wide text-fg sm:text-5xl">
            Moments That Bring Us Together.
          </h2>

          <GalleryGrid />

          <div className="mt-8">
            <LinkButton href="#gallery" variant="secondary">
              View Gallery
            </LinkButton>
          </div>
        </div>

        <div className="flex flex-col">
          <SectionEyebrow>What Members Say</SectionEyebrow>
          <Quote className="mt-6 h-16 w-16 text-teal" aria-hidden="true" />

          <p className="font-display mt-4 text-2xl leading-snug text-fg sm:text-3xl">
            &ldquo;RCC is not just a community, it&rsquo;s my second home. The people, the
            games, the energy – everything is amazing!&rdquo;
          </p>

          <div className="mt-8 flex items-center gap-4">
            <PlaceholderPanel
              alt="Harshit Singh"
              className="h-12 w-12 shrink-0 rounded-full"
            />
            <div>
              <p className="font-body text-sm font-bold text-fg">Harshit Singh</p>
              <p className="font-body text-xs text-muted">RCC Member</p>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <button
              type="button"
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-white text-fg transition-colors hover:border-teal hover:text-teal"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" />
              <span className="h-2 w-2 rounded-full bg-fg/20" aria-hidden="true" />
              <span className="h-2 w-2 rounded-full bg-fg/20" aria-hidden="true" />
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-white text-fg transition-colors hover:border-teal hover:text-teal"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
