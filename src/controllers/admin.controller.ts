import { Request, Response } from "express";
import { pool } from "../config/db";
import { redisClient } from "../config/redis";

/* -------------------------------
   GET RECENT VIOLATIONS
--------------------------------*/

export const getViolations = async (req: Request, res: Response) => {
  try {

    const result = await pool.query(`
      SELECT v.id, v.user_id, v.type, v.created_at, u.email
      FROM violations v
      JOIN users u ON v.user_id = u.id
      ORDER BY v.created_at DESC
      LIMIT 50
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch violations"
    });

  }
};


/* -------------------------------
   TOP ABUSERS
--------------------------------*/

export const getTopAbusers = async (req: Request, res: Response) => {
  try {

    const result = await pool.query(`
      SELECT u.email, COUNT(v.id) as violation_count
      FROM violations v
      JOIN users u ON v.user_id = u.id
      GROUP BY u.email
      ORDER BY violation_count DESC
      LIMIT 10
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch top abusers"
    });

  }
};


/* -------------------------------
   BLOCKED USERS
--------------------------------*/

export const getBlockedUsers = async (req: Request, res: Response) => {
  try {

    const result = await pool.query(`
      SELECT id, email, is_blocked, blocked_until
      FROM users
      WHERE blocked_until > NOW()
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch blocked users"
    });

  }
};


/* -------------------------------
   SYSTEM STATS
--------------------------------*/

export const getSystemStats = async (req: Request, res: Response) => {

  try {

    const users = await pool.query(`SELECT COUNT(*) FROM users`);
    const violations = await pool.query(`SELECT COUNT(*) FROM violations`);

    const totalRequests = await redisClient.get("analytics:total_requests");

    const endpointKeys = await redisClient.keys("analytics:endpoint:*");

    const endpointStats: any[] = [];

    for (const key of endpointKeys) {

      const count = await redisClient.get(key);

      endpointStats.push({
        endpoint: key.replace("analytics:endpoint:", ""),
        count: Number(count)
      });

    }

    endpointStats.sort((a, b) => b.count - a.count);

    res.json({
      total_users: Number(users.rows[0].count),
      total_violations: Number(violations.rows[0].count),
      total_requests: Number(totalRequests || 0),
      top_endpoints: endpointStats.slice(0, 5)
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch stats"
    });

  }

};


/* -------------------------------
   TRAFFIC STATS
--------------------------------*/

export const getTrafficStats = async (req: Request, res: Response) => {

  try {

    const totalRequests = await redisClient.get("analytics:total_requests");

    res.json({
      total_requests: Number(totalRequests || 0)
    });

  } catch (error) {

    console.error("Traffic stats error:", error);

    res.status(500).json({
      message: "Failed to fetch traffic stats"
    });

  }

};


/* -------------------------------
   TOP ENDPOINTS
--------------------------------*/

export const getTopEndpoints = async (req: Request, res: Response) => {

  try {

    const keys = await redisClient.keys("analytics:endpoint:*");

    const endpointStats: any[] = [];

    for (const key of keys) {

      const count = await redisClient.get(key);

      endpointStats.push({
        endpoint: key.replace("analytics:endpoint:", ""),
        count: Number(count)
      });

    }

    endpointStats.sort((a, b) => b.count - a.count);

    res.json(endpointStats);

  } catch (error) {

    console.error("Endpoint analytics error:", error);

    res.status(500).json({
      message: "Failed to fetch endpoint analytics"
    });

  }

};

export const getTopUsers = async (req: Request, res: Response) => {

  try {

    const keys = await redisClient.keys("analytics:user:*");

    const userStats: any[] = [];

    for (const key of keys) {

      const apiKey = key.replace("analytics:user:", "");
      const count = await redisClient.get(key);

      const userResult = await pool.query(
        "SELECT email FROM users WHERE api_key = $1",
        [apiKey]
      );

      if (userResult.rows.length > 0) {

        userStats.push({
          email: userResult.rows[0].email,
          requests: Number(count)
        });

      }

    }

    userStats.sort((a, b) => b.requests - a.requests);

    res.json(userStats);

  } catch (error) {

    console.error("Top users analytics error:", error);

    res.status(500).json({
      message: "Failed to fetch top users"
    });

  }

};