'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * Counts up to a numeric target when scrolled into view. Non-numeric values
 * (e.g. "Weekly") are rendered as-is. `prefix`/`suffix` wrap the number so
 * "300+" animates the 300 and keeps the "+".
 */
export default function Counter({
  value,
  className = '',
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();

  const match = value.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const target = match ? parseInt(match[2].replace(/,/g, ''), 10) : null;
  const prefix = match?.[1] ?? '';
  const suffix = match?.[3] ?? '';

  // Deterministic initial value (0) so server and client first render match —
  // branching this on `reduce` would hydration-mismatch for reduced-motion users.
  const [n, setN] = useState(0);

  useEffect(() => {
    if (target === null) return;
    if (reduce) { setN(target); return; }
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduce]);

  if (target === null) return <span ref={ref} className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      {prefix}{n.toLocaleString('en-IN')}{suffix}
    </span>
  );
}
