'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArrowDown, Mail } from 'lucide-react';
import { personalInfo } from '@/data/mockData';
import useTypewriter from '@/hooks/use-typewriter';
// import { personalInfo } from '../mockData';

// The 3D scene is client/WebGL-only — load it without SSR so it never
// runs on the server and doesn't block the rest of the page's paint.
const HeroCanvas = dynamic(() => import('@/components/hero3d/HeroCanvas'), {
  ssr: false,
});

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Drives both the 3D scene and the text/overlay as the hero scrolls out of
  // view — 0 while the hero fills the viewport, 1 by the time it unpins.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const scrollToSection = (id: string) => {
    if (typeof window === 'undefined') return;

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const typedRole = useTypewriter({
    words: personalInfo.role,
  });

  return (
    // Taller than the viewport so the hero can pin: the scene holds on screen
    // while the scroll drives it, then About slides up over it. The inner div
    // is what actually fills the screen.
    //
    // The height must stay above 200vh. About is pulled up by 100vh to cover the
    // pin's trailing viewport, which puts its opaque top edge at
    // (height - 100vh). Below 200vh that lands inside the first viewport and
    // clips the bottom of the hero before the reader has scrolled at all.
    <section ref={sectionRef} className="relative lg:h-[230vh]">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-black via-black to-gray-900 lg:sticky lg:top-0 lg:h-screen lg:min-h-0">
        {/* Atmospheric colour wash sitting behind the canvas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -right-1/4 w-[36rem] h-[36rem] bg-blue-600/20 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 -left-1/4 w-[36rem] h-[36rem] bg-violet-600/20 rounded-full blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* 3D constellation — the stack orbiting the headline, reacting to
          scroll and cursor */}
        <div className="absolute inset-0">
          <HeroCanvas progress={scrollYProgress} />
        </div>

        {/* Radial scrim over the type's footprint. Lighter than a full mask —
          the scene keeps nothing solid behind the headline, so this only has
          to knock back the starfield and the wireframe shell. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 42% 28% at 50% 44%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* Top/bottom vignette. The bottom reaches full black before the
          canvas edge so the WebGL rectangle never shows as a seam against
          the next section. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.85) 88%, #000 100%)',
          }}
        />

        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          {/* Name and Role */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.p
              className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 h-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {typedRole}
              <span className="animate-pulse">|</span>
            </motion.p>
            {/* Shadow keeps the type legible whatever the scene does behind it */}
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
              style={{ textShadow: '0 2px 40px rgba(0,0,0,0.9)' }}
            >
              {personalInfo.name}
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            style={{ textShadow: '0 1px 24px rgba(0,0,0,0.95)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          >
            {personalInfo.tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          >
            <motion.button
              onClick={() => scrollToSection('projects')}
              className="group relative px-8 py-4 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>View Work</span>
                <ArrowDown
                  size={18}
                  className="group-hover:translate-y-1 transition-transform duration-300"
                />
              </span>
            </motion.button>

            <motion.button
              onClick={() => scrollToSection('contact')}
              className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={18} />
              <span>Get In Touch</span>
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute -bottom-26 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-gray-500"
            >
              <ArrowDown size={24} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
