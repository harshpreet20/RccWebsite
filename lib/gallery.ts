export type GalleryPhoto = {
  image: string | null;
  alt: string;
};

// 35 real community photos, arranged for a 6-column grid so the three solo
// portraits of RCC's women players (g15, g16, g35) land in the visual
// center of the grid, with general community-vibe shots (group photos,
// matchplay, hangouts) surrounding them toward the edges.
const ORDER = [
  1, 2, 17, 25, 28, 34, // row 1 (edge)
  13, 18, 19, 20, 21, 22, // row 2
  23, 26, 15, 16, 35, 24, // row 3 (center: 15, 16, 35)
  31, 33, 30, 3, 27, 29, // row 4
  32, 4, 5, 6, 7, 8, // row 5
  9, 10, 11, 12, 14, // row 6 (edge, partial)
];

export const GALLERY_PHOTOS: GalleryPhoto[] = ORDER.map((n) => ({
  image: `/gallery/g${String(n).padStart(2, '0')}.webp`,
  alt: `RCC community moment ${n}`,
}));
