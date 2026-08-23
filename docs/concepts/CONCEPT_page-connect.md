# CONCEPT: Connect

_Status: Current — 2026-08-23_

"Connect Yourself." The community and outreach hub. Site-wide navigation rules live in `CONCEPT_site-structure.md`; this covers what's specific to `/connect`.

---

## 1. Structure

A **single continuous scrolling page** — unlike Artists, Events, Music, or Library, Connect deliberately does **not** use the nested-state pattern (`CONCEPT_site-structure.md` §3.6). There's no "enter a focused mode" interaction here; everything is reachable by scrolling, closer in shape to the Homepage than to the other interior pages.

**Navigation:** ← returns to Main from anywhere on the page — no nested state to unwind first, no Esc involved.

**Worth stating plainly:** Connect is the most reachable page on the site — the compass (→), the global Connect affordance, and the universal menu all lead here. That's not incidental; it's the CONNECT pillar (`VISION.md` §2) expressed structurally rather than just in copy.

Page order, top to bottom: node network + headline (§2), social & community links (§3), collaboration invite and contact form (§4), volunteer/community openings (§5).

---

## 2. Node network

**Decorative, not interactive** — the glowing, shifting node graphic visualises "connection" abstractly. It is not a clickable map of channels; the actual links live in a conventional icon row (§3).

**Build approach:** SVG elements — circles for nodes, lines for connections — animated with GSAP: opacity fades, subtle position drift, connections re-forming between random pairs on an interval. Same toolset already used for the homepage dragon and the Artists hologram reveal, no new dependency required.

**Motion sensitivity:** the node animation should dampen under `prefers-reduced-motion` — same principle as every other page.

---

## 3. Social & community links

**Social icons** — YouTube, SoundCloud, Instagram — a conventional icon row, `react-icons` per `VISION.md` §6.

**WhatsApp communities** (C9 Raves, C9-Berlin, Announcements) — **CMS-managed, not hardcoded.** Invite links expire or need regenerating periodically; hardcoding them means a code deploy every time one rotates, which shouldn't be a blocker for whoever's actually managing the community.

| Field       | Notes           |
| ----------- | --------------- |
| Name        | e.g. "C9 Raves" |
| Invite link | External URL    |

---

## 4. Collaboration

Copy inviting other collectives and collaborators to reach out — "let's work together" framing, not a submission-form-first experience.

**Contact form** — the general-purpose contact form, reused here rather than a Connect-specific one:

- Purpose selector (booking / music / general — routes to the appropriate address)
- Request/Info field
- Message
- **Priority toggle** — a simple yes/no flag the sender can set, rather than a separate field requiring its own logic. Resolves the open question sitting in `WORKING_LOG.md` since the first audit round. Flagged submissions are surfaced for manual triage on the receiving end — no automated routing beyond that for v1.

---

## 5. Volunteer / community openings

**Descriptive text, not a CMS-managed list** — an invitation to join and grow with the project, pointing toward the same contact path rather than a structured list of open roles. No content schema needed for this at v1 scale.

---

## 6. Open questions

None outstanding — this doc reflects confirmed decisions as of 2026-08-18.
