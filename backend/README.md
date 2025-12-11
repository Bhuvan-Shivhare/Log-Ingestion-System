# Log Ingestion & Search Backend

A production-ready Node.js backend for ingesting and searching logs (Log Ingestion + Search System), built with Express and MongoDB.

## Features

- **Ingest Logs**: Single or Bulk insertion.
- **Search Logs**: Full-text search, Regex search, Field filtering.
- **Filter**: Filter by Level, Resource ID, Trace ID, Span ID, Commit, Parent Resource ID, Date Range.
- **Pagination**: Efficient pagination support.
- **Performance**: Optimized MongoDB indexes.
- **Health Checks**: `/health` and `/ready` endpoints.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose

## Setup

1. **Clone the repository** (if applicable)

2. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the `backend` directory based on `.env.example`:
   ```properties
   ```properties
   MONGO_URI={{MONGO_ATLAS_URI}}
   PORT=3000
   JWT_SECRET=somesecretkey
   TOKEN_EXPIRY=1d
   REDIS_URL=redis://localhost:6379
   ```
   *Replace `{{MONGO_ATLAS_URI}}` with your actual MongoDB Atlas connection string.*

4. **Run Locally**
   
   Development mode (with nodemon):
   ```bash
   npm run dev
   ```

   Production start:
   ```bash
   npm start
   ```

## APIs

### 1. Ingest Log
**POST** `/api/logs`

```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Failed to connect to DB",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-0987"
    }
  }'
```

### 2. Bulk Ingest
**POST** `/api/logs/bulk`

```bash
curl -X POST http://localhost:3000/api/logs/bulk \
  -H "Content-Type: application/json" \
  -d '[
    {
      "level": "info",
      "message": "User logged in",
      "resourceId": "server-1234",
      "timestamp": "2023-09-15T08:05:00Z",
      "traceId": "abc-xyz-124",
      "spanId": "span-457",
      "commit": "5e5342f",
      "metadata": { "parentResourceId": "server-0987" }
    },
    {
      "level": "warn",
      "message": "High memory usage",
      "resourceId": "server-1234",
      "timestamp": "2023-09-15T08:10:00Z",
      "traceId": "abc-xyz-125",
      "spanId": "span-458",
      "commit": "5e5342f",
      "metadata": { "parentResourceId": "server-0987" }
    }
  ]'
```

### 3. Search Logs
**GET** `/api/logs`

**Query Parameters:**
- `level`: Filter by log level (e.g., `error`, `info`)
- `message`: Full-text search on message
- `regex`: Regex search on message (e.g., `Failed.*DB`)
- `resourceId`: Exact match
- `traceId`: Exact match
- `spanId`: Exact match
- `commit`: Exact match
- `parentResourceId`: Filter by metadata.parentResourceId
- `from`: Start timestamp (ISO format)
- `to`: End timestamp (ISO format)
- `page`: Page number (default: 1)
- `limit`: Logs per page (default: 10)

**Example:**
```bash
curl "http://localhost:3000/api/logs?level=error&message=connect&page=1&limit=5"
```

### 4. Health
- `GET /health` - Returns `{ status: "ok" }`
- `GET /ready` - Check DB connection status

### 4. Health
- `GET /health` - Returns `{ status: "ok" }`
- `GET /ready` - Check DB connection status

```bash
curl http://localhost:3000/health
```

### 5. Authentication
The system uses JWT-based authentication with Role-Based Access Control (RBAC).

**Roles:**
- `admin`: Can ingest logs and search logs.
- `viewer`: Can only search logs. (Default role)

**Register a User**
**POST** `/auth/register`

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

**Login**
**POST** `/auth/login`

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```
*Response will include a `token`. use this token in the Authorization header for subsequent requests.*

**Accessing Protected Routes**
All `/api/logs` endpoints are protected. You must include the `Authorization` header.

Header Format: `Authorization: Bearer <your_token_here>`

Example:
```bash
curl -X GET "http://localhost:3000/api/logs?page=1" \
  -H "Authorization: Bearer <your_token_here>"
```

## Indexes & Performance
To ensure fast queries, the following indexes are applied in the `Log` model:
- `text`: on `message` (Full-text search)
- `hashed/ascending`: on `resourceId`, `traceId`, `spanId`, `commit`, `level`
- `descending`: on `timestamp` (for sorting)
- `ascending`: on `metadata.parentResourceId`

## Caching (Redis)
This system uses Redis for caching search results (`GET /api/logs`) to improve read performance.
- **Cache Key**: Generated from query parameters.
- **TTL**: Cache entries expire after 30 seconds.
- **Invalidation**: Cache is automatically flushed when new logs are ingested via the POST endpoints.
- **Fallback**: If Redis is unavailable, the system safely falls back to MongoDB.
- **Response**: The API response includes a `fromCache` boolean field to indicate if the data came from Redis.

## Bonus Implementation
- **Bulk Insert**: API endpoint for inserting multiple logs at once.
- **Regex Search**: Fallback or alternative to full-text search.
- **Advanced Query Builder**: Modular utility to construct Mongoose queries.
- **RBAC**: Role-Based Access Control using JWT.
