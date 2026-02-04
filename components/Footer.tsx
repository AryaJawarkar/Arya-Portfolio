'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { personalInfo } from '@/data/mockData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={scrollToTop}
              className="text-2xl font-bold mb-2 hover:text-blue-400 transition-colors duration-300 cursor-pointer"
            >
              <span className="text-white">Arya</span>
              <span className="text-blue-500">.</span>
            </button>
            <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start">
              Built with
              <Heart size={14} className="mx-1 text-red-500" fill="currentColor" />
              by Arya
            </p>
          </motion.div>

          {/* Center: Quick Links */}
          <motion.div
            className="flex items-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <a
              href={`https://${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              GitHub
            </a>
            <a
              href={`https://${personalInfo.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Email
            </a>
          </motion.div>

          {/* Right: Copyright */}
          <motion.div
            className="text-center md:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="text-gray-400 text-sm">
              © {currentYear} {personalInfo.name}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              All rights reserved
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
