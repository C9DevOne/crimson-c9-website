import type { Metadata } from "next";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import TermsClient from "./terms-client";

export const metadata: Metadata = {
  title: "Terms & Privacy — CrimsonC9",
  description: "Terms of use and data protection information for CrimsonC9.",
  robots: { index: false, follow: true },
};

export default async function TermsPage() {
  // Defaults, also used verbatim when the CMS is unreachable.
  let termsData = {
    siteName: "CrimsonC9",
    contactEmail: "hello@crimsonc9.com",
  };

  // Same reasoning as /imprint: this page carries the privacy notice the landing page's
  // consent checkbox links to, so a database outage must not be able to remove it.
  try {
    const payload = await getPayload({ config: configPromise });
    const siteSettings = await payload.findGlobal({ slug: "site-settings" });

    termsData = {
      siteName: siteSettings.siteName || termsData.siteName,
      contactEmail: siteSettings.contactEmail || termsData.contactEmail,
    };
  } catch {
    // Fall through with the defaults above.
  }

  return <TermsClient data={termsData} />;
}
