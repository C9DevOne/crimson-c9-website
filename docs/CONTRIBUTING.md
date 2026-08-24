# CrimsonC9 Contribution Guide

_Status: Current — 2026-08-23_

Welcome to the team! :D This document covers the first practical steps — local setup and how code gets reviewed and merged. Read it once at the start, ask questions as they come up.

For brand identity, design language, and coding standards, read [`VISION.md`](./VISION.md). For what the stack currently is and why, see [`TECH_STACK.md`](./TECH_STACK.md) and [`/docs/adr/`](./adr/README.md). For how the docs fit together, see [`ONBOARDING.md`](./ONBOARDING.md). Full project tracking lives in Linear.

---

## Getting Started

### Prerequisites

- Node.js v20 or higher (v24 LTS recommended)
- Git
- A GitHub account added as a collaborator on this repo

### Clone and run locally

```bash
git clone https://github.com/C9DevOne/crimson-c9-website.git
cd crimson-c9-website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000/) in your browser. You should see the site running locally.

> **Windows users:** if you get a Git "dubious ownership" error, run `git config --global --add safe.directory <path-to-project>`. Use backslashes for paths in PowerShell.

### Environment variables

You'll need a `.env.local` file — the site won't run at all without it, not just the parts that touch Supabase.

```bash
cp .env.example .env.local
```

`.env.example` lists every variable, what it's for, and where to get a real value. Fastest path to real values: `vercel link` once, then `vercel env pull .env.local` any time — pulls current values straight from the team's Vercel project instead of asking a teammate to paste them somewhere. Never commit `.env.local`, it's already in `.gitignore`.

Full context on what each variable actually does, the three-environment model, and what's likely coming next: [`concepts/CONCEPT_environment-variables.md`](./concepts/CONCEPT_environment-variables.md).

---

## Branch Workflow

We use a simple feature branch workflow. `main` is protected — nobody pushes directly to it. Everything goes through a Pull Request.

### The flow

```
1. Pull latest main
2. Create a new branch for your task
3. Do your work, commit regularly
4. Push your branch to GitHub
5. Open a Pull Request
6. Someone reviews and approves
7. Merge into main — Vercel deploys automatically
```

### Branch naming

Name your branch after what it does, using the same prefixes as commits, and include the Linear issue ID:

```
feat/CRI-12-artist-roster
fix/CRI-31-navbar-mobile-layout
style/CRI-8-homepage-hero-spacing
refactor/CRI-19-gsap-scroll-hook
docs/CRI-45-adr-animation-library
```

Keep it lowercase, hyphens not spaces or underscores.

### Starting a new branch

Always branch off the latest version of main:

```bash
git checkout main
git pull origin main
git checkout -b feat/CRI-XX-your-feature-name
```

Don't branch off someone else's feature branch unless you're explicitly building on their work and it hasn't merged yet.

---

## Making Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) format — keeps history readable and makes it easy to understand what changed and why.

```
feat: add artist roster hover overlay
fix: correct mobile nav z-index
style: adjust hero section padding
refactor: extract GSAP scroll logic into custom hook
docs: update VISION.md with symbiosis language
```

**Commit often.** Small, focused commits are easier to review and easier to revert if something goes wrong. Don't save up a week of work into one giant commit.

---

## Opening a Pull Request

When your branch is ready:

1. Push it to GitHub: `git push origin feat/your-branch-name`
2. GitHub will prompt you to open a PR — click it, or go to the repo and click "Compare & pull request"
3. Write a clear title (same format as a commit message)
4. In the description, briefly explain what you built and any decisions you made
5. Link the PR from its Linear issue so it's traceable

Vercel automatically builds a **preview URL** for your branch within a couple of minutes of pushing. Include that link in your PR description so reviewers can see the changes live without pulling your branch locally.

### PR size

Keep PRs focused — one feature or one fix per PR. A PR touching 5 files that does one thing gets reviewed in 5 minutes; one touching 30 files that does six things takes much longer and things get missed. If your task is large, break it into multiple PRs that build on each other.

---

## Merging & Review

**Default:** open the PR, flag it in Linear (comment or mention on the issue) and/or the team WhatsApp, and give someone a chance to look before merging. Anyone on the team can review and approve — no assigned reviewers, peer review builds shared understanding of the codebase either way.

**Self-merge, when it's warranted:** for small, low-complexity changes — styling tweaks, copy edits, minor fixes — it's fine to self-approve and merge without waiting, as long as you're genuinely confident it's safe. This is a judgment call, not a size threshold. If you're unsure whether something counts as trivial, treat it like it doesn't and wait for a second look.

**Bigger changes** — new features or pages, anything touching backend or shared infrastructure, architectural decisions — should get an actual review before merging wherever possible. If you're genuinely blocked with nobody available, the same judgment applies: merge if you're confident it's safe, and say so plainly in the PR description rather than merging quietly.

### Response time

If you're waiting on a review, a PR should get a first look within **24 hours**. If you're blocked past that, say so — don't just sit idle. If you're reviewing and can't get to it fully right away, leave at least a comment so the author knows it's been seen.

### What to look for when reviewing

- Does it work? (Check the Vercel preview URL)
- Does it match the design language in `VISION.md`? (colours via CSS variables, correct fonts, spacing)
- TypeScript only — no plain `.js` files
- No hardcoded colour values — always use CSS variables like `var(--brand-crimson)`
- Conventional Commits format on commits
- Nothing obviously broken elsewhere on the site

You don't need to be exhaustive. The goal is a second pair of eyes, not a full audit.

---

## Coding Conventions

Full detail lives in [`VISION.md`](./VISION.md) §6 — this is the short version, worth repeating because review checks against it directly:

- **App Router only** — never the Pages Router
- **TypeScript everywhere** — all files are `.tsx` or `.ts`
- **Tailwind CSS + CSS variables** — no hardcoded colours or fonts
- **Radix UI** for accessible primitives — don't add a new component library without discussing first
- **Icons** — `lucide-react` for UI, `react-icons` for brand/social, kept deliberately separate

If you're unsure about a decision, just ask before building — faster than building the wrong thing and redoing it.

---

## Known Pitfalls

Mistakes already made on this project — and how to avoid repeating them — live in [`TRAP_LORE.md`](./TRAP_LORE.md). Add traps and fixes as they accumulate, to save the rest of the team from going through the same shit again.

---

## Questions

- **Technical / codebase questions** — team chat, or comment on the relevant Linear issue
- **Design questions** — check [`VISION.md`](./VISION.md) first, then ask in team chat
- **Stuck on something?** — ask in the group chat, someone will know (hopefully ;P)

_Domain ownership — design sign-off, backend/infra, and so on — lives in its own doc: [`TEAM.md`](./TEAM.md)._

---

_Living document — open a PR to change anything in it._
