'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CHAT_CONFIG } from '@/lib/chat-config';
import type { ChatErrorCode, ChatMessage, ChatStatus, StreamFrame } from '@/types/chat';
import { useSmoothStream } from './use-smooth-stream';

const SESSION_KEY = `${CHAT_CONFIG.storageKey}:session`;
/** Groq's TTFT can beat 200ms; a loader that flashes and vanishes reads as a glitch. */
const MIN_THINKING_MS = 350;

export interface ChatErrorState {
  code: ChatErrorCode;
  message: string;
  retryable: boolean;
}

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function useAskArya() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<ChatErrorState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const stream = useSmoothStream();

  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const limitReached = userMessageCount >= CHAT_CONFIG.maxUserMessagesPerSession;
  const busy = status === 'thinking' || status === 'streaming';

  // Hydrate from sessionStorage after mount, never during render (hydration mismatch).
  // sessionStorage rather than localStorage on purpose: a conversation from last week
  // reappearing is worse than starting fresh.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setMessages(parsed as ChatMessage[]);
      }
    } catch {
      // Corrupt or disabled storage — start fresh.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    } catch {
      // Quota or private mode — persistence is a nicety, not a requirement.
    }
  }, [messages, hydrated]);

  const commitAssistant = useCallback(
    (content: string, extra?: Partial<ChatMessage>) => {
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: 'assistant', content, createdAt: Date.now(), ...extra },
      ]);
      stream.reset();
    },
    [stream],
  );

  const run = useCallback(
    async (history: ChatMessage[]) => {
      const controller = new AbortController();
      abortRef.current = controller;
      stream.reset();
      setError(null);
      setStatus('thinking');

      const startedAt = Date.now();
      let sawFirstDelta = false;
      let thinkingTimer: ReturnType<typeof setTimeout> | null = null;

      /** Never feed a truncated or failed answer back as context. */
      const payload = history
        .filter((m) => !m.error && !m.aborted)
        .slice(-CHAT_CONFIG.maxHistoryMessages)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: payload }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => null);
          const code = (body?.code as ChatErrorCode) ?? 'server';
          throw Object.assign(new Error(body?.message ?? 'Something went wrong.'), { code });
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() ?? ''; // keep the trailing partial line

          for (const line of lines) {
            if (!line.trim()) continue;
            let frame: StreamFrame;
            try {
              frame = JSON.parse(line) as StreamFrame;
            } catch {
              continue;
            }

            if (frame.t === 'delta') {
              if (!sawFirstDelta) {
                sawFirstDelta = true;
                // Hold the loader for its minimum, then let revealed text take over.
                const wait = Math.max(0, MIN_THINKING_MS - (Date.now() - startedAt));
                thinkingTimer = setTimeout(() => {
                  thinkingTimer = null;
                  if (!controller.signal.aborted) setStatus('streaming');
                }, wait);
              }
              stream.push(frame.v);
            } else if (frame.t === 'error') {
              throw Object.assign(new Error(frame.message), {
                code: frame.code,
                partial: true,
              });
            }
          }
        }

        // Wait for the reveal queue to drain so the tail of the answer still animates,
        // rather than snapping into place the moment the network finishes.
        const full = await stream.finish();
        if (controller.signal.aborted) {
          // Stopped while the queue was still draining — keep what was revealed.
          const partial = stream.flush();
          if (partial) commitAssistant(partial, { aborted: true });
          else stream.reset();
          setStatus('idle');
          return;
        }
        commitAssistant(full || "I didn't get a response for that. Try asking again.");
        setStatus('idle');
      } catch (err) {
        // An abort is the user getting what they asked for, not a failure. Treating it as
        // an error here is the classic bug in hand-rolled streaming chat.
        if (controller.signal.aborted) {
          const partial = stream.flush();
          if (partial) commitAssistant(partial, { aborted: true });
          else stream.reset();
          setStatus('idle');
          return;
        }

        const e = err as Error & { code?: ChatErrorCode; partial?: boolean };
        const code: ChatErrorCode = e.code ?? 'network';

        // Keep whatever streamed before the failure — a half answer beats none.
        const partial = stream.flush();
        if (partial) {
          commitAssistant(partial, { error: e.message });
        } else {
          stream.reset();
        }

        setError({
          code,
          message:
            code === 'network'
              ? "Couldn't reach the server. Check your connection and try again."
              : e.message,
          retryable: code !== 'bad_request',
        });
        setStatus('error');
      } finally {
        // Otherwise a fast answer can finish before this fires and flip the UI back to
        // "streaming" after it already went idle, jamming the composer in Stop mode.
        if (thinkingTimer) clearTimeout(thinkingTimer);
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [commitAssistant, stream],
  );

  const send = useCallback(
    (raw: string) => {
      const content = raw.trim().slice(0, CHAT_CONFIG.maxInputChars);
      if (!content || busy || limitReached) return;

      const next: ChatMessage[] = [
        ...messages,
        { id: newId(), role: 'user', content, createdAt: Date.now() },
      ];
      setMessages(next);
      void run(next);
    },
    [busy, limitReached, messages, run],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const retry = useCallback(() => {
    if (busy) return;
    // Drop the failed assistant turn (if any) and re-run the same history.
    const next = [...messages];
    while (next.length && next[next.length - 1].role === 'assistant') next.pop();
    if (!next.length) return;
    setError(null);
    setMessages(next);
    void run(next);
  }, [busy, messages, run]);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    stream.reset();
    setMessages([]);
    setError(null);
    setStatus('idle');
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }, [stream]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return {
    messages,
    status,
    error,
    streamingText: stream.text,
    userMessageCount,
    limitReached,
    busy,
    hydrated,
    send,
    stop,
    retry,
    clear,
  };
}
