import { pool } from "../config/db";
import crypto from "crypto";

export class UserService {
  async createUser(email: string, planName: string) {
    const apiKey = crypto.randomBytes(32).toString("hex");

    // Get plan
    const planResult = await pool.query(
      "SELECT * FROM plans WHERE name = $1",
      [planName]
    );

    if (planResult.rows.length === 0) {
      throw new Error("Plan not found");
    }

    const plan = planResult.rows[0];

    const userResult = await pool.query(
      "INSERT INTO users (email, api_key, plan_id) VALUES ($1, $2, $3) RETURNING *",
      [email, apiKey, plan.id]
    );

    return userResult.rows[0];
  }

  async getUserByApiKey(apiKey: string) {
    const result = await pool.query(
      `SELECT users.*, plans.algorithm, plans.requests_per_minute, plans.bucket_capacity, plans.refill_rate
       FROM users
       JOIN plans ON users.plan_id = plans.id
       WHERE api_key = $1`,
      [apiKey]
    );

    return result.rows[0];
  }
}