"use cache";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import ImprintClient from "./imprint-client";

export default async function ImprintPage() {
  const payload = await getPayload({ config: configPromise });

  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
  });

  const imprintData = {
    siteName: siteSettings.siteName || "CrimsonC9",
    tagline: siteSettings.tagline || "Change Through Music",
    contactEmail: siteSettings.contactEmail || "hello@crimsonc9.com",
  };

  return <ImprintClient data={imprintData} />;
}
