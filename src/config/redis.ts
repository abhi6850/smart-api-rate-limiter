import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

// Supports REDIS_URL (Upstash, Redis Cloud, Railway, etc.)
// or individual REDIS_HOST / REDIS_PORT for local dev
export const redisClient = process.env.REDIS_URL
  ? createClient({ url: process.env.REDIS_URL })
  : createClient({
      socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    });

let isConnected = false;

export const connectRedis = async () => {
  if (isConnected) return;
  try {
    await redisClient.connect();
    isConnected = true;
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Redis connection failed:", error);
    process.exit(1);
  }
};

// Auto-connect on first use (for serverless — each cold start needs a connection)
redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
  isConnected = false;
});

redisClient.on("connect", () => {
  isConnected = true;
});
