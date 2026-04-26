# Architecture
A layered monorepo:
- Config-first env validation.
- Discord core as orchestration layer.
- Modules as feature boundaries.
- Postgres persistence (Prisma).
- Redis-backed jobs (BullMQ).
