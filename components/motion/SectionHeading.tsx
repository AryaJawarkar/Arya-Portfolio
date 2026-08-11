'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './Reveal';

/**
 * Section headline that assembles word by word as it scrolls into view.
 */
export default function SectionHeading({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const words = children.split(' ');

  return (
    <div className="relative">
      <motion.h2
        className={`text-5xl md:text-6xl font-bold text-white tracking-tight ${className}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduced ? 0 : 0.08 } },
        }}
      >
        {words.map((word, i) => (
          <React.Fragment key={i}>
            {/* Clipping wrapper so each word rises out of nothing */}
            <span className="inline-block overflow-hidden align-bottom py-1">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: reduced ? 0 : '110%', opacity: reduced ? 0 : 1 },
                  visible: {
                    y: '0%',
                    opacity: 1,
                    transition: { duration: 0.7, ease: EASE },
                  },
                }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </motion.h2>
    </div>
  );
}
