'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Minimum time the monogram stays up, so a warm cache doesn't flash it.
const MIN_DURATION = 900;

/**
 * Full-screen black hold shown until the site has finished loading.
 *
 * The monogram and the sweeping line are plain markup + CSS on purpose: this
 * component server-renders, and anything relying on framer-motion's `initial`
 * would be painted at opacity 0 until React hydrates — i.e. invisible for
 * exactly the stretch of time the loader exists to cover. Only the dismissal
 * is animated in JS.
 */
const Preloader = () => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const started = Date.now();
    let timer = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      const elapsed = Date.now() - started;
      timer = window.setTimeout(
        () => setDone(true),
        Math.max(MIN_DURATION - elapsed, 300)
      );
    };

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', finish);
    };
  }, []);

  // Hold the page still until the reveal.
  useEffect(() => {
    document.body.style.overflow = done ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {/* Monogram */}
          <div className="text-5xl font-bold tracking-[0.2em] text-white">
            AJ
            <span className="text-blue-500">.</span>
          </div>

          {/* Loader line */}
          <div className="mt-6 h-px w-32 overflow-hidden bg-white/15">
            <div
              className="h-full w-1/4 bg-gradient-to-r from-blue-500 to-violet-500"
              style={{
                animation: 'loader-sweep 1.1s ease-in-out infinite',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
