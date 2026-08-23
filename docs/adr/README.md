# Architecture Decision Records (ADRs) — CrimsonC9

## What this folder is

An ADR is a short, dated record of one architectural decision: the context that prompted it, what was decided, what alternatives were considered, and the consequences accepted. Unlike `VISION.md` or `TECH_STACK.md`, **ADRs are not living documents** — once a decision is Accepted, its file is not edited to reflect new information. If circumstances change enough to revisit a decision, a **new** ADR is written that explicitly supersedes the old one. This keeps a genuine history of _why_ the project looks the way it does, rather than one document that's been silently rewritten so many times nobody can reconstruct the original reasoning.

This matters more as the team grows past one person — it's the answer to "wait, why didn't we just use X?" six months from now, without relying on anyone's memory of a conversation.

## Status values

- **Proposed** — under consideration, not yet final
- **Accepted** — the current decision
- **Superseded by ADR-00XX** — no longer current; see the linked ADR for what replaced it
- **Deprecated** — no longer relevant, no replacement

## Index

| ADR                                                  | Title                                            | Status   |
| ---------------------------------------------------- | ------------------------------------------------ | -------- |
| [0001](./0001-nextjs-app-router.md)                  | Next.js (App Router) as the Frontend Framework   | Accepted |
| [0002](./0002-payload-cms-over-sanity.md)            | Payload CMS Instead of Sanity                    | Accepted |
| [0003](./0003-postgres-via-supabase.md)              | Postgres via Supabase                            | Accepted |
| [0004](./0004-backblaze-b2-media-storage.md)         | Backblaze B2 for Media Storage                   | Accepted |
| [0005](./0005-vercel-hosting.md)                     | Vercel for Hosting and Deployment                | Accepted |
| [0006](./0006-cloudflare-dns-namecheap-registrar.md) | Cloudflare DNS/CDN, Namecheap Registrar Only     | Accepted |
| [0007](./0007-radix-tailwind-component-layer.md)     | Radix UI + Tailwind for the Component Layer      | Accepted |
| [0008](./0008-animation-library-framer-vs-gsap.md)   | Animation Library — Framer Motion vs. GSAP       | Proposed |
| [0009](./0009-pretix-ticketing.md)                   | Pretix as Ticketing Platform (Replacing Weeztix) | Proposed |

## Adding a new ADR

1. Copy the template below into a new file: `00XX-short-title.md` (next sequential number).
2. Fill it in. Keep it short — a paragraph per section is usually enough.
3. Add a row to the index table above.
4. If it changes a prior decision, set the old ADR's status to `Superseded by ADR-00XX` — don't delete or rewrite it.

```markdown
# ADR-00XX: Title

**Status:** Proposed | Accepted | Superseded by ADR-00YY
**Date:** YYYY-MM-DD
**Deciders:** Names

## Context

What situation or problem prompted this decision?

## Decision

What was decided?

## Alternatives Considered

- Option — why not chosen
- Option — why not chosen

## Consequences

What do we gain? What do we accept as a trade-off?
```
