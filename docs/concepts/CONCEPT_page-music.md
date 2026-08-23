# CONCEPT: Music

_Status: Current — 2026-08-23_

An immersive listening/viewing lounge rather than a conventional player page. Site-wide navigation rules live in `CONCEPT_site-structure.md`, including §3.6's nested-state rule, which this page is the third confirmed example of.

**This page is intentionally left open.** More than any other page in the set, the visual and creative direction here is meant to stay flexible — what follows is the structural skeleton a contributor needs to start building, not a locked design. Sections below are marked accordingly.

---

## 1. Structure

Two states, same shape as Artists and Events:

- **Choose-media (base state)** — the default on arriving at `/music`. Visitor picks what they want: an EP, a podcast episode, or a full set.
- **Viewer (nested state)** — Enter opens the chosen item into a focused, immersive frame. Esc returns to choose-media, per §3.6 — never skips straight to Main.

**Base-state navigation:** ↑/↓ move between media categories, Enter opens the selected one. _(Proposed mapping — ↑/↓ for category, ←/→ reserved for in-viewer track-cycling below, so the two don't collide.)_

---

## 2. Content categories — audio vs. video

A real distinction, not just three items in one list:

- **EPs & Podcasts** — audio, via SoundCloud embed.
- **Full Sets** — video, via YouTube embed.

This distinction matters because the two get different viewer behaviour (§3).

---

## 3. Viewer behaviour — cinema mode vs. quick-cycle mode

Resolving the practical difference you flagged — full sets and short tracks don't want the same interaction:

**Full Sets (video) — cinema mode.** A focused, minimal-distraction viewing experience: **Space** plays/pauses, **Esc** exits back to choose-media. No track-skipping — a set is a longer commitment, watched start to finish or not at all, closer to actually sitting down for a film than browsing a playlist.

**EPs & Podcasts (audio) — quick-cycle mode.** Same **Space**/**Esc** baseline, plus **←/→ skip to the previous/next track without leaving the viewer** — the frame stays open, only the playing content swaps, mirroring how Artists' Hologram mode cycles between profiles without a full close-reopen each time. This is what makes "going through more quickly" actually work: no repeated Enter/Esc cycling just to sample a few tracks.

_(Proposal, not yet confirmed: this cinema/quick-cycle split as the actual mechanism. Flag if a different approach was in mind.)_

---

## 4. Environment / setting system

Visitor-controlled, not purely automatic: a setting selector (Fire / Water / Lightning, or whatever the eventual set turns out to be) lets a visitor choose their preferred environment, alongside an **Auto mode**.

**Proposed synthesis, not yet confirmed:** Auto mode follows a default setting tagged per track/set in Payload by whoever curates the content — so curators still shape the default experience — while a visitor who wants to override it can pick manually, persisting for the session. Gives the team creative control over the default without removing visitor agency.

_(Deliberately open — per the framing above, exact settings and their triggers are creative territory, not something to lock down here.)_

---

## 5. Reactivity

**Confirmed: low-level, playback-state-based only — not real audio analysis.** Genuine frequency-reactive visuals aren't feasible without self-hosting audio for Web Audio API access (both YouTube's and SoundCloud's embed APIs deliberately don't expose raw audio data), which would reopen the storage complexity the embed-don't-host approach was chosen to avoid.

What's achievable and confirmed as sufficient: the background reacts to **playback state** — a gentle ambient pulse or shift while something's playing, stillness when paused, a transition on track change. Reads as alive without needing to beat-match.

---

## 6. Submissions

Two separate paths — not the same form:

- **Podcast submissions** — the existing podcast submission form, reused as-is.
- **EP / track / demo submissions** — a different path entirely: contact form or direct email to `music@crimsonc9.com`. Not routed through the podcast form.

---

## 7. Thumbnails

Pulled directly from SoundCloud's and YouTube's own embed data — not stored or managed through the B2 media pipeline. No custom loading-state architecture needed beyond standard handling for third-party embed data resolving.

---

## 8. Motion sensitivity

`prefers-reduced-motion` should reduce or disable the ambient biome reaction (§5) and any transition animation on entering/exiting the viewer — same principle as every other page.

---

## 9. What's settled vs. what's open

For whoever picks this page up:

**Settled (build against this):** the two-state structure, the audio/video behavioural split, low-level playback-based reactivity only, the two separate submission paths, embed-sourced thumbnails.

**Open (creative territory, propose and iterate):** the exact visual environment(s) and what Fire/Water/Lightning (or alternatives) actually look like, the precise Auto-mode selection logic, category browsing UI in the choose-media state, overall visual treatment of the viewer frame itself.
