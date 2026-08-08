export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  /** Set when the turn failed; the partial content (if any) is still kept. */
  error?: string;
  /** Set when the user pressed Stop mid-stream. */
  aborted?: boolean;
}

export type ChatStatus = 'idle' | 'thinking' | 'streaming' | 'error';

export type ChatErrorCode =
  | 'rate_limit'
  | 'upstream'
  | 'bad_request'
  | 'server'
  | 'network';

/** NDJSON wire frames, server -> client. One JSON object per line. */
export type StreamFrame =
  | { t: 'delta'; v: string }
  | { t: 'done' }
  | { t: 'error'; code: ChatErrorCode; message: string };
