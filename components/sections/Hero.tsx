'use client';

import { Users, ArrowRight } from 'lucide-react';

/**
 * Hero — video/gif background (smooth, no per-frame canvas work). Drop the real
 * clip at /public/hero.mp4 (+ optional /public/hero-poster.jpg). Until then the
 * poster/gradient shows, so the section always looks intentional.
 */

const STATS = [
  { value: '300+', label: 'Active Members', sub: '' },
  { value: '20+', label: 'Venues', sub: 'Across Delhi' },
  { value: 'Weekly', label: 'Games & Sessions', sub: '' },
  { value: '5+', label: 'Tournaments', sub: 'Every year' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0f]">
      {/* Video / gif background (placeholder-safe) */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/85 to-[#0a0a0f]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/60" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 90% at 78% 45%, rgba(194,24,24,0.28) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-40 pt-32 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--color-gold)]">
          Racquets Club Community
        </p>
        <h1 className="mt-5 font-[var(--font-montserrat)] text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
          One Community.
          <br />
          One Passion.
          <br />
          <span className="text-[var(--color-gold)]">Racquets Forever.</span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70">
          RCC is more than a badminton community. It&apos;s a movement of players,
          by players — united by passion, respect &amp; the love for the game.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/membership"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-gold)] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-110"
          >
            <Users size={15} /> Join the Community <ArrowRight size={15} />
          </a>
          <a
            href="/about"
            className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 transition hover:border-white/40 hover:text-white"
          >
            Explore RCC <ArrowRight size={15} />
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/50 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 px-5 py-6 ${
                i < STATS.length - 1 ? 'md:border-r border-white/10' : ''
              }`}
            >
              <span className="font-[var(--font-montserrat)] text-2xl font-extrabold text-[var(--color-gold)]">
                {s.value}
              </span>
              <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide text-white/70">
                {s.label}
                {s.sub && <span className="block text-white/40">{s.sub}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
