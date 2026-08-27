"use cache";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import SupportClient from "./support-client";

export default async function SupportPage() {
  const payload = await getPayload({ config: configPromise });

  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
  });

  const socialLinks = await payload.findGlobal({
    slug: "social-links",
  });

  const supportData = {
    contactEmail: siteSettings.contactEmail || "hello@crimsonc9.com",
    whatsappCommunity: socialLinks.whatsappCommunity,
    siteName: siteSettings.siteName || "CrimsonC9",
  };

  return <SupportClient data={supportData} />;
}
