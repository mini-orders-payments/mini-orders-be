# mini-order-payments

NestJS starter for a mini order + M-Pesa (Daraja) payments workshop. Scaffolding, health check, and TODOs only — order/payment business logic is left for later days.

## Stack

- NestJS (TypeScript)
- TypeORM + PostgreSQL
- Docker Compose
- npm

## Setup

1. Copy env defaults:

   ```bash
   cp .env.example .env
   ```

2. Start Postgres + API:

   ```bash
   docker compose up --build
   ```

   Or run Postgres via Compose and the API locally:

   ```bash
   docker compose up postgres -d
   npm install
   npm run start:dev
   ```

## Verify the health check

With the API running on port 3000:

```bash
curl http://localhost:3000/health
```

Expected when the DB is reachable:

```json
{ "status": "ok", "db": "connected" }
```

If the DB ping fails, you get a `503` with a clear error payload.

## Project structure overview

```
src/
  app.module.ts          # root module — ConfigModule + TypeORM
  main.ts
  health/                # GET /health (works end-to-end)
  orders/                # Day 2 scaffold (entity/endpoints unimplemented)
  payments/              # Day 3 scaffold — mock DarajaService.initiateSTKPush
docker-compose.yml
Dockerfile
.env.example
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Watch mode |
| `npm run build` | Compile |
| `npm run start:prod` | Run `dist/main` |
| `npm test` | Jest unit tests |
| `npm run lint` | ESLint |

## Module Overview

### Orders

### Payments

### Health
