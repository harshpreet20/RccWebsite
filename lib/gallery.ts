export type GalleryPhoto = {
  image: string | null;
  alt: string;
};

// 34 community-vibe photos (tournaments, hangouts, team moments — not court
// action shots). Real files haven't landed in the repo yet — drop them into
// public/gallery/ and swap `image: null` for the real path here.
export const GALLERY_PHOTOS: GalleryPhoto[] = Array.from({ length: 34 }, (_, i) => ({
  image: null,
  alt: `RCC community moment ${i + 1}`,
}));

export const GALLERY_PREVIEW_COUNT = 4;
