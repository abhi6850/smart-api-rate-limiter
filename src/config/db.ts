import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    process.exit(1);
  }
};