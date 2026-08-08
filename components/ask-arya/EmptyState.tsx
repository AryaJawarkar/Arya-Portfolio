'use client';

import { motion } from 'framer-motion';
import { STARTER_QUESTIONS } from '@/lib/chat-config';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-start px-1 py-4"
    >
      <motion.div
        variants={item}
        className="mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.h3 variants={item} className="text-lg font-semibold text-white">
        Ask about Arya
      </motion.h3>
      <motion.p variants={item} className="mt-1.5 text-sm leading-relaxed text-gray-400">
        His experience, stack, or whether he&apos;s a fit for your role. Answers are direct
        and grounded in his actual work &mdash; including the gaps.
      </motion.p>

      <motion.div variants={item} className="mt-5 flex w-full flex-col gap-2">
        {STARTER_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-left text-sm text-gray-300 transition-all duration-200 hover:border-blue-500/30 hover:bg-white/10 hover:text-white"
          >
            {q}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}
