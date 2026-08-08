'use client';

import { useRef } from 'react';
import { MAX_H, MAX_W, MIN_H, MIN_W, type Size } from '@/hooks/use-panel-geometry';

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/**
 * Bottom-right corner grip.
 *
 * Bottom-right specifically: the panel is anchored top-left, so growing it here never needs
 * x/y compensation. Anchoring the other way would mean adjusting position on every move.
 */
export default function ResizeGrip({
  current,
  onResize,
  onCommit,
}: {
  current: Size;
  onResize: (size: Size) => void;
  onCommit: () => void;
}) {
  const origin = useRef({ px: 0, py: 0, w: 0, h: 0 });
  const frame = useRef<number | null>(null);

  return (
    <div
      role="separator"
      aria-label="Resize chat window"
      className="group absolute right-0 bottom-0 z-10 h-5 w-5 cursor-nwse-resize"
      style={{ touchAction: 'none' }}
      onPointerDown={(e) => {
        e.preventDefault(); // don't begin a text selection
        // Pointer capture is essential: outrun the 20px grip without it and the browser
        // stops delivering pointermove, so the resize stutters or dies mid-drag.
        e.currentTarget.setPointerCapture(e.pointerId);
        origin.current = { px: e.clientX, py: e.clientY, w: current.w, h: current.h };
      }}
      onPointerMove={(e) => {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
        if (frame.current !== null) return; // at most one update per frame
        const { clientX, clientY } = e;
        frame.current = requestAnimationFrame(() => {
          frame.current = null;
          const { px, py, w, h } = origin.current;
          onResize({
            w: clamp(w + (clientX - px), MIN_W, Math.min(MAX_W, window.innerWidth - 24)),
            h: clamp(h + (clientY - py), MIN_H, Math.min(MAX_H, window.innerHeight - 24)),
          });
        });
      }}
      onPointerUp={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        if (frame.current !== null) {
          cancelAnimationFrame(frame.current);
          frame.current = null;
        }
        onCommit(); // persist to localStorage on release only
      }}
    >
      <span className="absolute right-1 bottom-1 h-2 w-2 rounded-br-sm border-r-2 border-b-2 border-white/25 transition-colors group-hover:border-blue-400/70" />
    </div>
  );
}
