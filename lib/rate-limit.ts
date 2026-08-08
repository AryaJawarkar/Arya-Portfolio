import { CHAT_CONFIG } from '@/lib/chat-config';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Fixed-window limiter keyed by client IP.
 *
 * Be honest about what this is: in-memory state on Vercel is per-instance and dies on cold
 * start, so N concurrent instances means N x maxRequests actually get through, and anyone
 * rotating IPs bypasses it entirely. It's a speed bump against one bored visitor holding
 * down Enter — nothing more. The real cost ceiling is the spend limit set in the Groq
 * console. If genuine abuse shows up, swap this for @upstash/ratelimit.
 */
export function checkRateLimit(key: string): {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
} {
  const { windowMs, maxRequests } = CHAT_CONFIG.rateLimit;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });

    // Opportunistic sweep so a long-lived instance can't grow the map without bound.
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) {
        if (now > v.resetAt) buckets.delete(k);
      }
    }
    return { ok: true, remaining: maxRequests - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= maxRequests) {
    return { ok: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { ok: true, remaining: maxRequests - bucket.count, retryAfterMs: 0 };
}
