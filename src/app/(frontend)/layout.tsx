import { Suspense } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { GrowthField } from "@/components/animations/GrowthField";
import { Footer } from "@/components/layout/Footer";
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
 * not since `body` moved to `font-ui`. VISION.md §4's typography table still lists Cinzel
 * and also needs updating.)
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
 * One variable file covers the whole 400–700 range, so the four weights the UI uses come
 * from a single 61 KB download instead of four separate ones.
 */
const dmSans = localFont({
  variable: "--font-ui",
  display: "swap",
  src: [{ path: "../../fonts/DMSans-Variable-latin.woff2", weight: "400 700", style: "normal" }],
});

export const metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${philosopher.variable} ${dmSans.variable} antialiased`}>
      {/* Ordinary document scrolling. This used to be a fixed-height body with an inner
          scroll container, which the sidebar layout needed — with the sidebar gone, the
          scroll container only got in the way (anchor links and scroll-into-view both
          behave differently inside one). */}
      <body className="bg-background text-foreground min-h-svh">
        <TooltipProvider>
          {/* Fixed, full-viewport, behind everything. Lives in the layout rather than the
              page so the legal routes get the same world instead of a flat black page. */}
          <GrowthField />

          {/* Socials come from constants while the CMS is decoupled (see src/lib/socials.ts).
              This used to be an async component reading the `social-links` global behind its
              own Suspense boundary; with a synchronous source the boundary bought nothing,
              so it went with it. Both come back together. */}
          <Lantern socials={resolveSocials()} />

          <div className="relative z-10 flex min-h-svh flex-col">
            <main className="flex-1">{children}</main>
            <SuspendedFooter />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
