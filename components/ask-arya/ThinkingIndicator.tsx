'use client';

import { motion, useReducedMotion } from 'framer-motion';

const BAR_WIDTHS = ['88%', '96%', '64%'];

/**
 * The pre-first-token animation.
 *
 * A shimmer skeleton rather than a spinner, because it does something a spinner can't: the
 * bars sit at the width and leading of the text that's about to arrive, so the handoff to
 * streaming is a crossfade with zero reflow. That absence of a layout jump is what makes it
 * feel expensive.
 */
export default function ThinkingIndicator() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 px-1 py-2"
      role="status"
      aria-live="polite"
      aria-label="Ask Arya is thinking"
    >
      <motion.div
        className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-violet-500"
        animate={reduceMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="flex-1 space-y-2.5 pt-2">
        {BAR_WIDTHS.map((width, i) => (
          <div
            key={i}
            className="relative h-2.5 overflow-hidden rounded-full bg-white/5"
            style={{ width }}
          >
            {!reduceMotion && (
              <motion.div
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500/50 to-violet-500/0"
                animate={{ x: ['-120%', '260%'] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.12,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
