'use client';

import { Calendar, MapPin, Check, ArrowRight } from 'lucide-react';

const BENEFITS = [
  'Priority court bookings',
  'Exclusive tournaments',
  'Member-only events',
  'Special discounts on merch',
  'Connect with 300+ players',
];

export default function EventMembershipSection() {
  return (
    <section id="events" className="border-t border-white/10 bg-[#0a0a0f] py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:px-10 lg:grid-cols-2">
        {/* Upcoming event — banner placeholder */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#14202b] to-[#0b0f14] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-gold)]">Upcoming Event</p>
          <h3 className="mt-3 font-[var(--font-montserrat)] text-3xl font-extrabold uppercase text-white">RCC Cup 2024</h3>
          <p className="mt-2 text-sm font-semibold text-white/70">▶ Mix Skill Doubles Tournament</p>
          <div className="mt-5 space-y-2 text-sm text-white/60">
            <p className="flex items-center gap-2"><Calendar size={15} className="text-[var(--color-gold)]" /> 25 Aug 2024</p>
            <p className="flex items-center gap-2"><MapPin size={15} className="text-[var(--color-gold)]" /> Siri Fort Sports Complex</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/events" className="rounded-md bg-[var(--color-gold)] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-110">Register Now</a>
            <a href="/events" className="inline-flex items-center gap-1 px-3 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 hover:text-white">View All Events <ArrowRight size={13} /></a>
          </div>
        </div>

        {/* Become a member */}
        <div className="rounded-3xl border border-white/10 bg-[#111118] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-gold)]">Become a Member</p>
          <h3 className="mt-3 font-[var(--font-montserrat)] text-3xl font-extrabold uppercase leading-tight text-white">
            One Membership.
            <br />
            Endless Benefits.
          </h3>
          <ul className="mt-5 space-y-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-white/70">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold)]"><Check size={12} /></span>
                {b}
              </li>
            ))}
          </ul>
          <a href="/membership" className="mt-7 inline-flex items-center gap-2 rounded-md bg-[var(--color-gold)] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-110">
            Join RCC Today <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
