'use client';

import { Calendar, MapPin, Check, ArrowRight, Trophy, Gift, Zap } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '@/components/ui/StaggerGroup';

const BENEFITS = [
  'Priority court bookings',
  'Exclusive tournaments',
  'Member-only events',
  'Special discounts on merch',
  'Connect with 300+ players',
];

export default function EventMembershipSection() {
  return (
    <section id="events" className="border-t border-white/10 bg-[#050505] py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:px-10 lg:grid-cols-2">
        {/* Upcoming event — banner placeholder */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0d1a18] to-[#070d0c] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-teal)]">Upcoming Event</p>
          <h3 className="mt-3 font-[var(--font-montserrat)] text-3xl font-extrabold uppercase text-white">RCC Cup 2024</h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-white/70">
            <Zap size={14} className="text-[var(--color-teal)]" /> Mix Skill Doubles Tournament
          </p>
          <div className="mt-5 space-y-2 text-sm text-white/60">
            <p className="flex items-center gap-2"><Calendar size={15} className="text-[var(--color-teal)]" /> 25 Aug 2024</p>
            <p className="flex items-center gap-2"><MapPin size={15} className="text-[var(--color-teal)]" /> Siri Fort Sports Complex</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-4 border-t border-white/10 pt-4 text-[11px] text-white/50">
            <span className="flex items-center gap-1.5"><Trophy size={12} className="text-[var(--color-teal)]" /> Exciting Matches</span>
            <span className="flex items-center gap-1.5"><Trophy size={12} className="text-[var(--color-teal)]" /> Trophies &amp; Prizes</span>
            <span className="flex items-center gap-1.5"><Gift size={12} className="text-[var(--color-teal)]" /> Goodies &amp; More</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/events" className="rounded-md bg-[var(--color-gold)] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-110">Register Now</a>
            <a href="/events" className="inline-flex items-center gap-1 px-3 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 hover:text-white">View All Events <ArrowRight size={13} /></a>
          </div>
        </div>

        {/* Become a member */}
        <div className="rounded-3xl border border-white/10 bg-[#111111] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-teal)]">Become a Member</p>
          <h3 className="mt-3 font-[var(--font-montserrat)] text-3xl font-extrabold uppercase leading-tight text-white">
            One Membership.
            <br />
            Endless Benefits.
          </h3>

          <div className="mt-5 grid gap-6 sm:grid-cols-[1.2fr_1fr] sm:items-center">
            <StaggerGroup as="ul" className="space-y-2.5">
              {BENEFITS.map((b) => (
                <StaggerItem as="li" key={b} className="flex items-center gap-2.5 text-sm text-white/70">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-teal)]/15 text-[var(--color-teal)]"><Check size={12} /></span>
                  {b}
                </StaggerItem>
              ))}
            </StaggerGroup>

            {/* Membership card visual */}
            <div className="relative aspect-[1.6/1] overflow-hidden rounded-2xl border border-[var(--color-gold)]/40 bg-gradient-to-br from-[#1a1a12] via-[#12120c] to-[#0b0b08] p-4 shadow-[0_0_30px_rgba(212,175,55,0.12)]">
              <div className="flex items-center justify-between">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/rcc-crest.webp" alt="RCC" className="h-9 w-9 object-contain" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">Member</span>
              </div>
              <div className="absolute bottom-4 left-4">
                <p className="font-[var(--font-montserrat)] text-lg font-black uppercase tracking-wide text-white">RCC</p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">Play · Connect · Grow</p>
              </div>
            </div>
          </div>

          <a href="/membership" className="mt-7 inline-flex items-center gap-2 rounded-md bg-[var(--color-gold)] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-110">
            Join RCC Today <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
