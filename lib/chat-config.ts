/**
 * Every tunable for the Ask Arya widget, in one place.
 *
 * Imported by BOTH server and client code, so it must never read a secret.
 * `GROQ_MODEL` is not sensitive; note that on the client `process.env.GROQ_MODEL` is
 * inlined as `undefined` (only NEXT_PUBLIC_* vars reach the browser), so the client
 * always sees the default string. That's fine — the client never needs the model name.
 */
export const CHAT_CONFIG = {
  model: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
  temperature: 0.3,
  maxTokens: 500,
  maxInputChars: 600,
  /** Client-enforced, per browser session. */
  maxUserMessagesPerSession: 20,
  /** How many prior messages get sent upstream as context. */
  maxHistoryMessages: 12,
  /**
   * Kept at 3/min because Groq's free tier caps this model at 12,000 tokens/minute for the
   * whole org, and each request costs ~3,400 tokens of system prompt. Allowing more per IP
   * would just mean one visitor exhausting the quota for everyone. Raise this after
   * upgrading to Groq's Dev tier.
   */
  rateLimit: { windowMs: 60_000, maxRequests: 3 },
  storageKey: 'ask-arya:v1',
} as const;

export const STARTER_QUESTIONS = [
  "What's Arya actually good at?",
  'What are his weaknesses?',
  'Walk me through his backend experience',
  "What's his notice period?",
] as const;
