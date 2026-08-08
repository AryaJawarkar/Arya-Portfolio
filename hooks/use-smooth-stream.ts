'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Decouples "text received from the network" from "text shown on screen".
 *
 * Groq pushes multi-token chunks in bursts, so appending deltas directly makes 15 characters
 * appear at once and then nothing for 80ms — visibly chunky. Instead, deltas go into a buffer
 * and a rAF loop drains it at a rate proportional to the backlog: smooth when the stream
 * trickles, fast enough that it never falls behind, and instant once upstream is finished.
 */
export function useSmoothStream() {
  const [text, setText] = useState('');

  /** Characters received but not yet revealed. */
  const buffer = useRef('');
  /** Mirror of `text`, so callers can read the current value synchronously. */
  const revealed = useRef('');
  const rafId = useRef<number | null>(null);
  const upstreamDone = useRef(false);

  /** Resolvers waiting for the queue to fully drain. */
  const drainWaiters = useRef<((full: string) => void)[]>([]);

  const cancelLoop = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  const settleDrain = useCallback(() => {
    const waiters = drainWaiters.current;
    drainWaiters.current = [];
    waiters.forEach((resolve) => resolve(revealed.current));
  }, []);

  // The loop re-schedules itself, so the recursion goes through a ref rather than the
  // callback referencing its own binding.
  const tickRef = useRef<() => void>(() => {});

  const tick = useCallback(() => {
    rafId.current = null;
    const pending = buffer.current.length;

    if (pending === 0) {
      // Nothing to reveal. Keep spinning only while more may still arrive.
      if (upstreamDone.current) {
        settleDrain();
        return;
      }
      rafId.current = requestAnimationFrame(() => tickRef.current());
      return;
    }

    // ~2 chars/frame floor (~120 cps) and an exponential-decay drain above it: a 400-char
    // backlog clears in roughly 20 frames while a trickle still moves. Tune the divisor.
    const take =
      upstreamDone.current && pending < 24 ? pending : Math.max(2, Math.ceil(pending / 8));

    revealed.current += buffer.current.slice(0, take);
    buffer.current = buffer.current.slice(take);
    setText(revealed.current);
    rafId.current = requestAnimationFrame(() => tickRef.current());
  }, [settleDrain]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const schedule = useCallback(() => {
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(() => tickRef.current());
    }
  }, []);

  const push = useCallback(
    (delta: string) => {
      buffer.current += delta;
      schedule();
    },
    [schedule],
  );

  /**
   * Upstream finished sending. Resolves with the complete text once the queue has drained,
   * so the tail of every answer still reveals smoothly instead of appearing all at once.
   */
  const finish = useCallback(() => {
    upstreamDone.current = true;
    if (buffer.current.length === 0) {
      cancelLoop();
      return Promise.resolve(revealed.current);
    }
    schedule();
    return new Promise<string>((resolve) => {
      drainWaiters.current.push(resolve);
    });
  }, [cancelLoop, schedule]);

  /**
   * Reveal everything immediately and return the complete text.
   *
   * The Stop button must call this, otherwise received-but-unrevealed characters are thrown
   * away and Stop looks like it deleted part of the answer.
   */
  const flush = useCallback(() => {
    cancelLoop();
    upstreamDone.current = true;
    revealed.current += buffer.current;
    buffer.current = '';
    setText(revealed.current);
    settleDrain(); // never leave a finish() promise hanging
    return revealed.current;
  }, [cancelLoop, settleDrain]);

  const reset = useCallback(() => {
    cancelLoop();
    buffer.current = '';
    revealed.current = '';
    upstreamDone.current = false;
    setText('');
    settleDrain();
  }, [cancelLoop, settleDrain]);

  useEffect(() => cancelLoop, [cancelLoop]);

  return { text, push, finish, flush, reset };
}
