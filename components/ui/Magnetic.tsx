'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Magnetic hover — the wrapped element eases toward the cursor while hovered and
 * springs back on leave. Wrap a button/link. Respects reduced-motion.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)';
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block will-change-transform ${className}`}
      style={{ transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)' }}
    >
      {children}
    </span>
  );
}
