'use client';

import { useEffect, useRef } from 'react';

export default function ShuttleCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    let mouseX = -200, mouseY = -200;
    let rafId: number;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function loop() {
      if (el) {
        // Offset so cork tip (top-center of SVG, x=18) aligns with pointer
        el.style.transform = `translate(${mouseX - 18}px, ${mouseY}px)`;
      }
      rafId = requestAnimationFrame(loop);
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      <svg
        width="36"
        height="54"
        viewBox="0 0 36 54"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <filter id="sc-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="rgba(0,0,0,0.7)" />
          </filter>
        </defs>

        {/* ── Cork ── */}
        <ellipse cx="18" cy="9" rx="8" ry="10"
          fill="#e8c07a" stroke="#a06820" strokeWidth="1.4"
          filter="url(#sc-shadow)" />
        {/* Cork sheen */}
        <ellipse cx="15" cy="6" rx="3" ry="3.5"
          fill="rgba(255,255,255,0.32)" />
        {/* Cork base ring */}
        <ellipse cx="18" cy="16" rx="5.5" ry="1.8"
          fill="none" stroke="#a06820" strokeWidth="1" />

        {/* ── Shaft ── */}
        <path d="M15.5,17 L20.5,17 L19.5,27 L16.5,27 Z"
          fill="#c89050" stroke="#8b6030" strokeWidth="0.8" />

        {/* ── Feather lines (8 feathers) ── */}
        <g stroke="white" strokeWidth="1.3" strokeLinecap="round"
          filter="url(#sc-shadow)" opacity="0.92">
          <line x1="18" y1="26" x2="1"  y2="45" />
          <line x1="18" y1="26" x2="5"  y2="48" />
          <line x1="18" y1="26" x2="10" y2="51" />
          <line x1="18" y1="26" x2="15" y2="52" />
          <line x1="18" y1="26" x2="21" y2="52" />
          <line x1="18" y1="26" x2="26" y2="51" />
          <line x1="18" y1="26" x2="31" y2="48" />
          <line x1="18" y1="26" x2="35" y2="45" />
        </g>

        {/* ── Feather membrane (subtle fill between lines) ── */}
        <path d="M1,45 C6,41 12,36 18,26 C24,36 30,41 35,45"
          fill="rgba(255,255,255,0.05)" stroke="none" />

        {/* ── Feather ring ── */}
        <ellipse cx="18" cy="49.5" rx="17" ry="4"
          fill="rgba(255,255,255,0.07)"
          stroke="white" strokeWidth="1.5"
          filter="url(#sc-shadow)" />
      </svg>
    </div>
  );
}
