import { getPayload } from "payload";
import configPromise from "@payload-config";
import ContactClient from "./contact-client";

export default async function ContactPage() {
  const payload = await getPayload({ config: configPromise });

  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
  });

  const socialLinks = await payload.findGlobal({
    slug: "social-links",
  });

  const contactData = {
    contactEmail: siteSettings.contactEmail || "hello@crimsonc9.com",
    siteName: siteSettings.siteName || "CrimsonC9",
    tagline: siteSettings.tagline || "Change Through Music",
    instagram: socialLinks.instagram,
    whatsappCommunity: socialLinks.whatsappCommunity,
  };

  return <ContactClient data={contactData} />;
}
