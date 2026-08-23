# CrimsonC9

The website for **CrimsonC9** — a techno artist collective spanning Berlin, Cologne, and Aachen.

> _"Change Through Music."_

**crimsonc9.com** · Next.js 16 (App Router) · TypeScript · Payload CMS · Postgres · Vercel

---

## Getting started

```bash
git clone https://github.com/C9DevOne/crimson-c9-website.git
cd crimson-c9-website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You'll need a `.env.local` for anything touching Supabase or external APIs — ask a teammate with existing access. Never commit it.

Full setup, Git workflow, and review process: [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md).

## Documentation

All project documentation lives in [`/docs`](./docs). Start with [`docs/ONBOARDING.md`](./docs/ONBOARDING.md) — it explains what each doc is for and how they fit together.

|                                                  |                                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| [`docs/VISION.md`](./docs/VISION.md)             | Brand identity, design language, coding standards — the anchor doc |
| [`docs/TECH_STACK.md`](./docs/TECH_STACK.md)     | Live snapshot of what we run on                                    |
| [`docs/adr/`](./docs/adr/README.md)              | Why each architectural call was made                               |
| [`docs/concepts/`](./docs/concepts/)             | How a specific page or system actually works                       |
| [`docs/WORKING_LOG.md`](./docs/WORKING_LOG.md)   | Open risks, pending decisions, known work                          |
| [`docs/TRAP_LORE.md`](./docs/TRAP_LORE.md)       | Mistakes already survived, so nobody repeats them                  |
| [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) | Setup, Git workflow, PR review                                     |
| [`docs/TEAM.md`](./docs/TEAM.md)                 | Who to loop in on what                                             |

AI coding tools read [`AGENTS.md`](./AGENTS.md), which points at the same docs.

## Commands

```bash
npm run dev       # start the dev server
npm run lint      # eslint
npm run format    # prettier
npm run migrate   # payload migrate
npx tsc --noEmit  # typecheck
```

## Project status

The prototype is under construction. `/` currently still serves the stale "Bunker Dreams" ticket portal from the last event — see [`docs/WORKING_LOG.md`](./docs/WORKING_LOG.md) for what's in flight and what's blocked.
