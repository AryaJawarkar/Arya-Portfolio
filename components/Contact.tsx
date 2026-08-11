'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Send } from 'lucide-react';
import { contact, personalInfo } from '@/data/mockData';
import Reveal, { revealItem } from '@/components/motion/Reveal';
import SectionHeading from '@/components/motion/SectionHeading';

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: personalInfo.linkedin.replace('linkedin.com/in/', ''),
      href: `https://${personalInfo.linkedin}`,
      gradient: 'from-blue-500/20 to-violet-500/20',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: personalInfo.github.replace('github.com/', ''),
      href: `https://${personalInfo.github}`,
      gradient: 'from-violet-500/20 to-purple-500/20',
    },
  ];

  return (
    <section id="contact" className="py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="flex flex-col items-center">
          <SectionHeading>{contact.title}</SectionHeading>
        </div>

        <Reveal from="up" delay={0.15}>
          <p className="text-xl text-gray-400 mt-6 mb-12 max-w-2xl mx-auto leading-relaxed">
            {contact.description}
          </p>
        </Reveal>

        {/* Contact Methods */}
        <Reveal
          className="grid md:grid-cols-3 gap-6 mb-12"
          stagger={0.12}
          delay={0.1}
          tilt
        >
          {contactMethods.map((method, index) => (
            <motion.a
              key={index}
              href={method.href}
              target={method.label !== 'Email' ? '_blank' : undefined}
              rel={method.label !== 'Email' ? 'noopener noreferrer' : undefined}
              className="group p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors duration-300"
              variants={revealItem}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${method.gradient} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <method.icon size={24} className="text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">{method.label}</h3>
              <p className="text-gray-400 text-sm break-all">{method.value}</p>
            </motion.a>
          ))}
        </Reveal>

        {/* Primary CTA */}
        <Reveal from="up" delay={0.3}>
          <motion.a
            href={`mailto:${personalInfo.email}`}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-black font-semibold rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={20} />
            <span>{contact.cta}</span>
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
