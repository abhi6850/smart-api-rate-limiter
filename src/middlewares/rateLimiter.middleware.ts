import { Request, Response, NextFunction } from "express";
import { RateLimiterService } from "../services/rateLimiter.service";
import { UserService } from "../services/user.service";
import { ViolationService } from "../services/violation.service";
import { IpRateLimiterService } from "../services/ipRateLimiter.service";

const rateLimiterService = new RateLimiterService();
const userService = new UserService();
const violationService = new ViolationService();
const ipLimiter = new IpRateLimiterService();

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    /* -------------------------------
       API KEY VALIDATION
    --------------------------------*/

    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      return res.status(401).json({
        message: "API key missing"
      });
    }

    const user = await userService.getUserByApiKey(apiKey);

    if (!user) {
      return res.status(403).json({
        message: "Invalid API key"
      });
    }

    /* -------------------------------
       IP RATE LIMIT CHECK
    --------------------------------*/

    const ip = req.ip || req.socket.remoteAddress || "unknown";

    const ipResult = await ipLimiter.checkLimit(ip);

    if (!ipResult.allowed) {

      res.setHeader("Retry-After", 60);

      return res.status(429).json({
        message: "Too many requests from this IP",
        retry_after: 60
      });

    }

    /* -------------------------------
       TEMPORARY BLOCK CHECK
    --------------------------------*/

    if (user.blocked_until) {

      const blockedUntil = new Date(user.blocked_until);
      const now = new Date();

      console.log("Blocked until:", blockedUntil);
      console.log("Current time:", now);

      if (blockedUntil > now) {
        return res.status(403).json({
          message: "User temporarily blocked due to abuse"
        });
      }

      // Block expired → auto unblock
      await violationService.unblockUser(user.id);
      console.log(`User ${user.id} automatically unblocked`);
    }

    /* -------------------------------
       API KEY RATE LIMIT CHECK
    --------------------------------*/

    const limit = user.requests_per_minute;

    const { allowed, remaining } = await rateLimiterService.check(
      user.id,
      limit,
      user.algorithm,
      user.bucket_capacity,
      user.refill_rate
    );

    /* -------------------------------
       RATE LIMIT HEADERS
    --------------------------------*/

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);

    const resetTime = Math.floor(Date.now() / 1000) + 60;
    res.setHeader("X-RateLimit-Reset", resetTime);

    /* -------------------------------
       HANDLE RATE LIMIT FAILURE
    --------------------------------*/

    if (!allowed) {

      const blocked = await violationService.recordViolation(user.id);

      if (blocked) {
        return res.status(403).json({
          message: "User temporarily blocked due to abuse"
        });
      }

      res.setHeader("Retry-After", 10);

      return res.status(429).json({
        message: "Rate limit exceeded",
        retry_after: 10
      });
    }

    next();

  } catch (error) {

    console.error("Rate limiter error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });

  }
};