'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CHAT_CONFIG } from '@/lib/chat-config';

export const MIN_W = 340;
export const MIN_H = 420;
export const MAX_W = 720;
export const MAX_H = 900;
const DEFAULT_SIZE = { w: 400, h: 600 };
const EDGE = 16;
/** Matches Tailwind's `md`, which the rest of the site already breaks at. */
const MOBILE_BP = 768;

const GEOMETRY_KEY = `${CHAT_CONFIG.storageKey}:geometry`;

export type Size = { w: number; h: number };
export type Position = { x: number; y: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

function clampSize(s: Size): Size {
  return {
    w: clamp(s.w, MIN_W, Math.min(MAX_W, Math.max(MIN_W, window.innerWidth - EDGE * 2))),
    h: clamp(s.h, MIN_H, Math.min(MAX_H, Math.max(MIN_H, window.innerHeight - EDGE * 2))),
  };
}

function clampPosition(p: Position, s: Size): Position {
  return {
    x: clamp(p.x, 8, Math.max(8, window.innerWidth - s.w - 8)),
    y: clamp(p.y, 8, Math.max(8, window.innerHeight - s.h - 8)),
  };
}

function readStoredGeometry(): { size: Size; position: Position } {
  let storedSize: Size = DEFAULT_SIZE;
  let storedPos: Position | null = null;
  try {
    const raw = localStorage.getItem(GEOMETRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { size?: Size; pos?: Position };
      if (parsed.size) storedSize = parsed.size;
      if (parsed.pos) storedPos = parsed.pos;
    }
  } catch {
    // Corrupt or disabled storage — fall through to defaults.
  }

  const size = clampSize(storedSize);
  const position = clampPosition(
    storedPos ?? {
      // Default: bottom-right, clear of the launcher.
      x: window.innerWidth - size.w - EDGE,
      y: window.innerHeight - size.h - EDGE - 56,
    },
    size,
  );
  return { size, position };
}

/**
 * Size/position state for the desktop chat panel.
 *
 * State is seeded lazily from localStorage rather than in an effect. That's safe here only
 * because the panel is mounted on user interaction, long after hydration — it never renders
 * on the server. `ready` guards the SSR case anyway, since reading `window` during a server
 * render would throw.
 */
export function usePanelGeometry() {
  const ready = typeof window !== 'undefined';

  const [isMobile, setIsMobile] = useState(
    () => ready && window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`).matches,
  );
  const [geometry, setGeometry] = useState(() =>
    ready ? readStoredGeometry() : { size: DEFAULT_SIZE, position: { x: 0, y: 0 } },
  );
  /** Bumped whenever position changes from outside a drag, so the panel can re-sync. */
  const [positionEpoch, setPositionEpoch] = useState(0);

  const { size, position } = geometry;

  // Mirrors `size` so resize/persist callbacks can read the latest value without being
  // re-created on every resize frame. Written in an effect, never during render.
  const sizeRef = useRef(size);
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`);
    const applyMobile = () => setIsMobile(mq.matches);
    mq.addEventListener('change', applyMobile);
    return () => mq.removeEventListener('change', applyMobile);
  }, []);

  // Re-clamp on viewport resize so the panel can never be left off-screen.
  useEffect(() => {
    if (!ready) return;
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setGeometry((g) => {
          const nextSize = clampSize(g.size);
          return { size: nextSize, position: clampPosition(g.position, nextSize) };
        });
        setPositionEpoch((n) => n + 1);
      }, 120);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, [ready]);

  const persist = useCallback((s: Size, p: Position) => {
    try {
      localStorage.setItem(GEOMETRY_KEY, JSON.stringify({ size: s, pos: p }));
    } catch {
      // Persistence is a nicety.
    }
  }, []);

  /** Live resize from the grip. Not persisted until the pointer is released. */
  const resize = useCallback(
    (s: Size) => setGeometry((g) => ({ ...g, size: clampSize(s) })),
    [],
  );

  /** Called on drag end — the panel owns x/y during a drag via motion values. */
  const commitPosition = useCallback(
    (p: Position) => {
      const next = clampPosition(p, sizeRef.current);
      setGeometry((g) => ({ ...g, position: next }));
      persist(sizeRef.current, next);
    },
    [persist],
  );

  /** Called when the resize grip is released. */
  const commitSize = useCallback(
    (p: Position) => persist(sizeRef.current, p),
    [persist],
  );

  return {
    ready,
    isMobile,
    size,
    position,
    positionEpoch,
    resize,
    commitPosition,
    commitSize,
  };
}
