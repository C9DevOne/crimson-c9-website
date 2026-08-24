import { notFound } from "next/navigation";

// Internal-only route group — design tokens, component previews, the loading/error
// showcase. Never reachable in a deployed build (Production or Preview), only in
// local `next dev`. Mirrors the isDev convention already used in the root layout.
// See docs/concepts/CONCEPT_site-structure.md §2 and docs/WORKING_LOG.md.
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return children;
}
