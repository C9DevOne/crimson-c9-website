# CONCEPT: Environment Variables

_Status: Current — 2026-08-24_

What every environment variable this project uses actually is, why it exists, how to get set up with real values, and what's coming next as the prototype gets built out further. Written to be read cold — no prior backend experience assumed.

---

## 1. What an env var actually is, and why this matters here

Code needs values that differ per machine and must never be committed to git — database addresses, signing keys, API tokens. Hardcoding them means secrets sitting in git history forever (recoverable by anyone who ever clones the repo, even after you "remove" them in a later commit), and one fixed value for every environment instead of one per environment.

So instead, the code asks the platform for the value by name at runtime — `process.env.DATABASE_URI` in `payload.config.ts`, for example — and the platform supplies it. Locally that comes from a `.env.local` file (gitignored, never committed). On Vercel it comes from the dashboard. Same code, different values, nothing secret ever touches the repo.

**`.env.example`** (repo root) is the reference: every variable this project uses or will soon use, with a comment on what it is and where to get a real value. Copy it to `.env.local` and fill in the real values — never the other way around.

## 2. The three-environment model

Vercel builds this app in three separate contexts, each with its own independent set of variable values:

| Environment     | When it runs                  | What it is                                                                        |
| --------------- | ----------------------------- | --------------------------------------------------------------------------------- |
| **Production**  | Every push to `main`          | The real, live site                                                               |
| **Preview**     | Every other branch or PR      | A live, fully-running copy of that branch — real code executing, not a screenshot |
| **Development** | `npm run dev` on your machine | Whatever your own `.env.local` points at                                          |

The critical thing to internalize: **Preview is not a mockup.** It's the actual app, actually running, actually connecting to whatever database its `DATABASE_URI` points at. If Preview and Production share the same database — which is currently the case here, see §6 — every PR you open is a live process with write access to real data.

## 3. Current variables

| Variable                 | Required?                   | Secret?                                      | What it is                                                                                   |
| ------------------------ | --------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `DATABASE_URI`           | Yes                         | **Yes — highest sensitivity in the project** | Postgres connection string, password included                                                |
| `PAYLOAD_SECRET`         | Yes                         | Yes, but lower stakes                        | Signs admin login sessions                                                                   |
| `NEXT_PUBLIC_SERVER_URL` | No                          | No                                           | Canonical site URL; has a working fallback                                                   |
| `NODE_ENV`               | Set automatically           | No                                           | `development` locally, `production` on every Vercel build (Preview included)                 |
| `VERCEL_URL`             | Set automatically by Vercel | No                                           | Auto-generated deployment URL, used as a fallback if `NEXT_PUBLIC_SERVER_URL` is ever missed |

### `DATABASE_URI` — an address with credentials baked in

It's a **connection string**: everything needed to find and log into the database, in one line.

```
postgresql://postgres.abcd1234:YourPassword@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
└───┬────┘   └──────┬───────┘ └────┬─────┘ └──────────────┬──────────────────────┘ └┬─┘ └──┬───┘
 protocol        username       password                 host                      port  database
```

Read it as a URL, because it is one — protocol, who, password, where, which port, which database. The password lives **inside the string itself**, which is exactly why this is the single most sensitive value in the whole project. Anyone with this string has the database.

**The port matters, and it's not arbitrary.** Postgres connections are expensive and limited to a few hundred at once; serverless functions are the opposite — many short-lived instances spinning up under load. A **pooler** sits in front and shares a small set of real connections among many callers:

- **Port `6543` — transaction mode.** The connection is handed back to the pool after every transaction. Right for serverless: connect, do one thing, vanish. Trade-off: no session-level Postgres features like prepared statements.
- **Port `5432` — session mode.** The connection is held for as long as the process runs. Right for long-lived processes, and specifically for **migrations** — which is why `payload.config.ts`'s comments distinguish the two.

### `PAYLOAD_SECRET` — a signing key, not an address

Completely different in kind from `DATABASE_URI`. It doesn't point at anything or connect to anything — it's a random string used to **sign** the tokens issued when someone logs into the Payload admin. Every later request gets re-checked against the same key; a mismatched signature means a forged or tampered token.

Three consequences worth knowing:

1. **Must be genuinely random** — generate your own with `openssl rand -base64 32`, never pick something memorable.
2. **Must stay stable.** Changing it invalidates every existing session — everyone gets logged out at once.
3. **Safe to share across environments**, unlike `DATABASE_URI`. It isn't tied to any database or account, so the same value can be used in Preview, Production, and local dev without the risk that sharing `DATABASE_URI` carries.

## 4. Getting set up locally

**Recommended path:**

```bash
npm install -g vercel      # one-time, if you don't have the Vercel CLI
vercel link                # one-time per machine, links this folder to the team's Vercel project
vercel env pull .env.local # any time — pulls current real values straight from Vercel
```

This replaces "ask a teammate to paste you the values" — which is also a real security habit worth breaking, since anything pasted into a chat app sits in that app's history indefinitely, readable by anyone with access to the conversation later, long after it might matter.

**If you don't have Vercel access yet:** copy `.env.example` to `.env.local`, generate your own `PAYLOAD_SECRET` with the command above, and ask whoever owns the Vercel project (Aaron) or the Supabase project (Nick, per `TEAM.md`) for `DATABASE_URI` specifically — that one can't be generated, it has to come from the real database.

**If `npm run dev` throws `Missing required env var(s)`** — that's `payload.config.ts` failing fast on purpose, so the failure is immediate and points at exactly what's missing, instead of a page crashing later with a cryptic message three layers inside Payload's internals. Follow what the error says.

## 5. Coming soon — as the prototype gets built out

Nothing below is wired into the code yet. Listed here so the shape is known ahead of time, and so a `S3_*` var doesn't show up someday as a surprise nobody has context for.

**Backblaze B2 media storage** ([ADR-0004](../adr/0004-backblaze-b2-media-storage.md), [`CONCEPT_media-pipeline.md`](./CONCEPT_media-pipeline.md)) — `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`. Needed once `@payloadcms/storage-s3` is actually installed and configured. Until then, Payload writes uploads to the local filesystem, which doesn't survive a Vercel redeploy — confirmed missing, tracked in `WORKING_LOG.md`. The B2 key used here should be scoped to the `C9-Home-Storage` bucket specifically, never the account's master key — a leaked master key can create and delete buckets; nothing this app does needs that power.

**Ticketing platform** ([ADR-0009](../adr/0009-pretix-ticketing.md)) — Pretix is the leading candidate but not an accepted decision, so the actual variables aren't known yet. Whatever it turns out to need gets added here once the platform is picked, not before — an env var sitting around for a decision that hasn't been made is its own small trap (a future contributor might set it, assume it does something, and be confused when nothing uses it).

**Possibly, later: outbound email.** Nothing currently sends email from the app, but the Connect page's contact form and the [C9 Media Portal](./CONCEPT_C9-media-portal.md) spec's submission notifications both imply it eventually will. No variables exist for this yet because no transport (SMTP, Resend, Postmark, or similar) has been chosen — this is a prediction based on what's already specced elsewhere, not a confirmed plan, so don't build against it yet.

**GitHub Actions secrets — a different store entirely.** The media pipeline's retention digest is planned to run as a GitHub Actions cron job (`CONCEPT_media-pipeline.md`), not a Vercel function. GitHub Actions has its **own** separate secrets store (repo Settings → Secrets and variables → Actions) — a value living in Vercel's env vars is not automatically available to a GitHub Actions workflow, and vice versa. Worth knowing now so nobody spends time confused about why a Vercel-configured secret isn't visible inside a workflow file later.

## 6. The open risk this all points at

The highest-priority item in `WORKING_LOG.md`: `DATABASE_URI` currently resolves to the same Supabase database across Production, Preview, **and** local development. Combined with `payload.config.ts`'s `push: true` in dev mode — which lets `npm run dev` alter the live database schema directly, no migration, no prompt — this means anyone's local dev session or any open PR's Preview build can currently reshape or write to the real database.

This document explains _why_ that's dangerous (§2's "Preview is not a mockup," §3's port/pooling behavior applying identically regardless of which environment is connecting) but doesn't fix it — that's a decision for whoever owns Supabase (Nick, per `TEAM.md`), tracked as its own item in `WORKING_LOG.md`.

## 7. Rules of thumb

- **`NEXT_PUBLIC_` prefix means "ships to the browser."** Any variable named this way is bundled into client-side JavaScript and readable by anyone who opens dev tools — that's Next.js's own convention, not a project-specific choice. Never put a real secret behind a `NEXT_PUBLIC_` name.
- **Never paste a real secret into chat, an issue, a commit message, or this document.** If a secret is ever accidentally exposed this way, treat it as compromised — rotate it, don't just delete the message.
- **`.env.local` always wins over `.env.example`.** Next.js loads `.env.local` and ignores `.env.example` entirely at runtime — the example file is documentation only, never actually read by the app.
- **A missing var should fail loudly, not quietly degrade.** `payload.config.ts` throws immediately in local dev (not in production builds — see the comment in the file for why that split is safe) rather than letting the app limp along with an empty string standing in for a real value.
