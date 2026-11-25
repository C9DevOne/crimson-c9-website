# CrimsonC9 — Vision & Foundations

_Status: Current — 2026-11-23_

This document sets down the ground principles the prototype — and future versions of the site — are anchored around: what CrimsonC9 is, how it should look and feel, and the engineering foundations everything else is built on. It supersedes `AI_CONTEXT.md` and the earlier `C9 Website Project Vision.txt`, both retired.

This document is tool-agnostic. It's written to be read by any person or any AI agent working on the project, regardless of which one they use. Personal working preferences — communication style, environment quirks, individual learning goals — don't belong here; they live in `/docs/personal/`, one file per contributor, referenced by whichever agent that person works with.

For _why_ a specific technology was chosen, see `/docs/adr/`. For what the stack currently is, see `TECH_STACK.md`. For pitfalls already learned the hard way, see `TRAP_LORE.md`. For workflow, review process, and team structure, see `CONTRIBUTING.md`.

---

## Part 1 — Brand & Identity

### 1. What CrimsonC9 Is

CrimsonC9 is a young techno artist collective spanning Berlin, Cologne, and Aachen. The website is its online home — where community members, potential collaborators, and bookers explore who the collective is and what it does. The project carries both a cultural/artistic dimension (the collective itself, its artists, its events) and a commercial one (merchandise, bookings, ticketing), and the site needs to hold both without either one undermining the other.

**Tagline:** _"Change Through Music."_

### 2. Design Pillars

Three aims anchor every design and product decision:

**DISCOVER** — Visitors discover new music, artists, events, and visual content. The artist roster and individual pages are central to this. Exploration is rewarded, not just permitted.

**CONNECT** — A central hub for social channels, the WhatsApp community, and clear pathways for bookers and collaborators to reach out. The bridge between online presence and real-world events.

**FUN** — Visually striking and interesting to explore. Interactive elements and easter eggs. A balance between aesthetic wonder and easy, functional usability — wonder that never gets in the way of finding what you came for.

### 3. Visual Identity — Digital-Natural Symbiosis

The site's visual language is organic and geometric at once — nature and structure occupying the same space rather than one being in conflict with each other. The dragon is the collective's central brand element, and the broader aesthetic direction is a **digital-natural symbiosis**: code-generated plants, structures, and geometry woven directly into the digital space, so the site feels like one continuous world where the natural and the technological blend harmonically. Design ideas include site specific natural biomes, interesting coding patterns and structures (e.g conway's game of life, penrose geometry)

The website may hide easter eggs in various places - developers are free to creatively explore any ideas they have in this direction and fill the space with curious little interactions or more ambitious ideas.

**Design keywords:** Clean · Organic · Geometric · Minimal · Elegant

**Visual principles:**

1. **Visuals first** — images, video, and generative/3D elements take centre stage. Every section needs a strong visual identity.
2. **Clean UI** — minimal, elegant interfaces. Information stays clear and accessible despite the artistic ambition.
3. **Vibe** — an easily identifiable structure without needing much explanation. The site orients visitors intuitively, the way a real space would.

### 4. Design Tokens

Reference implementation of the above. Never hardcode these values — always reference the CSS variable. If something isn't tokenised yet, flag it and ask rather than inventing a value.

**Colour**

```css
--background: #050505; /* near-black, primary background */
--foreground: #f2f2ee; /* warm off-white, primary text */
--brand-crimson: #510606; /* surface tone — deep crimson/burgundy */
--glow-crimson: #dc143c; /* the light that comes off the brand colour */
--brand-accent: #cc5500; /* ember orange — fire accent */
--glow-accent: #ff7e00; /* neon orange glow */
--secondary: #1a1a1a; /* surface colour */
--muted-foreground: #78787a; /* subdued text, carries the micro-labels */
--hairline: /* foreground at 11% — every rule on the site */;
```

Three of these changed on 2026-11-23 and the reasoning is worth keeping: the background went from `#0a0a0a` to `#050505` and the foreground from `#f5f5f5` to a **warm** off-white, because pure white on pure black is the one combination that reliably looks cheap on a large dark surface — it buzzes, and every antialiased edge shows. `--muted-foreground` was darkened because the micro-labels carry most of the page's structure and are meant to recede until looked at.

**`--brand-crimson` is a surface tone, not a glow.** At `#510606` it is far too dark to read as light against the background, so anything luminous uses `--glow-crimson`. Using the wrong one is the most common token mistake on this project.

**Typography**

| Role           | Font              | Usage                                                       |
| -------------- | ----------------- | ----------------------------------------------------------- |
| Hero           | Cinzel Decorative | The hero headline, and nothing else                         |
| Display / Body | Philosopher       | Section headings, article text, artist bios, longer content |
| UI / Interface | DM Sans           | Micro-labels, buttons, captions, form fields                |

CSS variables: `--font-hero`, `--font-display`, `--font-body`, `--font-ui`. `--font-display` is an alias of `--font-body`, so "the heading face" has a name at every call site even though it is currently Philosopher.

**All three are self-hosted** in `src/fonts/`, not fetched from Google. `next/font/google` downloads font files at _build_ time, which made every CI run and Docker build depend on `fonts.googleapis.com` — a dependency that failed on 2026-11-22 and cost a deploy. See `src/fonts/README.md`.

**Cinzel Decorative is scoped to one element.** It is a display face, unreadable below about 24px, which is why it is wired to `--font-hero` rather than to `--font-display`. The hero is the one place on the site where type is the image rather than the information.

**Spacing & Shape**

- Direction is generous — sections breathe, content is never crowded. When in doubt, add more whitespace, not less.
- **Square edges and hairlines are the default** (changed 2026-11-23). Sections are separated by a 1px rule that fades at both ends, not by a panel. Rounding is now the exception, and it means something: it marks the two places on the landing page that are objects you act on — the contact form and the channel tiles, which keep `rounded-3xl` and the glass treatment. The earlier default was the reverse, and the reason it changed is that rounding everything made the page read as a column of boxes.

**Motion Personality**

Smooth, swift, balanced — considered without being slow and cinematic, responsive without being snappy or aggressive.

- Default duration: 400–700ms
- Easing: ease-out for entrances, ease-in-out for transitions, never linear
- GSAP default ease: `power2.out`
- No jarring cuts or instant state changes — everything transitions

---

## Part 2 — Dev Foundations

### 5. Core Engineering Principles

**Own your data, own your stack.** Portability and independence from large platform dependencies is a consistent value, not a one-off preference. It's the reasoning behind choosing a self-hosted CMS over a SaaS one, self-hosted media storage over a bundled platform service, and self-hosted ticketing over a third-party platform — see the relevant ADRs for each. When evaluating a new tool or service, ownership of the underlying data is a real factor in the decision, not an afterthought.

**Lean v1 scopes, with explicit deferrals.** Naming what's out of scope is as important as naming what's in it. Complexity is graduated in deliberately, not built upfront on the chance it's needed later. `concepts/CONCEPT_site-structure.md` §6 is the model to follow: every deferred feature gets a line, a status, and a reason, so "not now" is a recorded decision instead of something that quietly never happens or quietly creeps back in.

**Graceful degradation is non-negotiable.** Any dependency on a browser API needs a `try`/`catch` and a safe fallback. Decorative features must never break core functionality — the starfield's sessionStorage lock with a defensive fallback is the reference pattern. If a visual flourish fails, the visitor should never know; they should just see a slightly plainer page.

**Discoverability hints ship with every non-obvious interaction.** If an interaction isn't discoverable by looking at the screen — arrow-key navigation, hover states with hidden depth — it ships with a visible hint at the same time as the interaction itself, not as a follow-up polish pass. Visual treatment can be refined later; the hint's existence is not optional.

**Consult before creating.** New files, documents, or baked-in decisions get proposed and discussed before they're drafted in full — not delivered as a finished, unreviewed fait accompli. This applies to every contributor and to any AI agent working on the project: propose the shape, get it reviewed, then build. It's slower per-step and faster overall, because it's the difference between one round of feedback and un-doing finished work.

### 6. Coding Standards

- **App Router only** — never the Pages Router.
- **TypeScript everywhere** — every file is `.ts` or `.tsx`, no plain `.js`.
- **Tailwind CSS + CSS variables** for all styling. No hardcoded colours or fonts, ever — reference the token (§4).
- **Radix UI** for accessible interactive primitives, styled directly with Tailwind. Don't add a new component library without discussing it first.
- **Icons** — `lucide-react` for UI icons (arrows, close, menu, chevrons), `react-icons` for brand/social icons (Instagram, SoundCloud, Spotify, YouTube). The two are kept deliberately separate; don't use one where the other belongs.
- **Animation logic** lives in dedicated hooks or components under a dedicated `animations` directory — not scattered inline through page components.

---

## Part 3 — Where Else to Look

This document covers identity and foundations only. For everything else:

- **What we currently run, and why** → `TECH_STACK.md` and `/docs/adr/`
- **Mistakes already made, so they aren't repeated** → `TRAP_LORE.md`
- **The full documentation map, and how ADRs work** → `ONBOARDING.md`
- **Local setup, Git workflow, review process, and team structure** → `CONTRIBUTING.md`
