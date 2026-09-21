'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from 'lucide-react';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';
import { GALLERY_PHOTOS } from '@/lib/gallery';

const PREVIEW_COUNT = 16;

export default function GalleryGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const visiblePhotos = expanded ? GALLERY_PHOTOS : GALLERY_PHOTOS.slice(0, PREVIEW_COUNT);

  useEffect(() => {
    if (openIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') {
        setOpenIndex((i) => (i === null ? i : (i + 1) % GALLERY_PHOTOS.length));
      }
      if (e.key === 'ArrowLeft') {
        setOpenIndex((i) => (i === null ? i : (i - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length));
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [openIndex]);

  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {visiblePhotos.map((photo, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Expand ${photo.alt}`}
            className="group relative aspect-square overflow-hidden rounded-xl transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            <PlaceholderPanel imageSrc={photo.image ?? undefined} alt={photo.alt} className="h-full w-full" />
          </button>
        ))}
      </div>

      {GALLERY_PHOTOS.length > PREVIEW_COUNT && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex items-center gap-2 rounded-full border border-border-white px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-fg transition-colors hover:border-teal hover:text-teal"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" aria-hidden="true" />
              </>
            ) : (
              <>
                View All Photos <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      )}

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpenIndex(null)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-border-white text-white transition-colors hover:border-teal hover:text-teal"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((i) => (i === null ? i : (i - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length));
            }}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full border border-border-white text-white transition-colors hover:border-teal hover:text-teal sm:left-8"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div
            className="relative aspect-square w-full max-w-xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <PlaceholderPanel
              imageSrc={GALLERY_PHOTOS[openIndex].image ?? undefined}
              alt={GALLERY_PHOTOS[openIndex].alt}
              className="h-full w-full"
            />
          </div>

          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((i) => (i === null ? i : (i + 1) % GALLERY_PHOTOS.length));
            }}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full border border-border-white text-white transition-colors hover:border-teal hover:text-teal sm:right-8"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>

          <span className="absolute bottom-6 font-body text-xs uppercase tracking-wide text-muted">
            {openIndex + 1} / {GALLERY_PHOTOS.length}
          </span>
        </div>
      )}
    </>
  );
}
