# CONCEPT: Homepage

_Status: Current — 2026-08-23_

The compass hub and entry point. Site-wide navigation rules live in `CONCEPT_site-structure.md`; this covers what's specific to `/`.

---

## 1. Structure

The homepage has two states, not two sections — a hub view and a scroll-revealed narrative beneath it. Both lead to the same destinations by design: arrow keys are the fast direct route, the scroll is the equally complete guided one. Nobody using only a mouse, and nobody using only a keyboard, is missing anything the other has.

### 1.1 Hub view (first screen)

What's on screen at load, no scrolling required:

- **The dragon** — the animated hero (§2)
- **The compass** — arrow-key access to the four primary sections (see §3 for the current mapping)
- A **first-visit hint** indicating both paths are available — something like _"scroll, or press ↑ ↓ ← → to explore"_ — so the compass isn't invisible to a visitor who doesn't try arrow keys unprompted. Direct application of `VISION.md` §5's discoverability principle.

### 1.2 Scroll-revealed narrative

Scrolling down reveals a short introduction — CrimsonC9 as the collective's digital home — followed by hero cards:

| Card                | Links to   |
| ------------------- | ---------- |
| Who we are          | `/artists` |
| What we do          | `/events`  |
| How you can connect | `/connect` |

**Music card — planned, visual not yet designed.** Confirmed as a fourth card; holding a placeholder slot in the layout until the design exists rather than blocking the rest of the page on it.

### 1.3 The logo / home button

A static C9 wordmark appears at top-centre **only after the first scroll** — not present on the hub view, where that space is occupied by the compass. It is:

- **A permanent home button.** Clicking it from anywhere on the site returns to `/`, in the hub state, with arrow-key switching immediately active — not a plain scroll-to-top.
- **Persistent on every other page** once it's appeared, per the original site-wide convention.

---

## 2. The dragon

A **2D, snake-like animated creature** looping continuously around the glowing core at the centre of the hub view — segmented body, circular flight path, motion closer to the classic Snake game than to a rigged 3D creature.

**Build approach:** GSAP's MotionPath plugin, animating along a closed SVG path over the starfield/core. Body segments (head, a few mid-body pieces, tail) each sample the same path at a slightly earlier point than the segment ahead of them, rotated to the path's tangent at that point — the segments bend naturally wherever the path curves, with no manual per-frame keyframing needed. Visual treatment: a simplified silhouette or line-art form with a soft glow in the existing crimson/ember palette — deliberately not a fully rendered illustrated creature, which fits "elegant, minimal" better anyway and keeps v1 achievable.

Reaching for Three.js/WebGL here was considered and set aside — this is a choreography problem, not a rendering one, and 2D/GSAP covers it without the added rigging and lighting overhead 3D would require.

---

## 3. Compass mapping

Per the confirmed swap in `CONCEPT_site-structure.md`:

- **↑ Events · ↓ Artists · ← Music · → Connect**
- **Library is menu-only** — reachable through the universal menu, not a compass direction. Connect's compass placement gives it two entry points site-wide (the global affordance and the compass), reflecting its status as a more core page than Library.

---

## 4. Location line

Rotates between Aachen, Berlin, and Cologne on a slow timer. Also responds to hover, with a vertical letter-switch transition — the site's first small easter egg, and a deliberate visual affordance that the line is interactive, not just decorative.

---

## 5. Degradation & accessibility

- **WebGL/animation failure fallback:** if the dragon animation fails to initialize or runs too slowly, fall back to a single static illustrated frame of the scene rather than a blank space. The page should never look broken — only less alive.
- **`prefers-reduced-motion` must be respected.** This is the most animation-dense page on the site — the dragon, drifting background elements, scroll-triggered reveals — and nothing in the source sketches addressed motion sensitivity. Reduce or disable non-essential motion for visitors who've opted out at the OS level.
- **Page metadata** (title, description) needs real copy for `/` — it's now a genuine indexable route (ADR-0001), and this is the page a booker or collaborator is most likely to land on from search.

---

## 6. Open questions

- **Homepage environmental motif** — clouds vs. starfield, or both. Tracked in `WORKING_LOG.md`; non-essential, to be decided visually.
- **Reference sites** — `insanefestival.com` (clean UI component reference) and `bemo.studio` (visual-first focus, immersive web experience) apply here. Confirmed destination; not yet woven into this doc's guidance in detail.
