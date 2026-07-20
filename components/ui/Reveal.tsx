'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

/**
 * Apple-keynote style reveal: content eases up from below with a soft blur and
 * opacity ramp as it scrolls into view.
 *
 * The intersection margin is generous (large positive bottom value) rather
 * than a tight negative one: with Lenis smooth-scroll active, anything that
 * programmatically jumps scroll position (a "back to top" control, an anchor
 * link) can race Lenis's own RAF loop and never let a tightly-bounded
 * observer fire — which would leave the section permanently invisible. A
 * wide trigger zone means the reveal fires well before the fold, so it's not
 * sensitive to exactly how scroll got there.
 *
 * Reduced-motion is applied only after mount so the server render and the
 * client's first (hydration) render always agree — `useReducedMotion()` is
 * null on the server and can resolve to true on the client.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduceRaw = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && !!reduceRaw;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '0px 0px 400px 0px' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
