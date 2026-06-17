# Project: Crimson C9 Website

This project is the digital home for **Crimson C9**, a Techno music collective based in Aachen, Cologne, and Berlin. The site serves as a platform to showcase artists, events, and discoveries, grounded in the philosophy of "Change Through Music."

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Version 16+)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/) (Version 4)
- **Animation:** [GSAP](https://gsap.com/) + [Lenis](https://lenis.darkroom.engineering/) (Smooth Scroll)
- **3D Graphics:** [Three.js](https://threejs.org/) / [React Three Fiber](https://r3f.docs.pmnd.rs/)
- **Backend/CMS (Planned):** Supabase (DB), Sanity (CMS), Stripe (Payments)
- **Deployment:** [Vercel](https://vercel.com/)

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`:
  - `layout/`: Shared structural components (Header, Footer, Navigation).
  - `ui/`: Reusable UI primitives.
    - `hooks/`: Custom React hooks.
  - `animations/`: Components or wrappers dedicated to GSAP/R3F animations.
- `lib/`: Utility functions and shared library configurations.
- `public/`: Static assets.

## Development Guidelines

### Core Principles

- **Discover, Connect, Have Fun:** Every feature should align with these pillars.
- **Aesthetic:** Dark theme (`#0a0a0a`), Crimson accents (`#DC143C`), mystical, organic, and nature-inspired with 2D/3D geometric designs.

### Conventions

- **App Router Only:** Never use the Pages Router.
- **TypeScript Everywhere:** No plain `.js` or `.jsx` files.
- **Surgical Styling:** Use Tailwind utilities and CSS variables for brand tokens.
- **Animation Logic:** Keep GSAP animations in dedicated hooks or utility components to maintain readability in main UI files.
- **Minimal Dependencies:** Avoid external UI component libraries unless strictly necessary for complex functionality.
- **No Build Commands:** Do NOT run build commands (such as `npm run build` or `next build`) in this environment.

### Key Commands

- `npm run dev`: Starts the development server.
- `npm run lint`: Runs ESLint for code quality checks.
- You do not need to mention that you ran these two commands
- _Note: Do NOT run `npm run build`._

## Documentation References

- [AI_CONTEXT.md](./AI_CONTEXT.md): Detailed project background, design language, and site sections.
- [AGENTS.md](./AGENTS.md): Important notice regarding Next.js 16+ breaking changes.
