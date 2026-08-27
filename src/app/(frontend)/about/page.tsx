import { getPayload } from "payload";
import configPromise from "@payload-config";
import AboutClient from "./about-client";
import { Artist } from "@/payload-types";

export default async function AboutPage() {
  const payload = await getPayload({ config: configPromise });

  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
  });

  const artistsRes = await payload.find({
    collection: "artists",
    limit: 50,
  });

  const artistNames = artistsRes.docs.map((artist: Artist) => artist.name);

  const aboutData = {
    siteName: siteSettings.siteName || "CrimsonC9",
    tagline: siteSettings.tagline || "Change Through Music",
    metaDescription:
      siteSettings.metaDescription ||
      "Crimson C9 is a Techno music collective grounded in the philosophy of Change Through Music. Based in Aachen, Cologne, and Berlin, we showcase artists, events, and discoveries.",
    contactEmail: siteSettings.contactEmail || "hello@crimsonc9.com",
    artistCount: artistsRes.totalDocs,
    artistNames,
  };

  return <AboutClient data={aboutData} />;
}
