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

### `npm run dev` failing silently after `npm install` (Aaron)

**What happened:** `npm run dev` crashed at startup with no obvious cause. `npm install` itself completed and only printed warnings — `npm warn install-scripts sharp@0.34.5 (install: node install/check.js || npm run build)` among them, easy to skim past. As of npm 12, install scripts are **blocked by default** unless a package is explicitly allowlisted — `npm install` silently skips them rather than failing. `sharp`'s install script is what fetches its native binary; skipped, the package exists on disk with no working binary behind it. `payload.config.ts` imports `sharp` directly and eagerly (`import sharp from "sharp"`, passed straight into `buildConfig`), so the crash happens the moment the dev server tries to load the config — immediately, every time.

**Why it's a trap:** Nothing about the failure points at the cause. The actual error is a native-binary import failure deep in Payload's config loading; the real cause is a warning printed during a completely different command, minutes earlier, that looked like routine `npm install` noise. Anyone on npm 12+ doing a first-time clone will hit this.

**Do this instead:**

```bash
npm install-scripts approve sharp
npm install
npm run dev
```

The `approve` step only updates the allowlist (see `allowScripts` in `package.json`) — the second `npm install` is what actually runs the now-permitted script and fetches the real binary. If `npm run dev` still fails after a fresh install, check for this warning before assuming something else is wrong.

**Do NOT** reach for `npm audit fix --force` here or on any of the other packages this warning lists — see the entry above. Nothing about this problem needs it.

---

_Shit made you go grrr? Add it above — make the trap lore live on._
