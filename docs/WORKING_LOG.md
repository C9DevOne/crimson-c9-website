# Working Log

_Status: Current — 2026-08-23_

The project's week-to-week state: what's unresolved, what's risky, and what's known work not yet done. Unlike the other docs, this one isn't meant to go through a review pass each time — edit it freely as things change or get resolved. Just delete an item once it's actually closed; its resolution belongs wherever it was properly decided (an ADR, a `CONCEPT_*.md`, etc.), not preserved here.

**What doesn't belong here:** a decision that's been made (→ ADR), a mistake already survived (→ `TRAP_LORE.md`), or a question specific to one page (→ that page's own `CONCEPT_*.md` §Open Questions). This log is for things that are either genuinely cross-cutting, or don't have another home yet.

---

## Current State

The live site still serves the **"Bunker Dreams" Weeztix ticket portal** at `/` — a temporary setup built for the last event. It's stale and scheduled for removal (see Pending Actions).

The `_`-prefix route disabling that accompanied it **has already been reverted**: `/about`, `/artists`, `/connect`, `/contact`, `/events`, `/music`, `/imprint`, `/support` and `/terms` are all live routes again, in their pre-prototype state. So the site is currently neither a clean portal nor the prototype — it's a half-reverted mix, which is the main argument for getting the placeholder up sooner rather than later.

The prototype itself — compass navigation, the pages documented in `concepts/CONCEPT_site-structure.md` — is being built behind that, not yet live.

---

## Open Risks

Things that could cause real problems if left unresolved, roughly in order of how much they block.

- **Preview/Production `DATABASE_URI` isolation is unconfirmed.** If Preview deployments share a database with Production, every PR preview build risks running migrations against live data — Preview is a real, fully-running deployment, not a screenshot; it executes and connects to whatever database its `DATABASE_URI` points at. Must be resolved with whoever owns Supabase before migrate-on-build is re-enabled.
- **B2 media storage is entirely unimplemented.** Checked 2026-08-23: `@payloadcms/storage-s3` is not in `package.json`, and `payload.config.ts` still uses Payload's local-filesystem upload handling with a 10 MB cap. Vercel's filesystem is ephemeral, so **any media uploaded in production today is lost on redeploy.** This also settles the old "documented two different ways" question — neither the presigned model nor the `afterChange` server-routed model is running, because nothing is. Build against ADR-0004 + `concepts/CONCEPT_media-pipeline.md` (presigned/`clientUploads`) when wiring it up.
- **Postgres backup configuration is unconfirmed.** Nobody has verified what Supabase's backup setup actually is for this project.

---

## Pending Decisions

Real choices that need to be made, with no deadline forcing them yet.

- **Animation library** — Framer Motion vs. GSAP split. Tracked properly in [`ADR-0008`](./adr/0008-animation-library-framer-vs-gsap.md), status Proposed.
- **Ticketing platform is not yet decided** — Pretix is the leading candidate, not an accepted choice; deployment target (Railway/Hetzner/DigitalOcean) is downstream of that and further off still. See [`ADR-0009`](./adr/0009-pretix-ticketing.md), status Proposed.
- **Homepage environmental motif** — clouds vs. starfield, or both. Non-essential, to be decided visually. See `concepts/CONCEPT_site-structure.md` §7.
- **Connect affordance placement** — global vs. homepage-only, currently leaning global pending how it looks in context. See `concepts/CONCEPT_site-structure.md` §3.3.
- **YouTube Content ID exposure** for DJ set uploads — unresolved.
- **Finished export file retention** after a set is published to YouTube — unresolved.
- **Artists secondary navigation** — the wheel redesign into a dormant/hologram experience (`concepts/CONCEPT_page-artists.md`) dropped the "see several artists at once" view the old wheel gave for free. A persistent name-index side panel is proposed to compensate but not yet confirmed — needed before that page's navigation section is complete.

---

## Pending Actions

Known work, not yet done. Not decisions — just things somebody needs to actually build or write.

- **Build the under-construction placeholder** — single page, social links, contact, a small dragon-under-construction visual. Replaces the Weeztix portal while the prototype is built.
- **Decommission the Weeztix portal** and restore real routes as prototype pages ship.
- **Create `/docs/personal/` preference files** per contributor — agreed on as the pattern, none written yet.
- **Backfill names on the three pre-dating entries in `TRAP_LORE.md`**, if whoever hit them wants to claim them. Minor, no rush.
- **Wire up B2 storage** — install `@payloadcms/storage-s3`, create the bucket-scoped application key (not the master key), set the CORS `PUT`+`GET` rules, and set `S3_*` env vars **per Vercel environment**. Full checklist in `concepts/CONCEPT_media-pipeline.md`.
- **Take migrations out of the build command permanently.** `next build` should build. A failed build is harmless; a half-applied migration is not.
- **Confirm Postgres backups are on, check the retention window, and run one actual restore.** An untested backup is a hypothesis. Schedule a restore test twice a year (DB + a sample file from B2).
- **2FA on the org email**, with recovery codes stored somewhere a second person can reach them. 2FA living only on one phone is still a single point of failure.
- **Protect Vercel preview deployments.** Preview URLs are public by default — unreleased content on a preview build is the most common way it leaks, because nobody thinks about previews.
- **Decide what happens to the pre-prototype routes** — `/contact` overlaps the form scoped into `/connect`; `/support` has no clear purpose against current scope; `/imprint` and `/terms` are legally required and need a home in the navigation model; `/dev/*` should not be reachable in production. Listed in `concepts/CONCEPT_site-structure.md` §2.
- **Scope the C9 Media Portal build** — spec is complete and ready to build against (`concepts/CONCEPT_C9-media-portal.md`): one `Assets` collection with a `stage` field, 5 GB upload threshold, guest-only consent, email notification, no reviewer assignment. Depends on B2 being wired first.

---

## Deferred (not pending — deliberately parked)

Reminder-only, full detail in `concepts/CONCEPT_site-structure.md` §6: individual artist pages, artist self-serve accounts, Shop, Broadcast/News (scrapped), Library search & accounts, mobile layout (immediately after prototype, not distant).
