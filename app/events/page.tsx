'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Trophy, Zap, Star, Target, Repeat } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowButton from '@/components/ui/GlowButton';
import { SOCIAL_LINKS } from '@/lib/utils';

const pastEvents = [
  {
    id: 1,
    title: 'Budget Badminton League',
    venue: 'Delhi Sports Complex',
    date: 'December 2023',
    type: 'Tournament',
    level: 'All Levels',
    highlight: 'Portronics gifted mobile stands; RCC awarded a premium racket to the tournament\'s hustler player.',
  },
  {
    id: 2,
    title: 'Mixed Doubles Championship',
    venue: 'Siri Fort Sports Complex',
    date: 'October 2023',
    type: 'Tournament',
    level: 'Intermediate+',
    highlight: 'Epic 3-set battles and exceptional team chemistry on display throughout.',
  },
  {
    id: 3,
    title: 'Weekend Smash Series — Season 1',
    venue: 'Multiple Venues, Delhi',
    date: 'Q1 2023',
    type: 'Series',
    level: 'All Levels',
    highlight: 'First organized weekend series with skill-based pairings and structured scorekeeping.',
  },
];

const upcomingEvents = [
  {
    id: 4,
    title: 'Weekend Smash Session',
    venue: 'Siri Fort Sports Complex, Delhi',
    date: 'Every Saturday',
    time: '7:00 AM – 10:00 AM',
    type: 'Regular Session',
    level: 'All Levels',
    slotsLeft: 8,
    slotsTotal: 16,
    registrationUrl: SOCIAL_LINKS.whatsapp,
    featured: true,
    TypeIcon: Repeat,
  },
  {
    id: 5,
    title: 'Mixed Doubles Night',
    venue: 'TBA — Delhi',
    date: 'Coming Next Month',
    time: '6:00 PM – 9:00 PM',
    type: 'Community Game',
    level: 'All Levels',
    slotsLeft: 6,
    slotsTotal: 20,
    registrationUrl: SOCIAL_LINKS.whatsapp,
    featured: false,
    TypeIcon: Users,
  },
  {
    id: 6,
    title: 'Budget Badminton League S2',
    venue: 'TBA — Delhi',
    date: 'Coming Soon',
    time: 'Full Day Event',
    type: 'Tournament',
    level: 'Competitive',
    slotsLeft: 20,
    slotsTotal: 32,
    registrationUrl: SOCIAL_LINKS.whatsapp,
    featured: true,
    TypeIcon: Trophy,
  },
];

const typeStyles: Record<string, string> = {
  Tournament: 'bg-[#C21818]/15 text-[#C21818] border border-[#C21818]/20',
  Series: 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20',
  'Regular Session': 'bg-white/5 text-white/60 border border-white/10',
  'Community Game': 'bg-[#0B1F3A]/80 text-white/60 border border-white/10',
};

export default function EventsPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#C21818]/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#C21818]/50" />
            <span className="text-[#D4AF37] text-xs tracking-[0.4em] font-medium uppercase">On Court</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#C21818]/50" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight mb-5 tracking-tight"
          >
            Events &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
              Tournaments
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto"
          >
            From weekend rallies to championship leagues — every session is a chance to compete, connect, and grow.
          </motion.p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="What's Next"
            title="Upcoming"
            highlight="Sessions"
            align="left"
            className="mb-12"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
            {upcomingEvents.map((event, i) => {
              const slotsUsed = event.slotsTotal - event.slotsLeft;
              const fillPct = (slotsUsed / event.slotsTotal) * 100;
              const isUrgent = event.slotsLeft <= 4;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  whileHover={{ y: -6 }}
                  className={`glass rounded-3xl overflow-hidden flex flex-col ${event.featured ? 'ring-1 ring-[#D4AF37]/25' : ''}`}
                >
                  {event.featured && (
                    <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37]/90 to-[#B8960C]/90 text-[#050810] text-[11px] font-black tracking-widest py-2">
                      <Star size={10} className="fill-current" />
                      FEATURED EVENT
                    </div>
                  )}

                  <div className="p-7 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-6">
                      <div>
                        <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full font-semibold tracking-wide mb-2 ${typeStyles[event.type] ?? 'bg-white/5 text-white/50'}`}>
                          {event.type}
                        </span>
                        <h3 className="text-lg font-black text-white leading-snug">{event.title}</h3>
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/8">
                        <event.TypeIcon size={16} className="text-[#D4AF37]/70" />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2.5 mb-6">
                      <div className="flex items-center gap-2.5 text-white/55 text-sm">
                        <MapPin size={13} className="text-[#C21818]/70 flex-shrink-0" />
                        {event.venue}
                      </div>
                      <div className="flex items-center gap-2.5 text-white/55 text-sm">
                        <Calendar size={13} className="text-[#D4AF37]/70 flex-shrink-0" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2.5 text-white/55 text-sm">
                        <Clock size={13} className="text-white/30 flex-shrink-0" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2.5 text-white/55 text-sm">
                        <Target size={13} className="text-white/30 flex-shrink-0" />
                        {event.level}
                      </div>
                    </div>

                    {/* Slots */}
                    <div className="mb-6 mt-auto">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-white/40">Availability</span>
                        <span className={`font-semibold ${isUrgent ? 'text-[#C21818]' : 'text-white/50'}`}>
                          {event.slotsLeft} / {event.slotsTotal} spots open
                        </span>
                      </div>
                      <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isUrgent ? 'bg-[#C21818]' : 'bg-gradient-to-r from-[#C21818] to-[#D4AF37]'}`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>

                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-bold text-sm tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(194,24,24,0.35)] hover:scale-[1.02] transition-all duration-300"
                    >
                      <Zap size={13} className="fill-current" />
                      REGISTER VIA WHATSAPP
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="History"
            title="Past"
            highlight="Events"
            align="left"
            className="mb-12"
          />

          <div className="space-y-4">
            {pastEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass rounded-2xl overflow-hidden hover:border-[#D4AF37]/15 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1 bg-gradient-to-b from-[#C21818] to-[#D4AF37]" style={{ minHeight: '4px' }} />
                  <div className="flex-1 p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl glass flex items-center justify-center">
                      <Trophy size={16} className="text-[#D4AF37]/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${typeStyles[event.type] ?? 'bg-white/5 text-white/50'}`}>
                          {event.type}
                        </span>
                        <span className="text-white/30 text-xs">{event.date}</span>
                        <span className="text-white/20 text-xs">·</span>
                        <span className="text-white/30 text-xs">{event.level}</span>
                      </div>
                      <h3 className="text-base font-black text-white mb-1">{event.title}</h3>
                      <div className="flex items-center gap-1.5 text-white/40 text-xs mb-2">
                        <MapPin size={11} />
                        {event.venue}
                      </div>
                      <p className="text-white/35 text-sm italic">{event.highlight}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-gold rounded-3xl p-12"
          >
            <h2 className="text-3xl font-black text-white mb-4">
              Never Miss a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
                Session
              </span>
            </h2>
            <p className="text-white/50 mb-8 text-sm leading-relaxed">
              Join the WhatsApp community for real-time updates on all upcoming events.
            </p>
            <GlowButton href={SOCIAL_LINKS.whatsapp} variant="crimson" size="lg" target="_blank" rel="noopener noreferrer">
              JOIN COMMUNITY
            </GlowButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
