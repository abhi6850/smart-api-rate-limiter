import { Router } from "express";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.get("/test", rateLimiterMiddleware, (req, res) => {
  res.json({ message: "Request successful" });
});

export default router;