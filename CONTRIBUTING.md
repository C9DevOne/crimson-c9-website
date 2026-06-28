# CrimsonC9 Contribution Guide

Welcome to the team! <3 This document outlines the most important first steps — how to set up the project locally and our Git workflow -> how code gets reviewed and merged. Feel free to read it once at the start and ask any questions where they come up.

For full project context (stack, design language, coding conventions, infrastructure), read `AI_CONTEXT.md` in the repo root and take a look at the assana project brief

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

> **Windows users:** If you get a Git "dubious ownership" error, run: `git config --global --add safe.directory H:/path/to/project` Use backslashes for paths in PowerShell.

### Environment variables

You'll need a `.env.local` file for any features that connect to Supabase or external APIs. Ask Aaron or Nick for the values — never commit `.env.local` to the repo, it's already in `.gitignore`.

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

Name your branch after what it does, using the same prefixes we use for commits:

```
feat/artist-roster-page
feat/mastering-tool-integration
fix/navbar-mobile-layout
style/homepage-hero-spacing
refactor/gsap-scroll-hook
docs/update-ai-context
```

Keep it lowercase, use hyphens not spaces or underscores.

### Starting a new branch

Always branch off the latest version of main:

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

Do not branch off someone else's feature branch unless you're explicitly building on their work and it hasn't merged yet.

---

## Making Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) format. This keeps the history readable and makes it easy to understand what changed and why.

```
feat: add artist roster hover overlay
fix: correct mobile nav z-index
style: adjust hero section padding
refactor: extract GSAP scroll logic into custom hook
docs: update AI_CONTEXT with Backblaze B2 setup
```

**Commit often.** Small, focused commits are easier to review and easier to revert if something goes wrong. Don't save up a week of work into one giant commit.

---

## Opening a Pull Request

When your branch is ready:

1. Push it to GitHub: `git push origin feat/your-feature-name`
2. GitHub will show a prompt to open a PR — click it, or go to the repo and click "Compare & pull request"
3. Write a clear title (same format as a commit message)
4. In the description, briefly explain what you built and any decisions you made
5. Post the PR link in the team WhatsApp so someone knows to review it

Vercel will automatically build a **preview URL** for your branch within a couple of minutes of pushing. Include that link in your PR description so reviewers can see the changes live in the browser without having to pull your branch locally.

### PR size

Keep PRs focused. One feature or one fix per PR. A PR that touches 5 files and does one thing gets reviewed in 5 minutes. A PR that touches 30 files and does six things takes much longer and things get missed. If your task is large, break it into multiple PRs that build on each other (Rede mal Claude)

---

## Code Review

### Who reviews

Anyone on the team can review and approve a PR — this is intentional. You don't have to wait for anyone specifically unless it's a major architectural change. Please discuss these with everyone in the group chat before. Peer review is encouraged; it builds shared understanding of the codebase.

Soft guidelines:

- **Small changes** (styling, copy, minor fixes) — any one person approves, done
- **New features or pages** — Aaron should review before merging where possible
- **Backend-touching changes** (Supabase, API routes, external APIs) — Nick should be one of the approvers

### Response time

PRs should be reviewed within **24 hours** of being posted to WhatsApp. If you're blocked waiting for a review, say so in WhatsApp — don't just sit idle. If you're the one reviewing, leave at least a comment if you can't fully review right away so the developer knows you've seen it.

### What to look for when reviewing

- Does it work? (Check the Vercel preview URL)
- Does it match the design language in `AI_CONTEXT.md`? (colours via CSS variables, correct fonts, spacing)
- TypeScript only — no plain `.js` files
- No hardcoded colour values — always use CSS variables like `var(--brand-crimson)`
- Conventional Commits format on commits
- Nothing obviously broken in other parts of the site

You don't need to be exhaustive. The goal is a second pair of eyes, not a full audit.

---

## Coding Conventions

These are documented fully in `AI_CONTEXT.md`. The short version:

- **App Router only** — never use the Pages Router
- **TypeScript everywhere** — all files must be `.tsx` or `.ts`
- **Tailwind CSS** for styling — no inline styles, no separate CSS files unless absolutely necessary
- **No hardcoded colours** — use CSS variables: `var(--brand-crimson)`, `var(--background)`, etc.
- **GSAP animations** go in `components/animations/` or dedicated hooks in `hooks/`
- **Icons** — use `lucide-react` for UI icons, `react-icons` for brand/social icons
- **Component libraries** — Shadcn is approved, don't add new UI libraries without discussing first

If you're unsure about a decision, ask in WhatsApp before building — it's faster than building the wrong thing and having to redo it.

---

## It's a trap

A few things that have already caused problems on this project — save time, don't repeat them ;). Feel free to add anything that made you go grrr, so others can learn from your mistakes :D

| Thing                                         | Why not                                                          |
| --------------------------------------------- | ---------------------------------------------------------------- |
| `npm audit fix --force`                       | Previously downgraded Next.js from v15 to v9 — never use this    |
| Push directly to `main`                       | Branch protection will reject it anyway — always use a PR        |
| Hardcode colours like `#990000` in components | Use `var(--brand-crimson)` so the design system stays consistent |
| Add new dependencies without checking         | Ask first — we have a deliberate stack and don't want bloat      |
| Commit `.env.local`                           | It's gitignored for a reason — contains secrets                  |

---

## Questions

- **Technical / codebase questions** — WhatsApp dev group or comment on the relevant Asana task
- **Design questions** — check `AI_CONTEXT.md` first, then ask Aaron
- **Backend / Supabase questions** — Nick
- **Stuck on something?** — ask for help in the group chat, we are doing the teamwork is the dreamwork ting here

---

_Base Doc by Claude and changed by Aaron. Last updated June 2026._ _If you want to add/change anything in this document, just open a PR to fix it._
