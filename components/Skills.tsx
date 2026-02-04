'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { skills } from '@/data/mockData';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const skillCategories = [
    {
      title: 'Frontend',
      items: skills.frontend,
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      title: 'Styling & UI',
      items: skills.styling,
      gradient: 'from-blue-500/20 to-violet-500/20',
    },
    {
      title: 'Tooling & Dev',
      items: skills.tooling,
      gradient: 'from-cyan-500/20 to-blue-500/20',
    },
    {
      title: 'APIs & Integration',
      items: skills.apis,
      gradient: 'from-violet-500/20 to-blue-500/20',
    },
    {
      title: 'Fundamentals',
      items: skills.fundamentals,
      gradient: 'from-purple-500/20 to-violet-500/20',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const, // ← premium easeOut curve
    },
    },
  };

  return (
    <section
      id="skills"
      className="py-32 bg-gradient-to-b from-black to-gray-900"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Skills & Technologies
          </h2>
          <p className="text-xl text-gray-400 mb-16 max-w-2xl">
            A comprehensive toolkit built through hands-on experience and
            continuous learning.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              className="group p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div
                className={`inline-block px-4 py-2 bg-gradient-to-r ${category.gradient} rounded-lg mb-6`}
              >
                <h3 className="text-lg font-semibold text-white">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.items.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-sm text-gray-300 transition-all duration-200 cursor-default"
                    whileHover={{ scale: 1.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
