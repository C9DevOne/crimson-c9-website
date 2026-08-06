import { getPayload } from "payload";
import configPromise from "@payload-config";
import FeaturedClient from "./featured-client";
import { Artist, Event, Release, Media } from "@/payload-types";

export const dynamic = "force-dynamic";

export default async function DevFeaturedPage() {
  const payload = await getPayload({ config: configPromise });

  const featuredGlobal = await payload.findGlobal({
    slug: "homepage-featured",
    depth: 3,
  });

  let featuredArtist = null;
  if (featuredGlobal.featuredArtist && typeof featuredGlobal.featuredArtist === "object") {
    const artist = featuredGlobal.featuredArtist as Artist;
    let imageUrl = "https://picsum.photos/800/800?grayscale";
    if (artist.profileImage && typeof artist.profileImage === "object") {
      const media = artist.profileImage as Media;
      if (media.url) imageUrl = media.url;
    }
    featuredArtist = {
      name: artist.name,
      role: artist.role || "Resident Artist",
      bio: artist.shortBio || null,
      imageUrl,
    };
  }

  let featuredEvent = null;
  if (featuredGlobal.featuredEvent && typeof featuredGlobal.featuredEvent === "object") {
    const event = featuredGlobal.featuredEvent as Event;
    let imageUrl = "/key_portal_background_169.png";
    if (event.coverImage && typeof event.coverImage === "object") {
      const media = event.coverImage as Media;
      if (media.url) imageUrl = media.url;
    }
    featuredEvent = {
      title: event.title,
      date: event.date,
      venue: event.venue || "TBA",
      city: event.city || "Aachen / Cologne / Berlin",
      status: event.status,
      imageUrl,
    };
  }

  let featuredRelease = null;
  if (featuredGlobal.featuredRelease && typeof featuredGlobal.featuredRelease === "object") {
    const release = featuredGlobal.featuredRelease as Release;
    let coverArtUrl = "https://picsum.photos/800/800?grayscale";
    if (release.coverArt && typeof release.coverArt === "object") {
      const media = release.coverArt as Media;
      if (media.url) coverArtUrl = media.url;
    }
    featuredRelease = {
      title: release.title,
      type: release.type,
      coverArtUrl,
      soundcloudUrl: release.soundcloudUrl || null,
      spotifyUrl: release.spotifyUrl || null,
    };
  }

  const data = {
    heroHeadline: featuredGlobal.heroHeadline,
    heroSubtext: featuredGlobal.heroSubtext,
    featuredArtist,
    featuredEvent,
    featuredRelease,
  };

  return <FeaturedClient data={data} />;
}
