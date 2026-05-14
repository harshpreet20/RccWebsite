'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ParticleDivider({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className={`relative h-px mx-6 md:mx-20 overflow-hidden ${className}`}>
      {/* Base dashed line */}
      <div className="absolute inset-0 particle-divider opacity-40" />
      {/* Animated sweep */}
      <motion.div
        className="absolute inset-y-0 left-0 w-full origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.5), rgba(194,24,24,0.3), transparent)',
          height: '1px',
        }}
      />
      {/* Gold sparkle dot at center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: [0, 1, 0.6], scale: [0, 1.5, 1] } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        style={{ boxShadow: '0 0 8px rgba(212,175,55,0.8)' }}
      />
    </div>
  );
}
