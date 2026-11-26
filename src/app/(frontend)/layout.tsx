import { Suspense } from "react";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { Starfield } from "@/components/animations/Starfield";
import { Footer } from "@/components/layout/Footer";
import { CityCycle } from "@/components/layout/CityCycle";
import { Lantern } from "@/components/layout/Lantern";
import { TooltipProvider } from "@/components/ui/tooltip";
import { resolveSocials } from "@/lib/socials";

/**
 * Both families are served from our own origin (`src/fonts/`, see the README there) rather
 * than through `next/font/google`, which fetches them from Google at *build* time — a
 * dependency that failed on 2026-11-22, went red on `main` and skipped a deploy. CRI-21.
 *
 * Same latin subset, same weights, same CSS variables as before, so nothing that renders
 * changes. `display: "swap"` is set explicitly because `next/font/local` does not default
 * to it the way the Google loader did; without it the first paint hides the text.
 *
 * Philosopher is the heading face: globals.css aliases `--font-display` to `--font-body`
 * rather than instantiating a second font, so call sites keep saying `font-display` for a
 * heading. Cinzel Decorative was retired on 2026-10-02 in favour of one display face.
 * DM Sans carries body and UI text — `body` is `@apply font-ui`.
 *
 * (The comment this replaces said Philosopher carried body text too. It does not, and has
 * not since `body` moved to `font-ui`.)
 */
const philosopher = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    { path: "../../fonts/Philosopher-Regular-latin.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/Philosopher-Bold-latin.woff2", weight: "700", style: "normal" },
  ],
});

/**
 * One variable file covers the whole 400–700 range, so the weights the micro-labels use
 * come from a single 61 KB download instead of four.
 */
const dmSans = localFont({
  variable: "--font-ui",
  display: "swap",
  src: [{ path: "../../fonts/DMSans-Variable-latin.woff2", weight: "400 700", style: "normal" }],
});

/**
 * Cinzel Decorative, back for the hero headline only (CRI-22, Aaron).
 *
 * It was retired on 2026-10-02 in favour of one readable face across the site, and that
 * reasoning still holds for everything that is *read* — it is a display face with flared
 * serifs and tight counters, unreadable below about 24px. So it is scoped to a single
 * element rather than wired to `--font-display`: the hero is the one place on the site
 * where type is the image rather than the information.
 *
 * `preload` is off deliberately. It is used once, below the fold on nothing, and
 * preloading a third family would cost the first paint more than it buys.
 */
const cinzelDecorative = localFont({
  variable: "--font-hero",
  display: "swap",
  preload: false,
  src: [
    { path: "../../fonts/CinzelDecorative-Regular-latin.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/CinzelDecorative-Bold-latin.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata = {
  /**
   * Required for `src/app/opengraph-image.jpg` to resolve to an absolute URL. Without it
   * Next emits a relative `og:image`, which every social platform ignores — the preview
   * then falls back to no image at all, which is exactly the bug this was added to fix.
   *
   * Hardcoded rather than read from an env var: there is one public origin, and a wrong
   * value here is invisible until someone shares a link.
   */
  metadataBase: new URL("https://crimsonc9.com"),
  title: "CrimsonC9",
  description:
    "Change Through Music. CrimsonC9 is a young Techno collective, label and event curator that serves as a platform for emerging artists to showcase their unique talent and passion for music to the world",
};

/**
 * The footer reads the current year, which under Cache Components counts as platform I/O:
 * doing it inside a client component aborts the static prerender unless a Suspense boundary
 * sits above it to defer that subtree to request time. One boundary here fixes it for every
 * route rather than each one rediscovering the same error.
 *
 * `fallback={null}` is deliberate — a skeleton for a copyright line and two legal links
 * would be more visually disruptive than having them arrive a moment later.
 */
function SuspendedFooter() {
  return (
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  );
}

/**
 * Fixed chrome, anchored to the edges of the viewport with an empty middle — the move both
 * reference sites in CRI-22 make, and the reason the page reads as composed rather than as
 * a stack of centred blocks.
 *
 * Three cells: the lantern left, the mark centred, a location line right. The grid is
 * `1fr auto 1fr` so the mark is centred on the *viewport*, not on the space left over
 * between its neighbours — with `justify-between` it would drift as the right-hand text
 * changed length.
 */
function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Scrim rather than a solid bar: the header has to stay readable over whatever
          scrolls under it without drawing a box around itself. */}
      <div className="from-background/90 pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent to-transparent" />

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 md:px-8 md:py-5">
        <div className="justify-self-start">
          <Lantern socials={resolveSocials()} />
        </div>

        {/* The mark is the home button. On the landing page that is a no-op, which is
            correct — it is the affordance that matters, and it starts working the moment
            there is a second route. */}
        <Link
          href="/"
          aria-label="CrimsonC9 — home"
          className="group justify-self-center transition-opacity duration-500 hover:opacity-80"
        >
          <Image
            src="/crimson-logo.webp"
            alt="CrimsonC9"
            width={326}
            height={400}
            priority
            className="h-11 w-auto brightness-[1.75] saturate-[1.1] md:h-14"
          />
        </Link>

        {/* Balances the lantern and carries a real piece of information rather than being
            filler. One city at a time, changing (CRI-23) — see CityCycle for why that is a
            cross-fade and not the vertical roll this site used to have. Hidden on phones,
            where there is no room for it beside the mark. */}
        <CityCycle className="city-tag hidden justify-self-end sm:block" />
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${philosopher.variable} ${dmSans.variable} ${cinzelDecorative.variable} antialiased`}
    >
      <body className="bg-background text-foreground min-h-svh">
        <TooltipProvider>
          {/* Fixed, full-viewport, behind everything. In the layout rather than the page so
              the legal routes get the same sky instead of a flat black page. */}
          <Starfield />

          <SiteHeader />

          <div className="relative z-10 flex min-h-svh flex-col">
            <main className="flex-1">{children}</main>
            <SuspendedFooter />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
