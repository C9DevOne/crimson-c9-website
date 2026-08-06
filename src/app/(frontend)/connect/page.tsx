import { getPayload } from "payload";
import configPromise from "@payload-config";
import ConnectClient from "./connect-client";

export const dynamic = "force-dynamic";

export default async function ConnectPage() {
  const payload = await getPayload({ config: configPromise });

  const socialLinks = await payload.findGlobal({
    slug: "social-links",
  });

  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
  });

  const connectData = {
    instagram: socialLinks.instagram,
    soundcloud: socialLinks.soundcloud,
    youtube: socialLinks.youtube,
    spotify: socialLinks.spotify,
    whatsappCommunity: socialLinks.whatsappCommunity,
    residentAdvisor: socialLinks.residentAdvisor,
    contactEmail: siteSettings.contactEmail || "hello@crimsonc9.com",
  };

  return <ConnectClient data={connectData} />;
}
