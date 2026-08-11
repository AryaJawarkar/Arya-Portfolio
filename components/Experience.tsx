'use client';

import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { education, experience } from '@/data/mockData';
import Reveal, { revealItem } from '@/components/motion/Reveal';
import SectionHeading from '@/components/motion/SectionHeading';

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // The timeline rail draws itself in step with the scroll position, so the
  // line literally grows as you read down the roles.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 60%'],
  });
  const railScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Hand-off from the pinned Skills board.
  //
  // The negative top margin pulls this section up over the last viewport of the
  // Skills section — the stretch the sticky child still has to travel through
  // after its scroll progress hits 1. Left alone that stretch is blank; here the
  // section rises over it instead, so the board recedes and this slides in as one
  // continuous movement with nothing empty in between.
  const { scrollYProgress: entrance } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 35%'],
  });
  const riseIn = useTransform(entrance, [0, 1], [70, 0]);
  const growIn = useTransform(entrance, [0, 1], [0.97, 1]);
  const fadeIn = useTransform(entrance, [0, 0.45], [0, 1]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative z-10 pt-24 pb-32 bg-gradient-to-b from-gray-900 to-black overflow-x-hidden lg:-mt-[100vh]"
    >
      <motion.div
        className="max-w-6xl mx-auto px-6"
        style={
          reduced ? undefined : { y: riseIn, scale: growIn, opacity: fadeIn }
        }
      >
        <SectionHeading className="mb-16">
          Experience &amp; Education
        </SectionHeading>

        <div className="space-y-12 mt-16">
          {/* Work Experience */}
          <div>
            <Reveal from="up">
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <Briefcase size={24} className="mr-3 text-blue-400" />
                Work Experience
              </h3>
            </Reveal>

            <div className="relative space-y-8" ref={timelineRef}>
              {/* Rail track + the portion drawn so far */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10" />
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-blue-500 to-violet-500"
                style={{ scaleY: railScale }}
              />

              {experience.map((exp) => (
                <Reveal key={exp.id} from="right" className="relative pl-8">
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute -left-[7px] top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-black"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  />

                  <motion.div
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-300"
                    whileHover={{ x: 6 }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">
                          {exp.title}
                        </h4>
                        <p className="text-blue-400 font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-gray-400 text-sm mb-1">
                          <Calendar size={14} className="mr-1" />
                          {exp.duration}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin size={14} className="mr-1" />
                          {exp.location} • {exp.type}
                        </div>
                      </div>
                    </div>

                    {/* Responsibilities stream in line by line */}
                    <motion.ul
                      className="space-y-3 mb-6"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-60px' }}
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.06 } },
                      }}
                    >
                      {exp.responsibilities.map((resp, index) => (
                        <motion.li
                          key={index}
                          className="text-gray-400 text-sm leading-relaxed flex items-start"
                          variants={revealItem}
                        >
                          <span className="text-blue-400 mr-2 mt-1">▸</span>
                          <span>{resp}</span>
                        </motion.li>
                      ))}
                    </motion.ul>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <Reveal from="up">
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <svg
                  className="w-6 h-6 mr-3 text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
                Education
              </h3>
            </Reveal>

            <Reveal className="space-y-6" stagger={0.12} tilt>
              {education.map((edu) => (
                <motion.div
                  key={edu.id}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-300"
                  variants={revealItem}
                  whileHover={{ scale: 1.01, x: 4 }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        {edu.degree}
                      </h4>
                      <p className="text-violet-400">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">
                        {edu.duration}
                      </div>
                      {edu.cgpa && (
                        <div className="text-blue-400 text-sm font-medium mt-1">
                          CGPA: {edu.cgpa}
                        </div>
                      )}
                    </div>
                  </div>
                  {edu.coursework.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {edu.coursework.map((course, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-300"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </Reveal>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Experience;
