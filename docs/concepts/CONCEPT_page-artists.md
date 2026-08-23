# CONCEPT: Artists

_Status: Current — 2026-08-23_

"Meet the C9 Family." The roster showcase and booking entry point. Site-wide navigation rules live in `CONCEPT_site-structure.md`, including §3.6's nested-state rule, which this page is one of the two current examples of. This covers what's specific to `/artists`.

The wheel-gallery concept from the original sketch has been **replaced entirely** by the direction below — not layered on top of it. No wheel, no circular layout math, no per-artist positioning around a rotating axis.

---

## 1. Interaction states

Two states:

### Dormant

The default state on arriving at `/artists`. A **deserted-spaceship environment** — dormant technology with futuristic plants growing through and around it, the digital-natural symbiosis idea (`VISION.md` §3) expressed as this page's own narrative beat rather than a generic background motif. The holographic projector itself sits visibly inactive in the scene.

An on-screen affordance invites the next step — suggested copy: _"Press Enter to meet the C9 family."_ Direct application of the discoverability principle (`VISION.md` §5).

### Hologram mode

Enter activates the projector: a profile materialises upward from it, showing exactly **one artist at a time**, full profile — not a preview or thumbnail. Left/right arrow keys cycle to the next or previous artist. _(Assuming ← / → for cycling as the natural mapping — flag if a different pair was intended.)_

**The hologram frame stays open while cycling.** Moving between artists swaps the displayed content within the same active projection — it does not fully dematerialise and rematerialise on every arrow press. The full materialise/dematerialise animation plays only when _entering_ (Enter, from Dormant) and _exiting_ (Esc, back to Dormant) — see §4.

---

## 2. The hologram reveal — build approach

Carried forward from the earlier direction, now the primary interaction rather than a maybe:

- A **light cone**: CSS gradient or `clip-path`, semi-transparent, expanding upward from the projector base — crimson/ember palette, consistent with the rest of the site.
- The **card materialising**: a GSAP timeline scaling the panel from a thin horizontal sliver (`transform-origin: bottom`) to full height, with an opacity fade. A brief flicker or scanline pass at the start/end sells the hologram read.
- **Between-artist swaps** (cycling within hologram mode) should be a lighter transition than the full materialise — a quick cross-fade or flicker on the content itself, not a full close-reopen cycle. Keeps cycling through several profiles from feeling tedious.

Squarely GSAP's kind of choreography — another data point for `ADR-0008`, alongside the homepage dragon.

---

## 3. Environment & content

**Dormant state:** the spaceship/plants scene, static or gently animated (plants growing, ambient particle drift) — enough life in the scene that it doesn't read as a dead end, even though nothing has been "activated" yet.

**Per-artist content (CMS-managed):**

- Name
- Short bio
- Location
- **Book Artist** — routes through `booking@crimsonc9.com`, applied uniformly across all artists
- **Contact Artist** — separate from booking; either a per-artist email address or a social channel (Instagram, etc.), whichever the artist prefers
- Social links
- **Sets/Media** — for v1, links out to the artist's existing channels (Instagram, YouTube, etc.) rather than embedding anything. Richer embedded media is a natural extension once individual artist pages exist (§7), not before.
- Background — CMS-managed by default, since self-serve artist accounts are deferred. Open to a contributor building individual per-artist backgrounds earlier if someone wants to take that on.

---

## 4. Navigation

This page is one of the two confirmed examples of the site-wide nested-state rule (`CONCEPT_site-structure.md` §3.6): back-navigation unwinds **one level at a time**.

- **Esc inside Hologram mode** → closes the hologram, returns to **Dormant** (not Main). The spaceship/plants scene remains — you're back to watching it, not sent away from the page.
- **Esc from Dormant** → does nothing. Dormant is this page's base state.
- **↑ (the compass return direction) → Main.** This only fires from **Dormant**. It does not work from inside Hologram mode — Esc has to close the hologram first.

---

## 5. Roster size

At least 7 artists currently, likely more. Since there's no longer a wheel or any layout that depends on artist count, this isn't a layout concern the way it would have been under the old design — sequential cycling behaves identically regardless of roster size.

---

## 6. Secondary navigation — proposed, not yet confirmed

Losing the wheel's "several artists visible at once" view is a real trade-off worth naming: cycling sequentially through seven-plus full profiles to find one specific artist is slower than a glance at a wheel would have been, which matters given bookers doing a fast style-browse is one of this page's stated jobs.

**Proposed:** a persistent name index — a simple always-visible list, likely as a side panel, letting a visitor jump straight to a specific artist by name without cycling past everyone in between. Recommending this over a search input: at a roster of 7–15 people, fuzzy search solves a problem this page doesn't have yet: a flat list is enough.

Not yet confirmed — needs a decision before this doc's navigation section can be called complete.

---

## 7. Loading & motion sensitivity

- **Loading state:** artist images resolve through signed B2 URLs (`ADR-0004`), meaning real network latency before anything renders. Both the dormant scene's assets and each hologram profile need a skeleton/placeholder treatment, not a blank space while images resolve.
- **`prefers-reduced-motion`:** the hologram materialise/dematerialise animation and any ambient dormant-state motion (drifting particles, swaying plants) should reduce or simplify under this preference — same principle as the homepage dragon.

---

## 8. Explicitly out of scope

Full detail in `CONCEPT_site-structure.md` §6 — repeated here only where it directly shapes this page:

- **Individual artist pages** (`/artists/[slug]`) — deferred. Dormant + Hologram mode is the complete v1 artist experience.
- **Artist self-serve accounts** — deferred.
- **Embedded/rich media on profiles** — deferred until individual artist pages exist; v1 links out to external channels instead.
