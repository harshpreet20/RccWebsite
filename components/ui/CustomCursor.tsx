'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  // Dot follows cursor tightly
  const dotX = useSpring(cursorX, { stiffness: 600, damping: 40, mass: 0.4 });
  const dotY = useSpring(cursorY, { stiffness: 600, damping: 40, mass: 0.4 });

  // Ring lags behind for trailing effect
  const ringX = useSpring(cursorX, { stiffness: 180, damping: 28, mass: 0.6 });
  const ringY = useSpring(cursorY, { stiffness: 180, damping: 28, mass: 0.6 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, select, label')) {
        setHovering(true);
      }
    };
    const onLeave = () => setHovering(false);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
    };
  }, [cursorX, cursorY, visible]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Outer ring — lags behind */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: hovering ? 48 : 32,
          height: hovering ? 48 : 32,
          border: `1px solid rgba(212,175,55,${hovering ? 0.7 : 0.35})`,
          opacity: visible ? 1 : 0,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, opacity 0.4s ease',
        }}
      />
      {/* Inner dot — snappy */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: hovering ? 6 : 4,
          height: hovering ? 6 : 4,
          background: '#D4AF37',
          boxShadow: `0 0 ${hovering ? 12 : 6}px rgba(212,175,55,0.8)`,
          opacity: visible ? 1 : 0,
          transition: 'width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease, opacity 0.4s ease',
        }}
      />
    </>
  );
}
