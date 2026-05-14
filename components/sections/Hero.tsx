'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Zap, Users, ArrowRight } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/utils';

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
}));

const courtLines = [
  { x1: '10%', y1: '20%', x2: '90%', y2: '20%' },
  { x1: '10%', y1: '80%', x2: '90%', y2: '80%' },
  { x1: '50%', y1: '15%', x2: '50%', y2: '85%' },
  { x1: '10%', y1: '15%', x2: '10%', y2: '85%' },
  { x1: '90%', y1: '15%', x2: '90%', y2: '85%' },
  { x1: '10%', y1: '50%', x2: '90%', y2: '50%' },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let shuttles: Array<{ x: number; y: number; vx: number; vy: number; trail: Array<{ x: number; y: number; a: number }> }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize shuttlecocks
    for (let i = 0; i < 4; i++) {
      shuttles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        trail: [],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw court lines with glow
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 10]);

      const lines = [
        [canvas.width * 0.1, canvas.height * 0.15, canvas.width * 0.9, canvas.height * 0.15],
        [canvas.width * 0.1, canvas.height * 0.85, canvas.width * 0.9, canvas.height * 0.85],
        [canvas.width * 0.5, canvas.height * 0.1, canvas.width * 0.5, canvas.height * 0.9],
        [canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.1, canvas.height * 0.9],
        [canvas.width * 0.9, canvas.height * 0.1, canvas.width * 0.9, canvas.height * 0.9],
        [canvas.width * 0.1, canvas.height * 0.5, canvas.width * 0.9, canvas.height * 0.5],
      ];

      lines.forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Animate shuttles with trails
      shuttles.forEach((shuttle) => {
        shuttle.x += shuttle.vx;
        shuttle.y += shuttle.vy;

        if (shuttle.x < 0 || shuttle.x > canvas.width) shuttle.vx *= -1;
        if (shuttle.y < 0 || shuttle.y > canvas.height) shuttle.vy *= -1;

        shuttle.trail.push({ x: shuttle.x, y: shuttle.y, a: 1 });
        if (shuttle.trail.length > 20) shuttle.trail.shift();

        // Draw trail
        shuttle.trail.forEach((point, i) => {
          const alpha = (i / shuttle.trail.length) * 0.3;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(194, 24, 24, ${alpha})`;
          ctx.fill();
        });

        // Draw shuttle
        ctx.beginPath();
        ctx.arc(shuttle.x, shuttle.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
        ctx.fill();
        ctx.shadowColor = '#D4AF37';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Layered backgrounds */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050810] via-[#0B1F3A]/80 to-[#050810]" />

        {/* Radial arena light from top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-[#C21818]/15 via-[#0B1F3A]/5 to-transparent rounded-full blur-3xl" />

        {/* Side light effects */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#C21818]/8 rounded-full blur-3xl" />

        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C21818]" />
          <span className="text-[#D4AF37] text-xs tracking-[0.5em] font-bold uppercase">
            Delhi, India • Invite Only
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C21818]" />
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter mb-6">
            <span className="block text-white">DELHI'S</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] via-[#D4AF37] to-[#C21818] animate-gradient">
              INVITE-ONLY
            </span>
            <span className="block text-white">BADMINTON</span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Regular games, tournaments, and meaningful player connections
          for people who truly love badminton.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20"
        >
          <motion.a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-black text-sm tracking-widest rounded-full hover:shadow-[0_0_40px_rgba(194,24,24,0.6)] transition-shadow duration-300"
          >
            <Zap size={18} className="fill-current" />
            JOIN WHATSAPP COMMUNITY
          </motion.a>

          <motion.a
            href="/about"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-10 py-5 glass text-white font-bold text-sm tracking-widest rounded-full hover:border-[#D4AF37]/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300"
          >
            EXPLORE RCC
            <ArrowRight size={16} />
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { val: '150', label: 'Active Players', icon: '🏸' },
            { val: '50', label: 'Events Hosted', icon: '🏆' },
            { val: '200', label: 'Weekend Sessions', icon: '⚡' },
            { val: '10', label: 'Community Partners', icon: '🤝' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-2xl p-5 text-center group cursor-default"
              style={{ animation: `float-up ${3 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
                {stat.val}+
              </div>
              <div className="text-white/50 text-xs tracking-widest uppercase mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
