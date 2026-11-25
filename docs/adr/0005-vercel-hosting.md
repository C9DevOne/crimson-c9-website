# ADR-0005: Vercel for Hosting and Deployment

**Status:** Accepted 2026-07 · **Superseded 2026-11-22 — the site runs on Hetzner**
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

---

## Update — 2026-11-22: moved to Hetzner

This decision no longer describes what runs. `crimsonc9.com` is served by a Docker container on the team's Hetzner box, behind Caddy, deployed by GitHub Actions through GHCR.

**What changed is not the reasoning but the premise.** This ADR traded control for not having to run a server. The team now runs one anyway — c9-hub, Docmost, PhenoQuest and the ticket shop all live on it, with Caddy, backups and a deploy pipeline already built and paid for. Against that, Vercel was an _additional_ provider, not a saved operational burden. Moving removed a dependency.

What it cost: no per-PR preview URLs (staging is a manual dispatch instead), and image optimisation and edge caching are now ours to think about.

What it bought: one less account in the supply chain, no 4.5 MB serverless body limit shaping the media architecture, and the site sitting beside the ticket shop it links to.

Infrastructure lives in `C9DevOne/c9-infra`; the app's own Dockerfile, compose stacks and deploy script are in this repo under `deploy/`.
