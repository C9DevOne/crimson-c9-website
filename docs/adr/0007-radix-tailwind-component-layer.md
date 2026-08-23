# ADR-0007: Radix UI + Tailwind CSS for the Component Layer

**Status:** Accepted
**Date:** 2026-05
**Deciders:** Aaron

## Context

The site needed accessible interactive primitives (dialogs, tooltips, menus) without those primitives arriving with baked-in visual styling that would fight the project's bespoke, Biome-driven visual identity.

## Decision

**Radix UI** for unstyled, accessible component primitives (handles focus trapping, ARIA attributes, keyboard navigation), styled entirely with **Tailwind CSS v4** utilities and CSS variables for design tokens (color, spacing, radius, motion).

## Alternatives Considered

- **Shadcn UI** — pre-styled components built on top of Radix, considered early on. Given how custom the site's visual direction is (compass-hop navigation, pixel-art lantern menu, per-page Biome motifs), building from Radix's raw primitives directly avoids repeatedly overriding a pre-styled layer.
- **Headless UI** — a comparable unstyled option, but smaller ecosystem overlap with the rest of the stack.
- **Chakra UI / MUI** — fully opinionated design systems; ruled out as fundamentally in tension with a bespoke visual identity.

## Consequences

- **Positive:** Full visual control with accessibility handled correctly by Radix rather than reimplemented by hand.
- **Negative:** More manual styling work per component than a pre-styled library would require — an accepted trade given the project's design ambitions.
