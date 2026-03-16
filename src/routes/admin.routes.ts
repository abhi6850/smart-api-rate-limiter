import express from "express";
import {
  getViolations,
  getTopAbusers,
  getBlockedUsers,
  getSystemStats,
  getTrafficStats, 
  getTopEndpoints,
  getTopUsers
} from "../controllers/admin.controller";

const router = express.Router();

router.get("/violations", getViolations);
router.get("/top-abusers", getTopAbusers);
router.get("/blocked-users", getBlockedUsers);
router.get("/stats", getSystemStats);
router.get("/traffic", getTrafficStats);
router.get("/top-endpoints", getTopEndpoints);
router.get("/top-users", getTopUsers);

export default router;