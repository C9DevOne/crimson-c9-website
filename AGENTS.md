<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# run 'npm install' when first starting

# lint, format, and run 'npx tsc --noEmit' after every change that is made; you do not need to mention that you have run them

# DO NOT run build commands (e.g., do NOT run 'npm run build' or 'next build')

# NEVER read, log, or include the contents of `.env.local` or any `.env*.local` file — these contain secrets

<!-- END:nextjs-agent-rules -->

---

# CrimsonC9 — Agent Context

**This file is a pointer, not a copy.** It is the single entry point for every AI coding tool used on this project — `CLAUDE.md` imports it, `GEMINI.md` points at it. Content lives once, in `/docs/`, so it can't drift between tools.

Before working on this codebase, read:

| Doc                                              | What it gives you                                                                        |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| [`docs/VISION.md`](./docs/VISION.md)             | Brand identity, design language, design tokens, coding standards                         |
| [`docs/TECH_STACK.md`](./docs/TECH_STACK.md)     | What the project currently runs on, linking to full reasoning in `docs/adr/`             |
| [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) | Local setup, Git workflow, how PRs get reviewed and merged                               |
| [`docs/TRAP_LORE.md`](./docs/TRAP_LORE.md)       | Mistakes already made on this project — don't repeat them                                |
| [`docs/WORKING_LOG.md`](./docs/WORKING_LOG.md)   | Current open risks and pending decisions — read this before assuming anything is settled |
| [`docs/ONBOARDING.md`](./docs/ONBOARDING.md)     | How the docs fit together, and how ADRs work                                             |
| `docs/concepts/CONCEPT_*.md`                     | The relevant one for whatever page or feature is actually being worked on                |

If `docs/personal/<name>.md` exists for whoever you're working with, follow the preferences in it too. Those files are gitignored and local to each contributor.

## Rules that apply to you specifically

- **Consult before creating.** New files, documents, or baked-in decisions get proposed and discussed before being drafted in full — not delivered as a finished, unreviewed fait accompli. See `docs/VISION.md` §5.
- **Never hardcode a design token.** Colours and fonts always reference the CSS variable (`docs/VISION.md` §4). If a value isn't tokenised yet, flag it and ask rather than inventing one.
- **Never add a dependency without asking**, however small or obviously useful it looks. See `docs/TRAP_LORE.md`.
- **An Accepted ADR is never edited.** If a decision needs to change, write a new ADR that supersedes it. See `docs/adr/README.md`.

Don't duplicate content from those docs into this file. If something needed for a task is missing from all of them, that's a sign it belongs in one of them — add it there, not here.
