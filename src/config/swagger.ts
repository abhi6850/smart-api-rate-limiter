import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Smart API Rate Limiter",
    version: "1.0.0",
    description:
      "Production-grade API Rate Limiter using Redis and PostgreSQL. Supports Fixed Window and Token Bucket algorithms with abuse detection.",
  },
  servers: [
    { url: "/.netlify/functions/api", description: "Netlify Production" },
    { url: "http://localhost:5000", description: "Local Development" },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
      },
    },
    schemas: {
      CreateUserRequest: {
        type: "object",
        required: ["email", "plan"],
        properties: {
          email: { type: "string", example: "user@example.com" },
          plan: { type: "string", enum: ["free", "premium"], example: "free" },
        },
      },
      CreateUserResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "User created" },
          apiKey: { type: "string", example: "abc123..." },
        },
      },
      Violation: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          type: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          email: { type: "string" },
        },
      },
      SystemStats: {
        type: "object",
        properties: {
          total_users: { type: "integer" },
          total_violations: { type: "integer" },
          total_requests: { type: "integer" },
          top_endpoints: { type: "array", items: { type: "object" } },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["General"],
        summary: "Service info",
        responses: {
          "200": { description: "Service running" },
        },
      },
    },
    "/health": {
      get: {
        tags: ["General"],
        summary: "Health check",
        responses: {
          "200": { description: "OK" },
        },
      },
    },
    "/api/users": {
      post: {
        tags: ["Users"],
        summary: "Create a new user and get an API key",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "User created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateUserResponse" },
              },
            },
          },
          "400": { description: "Bad request" },
        },
      },
    },
    "/api/test": {
      get: {
        tags: ["Rate Limiter"],
        summary: "Test endpoint — protected by rate limiter middleware",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Request allowed" },
          "401": { description: "API key missing" },
          "403": { description: "Invalid API key or user blocked" },
          "429": {
            description: "Rate limit exceeded",
            headers: {
              "X-RateLimit-Limit": { schema: { type: "integer" } },
              "X-RateLimit-Remaining": { schema: { type: "integer" } },
              "X-RateLimit-Reset": { schema: { type: "integer" } },
              "Retry-After": { schema: { type: "integer" } },
            },
          },
        },
      },
    },
    "/admin/violations": {
      get: {
        tags: ["Admin"],
        summary: "Get recent violations (last 50)",
        responses: {
          "200": {
            description: "List of violations",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Violation" },
                },
              },
            },
          },
        },
      },
    },
    "/admin/top-abusers": {
      get: {
        tags: ["Admin"],
        summary: "Get top 10 users by violation count",
        responses: {
          "200": { description: "List of abusers" },
        },
      },
    },
    "/admin/blocked-users": {
      get: {
        tags: ["Admin"],
        summary: "Get currently blocked users",
        responses: {
          "200": { description: "List of blocked users" },
        },
      },
    },
    "/admin/stats": {
      get: {
        tags: ["Admin"],
        summary: "System-wide stats",
        responses: {
          "200": {
            description: "Stats object",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SystemStats" },
              },
            },
          },
        },
      },
    },
    "/admin/traffic": {
      get: {
        tags: ["Admin"],
        summary: "Total request count",
        responses: {
          "200": { description: "Traffic stats" },
        },
      },
    },
    "/admin/top-endpoints": {
      get: {
        tags: ["Admin"],
        summary: "Top endpoints by request count",
        responses: {
          "200": { description: "Endpoint analytics" },
        },
      },
    },
    "/admin/top-users": {
      get: {
        tags: ["Admin"],
        summary: "Top users by request count",
        responses: {
          "200": { description: "User analytics" },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [], // paths are inlined above — no file scanning needed
});
