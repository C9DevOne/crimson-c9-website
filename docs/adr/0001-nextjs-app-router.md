# ADR-0001: Next.js (App Router) as the Frontend Framework

**Status:** Accepted
**Date:** 2026-04
**Deciders:** Aaron

## Context

CrimsonC9 needed a framework for a public, visually heavy, media-loaded website (video, large images, 3D elements) built and maintained by a small team with mixed experience levels. SEO and initial load performance matter for a discovery-driven site, and the team wanted a framework with a clear hosting story.

## Decision

Next.js using the **App Router exclusively** (never the Pages Router), written entirely in TypeScript.

The decision is the router model, not a version pin. Adopted on v15; the project runs v16 as of 2026-08. The running version is tracked in `TECH_STACK.md` — deliberately not restated here, so a routine framework upgrade never makes this record wrong.

## Alternatives Considered

- **Pages Router** — the older Next.js model. No React Server Components, meaning more data-fetching logic would ship to the client. Rejected for a media-heavy site where client bundle size directly affects load time.
- **Plain React SPA (Vite)** — simpler mental model, but no built-in SSR/SEO story and would require assembling routing, data fetching, and hosting separately.
- **Remix** — a reasonable alternative with a similar philosophy, but smaller ecosystem overlap with the team's chosen hosting (Vercel) and CMS (Payload, which has first-party Next.js integration).

## Consequences

- **Positive:** Server Components let pages fetch content (from Payload, from Postgres) directly on the server, reducing client-side JavaScript for a visual-first site. Native fit with Vercel deployment.
- **Negative:** The App Router's data-fetching model (Server vs. Client Components) is a real conceptual shift from older React patterns and requires the team to agree on conventions (documented in `VISION.md` §6) so components don't end up inconsistently structured across contributors.
