/**
 * Lightweight in-memory rate limiter for serverless environments.
 * Uses a sliding window counter per IP address.
 *
 * For high-traffic production, upgrade to Redis-backed (@upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Evict expired entries periodically to prevent memory leaks
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function evictExpired() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  ip: string,
  config: RateLimitConfig
): RateLimitResult {
  evictExpired();

  const now = Date.now();
  const key = `${ip}`;
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowSeconds * 1000;
    store.set(key, { count: 1, resetAt });
    return { success: true, limit: config.limit, remaining: config.limit - 1, resetAt };
  }

  entry.count++;

  if (entry.count > config.limit) {
    return { success: false, limit: config.limit, remaining: 0, resetAt: entry.resetAt };
  }

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}

/** Pre-configured limits for different endpoint types */
export const RATE_LIMITS = {
  /** AI endpoints (Gemini API) — costly, strict limit */
  ai: { limit: 10, windowSeconds: 60 },
  /** Form submissions — moderate limit */
  form: { limit: 20, windowSeconds: 60 },
  /** Newsletter signup — strict to prevent spam */
  newsletter: { limit: 5, windowSeconds: 300 },
  /** General API — relaxed */
  general: { limit: 60, windowSeconds: 60 },
  /** Lesson comments — moderate spam prevention */
  comment: { limit: 5, windowSeconds: 60 },
  /** Auth endpoints — strict to prevent brute force */
  auth: { limit: 5, windowSeconds: 300 },
} as const;
