import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger";
import { adminDashboard } from "./dashboard/adminDashboard";
import { requestLoggerMiddleware } from "./middlewares/requestLogger.middleware";

import testRoutes from "./routes/test.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

/* -------------------------------
   GLOBAL MIDDLEWARES
--------------------------------*/

app.use(cors());
app.use(express.json());
app.use(requestLoggerMiddleware);

/* -------------------------------
   SWAGGER DOCUMENTATION
--------------------------------*/

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* -------------------------------
   DASHBOARD & ROOT ROUTES
--------------------------------*/

app.get("/dashboard", adminDashboard);

app.get("/", (req, res) => {
  res.json({
    service: "Smart API Rate Limiter",
    status: "running",
    message: "Welcome to Smart Rate Limiter API",
  });
});

/* -------------------------------
   HEALTH CHECK
--------------------------------*/

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Smart Rate Limiter is running",
  });
});

/* -------------------------------
   API ROUTES
--------------------------------*/

app.use("/api", testRoutes);
app.use("/api", userRoutes);
app.use("/admin", adminRoutes);

export default app;
