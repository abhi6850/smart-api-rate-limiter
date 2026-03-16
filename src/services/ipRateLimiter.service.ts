import { redisClient } from "../config/redis";

export class IpRateLimiterService {

  async checkLimit(ip: string) {

    const key = `rate:ip:${ip}`;
    const limit = 100; // requests per minute

    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, 60);
    }

    const remaining = limit - current;

    if (current > limit) {
      return {
        allowed: false,
        remaining: 0
      };
    }

    return {
      allowed: true,
      remaining
    };

  }

}