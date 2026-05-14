'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Zap, Users, ArrowRight, Trophy, Calendar, Handshake } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/utils';

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  duration: Math.random() * 12 + 10,
  delay: Math.random() * 6,
}));

const stats = [
  { val: '150+', label: 'Active Players', Icon: Users },
  { val: '50+', label: 'Events Hosted', Icon: Trophy },
  { val: '200+', label: 'Weekend Sessions', Icon: Calendar },
  { val: '10+', label: 'Community Partners', Icon: Handshake },
];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const shuttles: Array<{
      x: number; y: number; vx: number; vy: number;
      trail: Array<{ x: number; y: number }>;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 3; i++) {
      shuttles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        trail: [],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.045)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 12]);
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

      shuttles.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0 || s.x > canvas.width) s.vx *= -1;
        if (s.y < 0 || s.y > canvas.height) s.vy *= -1;
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 16) s.trail.shift();

        s.trail.forEach((pt, i) => {
          const alpha = (i / s.trail.length) * 0.2;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(194, 24, 24, ${alpha})`;
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
        ctx.shadowColor = '#D4AF37';
        ctx.shadowBlur = 8;
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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#131315] via-[#0B1F3A]/50 to-[#131315]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-[#C21818]/8 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#C21818]/5 rounded-full blur-3xl" />
      </div>

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -18, 0], opacity: [0, 0.35, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#C21818]/50" />
          <span className="text-[#D4AF37] text-xs tracking-[0.4em] font-medium uppercase">
            Delhi, India · Invite Only
          </span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#C21818]/50" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black leading-[0.9] tracking-[-0.04em] mb-8 uppercase font-[family-name:var(--font-montserrat)]"
        >
          <span className="block text-[#e4e2e5]">DELHI&apos;S</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] via-[#D4AF37] to-[#C21818] animate-gradient">
            INVITE-ONLY
          </span>
          <span className="block text-[#e4e2e5]">BADMINTON</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-white/50 text-base md:text-lg max-w-md mx-auto mb-12 leading-relaxed"
        >
          Serious players. Skill-based matches. Real community.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
        >
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-9 py-4 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-bold text-sm tracking-widest rounded-full hover:shadow-[0_0_28px_rgba(194,24,24,0.5)] hover:scale-105 transition-all duration-300"
          >
            <Zap size={14} className="fill-current" />
            JOIN WHATSAPP COMMUNITY
          </a>
          <a
            href="/about"
            className="flex items-center gap-2.5 px-9 py-4 glass text-white/70 hover:text-white font-semibold text-sm tracking-widest rounded-full hover:border-white/20 transition-all duration-300"
          >
            LEARN MORE
            <ArrowRight size={14} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {stats.map(({ val, label, Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass rounded-2xl p-5 text-center cursor-default"
            >
              <div className="flex justify-center mb-2.5">
                <Icon size={17} className="text-[#D4AF37] opacity-75" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
                {val}
              </div>
              <div className="text-white/40 text-[10px] tracking-widest uppercase mt-1 leading-tight">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown size={15} />
        </motion.div>
      </motion.div>
    </section>
  );
}
