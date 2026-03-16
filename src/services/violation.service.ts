import { pool } from "../config/db";

export class ViolationService {

  async recordViolation(userId: number): Promise<boolean> {

    await pool.query(
      "INSERT INTO violations (user_id, type) VALUES ($1, $2)",
      [userId, "RATE_LIMIT"]
    );

    const result = await pool.query(
      `SELECT COUNT(*) 
       FROM violations 
       WHERE user_id = $1 
       AND created_at > NOW() - INTERVAL '10 minutes'`,
      [userId]
    );

    const violations = parseInt(result.rows[0].count);

    if (violations >= 5) {

      await pool.query(
        `UPDATE users 
         SET blocked_until = NOW() + INTERVAL '15 seconds'
         WHERE id = $1`,
        [userId]
      );

      console.log(`User ${userId} temporarily blocked`);

      return true; // user blocked
    }

    return false; // not blocked yet
  }

  async unblockUser(userId: number) {

    await pool.query(
      `UPDATE users 
       SET blocked_until = NULL
       WHERE id = $1`,
      [userId]
    );

    console.log(`User ${userId} automatically unblocked`);
  }

}