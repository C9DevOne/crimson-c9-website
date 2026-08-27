"use cache";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import ArtistsClient from "./artists-client";
import { Artist, Media } from "@/payload-types";

export default async function ArtistsPage() {
  const payload = await getPayload({ config: configPromise });

  const artistsRes = await payload.find({
    collection: "artists",
    depth: 1, // Ensure relations like media are populated
  });

  const formattedArtists = artistsRes.docs.map((artist: Artist) => {
    // Safely extract the image URL if profileImage is populated
    let imageUrl = "https://picsum.photos/800/800?grayscale"; // fallback
    if (artist.profileImage && typeof artist.profileImage === "object") {
      const media = artist.profileImage as Media;
      if (media.url) {
        imageUrl = media.url;
      }
    }

    // Extract social links if any
    let instagram;
    let soundcloud;
    if (artist.socials && artist.socials.length > 0) {
      artist.socials.forEach((social) => {
        if (social.platform === "instagram") instagram = social.url;
        if (social.platform === "soundcloud") soundcloud = social.url;
      });
    }

    return {
      image: imageUrl,
      text: artist.name.toUpperCase(),
      subtitle: artist.role || "Artist",
      description: artist.shortBio || "",
      instagram,
      soundcloud,
    };
  });

  return <ArtistsClient artists={formattedArtists} />;
}
