import type { NextRequest } from 'next/server';
import { buildSystemPrompt, GUARD_REMINDER } from '@/lib/prompt';
import { retrieveContext } from '@/lib/retrieval';
import { CHAT_CONFIG } from '@/lib/chat-config';
import { checkRateLimit } from '@/lib/rate-limit';
import type { ChatErrorCode, StreamFrame } from '@/types/chat';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const encoder = new TextEncoder();
const encodeFrame = (frame: StreamFrame) => encoder.encode(JSON.stringify(frame) + '\n');

function errorResponse(code: ChatErrorCode, message: string, status: number) {
  return new Response(JSON.stringify({ t: 'error', code, message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('[ask-arya] GROQ_API_KEY is not set');
    return errorResponse('server', 'Chat is not configured right now.', 500);
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (!checkRateLimit(ip).ok) {
    return errorResponse(
      'rate_limit',
      'Too many questions in a short window. Give it a minute.',
      429,
    );
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return errorResponse('bad_request', 'Malformed request.', 400);
  }

  // Trust nothing from the client: whitelist roles, clamp content length, clamp history.
  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages = incoming
    .filter(
      (m): m is { role: 'user' | 'assistant'; content: string } =>
        !!m &&
        typeof m === 'object' &&
        ((m as { role?: unknown }).role === 'user' ||
          (m as { role?: unknown }).role === 'assistant') &&
        typeof (m as { content?: unknown }).content === 'string',
    )
    .slice(-CHAT_CONFIG.maxHistoryMessages)
    .map((m) => ({ role: m.role, content: m.content.slice(0, CHAT_CONFIG.maxInputChars) }));

  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user' || !last.content.trim()) {
    return errorResponse('bad_request', 'No question provided.', 400);
  }

  const sections = await retrieveContext(last.content);
  const systemPrompt = buildSystemPrompt(sections);

  let upstream: Response;
  try {
    upstream = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: CHAT_CONFIG.model,
        stream: true,
        temperature: CHAT_CONFIG.temperature,
        max_tokens: CHAT_CONFIG.maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
          // Last position, closest to generation — see GUARD_REMINDER in lib/prompt.ts.
          { role: 'system', content: GUARD_REMINDER },
        ],
      }),
      // Propagates a client disconnect/Stop upstream so we don't keep burning tokens.
      signal: req.signal,
    });
  } catch (err) {
    if (req.signal.aborted) return new Response(null, { status: 499 });
    console.error('[ask-arya] groq fetch failed', err);
    return errorResponse('upstream', 'Could not reach the model.', 502);
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    console.error('[ask-arya] groq error', upstream.status, detail.slice(0, 500));
    const rateLimited = upstream.status === 429;
    return errorResponse(
      rateLimited ? 'rate_limit' : 'upstream',
      rateLimited
        ? 'The model is rate limited right now. Try again shortly.'
        : 'The model is unavailable right now.',
      rateLimited ? 429 : 502,
    );
  }

  // Transform Groq's SSE into NDJSON rather than blind-piping it. Costs ~25 lines and buys:
  // Groq's response shape never reaches the browser, a mid-stream failure arrives as a typed
  // error frame instead of a dead socket, and the client parser is JSON.parse per line.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let closed = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE events are separated by a blank line. A TCP chunk can land mid-line, so the
          // trailing partial event must stay in the buffer until the rest arrives.
          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const event of events) {
            for (const line of event.split('\n')) {
              if (!line.startsWith('data:')) continue;
              const payload = line.slice(5).trim();
              if (!payload) continue;

              if (payload === '[DONE]') {
                controller.enqueue(encodeFrame({ t: 'done' }));
                closed = true;
                continue;
              }

              try {
                const json = JSON.parse(payload);
                const delta: unknown = json?.choices?.[0]?.delta?.content;
                if (typeof delta === 'string' && delta) {
                  controller.enqueue(encodeFrame({ t: 'delta', v: delta }));
                }
              } catch {
                // Partial JSON or a keep-alive comment — ignore.
              }
            }
          }
        }
        if (!closed) controller.enqueue(encodeFrame({ t: 'done' }));
      } catch (err) {
        // A client abort surfaces here too; that isn't an error worth reporting.
        if (!req.signal.aborted) {
          console.error('[ask-arya] stream error', err);
          controller.enqueue(
            encodeFrame({
              t: 'error',
              code: 'upstream',
              message: 'The response was cut short.',
            }),
          );
        }
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      // `no-transform` and `X-Accel-Buffering` are what stop a proxy buffering the whole
      // response into one lump in production. Without them this streams perfectly in
      // `next dev` and arrives all at once on Vercel.
      'Cache-Control': 'no-cache, no-store, no-transform',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive',
    },
  });
}
