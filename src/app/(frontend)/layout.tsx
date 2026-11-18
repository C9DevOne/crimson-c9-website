import { Suspense } from "react";
import { Philosopher, DM_Sans } from "next/font/google";
import "./globals.css";
import { GrowthField } from "@/components/animations/GrowthField";
import { Footer } from "@/components/layout/Footer";
import { Lantern } from "@/components/layout/Lantern";
import { TooltipProvider } from "@/components/ui/tooltip";
import { resolveSocials } from "@/lib/socials";

/**
 * Philosopher now carries both body and headings — Cinzel Decorative was retired on
 * 2026-10-02 in favour of one readable face across the site. `--font-display` is aliased to
 * this in globals.css rather than being a second font instance, so call sites can keep
 * saying `font-display` for a heading.
 *
 * `preload` is on now that this is the primary face, where it was off when it was only one
 * of three. VISION.md §4's typography table still lists Cinzel and needs updating.
 */
const philosopher = Philosopher({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
