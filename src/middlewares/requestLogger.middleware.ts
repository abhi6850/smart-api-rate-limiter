import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";

export const requestLoggerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const endpoint = req.originalUrl;
    const method = req.method;

    const endpointKey = `analytics:endpoint:${method}:${endpoint}`;
    const totalKey = `analytics:total_requests`;

    await redisClient.incr(totalKey);
    await redisClient.incr(endpointKey);

    const apiKey = req.headers["x-api-key"] as string;

    if (apiKey) {

      const userKey = `analytics:user:${apiKey}`;

      await redisClient.incr(userKey);

    }

  } catch (error) {

    console.error("Request logging error:", error);

  }

  next();
};