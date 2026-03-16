Smart API Rate Limiter

A production-style API rate limiting system built with Node.js, Express, Redis, and PostgreSQL.
The project demonstrates how modern backend systems protect APIs from abuse, enforce request limits, and monitor traffic in real time.

The system supports multiple rate limiting strategies, abuse detection, analytics tracking, and an admin monitoring dashboard.

Overview

Modern APIs must handle high traffic while protecting backend resources from abuse. This project implements a middleware-based rate limiting system that supports per-user limits, IP-based protection, request analytics, and administrative monitoring.

The system stores fast counters in Redis and persistent data such as users and violations in PostgreSQL. It also provides an admin dashboard and API documentation through Swagger.

The project is designed to simulate the core components of an API gateway used in production systems.

Key Features

Rate limiting
Implements Token Bucket and Fixed Window algorithms to control API usage.

API key authentication
Each user is assigned an API key which determines their request limits.

Plan-based limits
Different rate limits are applied depending on the user's subscription plan.

IP-based protection
Requests can be limited by IP address to prevent anonymous abuse.

Abuse detection and blocking
Repeated violations automatically trigger temporary blocking of the user.

Automatic unblocking
Blocked users are automatically unblocked once the block duration expires.

Traffic analytics
Tracks total requests, endpoint usage, and user activity using Redis.

Admin monitoring APIs
Provides endpoints to inspect violations, blocked users, system statistics, and traffic data.

Admin dashboard
A lightweight dashboard visualizes traffic statistics and user activity.

API documentation
Swagger UI provides interactive API documentation.

Load testing
Autocannon is used to simulate high traffic and verify system behavior under load.

Tech Stack

Backend framework
Node.js with Express

Language
TypeScript

Database
PostgreSQL

Cache and counters
Redis

Containerization
Docker

API documentation
Swagger (swagger-ui-express, swagger-jsdoc)

Load testing
Autocannon

Visualization
Chart.js

System Architecture
Client
   |
   v
Express Server
   |
   v
Rate Limiter Middleware
   |
   +----------------------+
   |                      |
   v                      v
Redis                PostgreSQL
(counters, analytics)   (users, plans, violations)
   |
   v
Admin APIs
   |
   v
Admin Dashboard

Redis handles high-speed counters for request limits and analytics, while PostgreSQL stores persistent user and violation data.

Project Structure
src
 ├── config
 │   ├── db.ts
 │   ├── redis.ts
 │   ├── initDB.ts
 │   └── swagger.ts
 │
 ├── controllers
 │   ├── admin.controller.ts
 │   └── user.controller.ts
 │
 ├── middlewares
 │   ├── rateLimiter.middleware.ts
 │   └── requestLogger.middleware.ts
 │
 ├── rate-limiters
 │   ├── tokenBucket.strategy.ts
 │   └── fixedWindow.strategy.ts
 │
 ├── routes
 │   ├── admin.routes.ts
 │   ├── test.routes.ts
 │   └── user.routes.ts
 │
 ├── services
 │   ├── rateLimiter.service.ts
 │   ├── user.service.ts
 │   ├── violation.service.ts
 │   └── ipRateLimiter.service.ts
 │
 ├── dashboard
 │   └── adminDashboard.ts
 │
 └── server.ts
Installation

Clone the repository

git clone https://github.com/yourusername/smart-api-rate-limiter.git
cd smart-api-rate-limiter

Install dependencies

npm install

Start Redis and PostgreSQL using Docker

docker compose up -d

Start the server

npm run dev

The server will run on

http://localhost:5000
API Documentation

Swagger documentation is available at

http://localhost:5000/docs

This interface allows you to explore and test all API endpoints.

Admin Dashboard

The admin dashboard visualizes traffic analytics and system statistics.

Open in browser

http://localhost:5000/dashboard

The dashboard shows

Total requests
Top endpoints
Top API users

All data is fetched from Redis-based analytics counters.

Admin APIs

Retrieve system statistics

GET /admin/stats

View recent violations

GET /admin/violations

Check blocked users

GET /admin/blocked-users

Top endpoints by request volume

GET /admin/top-endpoints

Top users by traffic

GET /admin/top-users
Example Request
GET /api/test

Headers

x-api-key: YOUR_API_KEY

Possible responses

200 OK
429 Too Many Requests
403 Forbidden
Load Testing

Load testing was performed using Autocannon.

Example command

autocannon -c 50 -d 10 http://localhost:5000/api/test

Sample results

Requests handled: ~29,000
Average latency: ~16 ms
Throughput: ~2900 requests per second

These results demonstrate that the rate limiting system remains stable under heavy traffic.

What This Project Demonstrates

Designing scalable API middleware
Using Redis for distributed rate limiting
Implementing abuse detection mechanisms
Building analytics for API traffic monitoring
Structuring production-style Node.js applications
Testing backend systems under high load

Future Improvements

Possible extensions include

Distributed rate limiting across multiple servers
Prometheus and Grafana integration for monitoring
Role-based admin authentication
Frontend admin panel using React
Horizontal scaling with load balancers

License

MIT License