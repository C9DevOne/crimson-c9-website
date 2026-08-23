# Personal context files

Everything else in this folder is **gitignored and local to you**. Nothing here gets committed except this README.

## What these are for

`VISION.md`, `CONTRIBUTING.md`, and the concept docs are deliberately impersonal — they describe the project, not the people working on it, so they hold up regardless of who's on the team. But working preferences are real and worth writing down: how you want things explained, what you're actively learning, quirks of your setup, how much detail you want in a review.

Those go in `docs/personal/<your-name>.md`. Whichever AI tool you work with reads it alongside the shared docs (see `AGENTS.md`), so you don't have to re-explain your preferences every session.

## Why they aren't committed

They're personal, they change often, and nobody else needs them. Committing them would mean review comments on how someone likes to be talked to, which is nobody's business but theirs.

If something in your personal file turns out to be a _project_ fact rather than a personal preference, move it into the shared docs where the whole team gets it.

## Format

No template. It's your file. A useful starting shape:

```markdown
# <Name>

## Background

What you know well, what you're still learning.

## How I like to work

Explanation depth, review style, how much to check in vs. just do it.

## Environment

OS, editor, anything that trips tooling up.

## Current focus

What you're working on right now.
```
