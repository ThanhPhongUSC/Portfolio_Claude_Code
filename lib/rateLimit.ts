/**
 * A tiny in-memory, per-key rate limiter (sliding window).
 *
 * Pulled out of the API route so it can be unit-tested in isolation. The clock
 * is injectable (`now`) so tests can simulate time passing without real waits.
 *
 * Note: state lives in memory, so it is per server instance and resets on
 * restart — fine for a single-instance portfolio. For multi-instance or
 * serverless deployments, back this with a shared store such as Upstash Redis.
 */
export type RateLimiter = {
  /** Returns true if the request is allowed; false if the limit is exceeded. */
  check: (key: string) => boolean;
};

export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
}): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    check(key: string): boolean {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((ts) => t - ts < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent); // drop expired entries even when blocking
        return false;
      }
      recent.push(t);
      hits.set(key, recent);
      return true;
    },
  };
}

/**
 * Best-effort identifier for the caller, from the usual proxy headers. Takes a
 * plain `Headers` object so it's trivial to test.
 */
export function getClientId(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
