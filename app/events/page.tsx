'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Trophy, ArrowRight, Zap } from 'lucide-react';
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
    highlight: 'One sponsor gifted Portronics mobile stands and RCC gifted a badminton racket to the hustler player.',
    icon: '🏆',
    color: 'from-[#C21818] to-[#8B0000]',
  },
  {
    id: 2,
    title: 'Mixed Doubles Championship',
    venue: 'Siri Fort Sports Complex',
    date: 'October 2023',
    type: 'Tournament',
    level: 'Intermediate+',
    highlight: 'Epic 3-set battles and incredible team chemistry on display.',
    icon: '⚡',
    color: 'from-[#0B1F3A] to-[#162B50]',
  },
  {
    id: 3,
    title: 'Weekend Smash Series — Season 1',
    venue: 'Multiple Venues, Delhi',
    date: 'Q1 2023',
    type: 'Series',
    level: 'All Levels',
    highlight: 'First organized weekend series with skill-based pairings.',
    icon: '🎯',
    color: 'from-[#D4AF37]/20 to-transparent',
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
    icon: '🏸',
    featured: true,
  },
  {
    id: 5,
    title: 'Mixed Doubles Night',
    venue: 'TBA — Delhi',
    date: 'Next Month',
    time: '6:00 PM – 9:00 PM',
    type: 'Community Game',
    level: 'All Levels',
    slotsLeft: 6,
    slotsTotal: 20,
    registrationUrl: SOCIAL_LINKS.whatsapp,
    icon: '🌙',
    featured: false,
  },
  {
    id: 6,
    title: 'Budget Badminton League Season 2',
    venue: 'TBA — Delhi',
    date: 'Coming Soon',
    time: 'Full Day',
    type: 'Tournament',
    level: 'Competitive',
    slotsLeft: 20,
    slotsTotal: 32,
    registrationUrl: SOCIAL_LINKS.whatsapp,
    icon: '🏆',
    featured: true,
  },
];

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-2">
      {Object.entries(timeLeft).map(([unit, val]) => (
        <div key={unit} className="glass rounded-lg px-2 py-1 text-center min-w-[40px]">
          <div className="text-[#D4AF37] font-black text-sm">{String(val).padStart(2, '0')}</div>
          <div className="text-white/30 text-[9px] uppercase">{unit}</div>
        </div>
      ))}
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-[#C21818]/10 to-transparent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C21818]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.5em] font-bold uppercase">On Court</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C21818]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight"
          >
            Events &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
              Tournaments
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-xl leading-relaxed"
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
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className={`glass rounded-3xl overflow-hidden group ${event.featured ? 'ring-1 ring-[#D4AF37]/30' : ''}`}
              >
                {event.featured && (
                  <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-[#050810] text-xs font-black tracking-widest text-center py-2 uppercase">
                    ⭐ Featured
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="text-4xl">{event.icon}</span>
                      <div className="mt-3">
                        <span className="text-xs text-white/40 tracking-widest uppercase">{event.type}</span>
                        <h3 className="text-xl font-black text-white mt-1">{event.title}</h3>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                      event.slotsLeft <= 4
                        ? 'bg-[#C21818]/20 text-[#C21818]'
                        : 'bg-[#D9FF00]/10 text-[#D9FF00]'
                    }`}>
                      {event.slotsLeft} left
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <MapPin size={14} className="text-[#C21818] flex-shrink-0" />
                      {event.venue}
                    </div>
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <Calendar size={14} className="text-[#D4AF37] flex-shrink-0" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <Clock size={14} className="text-[#D9FF00] flex-shrink-0" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <Users size={14} className="text-white/40 flex-shrink-0" />
                      {event.level}
                    </div>
                  </div>

                  {/* Slots bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-white/40 mb-2">
                      <span>Slots</span>
                      <span>{event.slotsLeft}/{event.slotsTotal} available</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C21818] to-[#D4AF37] rounded-full transition-all duration-500"
                        style={{ width: `${((event.slotsTotal - event.slotsLeft) / event.slotsTotal) * 100}%` }}
                      />
                    </div>
                  </div>

                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-bold text-sm tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(194,24,24,0.4)] transition-all duration-300"
                  >
                    <Zap size={14} className="fill-current" />
                    REGISTER NOW
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 px-6 bg-[#0A0E1A]">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="History"
            title="Past"
            highlight="Events"
            align="left"
            className="mb-12"
          />

          <div className="space-y-6">
            {pastEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="glass rounded-3xl overflow-hidden group hover:glow-gold transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row">
                  <div className={`md:w-2 bg-gradient-to-b ${event.color}`} />
                  <div className="flex-1 p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="text-5xl">{event.icon}</div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-xs text-[#D4AF37] tracking-widest uppercase font-bold">{event.type}</span>
                        <span className="text-white/30 text-xs">{event.date}</span>
                      </div>
                      <h3 className="text-xl font-black text-white mb-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-white/50 text-sm mb-3">
                        <MapPin size={13} />
                        {event.venue}
                      </div>
                      <p className="text-white/40 text-sm italic">{event.highlight}</p>
                    </div>
                    <div className="text-[#D4AF37]/40 flex items-center gap-2 group-hover:text-[#D4AF37] transition-colors text-sm">
                      <Trophy size={16} />
                      Past Event
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
            <h2 className="text-4xl font-black text-white mb-4">
              Never Miss a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
                Session
              </span>
            </h2>
            <p className="text-white/60 mb-8">Join the WhatsApp community for real-time updates on all upcoming events.</p>
            <GlowButton href={SOCIAL_LINKS.whatsapp} variant="crimson" size="lg" target="_blank" rel="noopener noreferrer">
              JOIN COMMUNITY
            </GlowButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
