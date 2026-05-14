'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Leaf, Zap, Trophy, Handshake, Rocket } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlowButton from '@/components/ui/GlowButton';
import { SOCIAL_LINKS } from '@/lib/utils';

const features = [
  'Regular & weekend games',
  'Skill-based pairings',
  'Friendly tournaments',
  'Court booking support',
  'Shuttle support',
  'Community networking',
  'Respect-first culture',
];

const timeline = [
  {
    year: '2022',
    title: 'RCC Formation',
    description: 'A small group of serious Delhi badminton players came together with one vision — building a respectful, organized community.',
    Icon: Leaf,
  },
  {
    year: '2023',
    title: 'First Weekend Sessions',
    description: 'Regular Saturday sessions launched across Delhi courts. Skill-based pairings made every match meaningful.',
    Icon: Zap,
  },
  {
    year: '2023',
    title: 'Budget Badminton League',
    description: 'RCC hosted its first major tournament. Portronics gifted mobile stands; RCC awarded a premium racket to the hustler of the tournament.',
    Icon: Trophy,
  },
  {
    year: '2024',
    title: 'Brand Partnerships',
    description: 'SUM India and Soul Stretch joined as community and wellness partners, expanding RCC beyond badminton.',
    Icon: Handshake,
  },
  {
    year: '2025',
    title: 'Community Expansion',
    description: '300+ members strong, 50+ events, and a growing movement across Delhi\'s badminton culture.',
    Icon: Rocket,
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-[#C21818]/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C21818]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.5em] font-bold uppercase">Our Story</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C21818]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight mb-8 tracking-tight"
          >
            More Than{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
              Badminton
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/60 text-xl leading-relaxed max-w-3xl mx-auto mb-12"
          >
            Racquets Club Community is a closed, invite-only badminton community in Delhi built
            for sincere players — beginners to advanced. This is not an open spam group or player
            marketplace. RCC focuses on respectful conduct, organized games, fair play, strong
            community culture, and meaningful player connections.
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="What We Offer"
            title="Everything a"
            highlight="Serious Player"
            subtitle="needs."
            className="mb-16"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.03, y: -3 }}
                className="glass rounded-2xl p-6 flex items-center gap-4 group"
              >
                <CheckCircle2 size={20} className="text-[#D4AF37] flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-white/80 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C21818]/30 to-transparent" />

        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Timeline"
            title="Our"
            highlight="Journey"
            className="mb-20"
          />

          <div className="space-y-16">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="glass rounded-2xl p-6 hover:glow-gold transition-all duration-500">
                    <span className="text-[#D4AF37] text-xs tracking-widest font-bold uppercase">{item.year}</span>
                    <h3 className="text-xl font-black text-white mt-2 mb-3">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>

                {/* Timeline node */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full glass-gold flex items-center justify-center border border-[#D4AF37]/30 glow-gold">
                    <item.Icon size={22} className="text-[#D4AF37]" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-[#D4AF37]/10 animate-pulse-glow" />
                </div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-gold rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#C21818]/5 to-[#D4AF37]/5" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
                  Join RCC?
                </span>
              </h2>
              <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
                Membership is by invitation only. Join our WhatsApp community to start your journey.
              </p>
              <GlowButton
                href={SOCIAL_LINKS.whatsapp}
                variant="crimson"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                JOIN WHATSAPP COMMUNITY
              </GlowButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
