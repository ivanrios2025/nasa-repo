Backedn README

NASA NEO Feed API

A Fastify + TypeScript service that fetches near-Earth objects (NEOs) from NASA’s API, transforms the data, caches responses, and exposes both JSON endpoints and live Swagger documentation.

Table of Contents

1.Overview
2.Features
3.Architecture & File Structure
4.Installation & Running
5.Configuration
6.API Endpoints
7.Caching
8.OpenAPI Documentation
9.Trade-Offs & Decisions

Overview

This service exposes a single GET `/` endpoint that:

-Accepts optional `start_date` and `end_date` query params(string)
-Fetches the NEO feed from NASA
-Transforms and returns an array of `{ name, sizeMeters, closestKm, velocityKph }`
-Caches results to improve performance
-Serves live Swagger docs at `/docs`

Features

-Fastify HTTP server with TypeScript
-JSON-Schema validation & OpenAPI 3.0 spec
-Interactive Swagger UI
-In-memory + optional Redis caching
-CORS configured for your frontend
-Modular, well-tested code

Architecture & File Structure

backend/
src/
inde.js
schemas/
openApiSchemas.ts
services/
nasaServices.ts
cache/
SimpleCache.ts
routes/
cacheRoutes.ts
nasaRoutes.ts
.env
package-lock.json
package.json
README.md
tsconfig.json

Installation & Running

1.Clone & install:

-bash
git https://github.com/ivanrios2025/nasa-repo.git
cd backend
npm install

npm start

http://localhost:3000, Swagger UI at /docs

npm run build
npm start
