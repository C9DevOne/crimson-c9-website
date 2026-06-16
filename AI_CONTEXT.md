# CrimsonC9 — AI Context Document

_Load this file at the start of every Windsurf/Cascade session before writing any code._

---

## 1. Project Overview

**Name:** CrimsonC9 (always one word, no space — never "Crimson C9")
**Tagline:** "Change Through Music"
**Type:** Techno music collective + aspiring fashion brand
**Location:** Berlin/Cologne/Aachen Germany
**Website:** crimsonc9.com
**GitHub Org:** github.com/C9DevOne
**Repo:** github.com/C9DevOne/crimson-c9-website

---

## 2. Project Vision

CrimsonC9 is the online home for a young Berlin, Cologne and Aachen based techno artist collective. It's where community members, potential collaborators, and bookers can explore who we are and what we do. The site should feel like entering a new world — visually immersive, easy to navigate, and full of personality.

### Three Core Design Aims

**DISCOVER** — Visitors discover new music, artists, events, and visual content. The artist roster and individual pages are central to this. Exploration is rewarded.

**CONNECT** — Central hub for all social channels, WhatsApp community, and clear pathways for bookers and collaborators to reach out. Bridge between online presence and real-world events.

**FUN** — Visually striking and interesting to explore. Interactive elements and easter eggs. Balance between aesthetic wonder and easy, functional usability.

---

## 3. Team

| Person | Role                                         |
| ------ | -------------------------------------------- |
| Aaron  | Frontend lead, project driver                |
| Nick   | Backend developer (Supabase, API routes, DB) |

Aaron has a CS background and is actively learning through the build process. Always explain the _why_ behind technical decisions, not just the what. Reasoning matters more than instructions.

---

## 4. Tech Stack

### Frontend

| Technology        | Purpose                      | Notes                                             |
| ----------------- | ---------------------------- | ------------------------------------------------- |
| Next.js 15        | React framework              | App Router only — never Pages Router              |
| TypeScript        | Type safety                  | All files must be .tsx/.ts — no plain .js         |
| Tailwind CSS v4   | Utility-first styling        | CSS variables for all brand tokens                |
| GSAP 3            | Web animation                | Scroll triggers, timelines, staggered entrances   |
| Lenis             | Smooth scroll                | Pairs with GSAP ScrollTrigger                     |
| Three.js          | 3D graphics                  | Browser-based WebGL                               |
| React Three Fiber | React wrapper for Three.js   | Write 3D scenes as React components               |
| @react-three/drei | R3F helper library           | Pre-built 3D primitives, cameras, effects         |
| Framer Motion     | UI animation                 | Component-level transitions and layout animations |
| tw-animate-css    | Tailwind animation utilities |                                                   |

### Animation Decision Guide

Both GSAP and Framer Motion are installed. Use them as follows — **this is a pending decision to confirm before building animation-heavy components:**

- **GSAP** is better suited for scroll-driven animations, complex timelines, and staggered sequences (e.g. hero reveals, scroll journeys)
- **Framer Motion** is better suited for component-level transitions, page transitions, and layout animations (e.g. modals opening, list items appearing)
- When in doubt, flag it and ask Aaron rather than picking arbitrarily

### Backend / Services

| Technology | Purpose                                        |
| ---------- | ---------------------------------------------- |
| Supabase   | Database, auth, file storage, API              |
| Sanity CMS | Headless CMS for events, releases, artist bios |
| Stripe     | Payments for shop/merch                        |

### Component Layer

| Technology               | Purpose                            | Notes                                       |
| ------------------------ | ---------------------------------- | ------------------------------------------- |
| Shadcn UI                | Pre-built accessible UI components | Fully owned in codebase, fully customisable |
| Radix UI                 | Headless component primitives      | Underpins Shadcn                            |
| class-variance-authority | Component variant management       |                                             |
| tailwind-merge           | Tailwind class merging utility     |                                             |
| lucide-react             | Icon library                       |                                             |

Do not add new UI component libraries without discussing with Aaron first. Shadcn is the approved choice.

### Tooling

| Technology                             | Purpose                |
| -------------------------------------- | ---------------------- |
| ESLint                                 | Linting                |
| Prettier + prettier-plugin-tailwindcss | Code formatting        |
| Vercel                                 | Deployment and hosting |

---

## 5. Design Language

### Aesthetic & Mood

- Underground Berlin techno with visual artistry
- Organic and geometric — nature meets structure
- Dragon as central brand element
- "Something is growing here" — growth narrative throughout
- Blend of natural and futuristic elements
- Think: elegant, minimal, surprising, clean, natural

### Design Keywords

Clean · Organic · Geometric · Minimal · Elegant

### Visual Principles

1. **Visuals first** — images, video, and 3D elements take centre stage. Every section needs a strong visual identity.
2. **Clean UI** — minimal, elegant interfaces. Information is clear and accessible despite the artistic ambition.
3. **Vibe** — easily identifiable structure without needing much explanation. The site should orient visitors intuitively.

### Colour Palette

```css
--background: #0a0a0a; /* near-black, primary background */
--foreground: #f5f5f5; /* off-white, primary text */
--brand-crimson: #510606; /* confirmed primary accent — deep crimson/burgundy red */
--secondary: #1a1a1a; /* surface colour */
--muted-foreground: #a1a1aa; /* subdued text */
--brand-accent: #cc5500; /* fire accent — ember orange, confirmed */
```

Do not hardcode any colour values. Always reference CSS variables. If a colour isn't yet tokenised, flag it and ask rather than inventing a value.

### Logo Behaviour

- The C9 dragon logo inverts colours based on background (inspired by leonardoliviero.com)
- Dark background → light logo; light background → dark logo

### Reference Sites

| Site                | What to take from it                                                    |
| ------------------- | ----------------------------------------------------------------------- |
| boomland.eu         | Organic geometric visual style, events timeline approach                |
| hyper-dreams.com    | Artist section interaction — minimal, navigatable booking feel          |
| insanefestival.com  | Clean UI, clear colour palette, strong section hierarchy                |
| bemo.studio         | Visuals as primary focus — but less overwhelming than this on CrimsonC9 |
| leonardoliviero.com | Simplicity, elegance, the inverted logo colour behaviour                |

---

## 5.5 Design Decisions & Tokens

### Typography System

| Role               | Font              | Usage                                             |
| ------------------ | ----------------- | ------------------------------------------------- |
| Display / Artistic | Cinzel Decorative | Hero text, section titles, brand moments          |
| Body / Reading     | Philosopher       | Article text, artist bios, longer content         |
| UI / Interface     | DM Sans           | Nav items, buttons, labels, captions, form fields |

CSS variables: `--font-display`, `--font-body`, `--font-ui`

All three fonts are available on Google Fonts and should be loaded
via Next.js's next/font system in layout.tsx for performance.

### Spacing

Direction: generous. Sections breathe, content is not crowded.
Lean toward larger padding and margin values than Tailwind defaults
suggest. When in doubt, add more whitespace rather than less.

### Border Radius

Primary direction: rounded corners.

- Cards, images, media containers → `rounded-2xl` or `rounded-3xl`
- Buttons and inputs → `rounded-full` or `rounded-xl`
- Sharp/no radius reserved for intentional exceptions only

### Motion Personality

Smooth, swift, and balanced.

- Animations should feel considered — not slow and cinematic,
  not snappy and aggressive. Find the middle.
- Default duration range: 400ms–700ms
- Preferred easing: ease-out for entrances, ease-in-out for
  transitions, never linear
- GSAP default ease: `power2.out`
- No jarring cuts or instant state changes — everything transitions

### Responsive Strategy

Desktop-first. Mobile layout is a future phase.
Build for desktop viewport widths first. Apply a sensible minimum
width (min-width: 768px or similar) so the site doesn't completely
break on smaller screens before the mobile pass. Do not invest time
in mobile-specific layouts until Phase 6.

## 6. Site Structure

### Core Pages (Phase 3 Priority)

#### Homepage

Entry point. Pull visitors in and communicate the vibe immediately.

- Heavy visual focus — "diving into a new world"
- Scroll-based journey introducing who we are
- Introduces the three pillars: Discover, Connect, Fun
- Universal menu button (top-left positioning concept)
- Clear navigation to Artists, Events, Music sections

#### Artists / Roster Page — `/artists`

Showcase residents for bookings and creative expression.

- Main roster overview with all artists
- Individual artist pages at `/artists/[artist-name]`
- Each artist gets a customisable space within a shared framework
- On hover: bio overlay → click through to full individual page
- For bookers: quick browse of styles + contact paths (email + socials)
- Interaction reference: hyper-dreams.com

#### Events Page — `/events`

Showcase events and build an archive timeline. Three parts:

1. Visually striking entry screen introducing the CrimsonC9 events world
2. Upcoming events with links to ticket sites, Resident Advisor, promo materials
3. Digital archive — each past event gets its own entry with date, venue, photos, video, lineup, recordings

#### Connect Page — `/connect`

Central access point for community and social channels.

- All social media links (Instagram, YouTube, SoundCloud, Spotify)
- WhatsApp community join link
- Collaboration invite — "let's work together" messaging for other collectives
- Outreach/contact form with considered design (potentially its own dedicated experience)
- Volunteer/contributor invite — people can join and grow with the project

#### About Us — `/about`

History of CrimsonC9, where we come from, core identity. Text and visual anchoring.

### Secondary Pages (Phase 5)

#### Music / Label Page — `/music` _(priority TBD)_

- Released tracks and projects
- Spitfire Techno Podcast
- Embedded SoundCloud + Spotify players
- "Listening lounge" concept with cool visuals
- May merge with another section depending on site flow

#### Broadcast / News — `/broadcast` _(planned, not immediate)_

- Blog-style updates and news
- Embedded social feeds (Instagram + YouTube)
- Community announcements

### Future Vision (Long-term, not in scope now)

- Mobile-optimised layout
- "The Playground" — online forum/community space
- Personal user accounts with profile/portfolio space
- "The Library" — collaborative knowledge base
- Shop — merch purchases
- Own ticketing system

---

## 7. Folder Structure

```
crimson-c9-website/
├── app/                        # Next.js App Router pages
│   ├── globals.css             # Global styles + CSS variables
│   ├── layout.tsx              # Root layout, metadata
│   ├── page.tsx                # Homepage
│   ├── artists/
│   │   ├── page.tsx            # Roster overview
│   │   └── [slug]/page.tsx     # Individual artist pages
│   ├── events/page.tsx
│   ├── connect/page.tsx
│   └── about/page.tsx
├── components/
│   ├── layout/                 # Navbar, footer, page wrappers
│   ├── ui/                     # Reusable interface elements
│   └── animations/             # GSAP wrappers, Three.js scenes
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions, API helpers
├── public/
│   └── fonts/                  # Local font files
├── AI_CONTEXT.md               # This file
├── package.json
└── next.config.ts
```

---

## 8. Coding Conventions

- **App Router only** — never use the Pages Router
- **TypeScript everywhere** — no plain `.js` files, all files are `.tsx` or `.ts`
- **Styling** — Tailwind utility classes + CSS variables for all brand tokens
- **No hardcoded colours** — always use CSS variables, e.g. `var(--brand-crimson)`
- **No hardcoded fonts** — always use CSS variables, e.g. `var(--font-display)`
- **GSAP animations** — in dedicated hooks or components under `components/animations/`
- **Component libraries** — Shadcn only; do not add new UI libraries without discussion
- **Commits** — Conventional Commits format: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `init:`
- **Branching** — always work on a feature branch; merge to `main` only when tested and working

---

## 9. Development Environment

### Setup

- **OS:** Windows, H:\ external drive
- **Project path:** `H:\Crimson\Code\website`
- **Shell:** PowerShell
- **Editor:** VS Code (daily), Windsurf (AI-assisted sessions)
- **Node:** v24 LTS

### Critical PowerShell Gotchas

These have caused real problems before — do not repeat them:

| Issue                   | Wrong                     | Correct                                                            |
| ----------------------- | ------------------------- | ------------------------------------------------------------------ |
| Creating multiple dirs  | `mkdir -p a b c`          | Run `mkdir a`, `mkdir b`, `mkdir c` separately                     |
| Creating empty files    | `echo $null > file`       | `New-Item filename`                                                |
| Path separators         | `/` sometimes fails       | Use `\` backslashes                                                |
| Deleting node_modules   | Looks stuck/frozen        | It's working — 50k+ files take time, just wait                     |
| `npm audit fix --force` | **NEVER USE**             | Downgraded Next.js from v15 to v9.3.3 — use `npm audit fix` only   |
| Git on external drive   | "Dubious ownership" error | `git config --global --add safe.directory H:/Crimson/Code/website` |

### Dependency Recovery

If dependencies break:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

Then verify `package.json` — key versions that must not be downgraded:

- `"next"` → `"^15.3.3"`
- `"eslint-config-next"` → must match Next.js version

---

## 10. Key Dependencies (Correct Versions)

```json
{
  "dependencies": {
    "next": "^15.3.3",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "gsap": "^3.15.0",
    "lenis": "^1.3.23",
    "@studio-freight/lenis": "^1.0.42",
    "three": "^0.184.0",
    "@react-three/fiber": "^9.6.1",
    "@react-three/drei": "^10.7.7",
    "framer-motion": "^12.40.0",
    "tw-animate-css": "^1.4.0",
    "shadcn": "^4.10.0",
    "radix-ui": "^1.4.3",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@radix-ui/react-separator": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.6.0",
    "lucide-react": "^1.17.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "^15.3.3",
    "prettier": "^3.8.3",
    "prettier-plugin-tailwindcss": "^0.8.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.184.1"
  }
}
```

---

## 11. Infrastructure

| Service   | Purpose               | Notes                                                                                   |
| --------- | --------------------- | --------------------------------------------------------------------------------------- |
| Vercel    | Hosting + deployment  | Connected to GitHub — auto-deploys on push to `main`; feature branches get preview URLs |
| Namecheap | Domain registrar only | crimsonc9.com — DNS not yet pointed to Vercel (happens at launch)                       |
| Supabase  | Backend               | Managed by Nick; Aaron has owner access                                                 |
| Zoho Mail | Email                 | hello@crimsonc9.com — must not be disrupted by DNS changes                              |

---

## 12. Social Links

| Platform           | URL                                |
| ------------------ | ---------------------------------- |
| Instagram          | instagram.com/crimsonc9            |
| SoundCloud         | soundcloud.com/crimsonc9           |
| WhatsApp Community | TBD                                |
| YouTube            | https://www.youtube.com/@CrimsonC9 |

---

## 14. Development Phases

### Phase 1 — Foundation (DONE)

- Next.js 15 scaffolded with TypeScript, Tailwind v4, Turbopack
- Core dependencies installed
- Folder structure created
- Brand CSS variables set in globals.css
- Repo live at github.com/C9DevOne/crimson-c9-website
- Vercel connected and deploying

### Phase 2 — Design System (DONE)

- ✅ Confirm orange/fire accent colour values (#cc5500) and add to CSS tokens
- ✅ Set up Cinzel Decorative + Philosopher + DM Sans font loading in layout.tsx
- ✅ Build design token reference page (`/dev/tokens`) to verify colours, fonts, spacing, radius, motion
- ✅ Confirm GSAP vs Framer Motion usage rule — Framer Motion for UI/component animations

### Phase 3 — Core Pages (IN PROGRESS)

Build in this order, one component at a time:

1. ✅ Dagon logo centrepiece (sticky, centered, hover scale animation)
   1.2 Universal Hovering Hamburger Menu with navigation links
2. Homepage — hero, scroll journey, three pillars (Discover / Connect / Fun)
3. Artists / Roster page — animated roster, bio overlays, individual artist template
4. Events page — entry screen, upcoming events, archive structure
5. Connect page — social links, WhatsApp, collaboration invite, outreach form
6. About page — history, identity, visual anchoring

### Phase 4 — CMS & Backend

- Sanity CMS schema: events, artist bios, releases
- Supabase: DB schema, auth setup, file storage
- Connect Sanity content to Artist and Events pages
- Environment variables added to Vercel

### Phase 5 — Secondary Features

- Music / Label page with embedded players
- Broadcast / News page with social feed embeds
- Stripe integration scaffolding (shop groundwork)

### Phase 6 — Polish & 3D

- GSAP scroll animations and page transitions
- Three.js / R3F integrations (3D elements, easter eggs)
- Lenis smooth scroll tuning
- Mobile optimisation throughout
- Performance audit

### Phase 7 — Testing & Launch

- User testing with collective members
- Cross-browser and device testing
- Full content population
- Point crimsonc9.com DNS to Vercel
- Soft launch — target: before Summer 2026

---

_Document last updated: June 2026_
_Maintained by Aaron — update after major decisions, new features, or stack changes_
