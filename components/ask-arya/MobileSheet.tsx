'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { useAskArya } from '@/hooks/use-ask-arya';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import Composer from './Composer';

type Chat = ReturnType<typeof useAskArya>;

/**
 * Below 768px the panel becomes a full-screen sheet with no drag and no resize grip.
 * A 340px draggable window on a 375px phone is unusable, and there's nowhere to drag it to.
 */
export default function MobileSheet({ chat, onClose }: { chat: Chat; onClose: () => void }) {
  // Lock the page behind the sheet so it can't scroll under the user's fingers.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      role="dialog"
      aria-modal
      aria-label="Ask Arya chat"
      className="fixed inset-0 z-[60] flex flex-col border-t border-white/10 bg-black/95 backdrop-blur-md"
    >
      <ChatHeader
        onClose={onClose}
        onClear={chat.clear}
        canClear={chat.messages.length > 0}
      />

      <MessageList
        messages={chat.messages}
        status={chat.status}
        streamingText={chat.streamingText}
        error={chat.error}
        onPick={chat.send}
        onRetry={chat.retry}
      />

      {/* No autoFocus on mobile — the keyboard springing up over the empty state is jarring. */}
      <Composer
        onSend={chat.send}
        onStop={chat.stop}
        onClear={chat.clear}
        busy={chat.busy}
        limitReached={chat.limitReached}
      />
    </motion.div>
  );
}
