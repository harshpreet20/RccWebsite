'use client';

import { useEffect, useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, Trophy, Users, X } from 'lucide-react';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';

const items = [Camera, Users, Trophy, Camera, Users, Trophy].map((icon, i) => ({
  icon,
  alt: `RCC gallery photo ${i + 1}`,
}));

export default function GalleryGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === 'ArrowLeft') {
        setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
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
      <div className="mt-8 grid grid-cols-3 grid-rows-2 gap-3">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={`Expand ${item.alt}`}
            className="group relative aspect-square overflow-hidden rounded-xl transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            <PlaceholderPanel alt={item.alt} icon={item.icon} className="h-full w-full" />
          </button>
        ))}
      </div>

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
              setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
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
              alt={items[openIndex].alt}
              icon={items[openIndex].icon}
              className="h-full w-full"
            />
          </div>

          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
            }}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full border border-border-white text-white transition-colors hover:border-teal hover:text-teal sm:right-8"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>

          <span className="absolute bottom-6 font-body text-xs uppercase tracking-wide text-muted">
            {openIndex + 1} / {items.length}
          </span>
        </div>
      )}
    </>
  );
}
