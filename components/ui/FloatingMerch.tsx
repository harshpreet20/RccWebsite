'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fetchStoreProducts, type StoreProduct } from '@/lib/store-products';

/**
 * FloatingMerch — a desktop-only hero-right layer showing 2–3 RCC products that
 * gently bob and rotate. Fetched client-side; items whose image is missing or
 * fails to load are silently dropped (no broken images, no empty boxes).
 * Respects prefers-reduced-motion (renders static). Sits to the right of and
 * behind the left-aligned headline.
 */

// Fixed positions in the right ~40% of the hero, staggered vertically.
const SLOTS = [
  { top: '20%', right: '6%', size: 200, delay: 0 },
  { top: '46%', right: '24%', size: 150, delay: 0.6 },
  { top: '60%', right: '3%', size: 130, delay: 1.1 },
];

export default function FloatingMerch() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();

  useEffect(() => {
    let alive = true;
    fetchStoreProducts(3)
      .then((p) => {
        if (alive) setProducts(p.filter((x) => !!x.image));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const items = products.filter((p) => !failed[p.slug]).slice(0, 3);
  if (items.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] hidden lg:block"
    >
      {items.map((product, i) => {
        const slot = SLOTS[i] ?? SLOTS[SLOTS.length - 1];
        const floatAnim = reduce
          ? undefined
          : {
              y: [0, -16, 0],
              rotate: [-3, 3, -3],
            };
        return (
          <motion.div
            key={product.slug}
            className="absolute will-change-transform"
            style={{
              top: slot.top,
              right: slot.right,
              width: slot.size,
              height: slot.size,
            }}
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.9 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: slot.delay, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="h-full w-full"
              animate={floatAnim}
              transition={
                reduce
                  ? undefined
                  : {
                      duration: 6 + i * 1.4,
                      delay: slot.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image as string}
                alt=""
                onError={() =>
                  setFailed((f) => ({ ...f, [product.slug]: true }))
                }
                className="h-full w-full object-contain"
                style={{
                  filter:
                    'drop-shadow(0 18px 40px rgba(0,183,168,0.35)) drop-shadow(0 4px 14px rgba(0,0,0,0.5))',
                }}
                loading="lazy"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
