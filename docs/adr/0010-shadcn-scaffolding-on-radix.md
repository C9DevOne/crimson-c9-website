# ADR-0010: shadcn CLI for Component Scaffolding (Supersedes ADR-0007)

**Status:** Accepted
**Date:** 2026-08-24
**Deciders:** Aaron

## Context

ADR-0007 decided to build interactive primitives directly on raw Radix, explicitly setting shadcn aside — the stated worry was that shadcn's pre-styled defaults would fight the site's bespoke visual identity, costing more effort to override than to build fresh.

The codebase didn't end up matching that decision. `shadcn` is a dependency, `components.json` is present, and `src/components/ui/` holds several generated components (`button`, `input`, `sheet`, `sidebar`, `skeleton`, `tooltip`, `separator`) — added without this ADR being revisited first, which is its own process gap, not repeated here.

Rather than treat that as pure drift to be deleted, the actual generated code was inspected before deciding anything: `button.tsx` and `tooltip.tsx` import directly from `radix-ui` (`import { Tooltip as TooltipPrimitive } from "radix-ui"`) — shadcn's CLI is not a competing component library sitting on top of Radix, it's a code generator that copies a Radix-based starting file into the repo and then gets out of the way. Once generated, the file is exactly as editable as anything hand-written.

More importantly, the specific failure ADR-0007 predicted didn't happen: the generated components' colour tokens were already reskinned to the project's actual palette — `--background`, `--foreground`, and `--muted-foreground` in `globals.css` match `VISION.md` §4 exactly, not shadcn's generic defaults. The one real problem this surfaced — shadcn's semantic tokens (`--primary`, `--secondary`, `--destructive`, etc.) repeating brand-token hex values instead of referencing them — has since been fixed by aliasing every one of them to the matching brand token in `globals.css`.

## Decision

**Supersede ADR-0007.** Keep using shadcn's CLI as the scaffolding tool for new Radix-based components, rather than hand-building every primitive from raw Radix. Existing generated components stay as-is. `shadcn` moves from `dependencies` to `devDependencies` in `package.json` — it's a CLI used at development time only; nothing at runtime imports from the `shadcn` package itself, only from the Radix-based files it generated.

Every future `npx shadcn add <component>` still needs the same check applied here before it's trusted: confirm the generated file is genuinely built on Radix, and reskin its colour tokens to reference the brand tokens rather than leaving shadcn's defaults in place.

## Alternatives Considered

- **Remove shadcn, rebuild the existing components from raw Radix** — the literal instruction in ADR-0007. Rejected: it doesn't fix a real problem, since the components are already built on Radix and already reskinned correctly. It would cost real time re-deriving components that already work, with a real risk of introducing accessibility regressions shadcn's version doesn't have (see `docs/VISION.md` example comparing a hand-rolled Sheet against the generated one — the generated version already handles four-directional slide animations and focus styling that would otherwise need writing from scratch, once per direction).
- **Leave the contradiction unresolved** — the ADR says one thing, the code does another, indefinitely. Rejected: this is exactly the "why didn't we just use X" gap `docs/ONBOARDING.md` describes ADRs as existing to close.

## Consequences

- **Positive:** Consistent, accessible components scaffolded quickly instead of hand-built each time. The token-duplication risk this decision surfaced is closed — shadcn's semantic tokens alias the brand tokens, not the other way around.
- **Negative:** The concern ADR-0007 originally raised is still real in principle, just not automatic — every future `shadcn add` needs the same check-and-reskin discipline applied here, not a one-time fix. Skipping that discipline on a future component would let generic, unbranded defaults back in.
