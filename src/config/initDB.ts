import { pool } from "./db";

export const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plans (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        algorithm VARCHAR(50) NOT NULL,
        requests_per_minute INT NOT NULL,
        bucket_capacity INT,
        refill_rate INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        api_key VARCHAR(255) UNIQUE NOT NULL,
        plan_id INT REFERENCES plans(id),
        is_blocked BOOLEAN DEFAULT FALSE,
        blocked_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS violations (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed plans if not exists
    await pool.query(`
      INSERT INTO plans (name, algorithm, requests_per_minute, bucket_capacity, refill_rate)
      VALUES 
        ('free', 'fixed', 100, NULL, NULL),
        ('premium', 'token', 1000, 1000, 50)
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log("Database initialized and seeded successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};