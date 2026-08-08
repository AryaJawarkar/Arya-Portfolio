'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { CHAT_CONFIG } from '@/lib/chat-config';
import { personalInfo } from '@/data/mockData';

const MAX_TEXTAREA_H = 120;

export default function Composer({
  onSend,
  onStop,
  onClear,
  busy,
  limitReached,
  autoFocus,
}: {
  onSend: (text: string) => void;
  onStop: () => void;
  onClear: () => void;
  busy: boolean;
  limitReached: boolean;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  // Auto-grow up to a cap.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_H)}px`;
  }, [value]);

  if (limitReached) {
    return (
      <div className="shrink-0 border-t border-white/10 px-4 py-3.5">
        <p className="text-sm text-gray-400">
          That&apos;s the question limit for this session. For anything else, email{' '}
          <a
            href={`mailto:${personalInfo.email}`}
            className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
          >
            {personalInfo.email}
          </a>
          .
        </p>
        <button
          onClick={onClear}
          className="mt-2.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          Start over
        </button>
      </div>
    );
  }

  const trimmed = value.trim();
  const overLimit = value.length > CHAT_CONFIG.maxInputChars;
  const canSend = !!trimmed && !overLimit && !busy;
  const showCounter = value.length > CHAT_CONFIG.maxInputChars * 0.8;

  const submit = () => {
    if (!canSend) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <div className="shrink-0 border-t border-white/10 p-3">
      <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-colors focus-within:border-blue-500/40">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // isComposing guard: without it, an IME user pressing Enter to confirm a
            // candidate would send the message instead.
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask about his experience, stack, or fit…"
          className="max-h-[120px] flex-1 resize-none bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
        />

        <button
          type="button"
          onClick={busy ? onStop : submit}
          disabled={!busy && !canSend}
          aria-label={busy ? 'Stop generating' : 'Send message'}
          className={`mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
            busy
              ? 'bg-white/10 text-white hover:bg-white/20'
              : canSend
                ? 'bg-white text-black hover:bg-gray-200'
                : 'cursor-not-allowed bg-white/10 text-gray-600'
          }`}
        >
          {busy ? <Square size={12} fill="currentColor" /> : <ArrowUp size={15} />}
        </button>
      </div>

      {showCounter && (
        <p
          className={`mt-1.5 text-right text-[11px] ${
            overLimit ? 'text-red-400/80' : 'text-gray-500'
          }`}
        >
          {value.length} / {CHAT_CONFIG.maxInputChars}
        </p>
      )}
    </div>
  );
}
