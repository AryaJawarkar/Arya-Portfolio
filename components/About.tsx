'use client';

import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Code2, Lightbulb, Zap } from 'lucide-react';
import { about } from '@/data/mockData';
import Reveal, { revealItem } from '@/components/motion/Reveal';
import SectionHeading from '@/components/motion/SectionHeading';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Hand-off from the hero, using the same move as Skills → Experience: the
  // negative top margin pulls this section up over the last viewport of the
  // pinned hero, so it rises over the 3D scene instead of the scene simply
  // scrolling away and leaving a seam.
  const { scrollYProgress: entrance } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 35%'],
  });
  const riseIn = useTransform(entrance, [0, 1], [70, 0]);
  const growIn = useTransform(entrance, [0, 1], [0.97, 1]);
  const fade = useTransform(entrance, [0, 0.45], [0, 1]);

  const highlights = [
    { icon: Code2, text: about.highlights[0] },
    { icon: Lightbulb, text: about.highlights[1] },
    { icon: Zap, text: about.highlights[2] },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 py-32 bg-black overflow-x-hidden lg:-mt-[100vh]"
    >
      <motion.div
        className="max-w-6xl mx-auto px-6"
        style={
          reduced ? undefined : { y: riseIn, scale: growIn, opacity: fade }
        }
      >
        <SectionHeading className="mb-16">{about.title}</SectionHeading>

        <div className="grid md:grid-cols-2 gap-12 mt-16">
          {/* Description */}
          <Reveal className="space-y-6" from="up" stagger={0.15}>
            {about.description.map((paragraph, index) => (
              <motion.p
                key={index}
                className="text-lg text-gray-400 leading-relaxed"
                variants={revealItem}
              >
                {paragraph}
              </motion.p>
            ))}
          </Reveal>

          {/* Highlights */}
          <Reveal className="space-y-6" from="right" stagger={0.15} delay={0.1}>
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 p-6 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-colors duration-300 group"
                variants={revealItem}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-lg flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-violet-500/30 transition-all duration-300">
                  <highlight.icon size={24} className="text-blue-400" />
                </div>
                <p className="text-gray-300 leading-relaxed pt-2">
                  {highlight.text}
                </p>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
