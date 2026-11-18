import { Suspense } from "react";
import { Philosopher, DM_Sans } from "next/font/google";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import "./globals.css";
import { GrowthField } from "@/components/animations/GrowthField";
import { Footer } from "@/components/layout/Footer";
import { Lantern } from "@/components/layout/Lantern";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTracker } from "@/components/analytics/PageTracker";
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

/**
 * Social links for the lantern menu come from the CMS, so the URLs can change without a
 * deploy. Isolated into its own async component so the database read sits behind a Suspense
 * boundary and doesn't force the whole shell to render dynamically.
 *
 * The fallback is a lantern with no socials rather than nothing at all — the lantern should
 * be on screen from the first paint, and since the panel starts closed nobody sees the
 * links fill in.
 */
async function LanternWithSocials() {
  // Only the fetch is guarded. Returning JSX from inside the try would be misleading —
  // React renders the element later, so a render error could never reach this catch, and
  // the `react-hooks/error-boundaries` lint rule correctly rejects that shape.
  let social;
  try {
    const payload = await getPayload({ config: configPromise });
    social = await payload.findGlobal({ slug: "social-links" });
  } catch {
    // CMS unreachable — resolveSocials falls back to the known URLs rather than dropping
    // the social row entirely.
  }

  return <Lantern socials={resolveSocials(social)} />;
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
          <Suspense fallback={null}>
            <PageTracker />
          </Suspense>

          {/* Fixed, full-viewport, behind everything. Lives in the layout rather than the
              page so the legal routes get the same world instead of a flat black page. */}
          <GrowthField />

          <Suspense fallback={<Lantern />}>
            <LanternWithSocials />
          </Suspense>

          <div className="relative z-10 flex min-h-svh flex-col">
            <main className="flex-1">{children}</main>
            <SuspendedFooter />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
