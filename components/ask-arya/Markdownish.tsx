'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * A deliberately tiny renderer for the small subset of markdown the system prompt allows:
 * **bold**, *italic*, `code`, and bullet/numbered lists.
 *
 * react-markdown + remark-gfm would be ~60KB gzipped in a portfolio widget's client bundle,
 * and a full parser also drags in a sanitization obligation (raw HTML, javascript: URLs).
 * This handles exactly five constructs, renders React nodes only — never
 * dangerouslySetInnerHTML — and treats anything else as literal text.
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g;

function renderInline(source: string, keyPrefix: string): React.ReactNode[] {
  return source
    .split(INLINE)
    .filter(Boolean)
    .map((part, i) => {
      const key = `${keyPrefix}-${i}`;

      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={key} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={key}
            className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em] text-blue-300"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <em key={key} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      return <React.Fragment key={key}>{part}</React.Fragment>;
    });
}

function Markdownish({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = (at: number) => {
    if (!bullets.length) return;
    const items = bullets;
    bullets = [];
    blocks.push(
      <ul key={`ul-${at}`} className="my-2 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-blue-400" />
            <span>{renderInline(item, `li-${at}-${i}`)}</span>
          </li>
        ))}
      </ul>,
    );
  };

  lines.forEach((line, i) => {
    const bullet = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      return;
    }
    flushBullets(i);
    if (line.trim()) {
      blocks.push(
        <p key={`p-${i}`} className="my-1.5">
          {renderInline(line, `p-${i}`)}
        </p>,
      );
    }
  });
  flushBullets(lines.length);

  return (
    <div className="text-[0.9rem] leading-relaxed text-gray-300 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      {blocks}
      {streaming && (
        <motion.span
          aria-hidden
          className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] rounded-full bg-blue-400 align-middle"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, times: [0, 0.45, 0.5, 1], ease: 'linear' }}
        />
      )}
    </div>
  );
}

/**
 * Note on partial markers: a half-streamed `**bo` has no closing delimiter, so the regex
 * leaves it as literal asterisks for a frame or two and it resolves once the rest arrives.
 * That's the right trade against speculatively closing markers, which flickers formatting
 * on and off as the text streams.
 */
export default React.memo(Markdownish);
