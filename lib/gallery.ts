export type GalleryPhoto = {
  image: string | null;
  alt: string;
};

// 34 real community photos, arranged for a 6-column grid so the two solo
// portraits of RCC's women players (g15, g16) land in the visual center of
// the grid, with general community-vibe shots (group photos, matchplay,
// hangouts) surrounding them toward the edges.
const ORDER = [
  1, 2, 17, 25, 28, 34, // row 1 (edge)
  13, 18, 19, 20, 21, 22, // row 2
  23, 26, 15, 16, 24, 31, // row 3 (center: 15, 16)
  33, 30, 3, 27, 29, 32, // row 4
  4, 5, 6, 7, 8, 9, // row 5
  10, 11, 12, 14, // row 6 (edge, partial)
];

export const GALLERY_PHOTOS: GalleryPhoto[] = ORDER.map((n) => ({
  image: `/gallery/g${String(n).padStart(2, '0')}.webp`,
  alt: `RCC community moment ${n}`,
}));
