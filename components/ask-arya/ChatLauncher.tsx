'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ChatLauncher = forwardRef<HTMLButtonElement, { open: boolean; onClick: () => void }>(
  function ChatLauncher({ open, onClick }, ref) {
    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        aria-label={open ? 'Close Ask Arya' : 'Open Ask Arya'}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.8, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 400, damping: 24 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group fixed right-6 bottom-6 z-[55] flex items-center gap-2.5 rounded-full border border-white/15 bg-black/85 py-3 pr-5 pl-3.5 shadow-lg shadow-blue-500/10 backdrop-blur-md transition-colors duration-200 hover:border-blue-500/40"
      >
        {/* Ambient glow, matching the Hero's blurred orbs. */}
        <span className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-blue-600/20 blur-2xl transition-opacity duration-300 group-hover:bg-blue-600/30" />

        <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500">
          <Sparkles size={13} className="text-white" />
        </span>
        <span className="text-sm font-medium text-white">Ask Arya</span>
      </motion.button>
    );
  },
);

export default ChatLauncher;
