'use client';

import { useEffect } from 'react';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import { usePanelGeometry } from '@/hooks/use-panel-geometry';
import type { useAskArya } from '@/hooks/use-ask-arya';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import Composer from './Composer';
import ResizeGrip from './ResizeGrip';
import MobileSheet from './MobileSheet';

type Chat = ReturnType<typeof useAskArya>;

export default function ChatPanel({ chat, onClose }: { chat: Chat; onClose: () => void }) {
  const dragControls = useDragControls();
  const { ready, isMobile, size, position, positionEpoch, resize, commitPosition, commitSize } =
    usePanelGeometry();

  // Motion values are the source of truth for the live position: framer-motion writes to
  // them during a drag, and mirroring that into React state would cause drift.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Sync only when position changes from outside a drag (initial hydration, viewport clamp).
  useEffect(() => {
    x.set(position.x);
    y.set(position.y);
  }, [positionEpoch, position.x, position.y, x, y]);

  if (!ready) return null;
  if (isMobile) return <MobileSheet chat={chat} onClose={onClose} />;

  return (
    // Full-viewport constraint box. Must stay transform-free — framer-motion measures its
    // bounding box for dragConstraints, and a transform would skew the drag coordinates.
    <div className="pointer-events-none fixed inset-0 z-[60]">
      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={{
          left: 8,
          top: 8,
          right: Math.max(8, window.innerWidth - size.w - 8),
          bottom: Math.max(8, window.innerHeight - size.h - 8),
        }}
        onDragEnd={() => commitPosition({ x: x.get(), y: y.get() })}
        style={{ x, y, width: size.w, height: size.h }}
        // x/y belong solely to drag — the enter/exit animation uses scale and opacity only.
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        role="dialog"
        aria-modal={false}
        aria-label="Ask Arya chat"
        className="pointer-events-auto absolute top-0 left-0 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/85 shadow-2xl shadow-blue-500/10 backdrop-blur-md"
      >
        <ChatHeader
          draggable
          onPointerDown={(e) => {
            // Without this guard, clicking Close starts a drag first and the click feels mushy.
            if ((e.target as HTMLElement).closest('button')) return;
            dragControls.start(e);
          }}
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

        <Composer
          autoFocus
          onSend={chat.send}
          onStop={chat.stop}
          onClear={chat.clear}
          busy={chat.busy}
          limitReached={chat.limitReached}
        />

        <ResizeGrip current={size} onResize={resize} onCommit={() => commitSize({ x: x.get(), y: y.get() })} />
      </motion.div>
    </div>
  );
}
