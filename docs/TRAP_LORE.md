# Trap Lore

_Status: Current — 2026-08-23_

A running list of mistakes, pitfalls, and "how tf did that just happen" moments already lived through on this project — kept so nobody has to learn them the hard way twice.

**How this differs from an ADR:** an ADR records a decision that was deliberately made, with alternatives weighed. A trap isn't a decision — it's just something that bit someone, with no upside to consider. No template, no status field, no ceremony. If it made you go _grrr_, it belongs here.

**Adding an entry:** short is fine. What happened, why it's a trap, what to do instead — and feel free to put your name on more complex issues so people know who to ask when they run into the same stuff. Open a PR against this file same as any other change.

---

### `npm audit fix --force` (Aaron)

**What happened:** Run during a routine dependency audit. Silently downgraded Next.js from v15 to v9.3.3, breaking large parts of the App Router setup along with it.

**Why it's a trap:** `--force` doesn't respect major-version boundaries — it resolves every flagged vulnerability regardless of how large a version jump that requires. For a fast-moving framework, that can mean a multi-major-version downgrade with zero warning.

**Do this instead:** Run `npm audit fix` without `--force`, and review anything it flags manually. If a dependency genuinely needs a major bump, do it as its own deliberate step, and test immediately after.

---

### Hardcoded colour values

**What happened:** Shows up in review periodically — a component ships with `#510606` or similar typed directly into a class or style, instead of `var(--brand-crimson)`.

**Why it's a trap:** It quietly defeats the token system ([`VISION.md`](./VISION.md) §4). The palette can look correct today and still be an invisible liability — if a token value ever changes, hardcoded copies don't update with it, and nothing will warn you they exist.

**Do this instead:** Always reference the CSS variable. If a colour you need isn't tokenised yet, flag it and ask before inventing a value.

---

### Adding a new dependency without checking first

**What happened:** Less a single incident, more a recurring temptation — a library looks like it'll save an afternoon, gets added, and either duplicates something already in the stack or quietly conflicts with an existing choice.

**Why it's a trap:** The stack is deliberately scoped, not accumulated ([`VISION.md`](./VISION.md) §5 — own your data, own your stack). Every dependency added is something the whole team now depends on staying maintained, secure, and compatible with everything else.

**Do this instead:** Ask before adding anything new, even something that looks small or obviously useful.

---

_Shit made you go grrr? Add it above — make the trap lore live on._
