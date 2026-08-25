# CrimsonC9 — Onboarding: How Our Docs Work

_Start here if you're new to the codebase. This explains where things live and why — not how to set up your local environment (that's a separate doc/step, ask in team chat if it's missing when you need it)._

## Where things live

| Doc                                          | What it's for                                                                                          | How often it changes                               |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| [`TECH_STACK.md`](./TECH_STACK.md)           | Live snapshot of what we currently run on — quick reference                                            | Often, as the stack changes                        |
| [`/docs/adr/`](./adr/README.md)              | Why we made specific architectural calls                                                               | Never edited after acceptance — only added to      |
| `VISION.md`                                  | Brand identity, design language, and dev/coding foundations                                            | Rarely — this is the anchor doc                    |
| `CONTRIBUTING.md`                            | Local setup, Git workflow, and how PRs get reviewed and merged                                         | As process evolves                                 |
| [`BACKBLAZE_SETUP.md`](./BACKBLAZE_SETUP.md) | Backblaze B2 provisioning, CORS setup, and env variable configuration guide                            | As storage operations evolve                       |
| `WORKING_LOG.md`                             | Week-to-week project state, open risks, pending decisions                                              | Continuously                                       |
| `CONCEPT_*.md`                               | Deep dive on how one specific, complex feature actually works (e.g. `concepts/CONCEPT_page-events.md`) | Added per feature, updated as that feature evolves |
| `TRAP_LORE.md`                               | Mistakes and pitfalls already lived through, so they aren't repeated                                   | Added whenever something bites someone             |

**The short version:** if you want to know what we use right now, check `TECH_STACK.md`. If you want to know _why_ we use it instead of the obvious alternative, follow the ADR link next to it. If you want to know exactly how a specific complex system works day-to-day, check for a `CONCEPT_*.md`. If none of those answer it, ask in the team chat — and if the answer to something wasn't written down anywhere, that's usually a sign it should become one of the above.

## What's an ADR, and why do we bother

An ADR (Architecture Decision Record) is a short, dated file that captures **one** decision: what situation prompted it, what we decided, what else we considered, and what trade-off we accepted. Full template and index: [`/docs/adr/README.md`](./adr/README.md).

The reason this exists isn't process for its own sake — it's the answer to a question that comes up constantly on any team past one person: _"wait, why didn't we just use X?"_ Without a written record, that question gets answered from memory, badly, six months after the fact, by whoever happens to remember the conversation. With an ADR, it's a two-minute read with the actual reasoning intact.

**The one rule that matters most:** once an ADR is Accepted, its content is never edited to reflect new information. If a decision changes later, we write a **new** ADR that supersedes the old one — the old file's status line changes to `Superseded by ADR-00XX`, nothing else about it does. This is what makes the record trustworthy instead of just another doc that quietly drifts.

## When to write one

Not every decision needs one. Ask: would reversing this be expensive, does it touch more than one part of the system, or could a reasonable person on the team argue for a different option? If yes to any of those, it's worth an ADR. "Postgres vs. Mongo" — yes. "Should this button be `rounded-xl` or `rounded-2xl`" — no, that's a normal code review comment.

## How to write one

Same workflow you already use for everything else — this isn't a separate process bolted on top:

1. Linear issue + branch, as usual (e.g. `docs/CRI-45-adr-animation-library`)
2. Draft the ADR with `Status: Proposed`, using the template in `/docs/adr/README.md`
3. Open the PR — same 1-approval review as any other change; this is where the actual discussion happens
4. Merging the PR = the decision is Accepted (flip the status line as part of the merge)

That's the whole thing. It lives inside the workflow you're already following.
