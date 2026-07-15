import { supabase } from './supabase';

/**
 * The RCC store, main website and CRM all read the SAME products table in the
 * shared RCC Supabase project — so the homepage shop stays in sync with the
 * store and the backend panel automatically. Product images are served by the
 * store, so relative paths are prefixed with the store origin.
 */
export const STORE_ORIGIN = 'https://store.racquetsclubcommunity.com';

export type StoreProduct = {
  slug: string;
  name: string;
  blurb: string | null;
  price: number;
  image: string | null;
  category: string | null;
  badge: string | null;
  accent: string | null;
  emoji: string | null;
  kind: string | null;
};

function resolveImage(image: string | null): string | null {
  if (!image) return null;
  return image.startsWith('http') ? image : `${STORE_ORIGIN}${image}`;
}

export async function fetchStoreProducts(limit = 8): Promise<StoreProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('slug,name,blurb,price,image,category,badge,accent,emoji,kind,active,sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .limit(limit);
    if (error || !data) return [];
    return data.map((p) => ({
      slug: p.slug,
      name: p.name,
      blurb: p.blurb,
      price: p.price,
      image: resolveImage(p.image),
      category: p.category,
      badge: p.badge,
      accent: p.accent,
      emoji: p.emoji,
      kind: p.kind,
    }));
  } catch {
    return [];
  }
}

export function storeProductUrl(slug: string) {
  return `${STORE_ORIGIN}/product/${slug}`;
}

export const money = (n: number) => `₹${(n || 0).toLocaleString('en-IN')}`;
