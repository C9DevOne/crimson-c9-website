---
description: CrimsonC9 website project onboarding routine for new AI contexts
---

# CrimsonC9 Website — New Context Onboarding

Use this workflow when an AI agent joins this project with no prior context.

## 1. Verify the project location

- **Workspace root:** `H:\Crimson\Code\website`
- **GitHub repo:** `https://github.com/C9DevOne/crimson-c9-website.git`
- **Project type:** Next.js 16.2.7 App Router + TypeScript + Tailwind CSS v4 + GSAP + Framer Motion + shadcn/radix
- **Live domain:** `crimsonc9.com` (Vercel + Cloudflare)

## 2. Read the context documents (in order)

1. `AGENTS.md` — Next.js 16+ breaking-change warning and hard rules
2. `AI_CONTEXT.md` — full project vision, design language, tech stack, conventions, infrastructure
3. `CONTRIBUTING.md` — Git workflow, branch naming, commit format, review policy
4. `GEMINI.md` — short project overview and key commands
5. `CLAUDE.md` — pointer to `AGENTS.md`

## 3. Check Git state

```powershell
git status --short
git branch --show-current
git log --oneline -5
```

- Never push directly to `main`; always branch off `main` and open a PR.
- Branch names: `feat/<name>`, `fix/<name>`, `style/<name>`, `refactor/<name>`, `docs/<name>`.
- Commits: Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `init:`).
- If you see `warning: in the working copy of ... LF will be replaced by CRLF`, `core.autocrlf` is `true` (expected on Windows).

## 4. Verify the environment

```powershell
node --version   # expected: v20+ (current v24.16.0)
npm --version    # expected: 9+ (current 11.13.0)
```

## 5. Ensure dependencies are installed

```powershell
if ((Get-ChildItem node_modules -ErrorAction SilentlyContinue | Measure-Object).Count -eq 0) { npm install }
```

**Critical:** if dependencies are broken, use the dependency recovery sequence:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

After recovery, verify `package.json` has not been downgraded:

- `next` must be `^15.3.3` or higher (installed is `16.2.7`)
- `eslint-config-next` must match the Next.js version
- **Never run `npm audit fix --force`** — it has previously downgraded Next.js to v9.

## 6. Configure Git safe directory (if on external drive / Windows)

```powershell
git config --global --add safe.directory H:/Crimson/Code/website
```

## 7. Check for environment variables

- Look for `.env.local` in the project root.
- If missing, ask Aaron or Nick for Supabase / external API secrets; **do not commit** `.env.local`.
- Current repo state: `.env.local` is not present and is already gitignored.

## 8. Run the development server

```powershell
npm run dev
```

Open `http://localhost:3000`.

## 9. Run lint / format after every change

```powershell
npm run lint
npm run format
```

You do not need to mention that these ran.

## 10. Project-specific hard rules

- **App Router only** — never use Pages Router.
- **TypeScript everywhere** — all files `.ts` / `.tsx`; no plain `.js`.
- **No hardcoded colours** — use CSS variables (`var(--brand-crimson)`, `var(--background)`, etc.).
- **No hardcoded fonts** — use CSS variables (`var(--font-display)`, `var(--font-body)`, `var(--font-ui)`).
- **GSAP animations** — keep in `components/animations/` or dedicated hooks.
- **UI libraries** — Shadcn only; do not add new libraries without discussion.
- **Icons** — `lucide-react` for UI icons; `react-icons` (ri/fa) for brand/social icons.
- **Desktop-first** — mobile layouts are a future phase; apply a sensible `min-width` stopgap only.
- **Do not run `next build` / `npm run build`** in this environment.
- **Read Next.js docs from `node_modules/next/dist/docs/`** before using unfamiliar APIs (Next.js 16 has breaking changes).
- **Canonical logo asset:** `public/crimson_logo_black.png` (the `DragonLogo` component and any old `dragon.svg` are not preferred).

## 11. Current project state at a glance (as of the last onboarding check)

- **Homepage (`app/page.tsx`)** is a temporary fixed overlay containing the crimson logo, a Weeztix ticket widget, and social links.
- **Artists page (`app/artists/page.tsx`)** has a `CircularGallery` with placeholder artist data (Picsum images, demo bios).
- **Events, Connect, Music, About, Contact, Imprint, Support, Terms** are placeholder pages with a `DecryptedText` heading.
- **Layout** includes `Navbar`, `AppSidebar`, `Footer`, and `TooltipProvider`/`SidebarProvider` wrappers.
- **Linting passes** (`npm run lint` exits 0) and `node_modules` is installed.
- **Uncommitted change:** `AI_CONTEXT.md` has pending edits on the `docs/contributing-guide` branch.

## 12. Ask before assuming

When starting a new page or component:

1. Confirm assets, navigation, layout, interactions, and references.
2. Propose a structure; confirm understanding in one round.
3. Build a single, immediately testable component/page.
4. Iterate after review.
