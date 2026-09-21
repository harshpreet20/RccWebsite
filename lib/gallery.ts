export type GalleryPhoto = {
  image: string | null;
  alt: string;
};

// 34 real community-vibe photos (hangouts, team moments, community spirit).
export const GALLERY_PHOTOS: GalleryPhoto[] = Array.from({ length: 34 }, (_, i) => ({
  image: `/gallery/g${String(i + 1).padStart(2, '0')}.webp`,
  alt: `RCC community moment ${i + 1}`,
}));

export const GALLERY_PREVIEW_COUNT = 4;
