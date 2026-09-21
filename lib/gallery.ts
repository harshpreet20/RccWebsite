export type GalleryPhoto = {
  image: string | null;
  alt: string;
};

// 34 real community-vibe photos (hangouts, team moments, community spirit).
// Ordered so photos featuring RCC's women players lead the set — they were
// under-represented in upload order, so they're pulled to the front (and
// into the 4-photo homepage preview) rather than left to chance.
const FEATURED_FIRST = [15, 16, 3, 24, 31, 33, 30];
const REMAINING = Array.from({ length: 34 }, (_, i) => i + 1).filter(
  (n) => !FEATURED_FIRST.includes(n),
);
const ORDER = [...FEATURED_FIRST, ...REMAINING];

export const GALLERY_PHOTOS: GalleryPhoto[] = ORDER.map((n) => ({
  image: `/gallery/g${String(n).padStart(2, '0')}.webp`,
  alt: `RCC community moment ${n}`,
}));

export const GALLERY_PREVIEW_COUNT = 4;
