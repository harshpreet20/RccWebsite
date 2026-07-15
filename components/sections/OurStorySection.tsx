'use client';

import { Users, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';

const VALUES = [
  { icon: Users, title: 'Community First', text: "We're a family of players who respect the game and each other." },
  { icon: ShieldCheck, title: 'Quality Play', text: 'Great venues, fair play & the best experience every time.' },
  { icon: TrendingUp, title: 'Grow Together', text: 'We learn, compete and celebrate every win as one.' },
];

export default function OurStorySection() {
  return (
    <section id="about" className="border-t border-white/10 bg-[#0a0a0f] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-gold)]">Our Story</p>
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
            className="mt-7 inline-flex items-center gap-2 rounded-md border border-[var(--color-gold)]/50 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-gold)] transition hover:bg-[var(--color-gold)]/10"
          >
            Know More About RCC <ArrowRight size={15} />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-white/10 bg-[#111118] p-5 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-[var(--color-gold)]/30 text-[var(--color-gold)]">
                <v.icon size={22} />
              </div>
              <h3 className="mt-4 text-xs font-bold uppercase tracking-wide text-[var(--color-gold)]">{v.title}</h3>
              <p className="mt-2 text-[11px] leading-relaxed text-white/50">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
