"use cache";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import MusicClient from "./music-client";
import { Release, Media, Artist } from "@/payload-types";

export default async function MusicPage() {
  const payload = await getPayload({ config: configPromise });

  const releasesRes = await payload.find({
    collection: "releases",
    depth: 2,
    sort: "-releaseDate",
  });

  const formattedReleases = releasesRes.docs.map((release: Release) => {
    let coverArtUrl = "https://picsum.photos/800/800?grayscale";
    if (release.coverArt && typeof release.coverArt === "object") {
      const media = release.coverArt as Media;
      if (media.url) {
        coverArtUrl = media.url;
      }
    }

    const artists: string[] = [];
    if (release.artist && Array.isArray(release.artist)) {
      release.artist.forEach((art) => {
        if (typeof art === "object" && (art as Artist).name) {
          artists.push((art as Artist).name);
        }
      });
    }

    return {
      id: release.id,
      title: release.title,
      slug: release.slug,
      type: release.type,
      releaseDate: release.releaseDate || null,
      coverArtUrl,
      soundcloudUrl: release.soundcloudUrl || null,
      spotifyUrl: release.spotifyUrl || null,
      youtubeUrl: release.youtubeUrl || null,
      artists,
      isFeatured: release.isFeatured || false,
    };
  });

  return <MusicClient releases={formattedReleases} />;
}
