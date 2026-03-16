import { redisClient } from "../config/redis";

export class TokenBucketStrategy {
  async checkLimit(
    userId: number,
    bucketCapacity: number,
    refillRate: number
  ): Promise<{ allowed: boolean; remaining: number }> {

    const key = `rate:bucket:${userId}`;
    const now = Math.floor(Date.now() / 1000);

    // Fetch bucket data from Redis
    const bucket = await redisClient.hGetAll(key);

    let tokens: number;
    let lastRefill: number;

    if (Object.keys(bucket).length === 0) {
      // Initialize bucket
      tokens = bucketCapacity;
      lastRefill = now;
    } else {
      tokens = parseFloat(bucket.tokens);
      lastRefill = parseInt(bucket.lastRefill);
    }

    // Calculate time elapsed since last refill
    const elapsed = now - lastRefill;

    // Add new tokens
    const refillTokens = elapsed * refillRate;
    tokens = Math.min(bucketCapacity, tokens + refillTokens);
    console.log("Tokens before:", tokens);

    if (tokens < 1) {
      return { allowed: false, remaining: 0 };
    }

    // Consume one token
    tokens -= 1;

    // Save updated bucket
    await redisClient.hSet(key, {
      tokens: tokens.toString(),
      lastRefill: now.toString(),
    });

    // Auto cleanup if inactive for 1 hour
    await redisClient.expire(key, 3600);

    return {
      allowed: true,
      remaining: Math.floor(tokens),
    };
  }
}