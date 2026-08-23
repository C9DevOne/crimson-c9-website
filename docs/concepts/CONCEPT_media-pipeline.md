# CrimsonC9 — Concept: Media Pipeline (B2 + Payload)

_Storage strategy: what goes where, how it gets there, how it's protected, when it's deleted._

_Status: Current — 2026-08-23 (v2, decisions resolved)_

> **Not yet implemented.** As of 2026-08-23 nothing below is wired up: `@payloadcms/storage-s3` is not installed, and `payload.config.ts` still writes uploads to the local filesystem (which is ephemeral on Vercel). This document is the architecture to build against, not a description of what runs — including the decisions-log line below claiming the bucket is "already wired into the backend", which records the rationale as it stood in July, not the state today. Tracked in `../WORKING_LOG.md`.

---

## Decisions log

| Date        | Decision                                                      | Why                                                                                                                  |
| ----------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 28 Jul 2026 | **One bucket** — `C9-Home-Storage`, organised by prefix       | Already wired into the backend; a second bucket means a second key, CORS config and lifecycle policy to keep in sync |
| 28 Jul 2026 | Prefixes: `media/`, `archive/`, `trash/`                      | Splitting later means copying one prefix, not untangling a mixed bucket                                              |
| 28 Jul 2026 | Bucket stays **private**; all delivery via `signedDownloads`  | Unreleased material must be restrictable; obscure URLs are not access control                                        |
| 28 Jul 2026 | `clientUploads: true` on the S3 adapter                       | Vercel's 4.5 MB function body limit otherwise breaks any real media upload                                           |
| 28 Jul 2026 | Large video masters **never** go through Payload              | Out-of-band CLI upload; Payload holds the metadata record only                                                       |
| 28 Jul 2026 | Static brand assets stay in `/public`                         | Resolves the open `/public` PNGs question — see rule below                                                           |
| 28 Jul 2026 | Payload **drafts/versions enabled**                           | Everyone can publish, so the safety net is undo, not permissions                                                     |
| 28 Jul 2026 | RAW deleted after ~3 months, **flag-gated + human-confirmed** | Automated deletion of masters on a timer is not acceptable risk                                                      |
| 28 Jul 2026 | Object Lock **not** in compliance mode on RAW                 | Would make the retention policy above impossible to execute                                                          |
| 28 Jul 2026 | B2 is archive + general assets; no public video playback yet  | Bunny/Cloudflare Stream decision stays parked                                                                        |

## The constraint everything follows from

**Vercel serverless functions cap request bodies at 4.5 MB.** Payload admin uploads pass through that function, so they fail above 4.5 MB even with S3 storage configured — the file still transits the server on its way to the bucket. It surfaces as a raw 413 / `FUNCTION_PAYLOAD_TOO_LARGE`, which reads like a bug rather than a platform limit. Known, frequently-hit Payload + Vercel issue.

Two `@payloadcms/storage-s3` options handle it:

- **`clientUploads: true`** — browser uploads straight to B2 via presigned URL, bypassing the function. **Requires a CORS PUT rule** on the bucket for our domains, or you get an opaque CORS error instead.
- **`signedDownloads`** (with `shouldUseSignedURL`) — serves files via presigned URLs rather than through the server. This is also our access-control mechanism for restricted material.

Known trade-off: client uploads **skip Payload's image processing** (resizing, crops, generated sizes). Anything needing derivatives is processed outside Payload — and not on Vercel, where the same limit applies.

## Three tiers of media

| Tier                    | Examples                                  | Where                       | How it gets there                                                                                           |
| ----------------------- | ----------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Static brand assets** | favicon, OG image, logo, lantern sprites  | `/public`, committed to git | Part of the repo — versioned with the code, which is correct for things that change when the design changes |
| **CMS content media**   | artist photos, event flyers, promo images | `media/` prefix in B2       | Payload admin, `clientUploads: true`                                                                        |
| **Large video masters** | event recordings, RAW footage             | `archive/` prefix in B2     | Out-of-band: `rclone` / S3 CLI. Payload holds a metadata record + object key                                |

**Rule for the `/public` question:** the test is not file type or size, it's _who changes it and when._ Fixed brand assets that change with the design belong in `/public`, versioned alongside the code and served from the edge. Anything an editor should change without a deploy belongs in Payload.

**Tier 3 is the one that keeps the system sane.** A 40 GB master has no business inside a CMS. Payload gets a row — key, title, event, date, size, type, consent, rights, retention — and the bytes live in B2. This also sidesteps the derivatives problem: proxies get generated locally with ffmpeg and uploaded the same way.

## Bucket setup (unblocks the Vercel env vars)

1. **Application key scoped to `C9-Home-Storage`** — not the master key. The master key can create and delete buckets; nothing in the app needs that, and a leaked master key is unrecoverable.
2. Capabilities: `listBuckets`, `listFiles`, `readFiles`, `writeFiles`, `deleteFiles`.
3. Env vars, set **per Vercel environment** (Production / Preview / Development separately):
   `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
4. **CORS**: allow `PUT` from production and preview domains. Required for `clientUploads`. B2 CORS rules are set via CLI/API, not the web UI.
5. Enable **versioning** before real content lands.

**When a second bucket becomes justified:** when site images want to be publicly cacheable while the archive stays private. Signed URLs and long-lived CDN caching don't mix — that's the split worth paying for. Because `media/` is already its own prefix, that migration is a prefix copy.

## Access control

- Bucket private; `signedDownloads` with `shouldUseSignedURL` so restricted files get short-lived URLs and public ones don't pay the signing cost
- Payload collection access control evaluated server-side on a status field — not on URL obscurity
- **Drafts/versions on.** Everyone can publish, so the protection is rollback, not permission. Config flag, no bureaucracy.
- **Protect Vercel preview deployments.** Preview URLs are public by default; unreleased content on a preview build is the most common leak, because nobody thinks about previews.

## Retention & deferred deletion

Policy: **RAW files only**, after ~3 months, only when explicitly flagged, with human confirmation before anything is destroyed. Delivered cuts and proxies are never eligible — they're small and expensive in effort to recreate.

**Do not use B2 lifecycle rules on masters.** Lifecycle rules delete by age and prefix, blindly — they cannot see a flag that lives in Payload. Blind age-based deletion on an archive is how you lose something someone needed.

Implementation:

1. Fields on the asset: `retention` (`keep` / `deferred-delete`) and `deleteAfter` (date, auto-set to +3 months when the flag is set)
2. **Scheduled job (GitHub Actions cron)** finds items past `deleteAfter` with the flag set, and **emails a digest — it does not delete.** Someone replies yes. Unattended deletion of masters on a timer is not a risk worth taking; a monthly human confirmation costs two minutes.
3. On confirmation, the object moves to the `trash/` prefix
4. A B2 lifecycle rule hard-deletes `trash/` after 30 days — the safe use of lifecycle rules: a prefix that only ever holds already-condemned files, with a grace period behind it

GitHub Actions rather than Vercel Cron: free scheduled workflows, already part of the stack, and it keeps a maintenance job out of the production deployment.

**Object Lock caveat:** compliance mode makes objects undeletable until retention expires — by anyone, including Backblaze support. That would block this policy outright. Use governance mode (overridable by an authorised key) or leave Object Lock off the `archive/` RAW prefix entirely.

## Environment isolation — STILL OPEN, highest risk

If Preview and Production share `DATABASE_URI`, a migration running during any PR preview build executes against the live database. That's not a deploy failure, it's data loss, and it fires on an unrelated PR when nobody's thinking about it.

1. **Confirm with Nick whether they're actually separate.** Vercel scopes env vars per environment — check whether `DATABASE_URI` is set once for all three or once per environment.
2. **Give Preview its own database.** The real fix; everything else is mitigation.
3. **Take migrations out of the build command.** `next build` should build. A failed build is harmless; a half-applied migration is not — different failure semantics, different step. Run migrations deliberately against Production only.
4. Until 2 and 3 are done, leave the build command as plain `next build`. The current revert is correct.

## Ops checklist

- [ ] **Postgres backups** — confirm they're on, check the retention window, and do one actual restore. Payload holds the catalogue; the bucket is worthless without the DB that describes it. Automatic backups nobody has restored are a hypothesis.
- [ ] **2FA on the org email**, recovery codes stored where a second person can reach them. Accounts on an org email is the right setup — but 2FA living only on one phone is still a single point of failure.
- [ ] Restore test scheduled twice a year (DB and a sample file from B2)
- [ ] README covering access and what runs where

## Video hosting — parked

B2 is archive-only for now, so no decision needed. If public playback ever becomes the goal, B2 alone won't do it (no transcoding, no adaptive bitrate) and the choice is Bunny Stream vs Cloudflare Stream. Decide what the video is _for_ before comparing prices.

## Still open

1. **None of this is wired yet** — `@payloadcms/storage-s3` isn't installed and Payload still writes locally. Everything below this line is downstream of that first step.
2. Preview/Production DB separation — **blocked on Nick**
3. Whether large masters enter this system now or stay manual through the first build
4. Who holds the CLI key for `archive/` uploads, and how it gets rotated

_(The older "all media to B2" strategy is superseded by the `/public` rule above. `AI_CONTEXT.md`, which carried it, is retired — `../VISION.md` and `../TECH_STACK.md` carry this now.)_
