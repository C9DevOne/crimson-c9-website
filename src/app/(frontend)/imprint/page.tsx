import type { Metadata } from "next";
import ImprintClient from "./imprint-client";

export const metadata: Metadata = {
  title: "Imprint — CrimsonC9",
  description: "Legal information according to § 5 DDG for CrimsonC9.",
  // A legal notice has no business in search results competing with the site itself.
  robots: { index: false, follow: true },
};

/**
 * These three were read from the `site-settings` global with exactly these values as the
 * fallback, so decoupling the CMS changed nothing that renders. The legally load-bearing
 * content was never in the CMS — it is in the client component.
 */
const IMPRINT_DATA = {
  siteName: "CrimsonC9",
  tagline: "Change Through Music",
  contactEmail: "hello@crimsonc9.com",
};

export default function ImprintPage() {
  return <ImprintClient data={IMPRINT_DATA} />;
}
