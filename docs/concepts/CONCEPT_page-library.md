# CONCEPT: The Library

_Status: Current — 2026-08-23_

A curated collection of guides and tools for music production, video, and DJing. Site-wide navigation rules live in `CONCEPT_site-structure.md`; this covers what's specific to `/library`.

---

## 1. Visual concept — the shelf

A geometric bookshelf metaphor represents the collection, deliberately simple rather than a detailed illustrated shelf:

**Proposed direction:** thin horizontal bars stacked vertically, one per category — the "shelves" themselves. Each resource within a category renders as a simple rectangular "spine" along its shelf, varying slightly in width for visual rhythm rather than uniform blocks. A soft crimson/ember glow on hover/focus reuses the interaction language already established elsewhere on the site (the lantern menu, Connect's nodes), so it reads as part of the same visual family rather than a one-off. No literal wood or leather rendering needed — geometry and glow alone carry the "shelf of resources" read.

This is a starting proposal, not a locked design — refine or reconsider entirely once it's actually in front of you.

---

## 2. Structure

Categorised, not a flat list — at minimum Music Production, Video, and DJing, though the actual category set isn't finalised. The full resource list doesn't exist yet either; this doc defines the structure it needs to slot into, not the content itself.

**Built to reorganise and extend easily** — categories are data, not a hardcoded enum. Adding a new category (Photography, say) or moving a resource between categories should be a content change in Payload, not a code change.

---

## 3. Navigation

Tree-structured, extending the site-wide nested-state rule (`CONCEPT_site-structure.md` §3.6) one level deeper than Artists, Events, or Music: page → category → resource, rather than just page → single nested state.

- **Enter** descends one level — opens a category, or follows a resource's link.
- **Esc** ascends one level — closes an open category back to the top level. **At the top level, with nothing open, Esc steps up out of the page entirely, back to Main** — Library has no compass arrow to hand that job to, so Esc carries it instead, consistent with what Esc already means everywhere else on the site.
- **Arrow keys move laterally between siblings** — between categories at the top level, between resources within an open category. Never bound to leaving the page.

A visible on-screen cue near the shelf communicates the Esc-to-go-back affordance, per the site's discoverability principle (`CONCEPT_site-structure.md` §3.4).

---

## 4. Content schema

| Field       | Notes                                   |
| ----------- | --------------------------------------- |
| Title       |                                         |
| Description |                                         |
| Link        | External URL                            |
| Category    | Relation, not a fixed enum — extensible |

No visible "trusted/open-source" badge — that's an internal curation principle (only vetted resources make it in), not a field shown to visitors.

---

## 5. Curation

CMS-managed by the team, not community-submitted — follows naturally from no accounts existing in v1, stated here explicitly rather than left implicit.

---

## 6. Aesthetic direction

A loose design direction rather than a locked visual spec: a "Harry Potter" / magic-library feeling — warm light, a sense of quiet discovery, room for small easter eggs — is worth exploring here. Not something to build out in exhaustive detail; a mood to lean into where it fits naturally, not a brief to fulfil precisely.

---

## 7. Future: maintenance & community input

**To-do, not v1:** external links will rot over time. A maintenance concept — most likely letting people flag dead or outdated links rather than relying on someone noticing by chance — keeps the Library alive and well-maintained rather than quietly stale. Needs its own design pass later; not scoped in this doc.

**Also future-facing:** user submissions to the Library itself — suggesting new resources, not just flagging problems with existing ones. Connects naturally to the broader accounts deferral (`CONCEPT_site-structure.md` §6) once that's revisited; not a v1 concern given no accounts exist yet.

---

## 8. Open questions

- **Visual execution of the shelf concept** (§1) — direction proposed, not built or reviewed visually yet.
- **Final category list** — structure is ready; the actual categories and their resources still need populating.
