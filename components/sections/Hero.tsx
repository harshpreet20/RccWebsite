'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
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
  { num: 150, suffix: '+', label: 'Active Players', Icon: Users },
  { num: 50, suffix: '+', label: 'Events Hosted', Icon: Trophy },
  { num: 200, suffix: '+', label: 'Weekend Sessions', Icon: Calendar },
  { num: 10, suffix: '+', label: 'Community Partners', Icon: Handshake },
];

const heroWords = ['DELHI\'S', 'INVITE-ONLY', 'BADMINTON'];
const wordColors = ['text-[#e4e2e5]', 'text-transparent', 'text-[#e4e2e5]'];

function CountUp({ target, suffix, started }: { target: number; suffix: string; started: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, target]);

  return <>{count}{suffix}</>;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.35 } },
};

const wordVariants = {
  hidden: { opacity: 0, y: 60, skewY: 4 },
  visible: {
    opacity: 1, y: 0, skewY: 0,
    transition: { duration: 0.85, ease: 'easeOut' as const },
  },
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

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
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-[#C21818]/8 rounded-full blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/4 left-0 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#C21818]/5 rounded-full blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
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
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <motion.div
            className="h-px bg-gradient-to-r from-transparent to-[#C21818]/50"
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <span className="text-[#D4AF37] text-xs tracking-[0.45em] font-bold uppercase font-[family-name:var(--font-inter)]">
            Delhi, India · Invite Only
          </span>
          <motion.div
            className="h-px bg-gradient-to-l from-transparent to-[#C21818]/50"
            initial={{ width: 0 }}
            animate={{ width: 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Hero headline — word-by-word stagger */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black leading-[0.9] tracking-[-0.04em] mb-8 uppercase font-[family-name:var(--font-montserrat)] overflow-hidden"
        >
          {heroWords.map((word, i) => (
            <motion.span
              key={word}
              variants={wordVariants}
              className={`block ${wordColors[i]} ${
                i === 1
                  ? 'bg-clip-text bg-gradient-to-r from-[#C21818] via-[#D4AF37] to-[#C21818] animate-gradient'
                  : ''
              }`}
              style={i === 1 ? { WebkitBackgroundClip: 'text' } : {}}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="text-[#c4c6ce] text-base md:text-lg max-w-md mx-auto mb-12 leading-relaxed font-[family-name:var(--font-inter)]"
        >
          Serious players. Skill-based matches. Real community.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
        >
          <motion.a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 px-9 py-4 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-bold text-sm tracking-widest rounded-full hover:shadow-[0_0_32px_rgba(194,24,24,0.55)] transition-shadow duration-300 cursor-none"
          >
            <Zap size={14} className="fill-current" />
            JOIN WHATSAPP COMMUNITY
          </motion.a>
          <motion.a
            href="/about"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 px-9 py-4 glass text-[#c4c6ce] hover:text-white font-semibold text-sm tracking-widest rounded-full transition-all duration-300 cursor-none"
          >
            LEARN MORE
            <ArrowRight size={14} />
          </motion.a>
        </motion.div>

        {/* Stats — animated counters */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {stats.map(({ num, suffix, label, Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="glass rounded-2xl p-5 text-center cursor-none group transition-all duration-300"
            >
              <div className="flex justify-center mb-2.5">
                <Icon size={17} className="text-[#D4AF37] opacity-75 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-2xl md:text-3xl font-black font-[family-name:var(--font-montserrat)] text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">
                <CountUp target={num} suffix={suffix} started={statsInView} />
              </div>
              <div className="text-[#8e9098] text-[10px] tracking-widest uppercase mt-1 leading-tight font-[family-name:var(--font-inter)]">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#8e9098]"
      >
        <span className="text-[10px] tracking-[0.35em] uppercase font-[family-name:var(--font-inter)]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={15} />
        </motion.div>
      </motion.div>
    </section>
  );
}
