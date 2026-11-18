import type { Metadata } from "next";
import Image from "next/image";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { RiInstagramLine, RiSoundcloudLine, RiYoutubeLine } from "react-icons/ri";

import { PagodaScene } from "@/components/animations/PagodaScene";
import { CollaborationForm } from "@/components/forms/CollaborationForm";
import { GeoHeading } from "@/components/ui/geo-heading";
import { resolveSocials } from "@/lib/socials";

/**
 * The landing page — a single self-contained introduction to the collective, standing in
 * for the full site while the prototype is built behind it (WORKING_LOG.md).
 *
 * Deliberately not the homepage described in CONCEPT_page-homepage.md: that page's compass
 * navigation and dragon hero only make sense once the interior routes it points at exist.
 * It does borrow the rotating city line (§4) and the requirement for real page metadata
 * (§5), and the lantern from CONCEPT_page-universal-menu.md now carries navigation.
 */

const FALLBACK_EMAIL = "hello@crimsonc9.com";

/**
 * Hero logo — the crimson dragon supplied 2026-10-02, replacing the black silhouette that
 * was invisible on a dark background.
 *
 * The artwork's own red sits around #630200, which is still close enough to the page
 * background to read as a dark shape, so it gets a brightness/saturation lift and a glow
 * rather than being dropped in raw. That treatment is interim — see the note to Aaron about
 * filling the silhouette with the crimson→ember gradient instead.
 */
const LOGO_SRC = "/crimson-logo.webp";

export const metadata: Metadata = {
  title: "CrimsonC9 — Change Through Music",
  description:
    "CrimsonC9 is a young techno collective across Aachen, Berlin and Cologne — a platform for emerging artists, events for a growing community, and an upcoming label.",
  openGraph: {
    title: "CrimsonC9 — Change Through Music",
    description:
      "A young techno collective across Aachen, Berlin and Cologne. Events, music, and an open door for collaborators.",
    type: "website",
    siteName: "CrimsonC9",
  },
};

/**
 * Cities for the rolling line. The fourth entry repeats the first on purpose — the roll
 * animation ends on it, and because it's identical to the opening frame the loop restarts
 * invisibly. See `.city-roll` in globals.css.
 */
const CITIES = ["Aachen", "Berlin", "Cologne", "Aachen"];

type SocialLink = { name: string; url: string; Icon: typeof RiInstagramLine };

export default async function Page() {
  let contactEmail = FALLBACK_EMAIL;
  let socials = resolveSocials();

  // A CMS hiccup must never take this page down — it's the only public page the site has
  // right now. Both reads fall back to constants rather than to nothing: the channels are
  // core content here, so hiding the section on a failed query would be worse than showing
  // a URL that's one deploy out of date.
  try {
    const payload = await getPayload({ config: configPromise });
    const [social, settings] = await Promise.all([
      payload.findGlobal({ slug: "social-links" }),
      payload.findGlobal({ slug: "site-settings" }),
    ]);

    contactEmail = settings?.contactEmail || FALLBACK_EMAIL;
    socials = resolveSocials(social);
  } catch {
    // Intentionally silent for the visitor; the page still renders in full.
  }

  const socialLinks: SocialLink[] = [
    { name: "Instagram", url: socials.instagram, Icon: RiInstagramLine },
    { name: "YouTube", url: socials.youtube, Icon: RiYoutubeLine },
    { name: "SoundCloud", url: socials.soundcloud, Icon: RiSoundcloudLine },
  ];

  return (
    <div className="relative z-10 flex flex-col items-center px-6">
      {/* ── Hero ───────────────────────────────────────────────────────────────── */}
      <header className="flex min-h-[92svh] flex-col items-center justify-center gap-7 text-center">
        <Image
          src={LOGO_SRC}
          alt="CrimsonC9"
          width={326}
          height={400}
          priority
          className="h-40 w-auto brightness-[1.9] drop-shadow-[0_0_45px_color-mix(in_srgb,var(--glow-crimson)_55%,transparent)] saturate-[1.15] md:h-56"
        />
        {/* brightness lifts the artwork's own #630200 off the near-black background; without
            it the dragon reads as a dark hole rather than a mark. The eye stays dark because
            it's already near-black, so the detail survives the lift. */}

        <div className="flex flex-col gap-3">
          {/* Tracking is reduced on narrow screens as well as the size: at 0.16em the
              wordmark runs edge-to-edge on a 375px phone and the outer letters clip. */}
          <h1 className="font-display text-3xl tracking-[0.08em] sm:text-5xl sm:tracking-[0.16em] md:text-7xl">
            CrimsonC9
          </h1>
          <p className="glow-text font-body text-muted-foreground text-lg tracking-wide sm:text-xl md:text-2xl">
            Change Through Music
          </p>
        </div>
      </header>

      {/* ── Welcome / the digital home ────────────────────────────────────────────
          Off-centre on purpose: the scene sits right and slightly high, the text block runs
          wider on the left and pulls past the container edge. The centred stack this
          replaced was the main reason the page read as a column of boxes. */}
      <section className="w-full max-w-6xl pt-6 pb-28" aria-labelledby="welcome">
        <div className="flex flex-col items-center gap-12">
          <GeoHeading
            id="welcome"
            topLeft="Welcome"
            topRight="to our"
            bottomLeft="Digital"
            bottomRight="Home"
            ornament={<PagodaScene className="h-44 w-auto sm:h-56 lg:h-72" />}
            className="text-3xl leading-tight sm:text-4xl lg:text-6xl"
          />

          {/* Offset from centre rather than sitting under the heading's axis — the symmetry
              of the heading is deliberate, the paragraph breaking out of it is what keeps
              the section from reading as a centred stack. */}
          <p className="font-body text-foreground/85 max-w-2xl text-lg leading-relaxed md:text-xl lg:ml-24 lg:self-start">
            We are CrimsonC9, a young techno collective from{" "}
            <span className="city-roll text-glow-crimson font-semibold">
              <span className="city-roll__track">
                {CITIES.map((city, i) => (
                  <span key={`${city}-${i}`}>{city}</span>
                ))}
              </span>
            </span>{" "}
            — serving as a platform for emerging artists by hosting events for a growing community,
            and releasing music as an upcoming label on SoundCloud.
          </p>
        </div>
      </section>

      {/* ── What that looks like ────────────────────────────────────────────────── */}
      <section className="w-full max-w-5xl pb-28" aria-label="A CrimsonC9 event">
        <figure className="glass-panel glass-interactive overflow-hidden rounded-[2rem] p-2">
          <Image
            src="/event-garden.webp"
            alt="A CrimsonC9 crowd dancing in a garden under a disco ball, hands in the air around the decks."
            width={1920}
            height={1080}
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="h-auto w-full rounded-[1.6rem] object-cover"
          />
        </figure>
      </section>

      {/* ── Channels ────────────────────────────────────────────────────────────── */}
      <section
        className="flex flex-col items-center gap-8 pb-28 text-center"
        aria-labelledby="channels"
      >
        <h2 id="channels" className="font-body text-foreground/85 max-w-xl text-lg md:text-xl">
          You can check out what we do on these channels
        </h2>

        <ul className="flex flex-wrap items-center justify-center gap-5">
          {socialLinks.map(({ name, url, Icon }) => (
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="glass-panel glass-interactive text-muted-foreground hover:text-glow-crimson flex size-16 items-center justify-center rounded-2xl transition-colors duration-300 md:size-20"
              >
                <Icon className="size-7 md:size-8" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Reach out ───────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-2xl pb-28" aria-labelledby="reach-out">
        <h2
          id="reach-out"
          className="font-body text-foreground/85 mb-8 text-center text-lg md:text-xl"
        >
          Or reach out if you want to collaborate with us, or have any other enquiry
        </h2>

        <div className="glass-panel rounded-[2rem] p-7 md:p-10">
          <CollaborationForm contactEmail={contactEmail} />
        </div>

        <p className="mt-8 text-center">
          <a
            href={`mailto:${contactEmail}`}
            className="font-ui text-muted-foreground hover:text-foreground text-sm tracking-wide transition-colors duration-300"
          >
            {contactEmail}
          </a>
        </p>
      </section>
    </div>
  );
}
