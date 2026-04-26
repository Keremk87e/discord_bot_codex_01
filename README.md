# AegisBot Platform

A production-oriented Discord bot monorepo (TypeScript + Node.js) for multi-server, SaaS-style operations.

## Architecture Overview
- `apps/bot`: Discord gateway app with modular slash commands.
- `apps/api`: Fastify API for health/status and dashboard integration.
- `apps/worker`: BullMQ worker for async/scheduled jobs.
- `apps/web`: Placeholder dashboard/landing shell.
- `packages/*`: reusable platform libraries (config, database, logger, permissions, discord-core, modules, shared).

## Folder Structure
See `docs/ARCHITECTURE.md`.

## Environment
Copy `.env.example` to `.env` and fill all required values.

## Discord App Setup
1. Create app at Discord Developer Portal.
2. Enable bot + privileged intents as needed.
3. Copy client ID, token, public key, secret into `.env`.
4. Build invite URL and set in `.env`.

## Local Infra
```bash
docker compose up -d
```

## Install
```bash
pnpm install
```

## Prisma
```bash
pnpm prisma:generate
pnpm prisma:migrate
```

## Register Slash Commands
```bash
pnpm register:guild-commands
pnpm register:global-commands
```

## Run
```bash
pnpm dev
# or
pnpm --filter @apps/bot dev
```

## Modules
Modules are loaded via `packages/modules` and feature flags in `.env`.

## Add a Command
1. Add command to a module in `packages/modules/src/*`.
2. Re-register slash commands.

## Add a Module
1. Create module directory under `packages/modules/src`.
2. Export module in `packages/modules/src/index.ts`.
3. Gate via `.env` feature flag.

## Deployment Notes
- Run bot/api/worker as separate processes.
- Use managed Postgres + Redis.
- Keep one `.env` source (or secret manager mapped to same keys).

## Limitations & Roadmap
- Web app is placeholder shell.
- Ticket transcript generation is scaffolded.
- Analytics/premium billing are placeholders for future release.
