/**
 * Fixed-window counter per key, kept in this process's memory.
 * shortcut: per-process, so with several server instances each has its own count; move to the database or Redis then.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

/** Records one attempt for `key`; false once it has made more than `limit` attempts within `windowMs`. */
export function allowAttempt(key: string, limit: number, windowMs: number, now = Date.now()) {
  if (hits.size > 5000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= limit;
}

export function clearAttempts(key: string) {
  hits.delete(key);
}

/** Caller's IP behind a proxy (first X-Forwarded-For entry), or "unknown". */
export function clientIp(headers: Headers | Record<string, string | string[] | undefined>) {
  const raw = headers instanceof Headers ? headers.get("x-forwarded-for") : headers["x-forwarded-for"];
  return (Array.isArray(raw) ? raw[0] : raw)?.split(",")[0]?.trim() || "unknown";
}
