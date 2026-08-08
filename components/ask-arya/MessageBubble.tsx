'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { ChatMessage } from '@/types/chat';
import Markdownish from './Markdownish';

export default function MessageBubble({
  message,
  streaming,
}: {
  message: ChatMessage;
  streaming?: boolean;
}) {
  if (message.role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] rounded-2xl rounded-br-md border border-blue-500/25 bg-blue-500/15 px-3.5 py-2.5 text-[0.9rem] leading-relaxed whitespace-pre-wrap text-white">
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3"
    >
      <div className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-violet-500" />
      <div className="min-w-0 flex-1">
        <Markdownish text={message.content} streaming={streaming} />

        {message.aborted && (
          <p className="mt-1.5 text-xs text-gray-500">Stopped</p>
        )}
        {message.error && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400/80">
            <AlertTriangle size={12} />
            {message.error}
          </p>
        )}
      </div>
    </motion.div>
  );
}
