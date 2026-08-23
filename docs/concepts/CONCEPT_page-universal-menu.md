# CONCEPT: Universal Menu (The Lantern)

_Status: Current — 2026-08-23_

The guaranteed navigation path, present on every page. Site-wide navigation rules live in `CONCEPT_site-structure.md`; this covers the menu's own interaction detail.

---

## 1. Visual direction

**Realistic, not pixel-art.** The lantern is rendered with a smooth, detailed, dimensional appearance — glass texture, drop shadow, a sense of weight and light — rather than as a crisp-edged pixel-grid icon. Realistic without tipping into hyper-realism: enough fidelity to carry a sense of magic, not a fully rendered 3D asset.

_(Note: this retires pixel-art-as-character-grid as the icon convention generally, not just for this one element — see `VISION.md` if that convention is referenced elsewhere and needs updating to match.)_

**States:**

- **Idle:** looping smooth glow effect
- **Hover (mouse):** grows slightly larger, glow intensifies
- **Focus (keyboard):** a visible focus ring or equivalent cue — the hover treatment alone doesn't serve a keyboard user, so focus needs its own explicit state, not a reuse of hover styling

**Position:** top-left corner, on every page, accessible on every sight line — never obscured by page content.

---

## 2. The open interaction

Clicking (or activating via keyboard, §3) triggers a **360° spin of the lantern itself**, and the menu panel unrolls out of that motion — conceived as a scripture or scroll unfurling, not a panel simply fading or sliding in. The spin isn't decorative feedback layered on top of the menu opening; it _is_ the menu opening.

**Closing** — any of the three should work:

- Esc
- Click outside the panel
- Click the lantern again

---

## 3. Keyboard access

The menu is mouse-first by design, but a shortcut opens it directly: **Shift + Enter**.

Two implementation notes worth carrying into the build, not just the concept:

- **Guard against text input contexts.** The shortcut must check that focus isn't currently inside a text field (the contact form, a search input if one ever exists) before firing — otherwise Shift+Enter inside a form unexpectedly pops the menu open mid-typing.
- **The focus ring stays, even with the shortcut available.** A shortcut only helps someone who already knows it exists; the visible focus ring (§1) is what makes the lantern discoverable to a keyboard user who doesn't.

---

## 4. Menu contents & order

Aligned to the route order established in `CONCEPT_site-structure.md`, not the original sketch order:

1. Events
2. Artists
3. Music
4. Library
5. Connect
6. About Us
7. Credits

**Shop is deliberately absent** — deferred per `CONCEPT_site-structure.md` §6, and per the site-wide rule, not rendered at all rather than shown disabled.

Per-item descriptions (a hover/focus blurb explaining each section) were considered and set aside — the item names are self-explanatory enough that it would likely be unnecessary polish rather than a real gap.

---

## 5. Open questions

None outstanding — this doc reflects confirmed decisions as of 2026-08-18.
