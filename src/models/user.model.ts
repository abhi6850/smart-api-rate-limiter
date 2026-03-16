export interface User {
  id: number;
  email: string;
  api_key: string;

  plan: string;

  // Fixed window configuration
  requests_per_minute: number;

  // Token bucket configuration
  bucket_capacity: number;
  refill_rate: number;

  // Algorithm selection
  algorithm: "fixed" | "token";

  // Abuse handling
  is_blocked: boolean;

  created_at: Date;
}