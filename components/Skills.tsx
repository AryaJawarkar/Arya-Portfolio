'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  Binary,
  Cloud,
  Database,
  Monitor,
  Palette,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { skills } from '@/data/mockData';
import { EASE } from '@/components/motion/Reveal';
import SectionHeading from '@/components/motion/SectionHeading';

type Category = {
  title: string;
  items: string[];
  accent: string;
  icon: LucideIcon;
};

const CATEGORIES: Category[] = [
  {
    title: 'Frontend',
    items: skills.frontend,
    accent: '#38bdf8',
    icon: Monitor,
  },
  {
    title: 'Styling & UI',
    items: skills.styling,
    accent: '#818cf8',
    icon: Palette,
  },
  {
    title: 'Tooling & Dev',
    items: skills.tooling,
    accent: '#22d3ee',
    icon: Wrench,
  },
  {
    title: 'Backend & Databases',
    items: skills.backend,
    accent: '#a78bfa',
    icon: Database,
  },
  {
    title: 'Cloud & Infrastructure',
    items: skills.cloud,
    accent: '#c084fc',
    icon: Cloud,
  },
  {
    title: 'Fundamentals',
    items: skills.fundamentals,
    accent: '#60a5fa',
    icon: Binary,
  },
];

// --- Scroll choreography, in fractions of the pinned scroll -----------------
// Both halves swap to the category the scroll has reached: the left label moves
// vertically, the right panel horizontally, so the two reads stay distinct. Over
// the final stretch the board eases back and dims while the Experience section
// slides up over it — a soft cover rather than a hard flip, which is easier to
// watch and leaves no blank screen between the two.
const STEP_FROM = 0.03;
const STEP_TO = 0.6;
const RECEDE = [0.66, 0.92] as const;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const Skills = () => {
  const wrapRef = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const measure = () =>
      setPinned(
        window.innerWidth >= 1024 && window.innerHeight >= 620 && !still.matches
      );

    measure();
    window.addEventListener('resize', measure);
    still.addEventListener('change', measure);
    return () => {
      window.removeEventListener('resize', measure);
      still.removeEventListener('change', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const p = clamp((v - STEP_FROM) / (STEP_TO - STEP_FROM), 0, 1);
    const next = Math.min(
      CATEGORIES.length - 1,
      Math.floor(p * CATEGORIES.length)
    );
    setActive((prev) => (prev === next ? prev : next));
  });

  // Gentle recede: a small push back and a dim. No rotation.
  const boardScale = useTransform(scrollYProgress, [...RECEDE], [1, 0.92]);
  const boardFade = useTransform(scrollYProgress, [...RECEDE], [1, 0.15]);
  const boardLift = useTransform(scrollYProgress, [...RECEDE], [0, -40]);

  const current = CATEGORIES[active];
  const Icon = current.icon;

  return (
    <section
      id="skills"
      ref={wrapRef}
      className="relative bg-gradient-to-b from-black to-gray-900 lg:h-[380vh]"
    >
      <div className="overflow-hidden py-32 lg:sticky lg:top-0 lg:h-screen lg:py-0">
        <motion.div
          className="mx-auto w-full max-w-7xl px-6 lg:flex lg:h-full lg:flex-col lg:pb-20 lg:pt-28"
          style={
            pinned
              ? { scale: boardScale, opacity: boardFade, y: boardLift }
              : undefined
          }
        >
          {pinned ? (
            /* Both columns stretch to the full height of the pinned screen, so
               the board reads as a full section rather than a band floating in
               the middle of it. */
            <div className="grid flex-1 gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-20">
              {/* ------------- Left: just the category being shown -------- */}
              <div className="flex h-full flex-col">
                <SectionHeading>Skills &amp; Technologies</SectionHeading>

                {/* Takes the slack between the heading and the counter, so the
                    label sits in the optical centre of the column. */}
                <div className="relative flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.title}
                      className="absolute inset-0 flex flex-col justify-center"
                      initial={{ opacity: 0, y: 34 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -34 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <span
                        className="font-mono text-sm tabular-nums"
                        style={{ color: current.accent }}
                      >
                        {String(active + 1).padStart(2, '0')}
                      </span>
                      {/* One step down from the section heading, so the
                          hierarchy reads heading → current category. */}
                      <p className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-white xl:text-5xl">
                        {current.title}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Position within the set, without listing it */}
                <div className="flex items-center gap-2">
                  {CATEGORIES.map((category, i) => (
                    <motion.span
                      key={category.title}
                      className="h-px rounded-full"
                      animate={{
                        width: i === active ? 36 : 14,
                        backgroundColor:
                          i === active
                            ? category.accent
                            : i < active
                              ? 'rgba(255,255,255,0.35)'
                              : 'rgba(255,255,255,0.12)',
                      }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  ))}
                  <span className="ml-3 font-mono text-[11px] tabular-nums text-gray-500">
                    {String(active + 1).padStart(2, '0')} /{' '}
                    {String(CATEGORIES.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* ------------- Right: that category's technologies --------
                  Deliberately quiet: no glow, no coloured shadow, no oversized
                  index. The accent appears once, on the icon, and everything
                  moves on a plain ease rather than a spring — the movement
                  carries the section, so the styling stays out of its way. */}
              {/* Card keeps its natural height and sits centred in the column,
                  rather than stretching to the full pinned screen. */}
              <div className="relative flex h-full items-center">
                <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.title}
                      className="flex flex-col items-center text-center"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06]"
                        style={{ color: current.accent }}
                      >
                        <Icon size={22} />
                      </span>
                      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-gray-500">
                        {String(current.items.length).padStart(2, '0')}{' '}
                        technologies
                      </p>

                      {/* Chips arrive one after another */}
                      <motion.div
                        className="mt-8 flex flex-wrap justify-center gap-2.5"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: {},
                          visible: { transition: { staggerChildren: 0.045 } },
                        }}
                      >
                        {current.items.map((skill) => (
                          <motion.span
                            key={skill}
                            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-base text-gray-200"
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.35, ease: EASE }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            /* --- Not pinned (small screens, reduced motion): everything at
                   once, so no content depends on a scroll animation. ------ */
            <div>
              <SectionHeading>Skills &amp; Technologies</SectionHeading>
              <p className="mt-6 mb-12 max-w-xl text-lg text-gray-400">
                A comprehensive toolkit built through hands-on experience and
                continuous learning.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                {CATEGORIES.map((category) => {
                  const RowIcon = category.icon;
                  return (
                    <div
                      key={category.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06]"
                          style={{ color: category.accent }}
                        >
                          <RowIcon size={18} />
                        </span>
                        <h3 className="text-lg font-semibold text-white">
                          {category.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.items.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
