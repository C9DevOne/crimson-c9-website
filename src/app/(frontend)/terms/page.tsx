"use cache";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import TermsClient from "./terms-client";

export default async function TermsPage() {
  const payload = await getPayload({ config: configPromise });

  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
  });

  const termsData = {
    siteName: siteSettings.siteName || "CrimsonC9",
    contactEmail: siteSettings.contactEmail || "hello@crimsonc9.com",
  };

  return <TermsClient data={termsData} />;
}
