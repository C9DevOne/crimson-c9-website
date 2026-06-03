# Crimson C9 — AI Context File

## Project Overview
CrimsonC9 is a Techno music collective and artist platform based in Aachen Cologne and Berlin. This Project's goal is to create our collective's home page and digital presence that showcases our artists, events and a place to discover new stuff. 
Tagline: "Change Through Music"
Website: crimsonc9.com

## Tech Stack
- Framework: Next.js (App Router, TypeScript)
- Styling: Tailwind CSS
- Animation: GSAP + Lenis (smooth scroll)
- 3D: Three.js / React Three Fiber
- Backend/DB: Supabase
- CMS: Sanity (headless, for events, releases, artist bios)
- Payments: Stripe
- Deployment: Vercel

## Design Language
- Dark theme, near-black background (#0a0a0a)
- Crimson accent colour (#DC143C)
- Mystical, organic, nature-inspired aesthetic and 2D-shaped geometrical designs
- Typography:  Primary Artistic Font: Cinzel Decorative, Primary Reading Font: Philosopher (organic, elegant serif), Supporting Fonts: TBD for UI elements and readability

## Site Sections
- Homepage — hero, animated intro, discover/connect/have fun pillars
- Artist Pages — individual pages per DJ/resident, animated roster with bio overlays
- Events — archive with "travel back in time" narrative
- Music / Label

## Core Principles
- Discover, Connect, Have Fun


## Conventions
- App Router only (never Pages Router)
- Components in /components with subfolders: layout/, ui/, animations/
- TypeScript everywhere — no plain .js files
- Styling via Tailwind utilities + CSS variables for brand tokens
- GSAP animations in dedicated hooks or animation utility components
- No external UI component libraries unless absolutely necessary