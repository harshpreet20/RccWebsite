'use client';

import { useScroll, motion } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[200] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(to right, #C21818, #D4AF37)',
        boxShadow: '0 0 8px rgba(212,175,55,0.6)',
      }}
    />
  );
}
