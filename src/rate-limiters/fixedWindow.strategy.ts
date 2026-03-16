import { redisClient } from "../config/redis";
import { RateLimiterStrategy } from "./strategy.interface";

export class FixedWindowStrategy implements RateLimiterStrategy {
  async checkLimit(
    userId: number,
    limit: number,
    windowInSeconds: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    const currentWindow = Math.floor(Date.now() / 1000 / windowInSeconds);
    const key = `rate:fixed:${userId}:${currentWindow}`;

    const currentCount = await redisClient.incr(key);

    if (currentCount === 1) {
      await redisClient.expire(key, windowInSeconds);
    }

    const remaining = Math.max(limit - currentCount, 0);

    if (currentCount > limit) {
      return { allowed: false, remaining: 0 };
    }

    return { allowed: true, remaining };
  }
}