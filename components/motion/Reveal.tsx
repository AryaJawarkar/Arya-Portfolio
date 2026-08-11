'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

// A single easing curve shared by every scroll animation on the site, so the
// whole page feels like one system rather than a pile of separate effects.
export const EASE = [0.16, 1, 0.3, 1] as const;

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Where the element travels in from. */
  from?: Direction;
  delay?: number;
  duration?: number;
  /** Adds a depth tilt to the entrance — used for cards. */
  tilt?: boolean;
  /** Stagger children instead of animating as one block. */
  stagger?: number;
  as?: 'div' | 'section' | 'li' | 'span';
};

/**
 * Scroll-triggered entrance. Fires once when the element comes into view.
 *
 * Honours `prefers-reduced-motion` by collapsing to a plain fade — the content
 * still appears, it just does not move.
 */
export default function Reveal({
  children,
  className,
  from = 'up',
  delay = 0,
  duration = 0.7,
  tilt = false,
  stagger,
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion();
  const { x, y } = reduced ? OFFSET.none : OFFSET[from];
  const Tag = motion[as];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x,
      y,
      filter: reduced ? 'none' : 'blur(6px)',
      ...(tilt && !reduced ? { rotateX: -12, scale: 0.97 } : {}),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'none',
      ...(tilt && !reduced ? { rotateX: 0, scale: 1 } : {}),
      transition: {
        duration: reduced ? 0.3 : duration,
        ease: EASE,
        delay,
        ...(stagger ? { staggerChildren: stagger, delayChildren: delay } : {}),
      },
    },
  };

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      style={tilt ? { transformPerspective: 1200 } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Child variant for use inside a <Reveal stagger={...}> parent. */
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'none',
    transition: { duration: 0.6, ease: EASE },
  },
};
