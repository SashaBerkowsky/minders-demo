# Minders Backend

Node.js/Express API for feedback storage using hexagonal architecture.

## Installation
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and set variables (e.g., `PORT=3000`).
4. Run DB setup: `npm run db:migrate && npm run db:generate`.

## Running
- Dev: `npm run dev`
- Build: `npm run build` (if needed)

## API Endpoints
- `GET /api/health`: Health check.
- `POST /api/feedback`: Submit feedback.
  - Headers: `Authorization: ApiKey <key>`, `x-project-id: <id>`
  - Body: `{ userId, rating, comment?, timestamp, deviceInfo }`

## Testing
- Unit/Integration: `npm run test:coverage`
- Manual API Test (curl):
  ```bash
  # Health check
  curl http://localhost:3000/api/health

  # Submit feedback
  curl -X POST http://localhost:3000/api/feedback \
    -H "Content-Type: application/json" \
    -H "Authorization: ApiKey minders_secret_key_0" \
    -H "x-project-id: 0" \
    -d '{
      "userId": "test-user",
      "rating": 5,
      "comment": "Great!",
      "timestamp": "2023-10-01T12:00:00.000Z",
      "deviceInfo": {
        "userAgent": "curl",
        "url": "http://localhost"
      }
    }'
  ```

## Storage
- Uses Prisma (SQLite) for persistent storage.

## ADR
See [docs/adr.md](../docs/adr.md).