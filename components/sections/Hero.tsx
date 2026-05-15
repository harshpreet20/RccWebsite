'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Play, Flame, Trophy, Users } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/utils';

/* ── Racquet icon ── */
function RacquetIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="9.5" cy="9.5" rx="5.5" ry="7" transform="rotate(-40 9.5 9.5)" />
      <line x1="13.5" y1="13.5" x2="20" y2="20" />
      <line x1="7.5" y1="9.5" x2="11.5" y2="9.5" />
      <line x1="9.5" y1="7.5" x2="9.5" y2="11.5" />
    </svg>
  );
}

/* ── Athlete SVG silhouette ── */
function AthleteSilhouette() {
  return (
    <svg
      viewBox="0 0 240 480"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 0 24px rgba(194,24,24,0.7)) drop-shadow(0 0 60px rgba(212,175,55,0.3))' }}
    >
      <defs>
        <radialGradient id="playerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#e8c060" stopOpacity="0.8" />
        </radialGradient>
        <radialGradient id="groundGlow" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#C21818" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C21818" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground glow */}
      <ellipse cx="120" cy="450" rx="90" ry="22" fill="url(#groundGlow)" />

      {/* ── Badminton player — jumping smash pose ── */}
      <g fill="url(#playerGlow)">
        {/* Head */}
        <circle cx="148" cy="78" r="22" />
        {/* Neck */}
        <rect x="141" y="98" width="14" height="14" rx="4" />

        {/* Torso — angled forward */}
        <path d="M128,112 L168,112 Q172,160 165,210 Q155,215 135,210 Q128,160 128,112Z" />

        {/* Right arm — raised high holding racquet */}
        <path d="M165,125 Q195,100 215,72 Q219,68 216,64" stroke="url(#playerGlow)" strokeWidth="15" fill="none" strokeLinecap="round" />

        {/* Racquet frame */}
        <ellipse cx="213" cy="50" rx="20" ry="26" fill="none" stroke="url(#playerGlow)" strokeWidth="5" transform="rotate(-25 213 50)" />
        {/* Racquet strings */}
        <line x1="203" y1="32" x2="221" y2="66" stroke="white" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="207" y1="28" x2="218" y2="70" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="196" y1="46" x2="228" y2="53" stroke="white" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="195" y1="52" x2="229" y2="47" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
        {/* Racquet handle */}
        <line x1="200" y1="70" x2="190" y2="88" stroke="url(#playerGlow)" strokeWidth="7" strokeLinecap="round" />

        {/* Left arm — out for balance */}
        <path d="M130,128 Q95,148 72,168" stroke="url(#playerGlow)" strokeWidth="13" fill="none" strokeLinecap="round" />
        {/* Left hand */}
        <circle cx="68" cy="171" r="7" />

        {/* Right leg — bent back/up */}
        <path d="M155,208 Q168,255 180,290 L192,288 Q180,252 168,208Z" />
        {/* Right foot */}
        <ellipse cx="188" cy="291" rx="13" ry="7" />

        {/* Left leg — forward lunge */}
        <path d="M138,210 Q130,255 108,300 Q100,320 90,350 L104,354 Q114,322 122,300 Q144,258 148,210Z" />
        {/* Left foot */}
        <ellipse cx="96" cy="354" rx="16" ry="8" transform="rotate(-10 96 354)" />

        {/* Knee highlight */}
        <circle cx="113" cy="300" r="8" fillOpacity="0.6" />
      </g>

      {/* Shuttlecock */}
      <g transform="translate(50, 370) rotate(-20)">
        <ellipse cx="0" cy="0" rx="7" ry="5" fill="white" fillOpacity="0.9" />
        <path d="M-4,-3 Q0,-18 4,-3" stroke="white" strokeWidth="1" fill="white" fillOpacity="0.5" />
        <path d="M-6,-4 Q-2,-20 2,-4" stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.4" />
        <path d="M-2,-3 Q2,-20 6,-4" stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.4" />
      </g>

      {/* Motion lines */}
      <g stroke="#D4AF37" strokeOpacity="0.3" strokeWidth="1.5" fill="none">
        <path d="M60,160 Q45,140 40,120" strokeDasharray="4,4" />
        <path d="M55,180 Q38,162 32,144" strokeDasharray="4,4" />
        <path d="M65,140 Q52,118 48,98" strokeDasharray="4,4" />
      </g>
    </svg>
  );
}

const features = [
  { Icon: Flame,       title: 'PASSION FUELS US',   desc: 'For the love of the game.' },
  { Icon: RacquetIcon, title: 'PLAY TOGETHER',       desc: 'Stronger as a community.' },
  { Icon: Trophy,      title: 'COMPETE FEARLESSLY', desc: 'Challenge yourself. Elevate together.' },
  { Icon: Users,       title: 'BELONG FOREVER',     desc: "More than a club. It's a family." },
];

const fireParticles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 54 + (i % 2 === 0 ? 1 : -1) * (i * 1.5 % 22),
  y: 30 + (i * 3.1 % 65),
  size: (i % 4) + 1.2,
  duration: 2.8 + (i % 5) * 0.5,
  delay: (i % 6) * 0.45,
  isGold: i % 4 === 0,
}));

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    type Ember = { x: number; y: number; vx: number; vy: number; size: number; life: number; maxLife: number; hue: number };
    const embers: Ember[] = [];

    const spawnEmber = () => {
      embers.push({
        x: canvas.width * 0.52 + Math.random() * canvas.width * 0.46,
        y: canvas.height * 0.7 + Math.random() * canvas.height * 0.35,
        vx: (Math.random() - 0.5) * 1.1,
        vy: -(Math.random() * 3 + 0.5),
        size: Math.random() * 3.5 + 0.6,
        life: 0,
        maxLife: Math.random() * 120 + 55,
        hue: Math.random() > 0.5 ? 0 : 38,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.42) spawnEmber();
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.x += e.vx; e.y += e.vy; e.vx += (Math.random() - 0.5) * 0.12; e.life++;
        const prog = e.life / e.maxLife;
        const alpha = Math.sin(prog * Math.PI) * 0.72;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * (1 - prog * 0.45), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 90%, 58%, ${alpha})`;
        ctx.shadowColor = `hsl(${e.hue}, 90%, 55%)`; ctx.shadowBlur = 10;
        ctx.fill(); ctx.shadowBlur = 0;
        if (e.life >= e.maxLife) embers.splice(i, 1);
      }
      animFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: '#09090f' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

      {/* ── Background glows ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, #06080f 0%, #0c0d1a 40%, #0f0608 100%)' }} />
        {/* Left dark navy tint */}
        <div className="absolute inset-y-0 left-0 w-[52%]" style={{ background: 'linear-gradient(to right, rgba(5,10,28,0.75), transparent)' }} />
        {/* Right fire spread */}
        <motion.div className="absolute right-0 top-0 w-[65%] h-full"
          style={{ background: 'radial-gradient(ellipse 78% 88% at 78% 46%, rgba(194,24,24,0.42) 0%, rgba(160,18,0,0.16) 42%, transparent 66%)' }}
          animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        {/* Fire core */}
        <motion.div className="absolute right-[5%] top-[10%] w-[50%] h-[75%]"
          style={{ background: 'radial-gradient(ellipse at 55% 55%, rgba(210,35,0,0.55) 0%, rgba(180,20,0,0.24) 30%, transparent 58%)' }}
          animate={{ scale: [1, 1.07, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} />
        {/* Gold base */}
        <motion.div className="absolute right-[10%] bottom-0 w-[40%] h-[48%]"
          style={{ background: 'radial-gradient(ellipse at 50% 90%, rgba(212,175,55,0.22) 0%, transparent 55%)' }}
          animate={{ opacity: [0.35, 0.8, 0.35] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
        {/* Top/bottom vignette */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(9,9,15,0.5) 0%, transparent 25%, transparent 72%, rgba(9,9,15,0.65) 100%)' }} />
      </div>

      {/* ── CSS fire sparks ── */}
      {fireParticles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full pointer-events-none z-[2]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
            background: p.isGold ? '#D4AF37' : '#C21818',
            boxShadow: `0 0 ${p.size * 4}px ${p.isGold ? '#D4AF37' : '#C21818'}` }}
          animate={{ y: [0, -35, -70], opacity: [0, 0.85, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeOut' }} />
      ))}

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex-1 flex items-center">
          {/* Proper horizontal padding to match the reference */}
          <div className="w-full max-w-6xl mx-auto pl-10 pr-6 lg:pl-16 lg:pr-10 xl:pl-20 grid grid-cols-1 lg:grid-cols-[54%_46%] gap-4 items-center pt-24 pb-4 min-h-[calc(100vh-110px)]">

            {/* ── Left: Text ── */}
            <div className="flex flex-col justify-center">

              {/* Eyebrow */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[10px] tracking-[0.4em] font-bold uppercase font-[family-name:var(--font-inter)]">
                  Delhi, India · Invite Only
                </span>
              </motion.div>

              {/* Script line */}
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.22 }}
                className="leading-none mb-1 text-[#D4AF37]"
                style={{ fontFamily: 'var(--font-dancing)', fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.6vw, 2.4rem)' }}>
                We don't just play
              </motion.p>

              {/* RACQUETS. */}
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}>
                <h1 className="leading-[0.9] mb-0"
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    /* clamp: min 4rem, preferred 7.5vw, max 7.2rem (~115px) keeps it inside the column */
                    fontSize: 'clamp(4rem, 7.5vw, 7.2rem)',
                    color: '#D4AF37',
                    textShadow: '0 0 60px rgba(212,175,55,0.3), 3px 3px 0 rgba(90,0,0,0.4)',
                    letterSpacing: '0.02em',
                  }}>
                  RACQUETS.
                </h1>
              </motion.div>

              {/* WE LIVE IT. */}
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="leading-[0.9] mb-5"
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(2.8rem, 5.4vw, 5.2rem)',
                    color: '#C21818',
                    textShadow: '0 0 55px rgba(194,24,24,0.7), 3px 3px 0 rgba(50,0,0,0.5)',
                    letterSpacing: '0.02em',
                  }}>
                  WE LIVE IT.
                </h2>
              </motion.div>

              {/* Tagline */}
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
                className="text-white/55 text-xs sm:text-sm tracking-wider leading-relaxed mb-7 max-w-xs font-[family-name:var(--font-inter)]">
                A COMMUNITY UNITED BY{' '}
                <span className="text-[#D4AF37] font-bold">PASSION</span>,{' '}
                DRIVEN BY{' '}
                <span className="text-[#D4AF37] font-bold">COMPETITION</span>.
              </motion.p>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.85 }}
                className="flex flex-col sm:flex-row gap-3">
                <motion.a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-[#D4AF37]/55 text-[#D4AF37] font-bold text-[10px] tracking-[0.22em] rounded hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300 cursor-none font-[family-name:var(--font-inter)]">
                  JOIN THE COMMUNITY <ArrowRight size={13} />
                </motion.a>
                <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-white/14 text-white/55 hover:text-white hover:border-white/30 font-semibold text-[10px] tracking-[0.22em] rounded transition-all duration-300 cursor-none font-[family-name:var(--font-inter)]">
                  <Play size={11} className="fill-current" /> WATCH VIDEO
                </motion.button>
              </motion.div>
            </div>

            {/* ── Right: Athlete + fire ── */}
            <div className="relative hidden lg:flex items-end justify-center h-full min-h-[500px] pb-6">

              {/* Fire glow layers behind athlete */}
              <motion.div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 70% 85% at 52% 42%, rgba(194,24,24,0.5) 0%, rgba(194,24,24,0.2) 36%, transparent 62%)' }}
                animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div className="absolute left-[15%] right-[15%] top-[8%] bottom-0"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(215,40,0,0.62) 0%, rgba(180,20,0,0.28) 28%, transparent 55%)' }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
              {/* Gold floor glow */}
              <motion.div className="absolute bottom-0 left-[10%] right-[10%] h-[30%]"
                style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.32) 0%, transparent 60%)' }}
                animate={{ opacity: [0.4, 0.85, 0.4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

              {/* Fire streaks */}
              {[18, 30, 44, 58, 70, 80].map((left, i) => (
                <motion.div key={i} className="absolute bottom-0 w-px"
                  style={{ left: `${left}%`,
                    background: `linear-gradient(to top, ${i % 2 === 0 ? 'rgba(194,24,24,0.75)' : 'rgba(212,175,55,0.55)'}, transparent)` }}
                  animate={{ height: [`${22 + i * 8}%`, `${38 + i * 6}%`, `${22 + i * 8}%`], opacity: [0.25, 0.65, 0.25] }}
                  transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.22 }} />
              ))}

              {/* Athlete silhouette */}
              <motion.div
                className="relative z-10 w-[75%] h-[88%]"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <AthleteSilhouette />
              </motion.div>

              {/* Floating stat badges */}
              <motion.div className="absolute top-8 right-4 glass rounded-xl px-4 py-2.5 text-center z-20"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.55 }}
                style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
                <div className="text-xl font-black text-[#D4AF37]" style={{ fontFamily: 'var(--font-bebas)' }}>300+</div>
                <div className="text-[8px] text-white/40 tracking-widest uppercase font-[family-name:var(--font-inter)]">Members</div>
              </motion.div>

              <motion.div className="absolute top-[38%] left-0 glass rounded-xl px-4 py-2.5 text-center z-20"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.25, duration: 0.55 }}
                style={{ border: '1px solid rgba(194,24,24,0.2)' }}>
                <div className="text-xl font-black text-[#C21818]" style={{ fontFamily: 'var(--font-bebas)' }}>50+</div>
                <div className="text-[8px] text-white/40 tracking-widest uppercase font-[family-name:var(--font-inter)]">Events Hosted</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Feature strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 1.05 }}
          className="relative z-10 border-t border-white/8 bg-black/30 backdrop-blur-md">
          <div className="max-w-6xl mx-auto pl-10 pr-6 lg:pl-16 lg:pr-10 xl:pl-20 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
            {features.map(({ Icon, title, desc }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 + i * 0.09, duration: 0.4 }}
                className="flex items-start gap-3.5 px-5 py-5 group hover:bg-[#D4AF37]/5 transition-colors duration-300 cursor-none">
                <div className="mt-0.5 flex-shrink-0">
                  <Icon size={18} className="text-[#D4AF37] opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <p className="text-white text-[10px] font-black tracking-widest uppercase mb-0.5 font-[family-name:var(--font-montserrat)]">{title}</p>
                  <p className="text-white/38 text-[11px] leading-snug font-[family-name:var(--font-inter)]">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}
        className="absolute bottom-[88px] right-8 flex flex-col items-center gap-1.5 text-white/30 z-10">
        <span className="text-[9px] tracking-[0.4em] uppercase font-[family-name:var(--font-inter)]">SCROLL</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown size={13} />
        </motion.div>
      </motion.div>
    </section>
  );
}
