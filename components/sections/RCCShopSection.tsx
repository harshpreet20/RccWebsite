'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import {
  fetchStoreProducts,
  storeProductUrl,
  STORE_ORIGIN,
  money,
  type StoreProduct,
} from '@/lib/store-products';

/**
 * RCC Shop — live from the shared store database, so the homepage, store and
 * backend panel stay in sync. Cards deep-link to the store.
 */
export default function RCCShopSection() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchStoreProducts(5).then((p) => {
      setProducts(p);
      setLoaded(true);
    });
  }, []);

  // Nothing configured yet — hide the section rather than show an empty shell.
  if (loaded && products.length === 0) return null;

  return (
    <section id="shop" className="relative border-t border-[var(--color-border)] bg-[#050505] py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-teal)]">
              RCC Shop
            </p>
            <h2 className="mt-2 font-[var(--font-montserrat)] text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
              Gear Up. Show Up.
            </h2>
            <p className="mt-3 max-w-md text-sm text-[var(--color-muted)]">
              Premium performance wear &amp; accessories designed for the game and
              the community.
            </p>
          </div>
          <a
            href={STORE_ORIGIN}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-gold)]/50 px-5 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/10"
          >
            Explore Shop <ArrowRight size={16} />
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {(loaded ? products : Array.from({ length: 5 })).map((p, i) => {
            const product = p as StoreProduct;
            return (
              <a
                key={loaded ? product.slug : i}
                href={loaded ? storeProductUrl(product.slug) : STORE_ORIGIN}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[#111111] transition hover:border-[var(--color-gold)]/40"
              >
                <div className="relative aspect-square overflow-hidden bg-[#0B0B0B]">
                  {loaded && product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-5xl"
                      style={{
                        background: loaded
                          ? `radial-gradient(120% 120% at 30% 20%, ${product.accent ?? '#006C67'}, #0B0B0B)`
                          : '#111111',
                      }}
                    >
                      {loaded ? <span>{product.emoji ?? '🎾'}</span> : null}
                    </div>
                  )}
                  {loaded && product.badge && (
                    <span className="absolute left-2 top-2 rounded bg-[var(--color-teal)] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-black">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="text-xs font-bold uppercase leading-tight tracking-wide text-white">
                    {loaded ? product.name : ' '}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-black text-[var(--color-gold)]">
                      {loaded ? money(product.price) : ''}
                    </span>
                    {loaded && (
                      <span className="grid h-7 w-7 place-items-center rounded-md border border-[var(--color-border)] text-white/70 transition group-hover:border-[var(--color-gold)]/50 group-hover:text-[var(--color-gold)]">
                        <ShoppingCart size={13} />
                      </span>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <a
            href={STORE_ORIGIN}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--color-teal)] hover:underline"
          >
            View All Products <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
