'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '@/components/ui/SocialIcons';
import SectionHeading from '@/components/ui/SectionHeading';
import { SOCIAL_LINKS } from '@/lib/utils';

const contactMethods = [
  {
    icon: <MessageCircle size={28} />,
    title: 'WhatsApp Community',
    desc: 'Join the RCC community directly',
    action: 'Join Now',
    href: SOCIAL_LINKS.whatsapp,
    bg: 'from-[#25D366] to-[#128C7E]',
  },
  {
    icon: <InstagramIcon size={28} />,
    title: 'Instagram',
    desc: '@racquetsclubcommunity',
    action: 'Follow',
    href: SOCIAL_LINKS.instagram,
    bg: 'from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]',
  },
  {
    icon: <FacebookIcon size={28} />,
    title: 'Facebook',
    desc: 'Racquets Club Community',
    action: 'Like Page',
    href: SOCIAL_LINKS.facebook,
    bg: 'from-[#1877F2] to-[#0A5BD4]',
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', type: 'general', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-[#C21818]/8 to-transparent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C21818]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.5em] font-bold uppercase">Reach Out</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C21818]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          >
            Get In{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
              Touch
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-xl"
          >
            Questions, partnerships, or just want to say hello? We're always listening.
          </motion.p>
        </div>
      </section>

      {/* Social Contact Cards */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
            {contactMethods.map((method, i) => (
              <motion.a
                key={method.title}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-3xl p-8 flex flex-col items-center gap-5 group hover:glow-gold transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.bg} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {method.icon}
                </div>
                <div className="text-center">
                  <div className="text-white font-black text-lg">{method.title}</div>
                  <div className="text-white/50 text-sm mt-1">{method.desc}</div>
                </div>
                <div className={`px-5 py-2 rounded-full bg-gradient-to-r ${method.bg} text-white text-sm font-bold tracking-wider`}>
                  {method.action}
                </div>
              </motion.a>
            ))}
          </div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 mb-12 flex items-center gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0">
              <MapPin size={24} className="text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-[#D4AF37] text-xs tracking-widest font-bold uppercase mb-1">Location</div>
              <div className="text-white font-black text-xl">Delhi, India</div>
              <div className="text-white/50 text-sm mt-1">Multiple courts across Delhi NCR</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 bg-[#0A0E1A]">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            eyebrow="Inquiry"
            title="Send Us a"
            highlight="Message"
            className="mb-12"
          />

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Inquiry Type</label>
              <select
                value={formState.type}
                onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
              >
                <option value="general">General Inquiry</option>
                <option value="membership">Membership / Joining</option>
                <option value="partnership">Sponsorship / Partnership</option>
                <option value="event">Event Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Your Message</label>
              <textarea
                required
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-black tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(194,24,24,0.4)] transition-all duration-300"
            >
              {submitted ? (
                <>
                  <CheckCircle2 size={18} />
                  MESSAGE SENT!
                </>
              ) : (
                <>
                  <Send size={18} />
                  SEND MESSAGE
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
