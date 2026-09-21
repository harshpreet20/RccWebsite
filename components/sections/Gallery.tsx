import SectionEyebrow from '@/components/ui/SectionEyebrow';
import GalleryGrid from '@/components/ui/GalleryGrid';

export default function Gallery() {
  return (
    <section id="gallery" className="bg-bg px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <SectionEyebrow>Gallery</SectionEyebrow>
          <h2 className="font-display mt-3 text-4xl uppercase tracking-wide text-fg sm:text-5xl">
            Moments That Bring Us Together.
          </h2>
        </div>

        <GalleryGrid />
      </div>
    </section>
  );
}
