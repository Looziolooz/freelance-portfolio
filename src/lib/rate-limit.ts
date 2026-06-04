import type { NextRequest } from "next/server";

// In-memory fixed-window rate limiter. PER-INSTANCE ONLY: state lives in this
// Node process and resets on cold start, so on multi-instance/serverless hosts
// it is best-effort. Replace with @upstash/ratelimit + Upstash Redis (or Vercel
// KV) before relying on it as real abuse protection in production.

interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit = 20,
  windowMs = 5 * 60 * 1000,
): RateResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    // Opportunistic eviction so the Map can't grow unbounded.
    if (buckets.size > 10_000) {
      for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
    }
    return { ok: true, remaining: limit - 1, resetAt };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

/** Best-effort client IP from proxy headers. */
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
