# ADR-0005: Vercel for Hosting and Deployment

**Status:** Accepted
**Date:** 2026-04
**Deciders:** Aaron

## Context

The project needed hosting for the Next.js app with minimal ongoing operational overhead, given the team is small and largely volunteer-driven.

## Decision

**Vercel**, connected to GitHub. Every push to `main` auto-deploys to production; every pull request gets its own preview URL.

## Alternatives Considered

- **Netlify** — a comparable platform, but with less complete support for newer Next.js features (Server Components, some ISR/edge behavior) than Vercel, which builds Next.js.
- **Self-hosted (Docker on a VPS)** — full control, but adds real, ongoing operational burden (deploy pipelines, scaling, TLS) that a 5-person side project doesn't have the bandwidth to maintain.

## Consequences

- **Positive:** Zero-config deploys; every PR is independently reviewable via its own live preview URL before merging, which supports the team's PR-review workflow.
- **Negative:** Vercel's serverless function body limit (4.5 MB) directly shaped the media upload architecture — it's the reason client-side direct-to-B2 uploads were necessary (see ADR-0004). Preview deployments are real running app instances, not static snapshots, which is why database environment isolation (ADR-0003) is a genuine risk rather than a theoretical one.
