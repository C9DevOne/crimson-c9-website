"use client";

import Link from "next/link";
import type { Route } from "next";

// Only routes that actually exist may be listed here — Next's typed routes reject the
// rest at build time, which is deliberate: a dead link can't ship unnoticed.
//
// Imprint and Terms are live: they are legally required in DE, and the landing page now
// collects personal data through its contact form. Contact and Support stay disabled
// (`_`-prefixed, see docs/concepts/CONCEPT_site-structure.md §5) — uncomment each as it
// ships, and add it to PUBLIC_PREFIXES in src/proxy.ts at the same time or it will
// redirect to `/` in production regardless.
const links: { name: string; href: Route }[] = [
  { name: "Imprint", href: "/imprint" },
  { name: "Terms & Conditions", href: "/terms" },
  // { name: "Contact", href: "/contact" },
  // { name: "Support", href: "/support" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto py-8 sm:py-10">
      {/* A hairline instead of a border and a glow. The footer is the end of the page, not
          a separate region that needs announcing. */}
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="rule" />

        <div className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="type-label">CrimsonC9 © {currentYear}</p>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="type-label hover:text-foreground transition-colors duration-400"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
