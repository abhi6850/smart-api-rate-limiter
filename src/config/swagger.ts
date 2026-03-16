import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart API Rate Limiter",
      version: "1.0.0",
      description: "Production-grade API Rate Limiter using Redis and PostgreSQL",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
});