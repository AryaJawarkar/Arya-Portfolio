'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAskArya } from '@/hooks/use-ask-arya';
import ChatLauncher from './ChatLauncher';
import ChatPanel from './ChatPanel';

/**
 * The only piece mounted globally. Lives at <body> level in app/layout.tsx, not inside
 * <main>: a `fixed` element nested under any transformed ancestor gets a new containing
 * block, and Hero is full of animated motion.div transforms.
 */
export default function AskAryaWidget() {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const chat = useAskArya();

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <>
      <ChatLauncher ref={launcherRef} open={open} onClick={() => setOpen((v) => !v)} />
      <AnimatePresence>
        {open && <ChatPanel key="panel" chat={chat} onClose={close} />}
      </AnimatePresence>
    </>
  );
}
