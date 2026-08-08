'use client';

import { Eraser, X } from 'lucide-react';

export default function ChatHeader({
  onClose,
  onClear,
  canClear,
  draggable,
  onPointerDown,
}: {
  onClose: () => void;
  onClear: () => void;
  canClear: boolean;
  draggable?: boolean;
  onPointerDown?: (e: React.PointerEvent<HTMLElement>) => void;
}) {
  return (
    <header
      onPointerDown={onPointerDown}
      // touch-action: none is required or touch drag never starts — the browser claims the
      // gesture for scrolling first.
      style={draggable ? { touchAction: 'none' } : undefined}
      className={`flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 select-none ${
        draggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-violet-500" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Ask Arya</p>
          <p className="truncate text-[11px] text-gray-500">
            Answers straight from his portfolio
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {canClear && (
          <button
            onClick={onClear}
            aria-label="Clear conversation"
            title="Clear conversation"
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Eraser size={14} />
          </button>
        )}
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </header>
  );
}
