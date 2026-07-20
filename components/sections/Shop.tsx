import Image from 'next/image';
import { Award, ShoppingCart } from 'lucide-react';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';
import { PRODUCTS } from '@/lib/products';

const STORE_URL = 'https://store.racquetsclubcommunity.com';

export default function Shop() {
  return (
    <section id="shop" className="bg-bg px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <SectionEyebrow>RCC Shop</SectionEyebrow>
            <h2 className="font-display mt-3 text-4xl uppercase tracking-wide text-white sm:text-5xl">
              Gear Up. Show Up.
            </h2>
            <p className="font-body mt-4 text-sm text-muted sm:text-base">
              Premium performance wear &amp; accessories designed for the game and the
              community.
            </p>
          </div>
          <LinkButton
            href={STORE_URL}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore Shop
          </LinkButton>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
          {PRODUCTS.map((product) => (
            <a
              key={product.url}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-white bg-panel transition-colors hover:border-teal"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <PlaceholderPanel
                    alt={product.name}
                    icon={Award}
                    className="h-full w-full"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors group-hover:bg-teal group-hover:text-black"
                >
                  <ShoppingCart className="h-4 w-4" />
                </span>
              </div>
              <div className="flex flex-col gap-1 px-3 py-4">
                <span className="font-body text-xs font-semibold uppercase tracking-wide text-white">
                  {product.name}
                </span>
                <span className="font-body text-sm font-semibold text-gold">
                  {product.price}
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <LinkButton
            href={STORE_URL}
            variant="text"
            target="_blank"
            rel="noopener noreferrer"
          >
            View All Products
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
