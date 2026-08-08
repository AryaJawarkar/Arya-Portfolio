'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowDown, RotateCw } from 'lucide-react';
import type { ChatMessage, ChatStatus } from '@/types/chat';
import type { ChatErrorState } from '@/hooks/use-ask-arya';
import MessageBubble from './MessageBubble';
import ThinkingIndicator from './ThinkingIndicator';
import EmptyState from './EmptyState';

const PIN_TOLERANCE = 48;

export default function MessageList({
  messages,
  status,
  streamingText,
  error,
  onPick,
  onRetry,
}: {
  messages: ChatMessage[];
  status: ChatStatus;
  streamingText: string;
  error: ChatErrorState | null;
  onPick: (q: string) => void;
  onRetry: () => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  const [showJump, setShowJump] = useState(false);

  const scrollToBottom = useCallback((smooth = false) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  const onScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < PIN_TOLERANCE;
    setShowJump(!pinned.current);
  }, []);

  const lastRole = messages[messages.length - 1]?.role;

  // `behavior: 'auto'` on purpose — smooth scrolling fights a 60fps content change and stutters.
  // Sending re-pins unconditionally: the user always wants to see their own message. The
  // resulting scroll fires onScroll, which clears the jump button on its own.
  useEffect(() => {
    if (lastRole === 'user') pinned.current = true;
    if (pinned.current) scrollToBottom(false);
  }, [messages, streamingText, status, lastRole, scrollToBottom]);

  const isThinking = status === 'thinking';
  const isStreaming = status === 'streaming' && streamingText.length > 0;

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={listRef}
        onScroll={onScroll}
        className="h-full space-y-4 overflow-y-auto overscroll-contain px-4 py-3 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]"
      >
        {messages.length === 0 && status === 'idle' && <EmptyState onPick={onPick} />}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {/*
          `mode="wait"` so the skeleton finishes exiting before the streaming bubble enters.
          The switch is driven by revealed text being non-empty, not by the first network
          delta — otherwise the skeleton vanishes and leaves an empty bubble for a frame.
        */}
        <AnimatePresence mode="wait">
          {isThinking && <ThinkingIndicator key="thinking" />}
          {isStreaming && (
            <MessageBubble
              key="streaming"
              streaming
              message={{
                id: 'streaming',
                role: 'assistant',
                content: streamingText,
                createdAt: 0, // not rendered; kept 0 so this object stays pure across renders
              }}
            />
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5"
          >
            <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-400/80" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-red-400/90">{error.message}</p>
              {error.retryable && (
                <button
                  onClick={onRetry}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RotateCw size={12} />
                  Try again
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/*
          Screen readers get the completed message only. Putting aria-live on the streaming
          text itself makes them announce every single frame.
        */}
        <div className="sr-only" aria-live="polite">
          {status === 'idle' && messages[messages.length - 1]?.role === 'assistant'
            ? messages[messages.length - 1].content
            : ''}
        </div>
      </div>

      <AnimatePresence>
        {showJump && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => {
              pinned.current = true;
              setShowJump(false);
              scrollToBottom(true);
            }}
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-black/80 px-3 py-1.5 text-xs text-gray-300 shadow-lg backdrop-blur-md transition-colors hover:text-white"
          >
            <ArrowDown size={12} />
            Jump to latest
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
