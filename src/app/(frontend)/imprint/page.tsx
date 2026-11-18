import type { Metadata } from "next";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import ImprintClient from "./imprint-client";

export const metadata: Metadata = {
  title: "Imprint — CrimsonC9",
  description: "Legal information according to § 5 DDG for CrimsonC9.",
  // A legal notice has no business in search results competing with the site itself.
  robots: { index: false, follow: true },
};

export default async function ImprintPage() {
  // Defaults, also used verbatim when the CMS is unreachable.
  let imprintData = {
    siteName: "CrimsonC9",
    tagline: "Change Through Music",
    contactEmail: "hello@crimsonc9.com",
  };

  // This page is legally required to be reachable, so a database outage must not take it
  // down — previously an unwrapped findGlobal meant exactly that, with the error boundary
  // swallowing the whole Impressum. The CMS only supplies cosmetic values here anyway; the
  // legally load-bearing content is hardcoded in the client component.
  try {
    const payload = await getPayload({ config: configPromise });
    const siteSettings = await payload.findGlobal({ slug: "site-settings" });

    imprintData = {
      siteName: siteSettings.siteName || imprintData.siteName,
      tagline: siteSettings.tagline || imprintData.tagline,
      contactEmail: siteSettings.contactEmail || imprintData.contactEmail,
    };
  } catch {
    // Fall through with the defaults above.
  }

  return <ImprintClient data={imprintData} />;
}
