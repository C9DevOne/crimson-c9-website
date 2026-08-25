import Image from "next/image";
import { RiInstagramLine, RiSoundcloudLine, RiYoutubeLine } from "react-icons/ri";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { Artist, Event, Release, Media } from "@/payload-types";
import FeaturedClient from "./dev/featured/featured-client";

export const metadata = {
  title: "CrimsonC9",
  description: "Change Through Music. Something is growing here — the site is under construction.",
};

type SocialLinksData = {
  instagram?: string | null;
  soundcloud?: string | null;
  youtube?: string | null;
};

export default async function Page() {
  const isDev = process.env.NODE_ENV === "development";
  let featuredData = null;
  let social: SocialLinksData | null = null;

  try {
    const payload = await getPayload({ config: configPromise });
    social = await payload.findGlobal({ slug: "social-links" });
  } catch {
    // Graceful fallback — a CMS hiccup should never take the placeholder down with it.
    // The page still renders, just without the social row.
  }

  if (isDev) {
    try {
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

      featuredData = {
        heroHeadline: featuredGlobal.heroHeadline,
        heroSubtext: featuredGlobal.heroSubtext,
        featuredArtist,
        featuredEvent,
        featuredRelease,
      };
    } catch {
      // Graceful fallback if Payload/DB is not accessible during render
    }
  }

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 py-12 text-center">
        <Image
          src="/DigitalTreeVisual.png"
          alt=""
          width={1024}
          height={1024}
          className="hero-visual h-auto w-64 md:w-80"
          priority
          aria-hidden="true"
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl tracking-wide md:text-5xl">CRIMSONC9</h1>
          <p className="glow-text font-body text-muted-foreground text-lg md:text-xl">
            Something is growing here.
          </p>
        </div>

        {social && (social.instagram || social.soundcloud || social.youtube) && (
          <div className="flex items-center gap-8">
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <RiInstagramLine className="glow-icon size-8" />
              </a>
            )}
            {social.soundcloud && (
              <a
                href={social.soundcloud}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SoundCloud"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <RiSoundcloudLine className="glow-icon size-8" />
              </a>
            )}
            {social.youtube && (
              <a
                href={social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <RiYoutubeLine className="glow-icon size-8" />
              </a>
            )}
          </div>
        )}

        <a
          href="mailto:hello@crimsonc9.com"
          className="font-ui text-muted-foreground hover:text-foreground text-sm transition-colors duration-300"
        >
          hello@crimsonc9.com
        </a>

        <p className="font-ui text-muted-foreground/60 text-xs">
          &copy; {new Date().getFullYear()} CrimsonC9
        </p>
      </div>

      {/* Dev environment only: Homepage Featured Section preview */}
      {isDev && featuredData && (
        <div className="bg-background relative z-10 border-t border-zinc-800">
          <FeaturedClient data={featuredData} />
        </div>
      )}
    </>
  );
}
