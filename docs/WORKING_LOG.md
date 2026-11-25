# Working Log

_Status: Current — 2026-11-23_

The project's week-to-week state: what's unresolved, what's risky, and what's known work not yet done. Unlike the other docs, this one isn't meant to go through a review pass each time — edit it freely as things change or get resolved. Just delete an item once it's actually closed; its resolution belongs wherever it was properly decided (an ADR, a `CONCEPT_*.md`, etc.), not preserved here.

**What doesn't belong here:** a decision that's been made (→ ADR), a mistake already survived (→ `TRAP_LORE.md`), or a question specific to one page (→ that page's own `CONCEPT_*.md` §Open Questions). This log is for things that are either genuinely cross-cutting, or don't have another home yet.

---

## Current State

**The site is live on its own infrastructure.** `crimsonc9.com` serves a single-page landing site from a Docker container on the Hetzner box, behind Caddy. Vercel is disconnected.

The page is hero → upcoming events → channels → contact. The hero sets "Change Through Music" in Cinzel Decorative over the event photograph, with a chromatic-displacement treatment that tracks the pointer; the background is a seeded starfield with occasional constellations and meteors. The navbar is gone — navigation is the Lantern, now a sphere of light between two beams, which turns a full revolution on open.

`/imprint` and `/terms` are live and legally required. The Impressum carries real publisher details (see below). Everything else — `/about`, `/artists`, `/connect`, `/contact`, `/events`, `/music`, `/support` — stays disabled under Next's `_`-prefix convention, and `proxy.ts` redirects anything unlisted to `/` in production.

**Payload is dormant, not deleted.** `src/app/_payload` is out of routing, `withPayload()` is off, and nothing connects to Postgres. Collections, access rules, generated types and the initial migration are all untouched; it comes back with the artist page.

**Staging exists.** `staging.crimsonc9.com` is behind the team login and deploys **any branch** on a manual workflow dispatch — it is the preview mechanism now that Vercel's per-PR URLs are gone.

**Deploys:** merge to `main` → CI → image to GHCR → `deploy.sh` over a restricted SSH key → healthcheck-gated swap with automatic rollback.

## Open Risks

Things that could cause real problems if left unresolved, roughly in order of how much they block.

> **The four database items below are dormant, not fixed.** Nothing connects to Postgres in v1, so none of them can bite today — and all four come back the moment Payload does. Read them as a checklist for that day, not as live fires. Noted 2026-11-23.

- **Row-Level Security is disabled on at least one table — confirmed 2026-08-26 via Supabase's own security advisor, flagged CRITICAL.** `rls_disabled_in_public` and `sensitive_columns_exposed` both fired; the sensitive-columns flag almost certainly means the `Users` collection (password hashes, emails).

  This is not something Payload's own `access: {...}` rules protect against. Those rules only govern requests through Payload's API — Supabase separately auto-exposes every table through its own direct REST API (PostgREST), and without RLS enabled on a table, that second path has no access control at all. Right now, anyone with the project URL can read (and possibly write) through it, regardless of what any collection config says.

  Not safe to fix blind: enabling RLS with no policies defined can just as easily break Payload's own read/write access. Nick's call — Supabase is his domain and this is exactly the kind of change that needs someone who knows the schema.

- **One database is shared across Production, Preview, and local development — confirmed 2026-08-23, no longer a hypothesis.** `DATABASE_URI` resolved to the same Supabase database in every environment, and at least one contributor's local `.env.local` pointed at it too. The Vercel environments are gone, but the single shared database remains — and when Payload returns it will have **one** server-side `.env` per stage, which makes separating prod from local a deliberate step somebody has to take rather than something the platform did.

  The local-dev part is the sharp end. `payload.config.ts` sets `push: process.env.NODE_ENV === "development"`, so running `npm run dev` against this database lets Payload **alter the live schema directly**, with no migration and no prompt. That has already happened — see the migration-history risk below.

  Now that `artists` holds real content, this is the highest-priority item on this list. Minimum fix: a separate database for local development. Proper fix: a separate database per environment. Supabase's branching feature may cover Preview — the `Supabase Preview` check appears on PRs but reports `skipping`, so the integration is installed and inactive. Worth investigating.

- **The tracked migration has never been applied; the live schema came from dev push.** `payload_migrations` contains exactly one row — `name: dev`, `batch: -1` — which is Payload's marker for a schema synced by dev push rather than by a migration. `migrations/20260716_215159_initial_schema` is not recorded there and has never run.

  So the live schema is whatever the most recent `npm run dev` synced, and nothing guarantees it matches the migration file in the repo. Two consequences: the database can't be reproduced from the repo, and running `npm run migrate` against it now would try to create tables that already exist.

  Needs a deliberate decision before migrations can be trusted at all: either baseline the existing schema as already-applied, or rebuild from migrations onto a fresh database. Backend call — loop in Nick.

- **`payload migrate` has never been run in CI and is untested on the current Node.** It previously failed on Vercel with `ERR_REQUIRE_ASYNC_MODULE`: the Payload CLI loads `payload.config.ts` through `tsx`, which `require()`s it, while `@payloadcms/richtext-lexical` is ESM with top-level await, which Node refuses to `require()` from 22.12 on.

  Vercel is gone and the project now pins Node 26.13.1 everywhere, so the old framing no longer applies — but nothing has verified that `payload migrate` works on 26 either, and the Dockerfile has no migrate step. Settle this before Payload returns; the tickets image runs its migration as the container's first command and is the pattern to copy.

- **B2 media storage is entirely unimplemented.** `@payloadcms/storage-s3` is still not in `package.json`. Less urgent than it was: with Payload dormant there is no upload path at all, so nothing can be lost. The container's filesystem is still ephemeral, so the warning stands for the day uploads return. Build against ADR-0004 + `concepts/CONCEPT_media-pipeline.md` (presigned/`clientUploads`).
- **Postgres backup configuration is unconfirmed.** Nobody has verified what Supabase's backup setup actually is. Dormant with the database.

- **Legal texts have not been checked by a lawyer.** The Impressum and the privacy policy are the TIC-25 drafts — accurate, but unreviewed, and now public. TIC-31 covers the external check. The privacy policy still carries a visible note that data-processing agreements with Hetzner, Cloudflare and Zoho are unconfirmed.

---

## Pending Decisions

Real choices that need to be made, with no deadline forcing them yet.

- **Connect affordance placement** — global vs. homepage-only, currently leaning global pending how it looks in context. See `concepts/CONCEPT_site-structure.md` §3.3.
- **YouTube Content ID exposure** for DJ set uploads — unresolved.
- **Finished export file retention** after a set is published to YouTube — unresolved.
- **Artists secondary navigation** — the wheel redesign into a dormant/hologram experience (`concepts/CONCEPT_page-artists.md`) dropped the "see several artists at once" view the old wheel gave for free. A persistent name-index side panel is proposed to compensate but not yet confirmed — needed before that page's navigation section is complete.

---

## Pending Actions

Known work, not yet done. Not decisions — just things somebody needs to actually build or write.

- **Restore the interior routes as prototype pages ship.** Each is `_`-prefixed under `src/app/(frontend)/`; drop the prefix and uncomment the matching entry in `Footer.tsx` / `AppSidebar.tsx`. `/imprint` and `/terms` are legally required in DE and must be back before public launch.
- **Create `/docs/personal/` preference files** per contributor — `aaron.md` exists; others don't.
- **robots.txt and sitemap.xml** — neither exists and the site is public (CRI-8).
- **Supersede or retire the pre-prototype page concepts.** `CONCEPT_page-homepage.md` describes a compass-navigation homepage that the live landing page is not, and `CONCEPT_page-universal-menu.md` §1 describes a paper lantern that is now a sphere of light. Both are being revisited deliberately rather than patched — see the note at the end of the menu concept.
- **Backfill names on the three pre-dating entries in `TRAP_LORE.md`**, if whoever hit them wants to claim them. Minor, no rush.
- **Wire up B2 storage** — install `@payloadcms/storage-s3`, create the bucket-scoped application key (not the master key), set the CORS `PUT`+`GET` rules, and set `S3_*` env vars in each stage's server-side `.env`. Full checklist in `concepts/CONCEPT_media-pipeline.md`. Blocked on Payload returning.
- **Confirm Postgres backups are on, check the retention window, and run one actual restore.** An untested backup is a hypothesis. Schedule a restore test twice a year (DB + a sample file from B2).
- **2FA on the org email**, with recovery codes stored somewhere a second person can reach them. 2FA living only on one phone is still a single point of failure.
- **Decide what happens to the pre-prototype routes** — `/contact` overlaps the form scoped into `/connect`; `/support` has no clear purpose against current scope; `/imprint` and `/terms` are legally required and need a home in the navigation model; `/dev/*` should not be reachable in production. Listed in `concepts/CONCEPT_site-structure.md` §2.
- **Scope the C9 Media Portal build** — spec is complete and ready to build against (`concepts/CONCEPT_C9-media-portal.md`): one `Assets` collection with a `stage` field, 5 GB upload threshold, guest-only consent, email notification, no reviewer assignment. Depends on B2 being wired first.

---

## Deferred (not pending — deliberately parked)

Reminder-only, full detail in `concepts/CONCEPT_site-structure.md` §6: individual artist pages, artist self-serve accounts, Shop, Broadcast/News (scrapped), Library search & accounts, mobile layout (immediately after prototype, not distant).
