'use client';

import { useEffect, useRef } from 'react';

/**
 * HeroParticles — a very subtle canvas layer of drifting teal "shuttlecock
 * feather" particles so the hero stays alive even when /hero.mp4 is missing.
 * Additive teal glow, low opacity, DPR capped at 1.5, delta-time driven, and
 * fully torn down on unmount. Respects prefers-reduced-motion (renders nothing).
 */
export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = performance.now();
    let running = true;

    type Feather = {
      x: number;
      y: number;
      len: number;
      angle: number;
      spin: number;
      vy: number;
      vx: number;
      alpha: number;
    };
    let feathers: Feather[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Scale particle count with area but keep it light.
      const target = Math.min(28, Math.max(12, Math.round((width * height) / 60000)));
      if (feathers.length !== target) {
        feathers = Array.from({ length: target }, () => spawn(true));
      }
    };

    function spawn(initial: boolean): Feather {
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + 20,
        len: 8 + Math.random() * 14,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.4,
        vy: -(6 + Math.random() * 14), // drift upward, px/s
        vx: (Math.random() - 0.5) * 10,
        alpha: 0.05 + Math.random() * 0.14,
      };
    }

    const drawFeather = (f: Feather) => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      ctx.globalCompositeOperation = 'lighter';
      // Soft teal feather: a thin quill with a rounded glow tip.
      const grad = ctx.createLinearGradient(0, -f.len, 0, f.len);
      grad.addColorStop(0, `rgba(98,243,232,${f.alpha})`);
      grad.addColorStop(1, 'rgba(0,183,168,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -f.len);
      ctx.lineTo(0, f.len);
      ctx.stroke();
      // Glow tip.
      ctx.beginPath();
      ctx.fillStyle = `rgba(0,212,191,${f.alpha * 0.9})`;
      ctx.arc(0, -f.len, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05); // clamp large gaps
      last = now;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < feathers.length; i++) {
        const f = feathers[i];
        f.y += f.vy * dt;
        f.x += f.vx * dt;
        f.angle += f.spin * dt;
        if (f.y < -30 || f.x < -30 || f.x > width + 30) {
          feathers[i] = spawn(false);
        }
        drawFeather(f);
      }
      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
    />
  );
}
