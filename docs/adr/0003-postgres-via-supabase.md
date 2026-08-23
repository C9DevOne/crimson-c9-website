# ADR-0003: Postgres via Supabase as the Primary Database

**Status:** Accepted
**Date:** 2026-05
**Deciders:** Nick, Aaron

## Context

Payload CMS (ADR-0002) needs a backing database. The team needed a managed database service to avoid hand-rolling Postgres operations (backups, scaling, patching) given the project is run by a small, mostly-volunteer team without dedicated infra staff.

## Decision

**Postgres, managed via Supabase.** Nick owns this piece of infrastructure.

## Alternatives Considered

- **MongoDB** — Payload supports Mongo as well, but the team's existing SQL familiarity and the relational shape of the content (artists, events, releases with real relationships between them) favored Postgres.
- **Self-hosted Postgres on a VPS** — full control, but meaningfully more operational overhead (backups, patching, monitoring) than a 5-person prototype team has bandwidth for.
- **Other managed Postgres providers** — Supabase was chosen partly because its broader feature set (auth, storage, edge functions) is available if the project's needs grow, even though only the database is currently in active use.

## Consequences

- **Positive:** Managed backups and scaling; no dedicated DBA needed; SQL is a common skill across the team.
- **Negative — open risk:** Whether Preview and Production deployments share the same `DATABASE_URI` is unresolved as of this writing. If shared, every PR preview build risks running migrations against the live database. **This must be resolved with Nick before migrate-on-build is re-enabled** (tracked in `WORKING_LOG.md`, not restated here since ADRs are not living documents).
