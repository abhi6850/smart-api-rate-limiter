import { FixedWindowStrategy } from "../rate-limiters/fixedWindow.strategy";
import { TokenBucketStrategy } from "../rate-limiters/tokenBucket.strategy";

export class RateLimiterService {
  async check(
    userId: number,
    limit: number,
    algorithm: string,
    bucketCapacity?: number,
    refillRate?: number
  ): Promise<{ allowed: boolean; remaining: number }> {

    const windowInSeconds = 60;

    if (algorithm === "token") {
      const strategy = new TokenBucketStrategy();
      return strategy.checkLimit(userId, bucketCapacity || limit, refillRate || 1);
    }

    // Default to fixed window
    const strategy = new FixedWindowStrategy();
    return strategy.checkLimit(userId, limit, windowInSeconds);
  }
}