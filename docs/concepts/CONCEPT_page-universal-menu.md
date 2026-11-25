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

---

## Appendix — what is actually built, as of 2026-11-23

**This section records the current implementation only. It deliberately does not revise the direction above** — Aaron is revisiting the lantern's design in a later session, and the sections above should be read as the open question, not as a description of the site.

Where the two disagree, the code is what ships and §1 is what is still being decided.

### The mark

Not a paper lantern. It is a **sphere of light suspended between two short dark beams**, with a gap above and below it and nothing joining them — the absence of any visible support is the point, and a cord or strut would undo it.

The sphere is shaded in four layers rather than drawn as one gradient: the lit surface with its terminator, a crescent of reflected light on the shadow side, a small hard specular, and a bloom thrown into the air around it. Only the bloom animates, so the object stays stable while its light moves.

Built in DOM and CSS, not SVG — the glow is three animated `box-shadow`s, which composite far more cheaply than the equivalent SVG filter.

### States

- **Idle** — the bloom breathes on a 9s cycle, three radii out of phase so it reads as light rather than as a fade.
- **Hover** — the glow swells and warms towards ember; hover takes the animation over completely, because leaving the keyframes running makes the hover state flicker against them.
- **Focus** — a crimson outline at 8px offset. Still its own state, per §1.
- **Open** — the whole assembly turns a full revolution _and_ the light flares. The rotation is on the outer element: a featureless sphere turning is invisible, but the beams carry the motion plainly.

§2's "the spin _is_ the menu opening" therefore still holds, on a different object.

### Position and contents

Top-left of a fixed header, beside a centred wordmark that links home. Contents are live links only — Imprint, Terms & Privacy, and the three social channels. The seven sections §1 anticipates go back in as each route ships.

### What has not changed

Shift+Enter to open, Escape to close with focus returned to the button, outside-pointer-down to dismiss, `inert` on the panel while closed, and the reduced-motion fallbacks. All as specified.
