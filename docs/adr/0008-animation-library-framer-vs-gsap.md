# ADR-0008: Animation Library — Framer Motion vs. GSAP

**Status:** Proposed (open — no final decision yet)
**Date:** 2026-06
**Deciders:** Aaron (pending)

## Context

Both Framer Motion and GSAP are installed. They have different strengths and the project has use cases that lean toward each: component-level, state-driven UI (the lantern menu, modals) versus scroll-driven timelines and staggered sequences (the homepage scroll journey described in the project vision).

## Decision

**Not yet finalized.** Current lean, pending confirmation:

- **Framer Motion** for component-level transitions tied to React state — modals, menus, layout animations.
- **GSAP** for scroll-driven timelines and staggered entrance sequences — hero reveals, scroll journeys, ScrollTrigger-based work (pairs with Lenis for smooth scroll).

## Alternatives Considered

- **Pick one exclusively** — simpler mental model for contributors, but would force awkward workarounds for whichever use case the chosen library is weaker at (GSAP is not React-idiomatic for component state; Framer Motion is not built for complex scroll timelines).

## Consequences

Until this is formally resolved, contributors should default to Framer Motion for isolated component transitions and flag any new GSAP usage for discussion, so the codebase doesn't drift into inconsistent conventions before the decision is locked in. **This ADR should be updated to Status: Accepted once the decision is confirmed** — at that point, a new dated entry should be added rather than silently editing this one.
