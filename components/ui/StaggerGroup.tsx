'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect, useState, type ComponentPropsWithoutRef, type ElementType, type ReactNode, type Ref } from 'react';

/**
 * Reduced-motion, but only after mount — so the server render and the client's
 * first (hydration) render always agree. `useReducedMotion()` is null on the
 * server and can resolve to true on the client, which would hydration-mismatch
 * if we branched the rendered element on it during the first paint.
 */
function useReduceAfterMount() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!reduce;
}

/**
 * Cinematic staggered scroll reveal.
 *
 * <StaggerGroup> is a container that fires its children in sequence as it
 * scrolls into view; each direct child should be a <StaggerItem>. Items ease
 * up from below with a soft blur + opacity ramp, matching the site's Reveal
 * easing [0.22, 1, 0.36, 1].
 *
 * Respects prefers-reduced-motion: when reduced, both render as plain elements
 * with no transform/opacity so nothing can get stuck invisible.
 */

type MotionTagName = 'div' | 'ul' | 'ol' | 'li' | 'section' | 'span' | 'a';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

type StaggerProps<T extends MotionTagName> = {
  as?: T;
  children: ReactNode;
  /** Forwarded to the underlying DOM node (e.g. a scroll container ref). */
  containerRef?: Ref<HTMLElement>;
} & Omit<ComponentPropsWithoutRef<T>, 'children'>;

export function StaggerGroup<T extends MotionTagName = 'div'>({
  as,
  children,
  containerRef,
  ...rest
}: StaggerProps<T>) {
  const reduce = useReduceAfterMount();
  const tag = (as ?? 'div') as MotionTagName;

  if (reduce) {
    const Tag = tag as ElementType;
    return (
      <Tag ref={containerRef} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[tag] as ElementType;
  return (
    <MotionTag
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px 400px 0px' }}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </MotionTag>
  );
}

type StaggerItemProps<T extends MotionTagName> = {
  as?: T;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'children'>;

export function StaggerItem<T extends MotionTagName = 'div'>({
  as,
  children,
  ...rest
}: StaggerItemProps<T>) {
  const reduce = useReduceAfterMount();
  const tag = (as ?? 'div') as MotionTagName;

  if (reduce) {
    const Tag = tag as ElementType;
    return <Tag {...rest}>{children}</Tag>;
  }

  const MotionTag = motion[tag] as ElementType;
  return (
    <MotionTag variants={itemVariants} {...(rest as Record<string, unknown>)}>
      {children}
    </MotionTag>
  );
}
