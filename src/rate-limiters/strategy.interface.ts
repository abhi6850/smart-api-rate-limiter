export interface RateLimiterStrategy {
  checkLimit(
    userId: number,
    limit: number,
    windowInSeconds: number
  ): Promise<{ allowed: boolean; remaining: number }>;
}