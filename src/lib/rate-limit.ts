import "server-only";

/**
 * Rate limiter in-memory sederhana per key (biasanya IP+aksi). Cukup untuk
 * deployment single-instance; untuk multi-instance/serverless gunakan store
 * eksternal seperti Upstash Redis.
 */
const attemptLog = new Map<string, number[]>();

export function isRateLimited(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (attemptLog.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  attemptLog.set(key, timestamps);
  return timestamps.length > maxAttempts;
}

export async function getClientIp(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
