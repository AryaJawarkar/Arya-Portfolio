'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Lightbulb, Zap } from 'lucide-react';
import { about } from '@/data/mockData';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const highlights = [
    { icon: Code2, text: about.highlights[0] },
    { icon: Lightbulb, text: about.highlights[1] },
    { icon: Zap, text: about.highlights[2] },
  ];

  return (
    <section id="about" className="py-32 bg-black" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Title */}
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-white mb-16 tracking-tight"
            variants={itemVariants}
          >
            {about.title}
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Description */}
            <div className="space-y-6">
              {about.description.map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="text-lg text-gray-400 leading-relaxed"
                  variants={itemVariants}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Highlights */}
            <div className="space-y-6">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
                  variants={itemVariants}
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
