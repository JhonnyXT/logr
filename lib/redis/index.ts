import { Redis } from "@upstash/redis";

let redisInstance: Redis | null | undefined;

/**
 * Upstash Redis REST client. Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
 */
export function getRedis(): Redis | null {
  if (redisInstance !== undefined) return redisInstance;
  if (
    typeof process === "undefined" ||
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    redisInstance = null;
    return null;
  }
  redisInstance = Redis.fromEnv();
  return redisInstance;
}

/**
 * Fixed-window rate limit. If Redis is not configured, allows all traffic.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number }> {
  const redis = getRedis();
  if (!redis) {
    return { success: true, remaining: limit };
  }

  const bucket = Math.floor(Date.now() / (windowSeconds * 1000));
  const redisKey = `rl:${key}:${bucket}`;
  const count = await redis.incr(redisKey);
  if (count === 1) {
    await redis.expire(redisKey, windowSeconds);
  }
  const remaining = Math.max(0, limit - count);
  return { success: count <= limit, remaining };
}
