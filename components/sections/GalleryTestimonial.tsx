import { Camera, ChevronLeft, ChevronRight, Quote, Trophy, Users } from 'lucide-react';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';

const GALLERY_ICONS = [Camera, Users, Trophy, Camera, Users, Trophy];

export default function GalleryTestimonial() {
  return (
    <section id="gallery" className="bg-bg px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <SectionEyebrow>Gallery</SectionEyebrow>
          <h2 className="font-display mt-3 text-4xl uppercase tracking-wide text-white sm:text-5xl">
            Moments That Bring Us Together.
          </h2>

          <div className="mt-8 grid grid-cols-3 grid-rows-2 gap-3">
            {GALLERY_ICONS.map((Icon, i) => (
              <PlaceholderPanel
                key={i}
                alt={`RCC gallery photo ${i + 1}`}
                icon={Icon}
                className="aspect-square rounded-xl"
              />
            ))}
          </div>

          <div className="mt-8">
            <LinkButton href="#gallery" variant="secondary">
              View Gallery
            </LinkButton>
          </div>
        </div>

        <div className="flex flex-col">
          <SectionEyebrow>What Members Say</SectionEyebrow>
          <Quote className="mt-6 h-16 w-16 text-teal" aria-hidden="true" />

          <p className="font-display mt-4 text-2xl leading-snug text-white sm:text-3xl">
            &ldquo;RCC is not just a community, it&rsquo;s my second home. The people, the
            games, the energy – everything is amazing!&rdquo;
          </p>

          <div className="mt-8 flex items-center gap-4">
            <PlaceholderPanel
              alt="Harshit Singh"
              className="h-12 w-12 shrink-0 rounded-full"
            />
            <div>
              <p className="font-body text-sm font-bold text-white">Harshit Singh</p>
              <p className="font-body text-xs text-muted">RCC Member</p>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <button
              type="button"
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-white text-white transition-colors hover:border-teal hover:text-teal"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" />
              <span className="h-2 w-2 rounded-full bg-white/20" aria-hidden="true" />
              <span className="h-2 w-2 rounded-full bg-white/20" aria-hidden="true" />
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-white text-white transition-colors hover:border-teal hover:text-teal"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
