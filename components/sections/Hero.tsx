'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Play, Flame, Trophy, Users } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/utils';

/* ── Badminton racquet mini SVG ── */
function RacquetIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="9" cy="9" rx="5.5" ry="7" transform="rotate(-40 9 9)" />
      <line x1="13" y1="13" x2="20" y2="20" />
      <line x1="7" y1="9" x2="11" y2="9" />
      <line x1="9" y1="7" x2="9" y2="11" />
    </svg>
  );
}

const features = [
  { Icon: Flame,       title: 'PASSION FUELS US',      desc: 'For the love of the game.' },
  { Icon: RacquetIcon, title: 'PLAY TOGETHER',          desc: 'Stronger as a community.' },
  { Icon: Trophy,      title: 'COMPETE FEARLESSLY',    desc: 'Challenge yourself. Elevate together.' },
  { Icon: Users,       title: 'BELONG FOREVER',        desc: "More than a club. It's a family." },
];

const fireParticles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: 52 + (i % 2 === 0 ? 1 : -1) * (Math.random() * 28),
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 4 + 2.5,
  delay: Math.random() * 3,
  isGold: i % 3 === 0,
}));

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const embers: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; life: number; maxLife: number; hue: number;
    }> = [];

    const spawnEmber = () => {
      embers.push({
        x: canvas.width * 0.55 + Math.random() * canvas.width * 0.42,
        y: canvas.height * 0.75 + Math.random() * canvas.height * 0.3,
        vx: (Math.random() - 0.5) * 0.9,
        vy: -(Math.random() * 2.8 + 0.6),
        size: Math.random() * 3 + 0.5,
        life: 0,
        maxLife: Math.random() * 110 + 50,
        hue: Math.random() > 0.5 ? 0 : 38,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.45) spawnEmber();

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.x += e.vx;
        e.y += e.vy;
        e.vx += (Math.random() - 0.5) * 0.1;
        e.life++;

        const progress = e.life / e.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.7;

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 90%, 58%, ${alpha})`;
        ctx.shadowColor = `hsl(${e.hue}, 90%, 55%)`;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (e.life >= e.maxLife) embers.splice(i, 1);
      }

      animFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: '#09090f' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#06080f] via-[#0b0c18]/80 to-[#09090f]" />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#050b18]/70 to-transparent" />

        {/* Fire glow — right side */}
        <motion.div
          className="absolute right-0 top-0 w-[65%] h-full"
          style={{ background: 'radial-gradient(ellipse 75% 85% at 75% 48%, rgba(194,24,24,0.38) 0%, rgba(170,20,0,0.14) 44%, transparent 68%)' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[6%] top-[12%] w-[48%] h-[72%]"
          style={{ background: 'radial-gradient(ellipse at 58% 58%, rgba(200,30,0,0.52) 0%, rgba(160,20,0,0.22) 32%, transparent 62%)' }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[8%] bottom-[8%] w-[38%] h-[50%]"
          style={{ background: 'radial-gradient(ellipse at 50% 82%, rgba(212,175,55,0.2) 0%, transparent 58%)' }}
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#09090f]/55 via-transparent to-[#09090f]/70" />
      </div>

      {/* ── CSS fire particles ── */}
      {fireParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none z-[2]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.isGold ? '#D4AF37' : '#C21818',
            boxShadow: `0 0 ${p.size * 4}px ${p.isGold ? '#D4AF37' : '#C21818'}`,
          }}
          animate={{ y: [0, -40, -80], opacity: [0, 0.9, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex flex-col">

        {/* Hero body */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center pt-28 pb-6 min-h-[calc(100vh-120px)]">

            {/* ── Left: Text ── */}
            <div className="flex flex-col justify-center">

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="w-7 h-px bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[10px] tracking-[0.45em] font-bold uppercase font-[family-name:var(--font-inter)]">
                  Delhi, India · Invite Only
                </span>
              </motion.div>

              {/* Script line */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-[#D4AF37] mb-0 leading-none"
                style={{
                  fontFamily: 'var(--font-dancing)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
                }}
              >
                We don't just play
              </motion.p>

              {/* RACQUETS. */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.85, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className="leading-none mb-0"
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(5rem, 13vw, 10.5rem)',
                    color: '#D4AF37',
                    textShadow: '0 0 80px rgba(212,175,55,0.28), 4px 4px 0 rgba(100,0,0,0.35)',
                    letterSpacing: '0.025em',
                  }}
                >
                  RACQUETS.
                </h1>
              </motion.div>

              {/* WE LIVE IT. */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.85, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2
                  className="leading-none mb-5"
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(3.2rem, 9.5vw, 7.5rem)',
                    color: '#C21818',
                    textShadow: '0 0 70px rgba(194,24,24,0.65), 3px 3px 0 rgba(60,0,0,0.45)',
                    letterSpacing: '0.025em',
                  }}
                >
                  WE LIVE IT.
                </h2>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.72 }}
                className="text-white/55 text-sm tracking-wider leading-relaxed mb-8 max-w-sm font-[family-name:var(--font-inter)]"
              >
                A COMMUNITY UNITED BY{' '}
                <span className="text-[#D4AF37] font-bold">PASSION</span>,{' '}
                DRIVEN BY{' '}
                <span className="text-[#D4AF37] font-bold">COMPETITION</span>.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.88 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2.5 px-7 py-3 border border-[#D4AF37]/50 text-[#D4AF37] font-bold text-xs tracking-[0.2em] rounded hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300 cursor-none font-[family-name:var(--font-inter)]"
                >
                  JOIN THE COMMUNITY
                  <ArrowRight size={14} />
                </motion.a>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2.5 px-7 py-3 border border-white/15 text-white/60 hover:text-white hover:border-white/35 font-semibold text-xs tracking-[0.2em] rounded transition-all duration-300 cursor-none font-[family-name:var(--font-inter)]"
                >
                  <Play size={12} className="fill-current" />
                  WATCH VIDEO
                </motion.button>
              </motion.div>
            </div>

            {/* ── Right: Fire athlete area ── */}
            <div className="relative hidden lg:flex items-center justify-center h-full min-h-[480px]">
              {/* Fire rings */}
              <motion.div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 65% 80% at 55% 45%, rgba(194,24,24,0.42) 0%, rgba(194,24,24,0.16) 38%, transparent 65%)' }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute w-[72%] h-[72%]"
                style={{ background: 'radial-gradient(ellipse at 50% 52%, rgba(220,50,0,0.6) 0%, rgba(194,24,24,0.3) 28%, transparent 58%)' }}
                animate={{ scale: [1, 1.09, 1], opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              />
              <motion.div
                className="absolute bottom-0 w-[65%] h-[45%]"
                style={{ background: 'radial-gradient(ellipse at 50% 95%, rgba(212,175,55,0.28) 0%, transparent 58%)' }}
                animate={{ opacity: [0.35, 0.8, 0.35] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />

              {/* Vertical fire streaks */}
              {[20, 32, 44, 56, 68, 78].map((left, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0 w-[1px]"
                  style={{
                    left: `${left}%`,
                    height: `${28 + i * 7}%`,
                    background: `linear-gradient(to top, ${i % 2 === 0 ? 'rgba(194,24,24,0.7)' : 'rgba(212,175,55,0.5)'}, transparent)`,
                  }}
                  animate={{
                    height: [`${28 + i * 7}%`, `${42 + i * 6}%`, `${28 + i * 7}%`],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{ duration: 2 + i * 0.35, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
                />
              ))}

              {/* Floating info badges */}
              <motion.div
                className="absolute top-10 right-2 glass rounded-xl px-4 py-3 text-center z-10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                style={{ border: '1px solid rgba(212,175,55,0.22)' }}
              >
                <div className="text-2xl font-black text-[#D4AF37]" style={{ fontFamily: 'var(--font-bebas)' }}>300+</div>
                <div className="text-[9px] text-white/45 tracking-widest uppercase font-[family-name:var(--font-inter)]">Members</div>
              </motion.div>

              <motion.div
                className="absolute bottom-20 left-2 glass rounded-xl px-4 py-3 text-center z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                style={{ border: '1px solid rgba(194,24,24,0.22)' }}
              >
                <div className="text-2xl font-black text-[#C21818]" style={{ fontFamily: 'var(--font-bebas)' }}>50+</div>
                <div className="text-[9px] text-white/45 tracking-widest uppercase font-[family-name:var(--font-inter)]">Events Hosted</div>
              </motion.div>

              {/* Center RCC crest */}
              <div className="relative z-10 w-40 h-40 flex items-center justify-center">
                <motion.div
                  className="w-full h-full rounded-full border-2 border-[#D4AF37]/30 flex items-center justify-center"
                  style={{ background: 'radial-gradient(circle, rgba(194,24,24,0.15) 0%, transparent 70%)' }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/20" />
                </motion.div>
                <div className="absolute text-center">
                  <div className="text-4xl font-black text-white" style={{ fontFamily: 'var(--font-bebas)', textShadow: '0 0 30px rgba(194,24,24,0.8)' }}>RCC</div>
                  <div className="text-[8px] text-[#D4AF37]/70 tracking-[0.25em] uppercase font-[family-name:var(--font-inter)]">Est. 2022</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="relative z-10 border-t border-[#D4AF37]/12 bg-black/35 backdrop-blur-md"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#D4AF37]/10">
            {features.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.09, duration: 0.45 }}
                className="flex items-start gap-3.5 px-5 py-5 group hover:bg-[#D4AF37]/5 transition-colors duration-300 cursor-none"
              >
                <div className="mt-0.5 flex-shrink-0">
                  <Icon size={19} className="text-[#D4AF37] opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div>
                  <p className="text-white text-[10px] font-black tracking-widest uppercase mb-0.5 font-[family-name:var(--font-montserrat)]">
                    {title}
                  </p>
                  <p className="text-white/38 text-[11px] leading-snug font-[family-name:var(--font-inter)]">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="absolute bottom-[90px] left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 flex flex-col items-center gap-1.5 text-[#8e9098]/60 z-10"
      >
        <span className="text-[9px] tracking-[0.35em] uppercase font-[family-name:var(--font-inter)]">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown size={13} />
        </motion.div>
      </motion.div>
    </section>
  );
}
