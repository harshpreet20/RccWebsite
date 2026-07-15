'use client';

import { Users, ShieldCheck, TrendingUp, ArrowRight, ImageIcon } from 'lucide-react';

const VALUES = [
  { icon: Users, title: 'Community First', text: "We're a family of players who respect the game and each other." },
  { icon: ShieldCheck, title: 'Quality Play', text: 'Great venues, fair play & the best experience every time.' },
  { icon: TrendingUp, title: 'Grow Together', text: 'We learn, compete and celebrate every win as one.' },
];

export default function OurStorySection() {
  return (
    <section id="about" className="border-t border-white/10 bg-[#050505] py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-teal)]">Our Story</p>
          <h2 className="mt-3 font-[var(--font-montserrat)] text-4xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-5xl">
            Built for Players.
            <br />
            By Players.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
            Racquets Club Community (RCC) was founded with a simple goal — create a
            space where badminton lovers of all levels can play, connect, compete
            and grow together.
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
            From casual sessions to competitive tournaments, we&apos;re building
            Delhi&apos;s most engaging and trusted badminton community.
          </p>
          <a
            href="/about"
            className="mt-7 inline-flex items-center gap-2 rounded-md border border-[var(--color-teal)]/50 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-teal)] transition hover:bg-[var(--color-teal)]/10"
          >
            Know More About RCC <ArrowRight size={15} />
          </a>
        </div>

        {/* Team-photo banner (placeholder) with value cards overlaid at the bottom */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10">
          <div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-[#101f1c] via-[#0a1210] to-[#070d0c] text-white/10 sm:aspect-[16/10]">
            <ImageIcon size={46} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
          <div className="absolute inset-x-3 bottom-3 grid grid-cols-3 gap-2 sm:inset-x-4 sm:bottom-4 sm:gap-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-white/10 bg-black/50 p-3 text-center backdrop-blur sm:p-4">
                <div className="mx-auto grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-teal)]/30 text-[var(--color-teal)] sm:h-10 sm:w-10">
                  <v.icon size={18} />
                </div>
                <h3 className="mt-2.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-teal)] sm:text-[11px]">{v.title}</h3>
                <p className="mt-1 hidden text-[10px] leading-relaxed text-white/55 sm:block">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
