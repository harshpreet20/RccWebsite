'use client';

import { useEffect, useRef } from 'react';
import { Flame, Trophy, Users, ArrowRight, Play } from 'lucide-react';

/* ─── Super Saiyan angular spike aura ──────────────────────────────── */
interface Spike {
  angle: number;       // outward direction in radians
  bx: number;          // base x on body outline (0-1 of canvas)
  by: number;          // base y on body outline (0-1 of canvas)
  len: number;         // current rendered length
  targetLen: number;   // animating toward this
  baseLen: number;     // resting length
  width: number;       // base width of triangle
  phase: number;       // personal time offset
  speed: number;       // flicker speed
  hue: number;         // 0=red, 20=orange, 38=gold
  layer: number;       // 0=inner,1=outer
}

function useSuperSaiyanAura(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let spikes: Spike[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      buildSpikes();
    }

    function buildSpikes() {
      if (!canvas) return;
      const W = canvas.width;
      const H = canvas.height;
      spikes = [];

      // Body silhouette — narrow ellipse, athlete is right-center
      // cx ~62% from canvas left, cy ~45% from top, rx ~11%, ry ~44%
      const cx = W * 0.62;
      const cy = H * 0.45;
      const rx = W * 0.11;
      const ry = H * 0.44;

      // Inner layer — tight, sharp, fast-flicker spikes
      const INNER = 52;
      for (let i = 0; i < INNER; i++) {
        // Bias angles upward: concentrate ~60% in the upper arc
        const t0 = Math.random();
        const angle = t0 < 0.6
          ? -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3   // upper half
          : -Math.PI / 2 + Math.PI + (Math.random() - 0.5) * Math.PI; // lower half
        const bx = cx + Math.cos(angle) * rx;
        const by = cy + Math.sin(angle) * ry;
        // Outward direction = angle from center
        const outAngle = Math.atan2(by - cy, bx - cx);
        // Upper spikes get extra upward push
        const upBias = by < cy ? -0.35 : 0;
        const len = 35 + Math.random() * 90;
        spikes.push({
          angle: outAngle + upBias,
          bx, by,
          len, targetLen: len, baseLen: len,
          width: 5 + Math.random() * 14,
          phase: Math.random() * Math.PI * 2,
          speed: 2.5 + Math.random() * 4,
          hue: Math.random() < 0.75 ? 0 : (Math.random() < 0.5 ? 20 : 38),
          layer: 0,
        });
      }

      // Outer layer — long, wide, slow majestic spikes
      const OUTER = 28;
      for (let i = 0; i < OUTER; i++) {
        const t0 = Math.random();
        const angle = t0 < 0.65
          ? -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5
          : -Math.PI / 2 + Math.PI + (Math.random() - 0.5) * Math.PI * 0.9;
        const bx = cx + Math.cos(angle) * rx * 1.05;
        const by = cy + Math.sin(angle) * ry * 1.05;
        const outAngle = Math.atan2(by - cy, bx - cx);
        const upBias = by < cy ? -0.5 : 0;
        const len = 80 + Math.random() * 180;
        spikes.push({
          angle: outAngle + upBias,
          bx, by,
          len, targetLen: len, baseLen: len,
          width: 14 + Math.random() * 28,
          phase: Math.random() * Math.PI * 2,
          speed: 1.2 + Math.random() * 2.2,
          hue: Math.random() < 0.8 ? 0 : 20,
          layer: 1,
        });
      }
    }

    function drawSpike(
      ctx: CanvasRenderingContext2D,
      bx: number, by: number,
      angle: number, len: number, width: number,
      hue: number, alpha: number, layer: number
    ) {
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(angle);

      // Sharp triangle: base → tip
      const tipX = 0;
      const tipY = -len;
      const halfW = width / 2;

      // Sub-spike for jagged look — split into 2-3 inner triangles
      const jag = layer === 1 ? 3 : 2;
      for (let j = 0; j < jag; j++) {
        const jRatio = (j + 1) / jag;
        const jW = halfW * (1 - j * 0.3);
        const jLen = len * (0.5 + jRatio * 0.5);
        const jOff = (j - (jag - 1) / 2) * halfW * 0.4;

        ctx.beginPath();
        ctx.moveTo(-jW + jOff, 0);
        ctx.lineTo(jW + jOff, 0);
        ctx.lineTo(jOff * 0.3, -jLen);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, tipX, tipY * jRatio);
        const bright = layer === 0 ? '65%' : '55%';
        grad.addColorStop(0, `hsla(${hue}, 100%, ${bright}, ${alpha})`);
        grad.addColorStop(0.35, `hsla(${hue + 10}, 100%, 60%, ${alpha * 0.75})`);
        grad.addColorStop(1, `hsla(${hue + 20}, 100%, 70%, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.restore();
    }

    function tick() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;

      for (const s of spikes) {
        // Animate length with noise-like flicker
        const wave = Math.sin(t * s.speed + s.phase) * 0.5
                   + Math.sin(t * s.speed * 1.7 + s.phase * 1.3) * 0.3
                   + Math.sin(t * s.speed * 0.4 + s.phase * 0.7) * 0.2;
        // Clamp 0.15–1.0 so spikes never fully disappear
        const lenFactor = 0.15 + 0.85 * Math.max(0, Math.min(1, (wave + 1) / 2));
        s.len = s.baseLen * lenFactor;

        // Alpha flickers too — inner spikes more opaque
        const alphaBase = s.layer === 0 ? 0.75 : 0.55;
        const alpha = alphaBase * (0.5 + 0.5 * lenFactor);

        drawSpike(ctx, s.bx, s.by, s.angle, s.len, s.width, s.hue, alpha, s.layer);
      }

      animId = requestAnimationFrame(tick);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
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
  const auraCanvasRef = useRef<HTMLCanvasElement>(null);
  useSuperSaiyanAura(auraCanvasRef);

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

      <style>{`
        .hero-feature-strip { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 768px) { .hero-feature-strip { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .hero-feature-strip { grid-template-columns: repeat(2, 1fr) !important; } }
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

      {/* 5. Super Saiyan aura canvas — covers full hero, spikes drawn over athlete position */}
      <canvas
        ref={auraCanvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 8,
          pointerEvents: 'none',
        }}
      />

      {/* ── Athlete ── */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 90,
          height: '105%',
          width: '68%',
          zIndex: 6,
          overflow: 'visible',
        }}
      >
        <img
          src="/athlete.png"
          alt="RCC athlete"
          fetchPriority="high"
          loading="eager"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          style={{
            position: 'absolute',
            bottom: 0, right: 0,
            height: '118%', width: 'auto',
            objectFit: 'contain', objectPosition: 'bottom right',
            mixBlendMode: 'screen',
            filter: 'brightness(1.1) contrast(1.05)',
            zIndex: 7,
            pointerEvents: 'none',
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
            fontSize: 'clamp(2.23rem, 3.9vw, 4.19rem)',
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
            fontSize: 'clamp(5.58rem, 12.1vw, 13rem)',
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

        {/* "WE LIVE IT." — Pink Blue font, bold red, one line */}
        <div
          style={{
            fontFamily: 'var(--font-pinkblue)',
            fontSize: 'clamp(2.98rem, 6.98vw, 7.91rem)',
            lineHeight: 0.9,
            display: 'block',
            whiteSpace: 'nowrap',
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
