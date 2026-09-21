export type GalleryPhoto = {
  image: string | null;
  alt: string;
};

// 35 real community photos, arranged for a 4-column grid. The first 16
// (a 4x4 block) are shown by default, with the three solo portraits of
// RCC's women players (g15, g16, g35) landing in the visual center of
// that block; the rest expand in behind a "Show More" toggle.
const ORDER = [
  1, 2, 17, 25, // row 1 (edge)
  28, 15, 16, 34, // row 2 (center: 15, 16)
  13, 35, 24, 18, // row 3 (center: 35)
  19, 20, 21, 22, // row 4 (edge)
  3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 23, 26, 27, 29, 30, 31, 32, 33, // rest
];

export const GALLERY_PHOTOS: GalleryPhoto[] = ORDER.map((n) => ({
  image: `/gallery/g${String(n).padStart(2, '0')}.webp`,
  alt: `RCC community moment ${n}`,
}));
