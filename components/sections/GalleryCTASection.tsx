'use client';

import { ImageIcon, Quote, ArrowRight } from 'lucide-react';

/** Gallery uses banner placeholders (swap for real photos) + a member quote,
 *  followed by the closing call-to-action. */
export default function GalleryCTASection() {
  return (
    <>
      <section id="gallery" className="border-t border-white/10 bg-[#050505] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-teal)]">Gallery</p>
            <h2 className="mt-3 font-[var(--font-montserrat)] text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-5xl">
              Moments That
              <br />
              Bring Us Together.
            </h2>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="grid aspect-[4/3] place-items-center rounded-lg border border-white/10 bg-gradient-to-br from-[#101f1c] to-[#070d0c] text-white/15">
                  <ImageIcon size={22} />
                </div>
              ))}
            </div>
            <a href="/community" className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--color-teal)]/50 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-teal)] transition hover:bg-[var(--color-teal)]/10">
              View Gallery <ArrowRight size={15} />
            </a>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-teal)]">What Members Say</p>
            <Quote className="mt-6 text-[var(--color-teal)]" size={40} />
            <p className="mt-4 max-w-md text-2xl font-semibold leading-snug text-white/90">
              RCC is not just a community, it&apos;s my second home. The people, the
              games, the energy — everything is amazing!
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-gold)]/15 text-sm font-black text-[var(--color-gold)]">HS</div>
              <div>
                <p className="text-sm font-bold text-white">Harshit Singh</p>
                <p className="text-[11px] uppercase tracking-wide text-white/40">RCC Member</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0B0B0B] to-[#050505] py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-teal)]">Ready to be part of RCC?</p>
        <h2 className="mt-4 font-[var(--font-montserrat)] text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
          Let&apos;s Play. Let&apos;s Grow. Together.
        </h2>
        <a href="/membership" className="mt-8 inline-flex items-center gap-2 rounded-md bg-[var(--color-gold)] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:brightness-110">
          Join the Community <ArrowRight size={16} />
        </a>
      </section>
    </>
  );
}
