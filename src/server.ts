import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger";
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";
import { initializeDatabase } from "./config/initDB";
import { adminDashboard } from "./dashboard/adminDashboard";

import { requestLoggerMiddleware } from "./middlewares/requestLogger.middleware";

import testRoutes from "./routes/test.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";

dotenv.config();

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
   ROOT ROUTE
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

const PORT = process.env.PORT || 5000;

/* -------------------------------
   SERVER START
--------------------------------*/

const startServer = async () => {
  try {

    await connectDB();
    await connectRedis();
    await initializeDatabase();

    app.listen(PORT, () => {

      console.log(`Server running on port ${PORT}`);
      console.log(`Open API: http://localhost:${PORT}`);
      console.log(`Swagger Docs: http://localhost:${PORT}/docs`);

    });

  } catch (error) {

    console.error("Server startup failed:", error);
    process.exit(1);

  }
};

startServer();