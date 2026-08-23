# CONCEPT: Events

_Status: Current — 2026-08-23_

"Change Through Music." The event showcase, ticketing entry point, and archive. Site-wide navigation rules live in `CONCEPT_site-structure.md`; this covers what's specific to `/events`.

---

## 1. Structure

Three parts, in order:

1. **Entry screen** — video background carrying "Change Through Music," pulling footage from a curated highlight list (§4) with a static image fallback.
2. **Upcoming events** — name, cover image, event text, and an embedded ticket purchase flow per event (§3). Also carries a partners/collaborators section (§5).
3. **Archive** — past events in chronological order, each with its own page (§2).

---

## 2. Navigation within the page

- **Enter** moves forward through the three parts in order (entry screen → upcoming → archive).
- **Scroll** does the same thing, redundantly — either input works.
- **↓ returns to Main from the page's base state** — scrolling through the entry screen, upcoming events, and archive list is all still the base state, so ↓ works from anywhere within it. This is a discrete keypress distinct from scrolling, so there's no actual conflict between "↓ exits to Main" and "scroll moves through sections" — different input channels, not competing bindings on the same one.
- **On an individual archive entry** (`/events/[slug]`), ↓ does not fire. That's a nested state one level deeper than the base page — per the site-wide rule (`CONCEPT_site-structure.md` §3.6), **Esc exits the entry back to `/events` first**, and only from there does ↓ return to Main. No skipping straight from a deep archive entry to Main in one step.

---

## 3. Ticketing

The purchase flow is **embedded directly into the upcoming events section** — not a link out to a separate page or external shop. This part is settled regardless of which platform ends up behind it.

**The platform itself is still open.** Pretix is the leading candidate but not an accepted decision — see `ADR-0009`, status Proposed, and `WORKING_LOG.md`.

---

## 4. Archive

- **Each past event gets its own route**, `/events/[slug]` — confirmed, added to the route map in `CONCEPT_site-structure.md`. Independently shareable and indexable, same reasoning as the routes decision generally (`ADR-0001`).
- **Display: infinite scroll for v1.** Categorisation and filtering (by artist, venue, date range) are a deliberate later addition once the archive is dense enough to need them — not a v1 requirement, named here so it doesn't get built prematurely or forgotten entirely.
- **The entry screen's highlight footage is a separately curated list**, not a flag on individual archive entries. Simpler to maintain — someone picks what represents the collective well right now, rather than every past event needing a "should this loop on the entry screen" decision at creation time.

---

## 5. Partners / Collaborators

Content model, closing out the previously open item:

| Field | Notes                                                                          |
| ----- | ------------------------------------------------------------------------------ |
| Name  |                                                                                |
| Logo  | Media relation                                                                 |
| Link  | External URL                                                                   |
| Type  | Optional tag — partner vs. collaborator, if that distinction ends up mattering |

Simple enough to implement directly; no need to over-design ahead of actual content existing.

---

## 6. Degradation & accessibility

- **`prefers-reduced-motion`** — the entry screen's video background should fall back to the static image whenever motion is reduced, not only when the video fails to load. Same principle as the homepage dragon and the Artists page's hologram effects.
- **Video load failure** — falls back to the same static image, independent of the motion-preference case above.

---

## Related

Nested-state back-navigation (§2) follows the general rule in `CONCEPT_site-structure.md` §3.6 — Artists' Hologram mode is the other confirmed example.
