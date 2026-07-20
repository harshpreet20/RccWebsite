'use client';

import { useEffect, useRef } from 'react';
import { Users, ArrowRight } from 'lucide-react';
import Counter from '@/components/ui/Counter';
import Magnetic from '@/components/ui/Magnetic';
import HeroParticles from '@/components/ui/HeroParticles';
import FloatingMerch from '@/components/ui/FloatingMerch';

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
  const tealRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);

  // Soft mouse parallax on the volumetric light layers.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 2;
        const dy = (e.clientY / window.innerHeight - 0.5) * 2;
        if (tealRef.current) tealRef.current.style.transform = `translate(${dx * 26}px, ${dy * 26}px)`;
        if (goldRef.current) goldRef.current.style.transform = `translate(${dx * -18}px, ${dy * -18}px)`;
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#050505]">
      {/* Animated fallback: drifting teal shuttlecock-feather particles (behind video) */}
      <HeroParticles />

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
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-[#050505]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60" />
      {/* Soft teal volumetric lighting + gold highlight (mouse parallax) */}
      <div
        ref={tealRef}
        className="absolute inset-0 will-change-transform"
        style={{
          transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
          background:
            'radial-gradient(ellipse 70% 90% at 78% 40%, rgba(0,183,168,0.22) 0%, transparent 60%)',
        }}
      />
      <div
        ref={goldRef}
        className="absolute inset-0 will-change-transform"
        style={{
          transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
          background:
            'radial-gradient(ellipse 40% 60% at 15% 75%, rgba(212,175,55,0.10) 0%, transparent 55%)',
        }}
      />

      {/* Floating RCC merch (desktop only, right ~40%, behind the headline) */}
      <FloatingMerch />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pb-40 pt-32 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[var(--color-teal)]">
          Racquets Club Community
        </p>
        <h1 className="mt-5 font-[var(--font-montserrat)] text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
          One Community.
          <br />
          One Passion.
          <br />
          Racquets <span className="text-[var(--color-teal)]">Forever.</span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70">
          RCC is more than a badminton community. It&apos;s a movement of players,
          by players — united by passion, respect &amp; the love for the game.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Magnetic>
            <a
              href="/membership"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--color-gold)] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-110"
            >
              <Users size={15} /> Join the Community <ArrowRight size={15} />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Explore RCC <ArrowRight size={15} />
            </a>
          </Magnetic>
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
              <Counter value={s.value} className="font-[var(--font-montserrat)] text-2xl font-extrabold text-[var(--color-teal)]" />
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
