'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github, Sparkles } from 'lucide-react';
import { projects } from '@/data/mockData';
import Reveal from '@/components/motion/Reveal';
import SectionHeading from '@/components/motion/SectionHeading';

type Project = (typeof projects)[number];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Cursor-tracked spotlight. Kept in motion values so moving the mouse never
  // triggers a React re-render.
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useTransform(
    [mx, my],
    ([x, y]) =>
      `radial-gradient(420px circle at ${x}% ${y}%, rgba(96,165,250,0.10), transparent 70%)`
  );

  // Each card drifts at a slightly different rate for a layered parallax.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [index % 2 ? 40 : 70, -40]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <motion.div ref={cardRef} style={{ y }}>
      <Reveal from="up" tilt delay={index * 0.1}>
        <motion.div
          className="group relative bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 hover:border-white/20 overflow-hidden transition-colors duration-500"
          onMouseMove={onMove}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Cursor spotlight */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: spotlight }}
          />

          <div className="relative p-8">
            {/* Project Type */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  project.type === 'real'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                }`}
              >
                <Sparkles size={12} />
                <span>
                  {project.type === 'real' ? 'Production' : 'Concept'}
                </span>
              </span>

              {/* Links */}
              <div className="flex items-center space-x-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="View on GitHub"
                  >
                    <Github size={20} />
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="View live project"
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Impact */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                Key Impact:
              </h4>
              <motion.ul
                className="space-y-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
              >
                {project.impact.map((item, i) => (
                  <motion.li
                    key={i}
                    className="text-sm text-gray-400 flex items-start"
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <span className="text-blue-400 mr-2">•</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </Reveal>
    </motion.div>
  );
}

const Projects = () => {
  return (
    <section id="projects" className="py-32 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading>Featured Projects</SectionHeading>

        <Reveal from="up" delay={0.15}>
          <p className="text-xl text-gray-400 mt-8 mb-16 max-w-2xl">
            A selection of work showcasing problem-solving, technical depth, and
            attention to detail.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
