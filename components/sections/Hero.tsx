'use client';

import { useEffect, useRef } from 'react';
import { Flame, Trophy, Users, ArrowRight, Play } from 'lucide-react';

/* ─── Canvas fire particles ────────────────────────────────────────── */
interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  isGold: boolean;
}

function useFireCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const embers: Ember[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function spawnEmber() {
      if (!canvas) return;
      const x = canvas.width * (0.55 + Math.random() * 0.40);
      const y = canvas.height * (0.75 + Math.random() * 0.25);
      embers.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(1.2 + Math.random() * 2.0),
        r: 0.5 + Math.random() * 3.5,
        life: 0,
        maxLife: 60 + Math.floor(Math.random() * 100),
        isGold: Math.random() < 0.35,
      });
    }

    function tick() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn
      if (Math.random() < 0.4) spawnEmber();

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life++;
        if (e.life > e.maxLife) { embers.splice(i, 1); continue; }

        e.x += e.vx;
        e.y += e.vy;
        e.vx += (Math.random() - 0.5) * 0.12;

        const t = e.life / e.maxLife;
        const alpha = Math.sin(t * Math.PI) * 0.85;

        const hue = e.isGold ? 38 : 0;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 90%, 58%, ${alpha})`;
        ctx.fill();

        // Soft glow
        const grd = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 3);
        grd.addColorStop(0, `hsla(${hue}, 90%, 58%, ${alpha * 0.4})`);
        grd.addColorStop(1, `hsla(${hue}, 90%, 58%, 0)`);
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      animId = requestAnimationFrame(tick);
    }
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [canvasRef]);
}

/* ─── Custom racquet SVG icon ───────────────────────────────────────── */
function RacquetIcon({ size = 20, color = '#D4AF37' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="9" cy="8" rx="6" ry="7" stroke={color} strokeWidth="1.5" />
      <line x1="9" y1="1" x2="9" y2="15" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="3" y1="8" x2="15" y2="8" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="4" y1="4" x2="14" y2="12" stroke={color} strokeWidth="0.7" opacity="0.35" />
      <line x1="4" y1="12" x2="14" y2="4" stroke={color} strokeWidth="0.7" opacity="0.35" />
      <path d="M14 14 L20 21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Feature strip data ────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Flame size={20} color="#D4AF37" opacity={0.75} />,
    title: 'PASSION FUELS US',
    desc: 'For the love of the game.',
  },
  {
    icon: <RacquetIcon size={20} color="#D4AF37" />,
    title: 'PLAY TOGETHER',
    desc: 'Stronger as a community.',
  },
  {
    icon: <Trophy size={20} color="#D4AF37" opacity={0.75} />,
    title: 'COMPETE FEARLESSLY',
    desc: 'Challenge yourself. Elevate together.',
  },
  {
    icon: <Users size={20} color="#D4AF37" opacity={0.75} />,
    title: 'BELONG FOREVER',
    desc: "More than a club. It’s a family.",
  },
];

/* ─── Hero ──────────────────────────────────────────────────────────── */
export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useFireCanvas(canvasRef);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        background: '#0B0D1F',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Background layers ── */}

      {/* 1. Left dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(8,10,25,0.92) 0%, rgba(8,10,25,0.7) 35%, rgba(8,10,25,0.2) 55%, transparent 70%)',
          zIndex: 1,
        }}
      />

      {/* 2. Right fire glow — large aura filling right half */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 110% at 80% 50%, rgba(194,24,24,0.70) 0%, rgba(150,15,0,0.45) 30%, rgba(100,10,0,0.20) 55%, transparent 75%)',
          zIndex: 2,
        }}
      />

      {/* 3. Fire core — pulsing, larger */}
      <div
        className="animate-pulse-glow"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 100% at 78% 55%, rgba(220,50,0,0.75) 0%, rgba(180,25,0,0.50) 22%, rgba(120,15,0,0.25) 45%, transparent 65%)',
          zIndex: 3,
        }}
      />

      {/* 3b. Top fire plume */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 40% 60% at 75% 10%, rgba(220,60,0,0.45) 0%, transparent 60%)',
          zIndex: 3,
        }}
      />

      {/* Smash 3D animation + responsive styles */}
      <style>{`
        @keyframes smash-3d {
          0%   { transform: perspective(700px) translateY(0px) rotateY(-8deg) rotateZ(-3deg) scale(1); }
          18%  { transform: perspective(700px) translateY(-28px) rotateY(-18deg) rotateZ(-7deg) scale(1.04); }
          36%  { transform: perspective(700px) translateY(-44px) rotateY(-25deg) rotateZ(-10deg) scale(1.06); }
          52%  { transform: perspective(700px) translateY(-8px) rotateY(8deg) rotateZ(4deg) scale(0.97); }
          62%  { transform: perspective(700px) translateY(0px) rotateY(-4deg) rotateZ(-2deg) scale(1.02); }
          80%  { transform: perspective(700px) translateY(-8px) rotateY(-6deg) rotateZ(-2deg) scale(1.01); }
          100% { transform: perspective(700px) translateY(0px) rotateY(-8deg) rotateZ(-3deg) scale(1); }
        }
        .hero-feature-strip {
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 768px) {
          .hero-feature-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .hero-feature-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      {/* 4. Gold floor glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 80% 100%, rgba(212,175,55,0.25) 0%, transparent 50%)',
          zIndex: 4,
        }}
      />

      {/* 5. Canvas for embers */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* ── Athlete area ── */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 90,
          height: '100%',
          width: '65%',
          zIndex: 6,
          overflow: 'visible',
        }}
      >
        {/* Fire streaks — more and taller */}
        {[8, 18, 30, 42, 55, 68, 80].map((pct, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${pct}%`,
              bottom: 0,
              width: i % 3 === 0 ? '2px' : '1px',
              height: `${40 + i * 8}%`,
              background: `linear-gradient(to top, ${i % 2 === 0 ? 'rgba(220,40,0,0.85)' : 'rgba(212,175,55,0.6)'}, transparent)`,
              animation: `pulse-glow ${1.6 + i * 0.35}s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}

        {/* Athlete image */}
        <img
          src="/athlete.png"
          alt="RCC athlete"
          fetchPriority="high"
          loading="eager"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            height: '105%',
            width: 'auto',
            objectFit: 'contain',
            objectPosition: 'bottom right',
            mixBlendMode: 'screen',
            filter: 'drop-shadow(-40px 0 100px rgba(220,40,0,0.85)) drop-shadow(0 0 60px rgba(212,175,55,0.35)) brightness(1.1)',
            animation: 'smash-3d 3.2s ease-in-out infinite',
            transformStyle: 'preserve-3d',
          }}
        />
      </div>

      {/* ── Main text content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          paddingLeft: 'clamp(40px, 7vw, 130px)',
          paddingRight: '40px',
          paddingTop: 'clamp(140px, 18vh, 180px)',
          paddingBottom: '110px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: '660px',
        }}
      >
        {/* "We don't just play" */}
        <div
          style={{
            fontFamily: 'var(--font-pinkblue)',
            color: '#D4AF37',
            fontSize: 'clamp(2.4rem, 4.2vw, 4.5rem)',
            marginBottom: '2px',
            lineHeight: 1.1,
            textShadow: '0 0 40px rgba(212,175,55,0.4)',
          }}
        >
          We don&apos;t just play
        </div>

        {/* "RACQUETS." — Pink Blue font, massive */}
        <div
          style={{
            fontFamily: 'var(--font-pinkblue)',
            fontSize: 'clamp(6rem, 13vw, 14rem)',
            lineHeight: 0.9,
            display: 'block',
            letterSpacing: '0.01em',
            color: '#D4AF37',
            WebkitTextStroke: '1px #b8932a',
            textShadow: '4px 4px 0 rgba(80,20,0,0.6), 0 0 100px rgba(212,175,55,0.3)',
          }}
        >
          RACQUETS.
        </div>

        {/* "WE LIVE IT." — Pink Blue font, bold red */}
        <div
          style={{
            fontFamily: 'var(--font-pinkblue)',
            fontSize: 'clamp(4rem, 9vw, 9.5rem)',
            lineHeight: 0.9,
            display: 'block',
            color: '#C21818',
            WebkitTextStroke: '1px #8b0000',
            textShadow: '3px 3px 0 rgba(40,0,0,0.7), 0 0 80px rgba(194,24,24,0.6)',
          }}
        >
          WE LIVE IT.
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '13px',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '380px',
            marginTop: '20px',
            marginBottom: '28px',
            lineHeight: 1.7,
            textTransform: 'uppercase',
          }}
        >
          A COMMUNITY UNITED BY{' '}
          <span style={{ color: '#D4AF37', fontWeight: 700 }}>PASSION</span>
          {', DRIVEN BY '}
          <span style={{ color: '#D4AF37', fontWeight: 700 }}>COMPETITION</span>
          {'.'}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* Join the Community */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              minHeight: '44px',
              border: '1px solid rgba(212,175,55,0.5)',
              borderRadius: '4px',
              background: 'transparent',
              color: '#D4AF37',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,175,55,0.10)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4AF37';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.5)';
            }}
          >
            <Users size={14} />
            JOIN THE COMMUNITY
            <ArrowRight size={14} />
          </button>

          {/* Watch Video */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              minHeight: '44px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '10px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.30)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
            }}
          >
            <Play size={12} fill="currentColor" />
            WATCH VIDEO
          </button>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '110px',
          right: '32px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(255,255,255,0.30)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '9px',
            letterSpacing: '0.22em',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
          }}
        >
          SCROLL
        </span>
        <div
          className="animate-bounce"
          style={{ marginTop: '4px' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── Feature strip ── */}
      <div
        className="hero-feature-strip"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          minHeight: '90px',
          background: 'rgba(0,0,0,0.50)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          zIndex: 20,
          display: 'grid',
        }}
      >
        {FEATURES.map((feat, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0 clamp(12px, 2.5vw, 28px)',
              borderRight: i < FEATURES.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}
          >
            <div style={{ flexShrink: 0, opacity: 0.75 }}>{feat.icon}</div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 900,
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  lineHeight: 1.3,
                }}
              >
                {feat.title}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.40)',
                  marginTop: '2px',
                  lineHeight: 1.4,
                }}
              >
                {feat.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
