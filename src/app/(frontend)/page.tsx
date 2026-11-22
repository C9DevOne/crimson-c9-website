import type { Metadata } from "next";
import Image from "next/image";
import {
  RiArrowRightUpLine,
  RiInstagramLine,
  RiSoundcloudLine,
  RiYoutubeLine,
} from "react-icons/ri";

import { CollaborationForm } from "@/components/forms/CollaborationForm";
import { resolveSocials } from "@/lib/socials";

/**
 * The landing page — a single self-contained introduction to the collective, standing in
 * for the full site while the prototype is built behind it (WORKING_LOG.md).
 *
 * Redesigned under CRI-22 against two references Aaron picked (primal-instinct.net,
 * raw-people.com). The system those two share, and this now follows:
 *
 *  - everything is one typeface at two opposite registers — a very large headline with
 *    negative tracking, and 11px uppercase labels at wide tracking. Nothing in between
 *    except body copy
 *  - sections are separated by hairlines and space, never by panels or cards
 *  - content is left-aligned against a consistent edge rather than centred, so the page
 *    has a spine
 *  - one accent colour, used about four times in total
 *
 * The old version's glass panels, sparkle entrances and rolling city list are all gone;
 * the city names now sit in the header, which is where a location belongs.
 */

/**
 * Contact address. Was a `site-settings` CMS read with this as its fallback; it is now the
 * single source while the CMS is decoupled, so changing it is a deploy.
 */
const CONTACT_EMAIL = "hello@crimsonc9.com";

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

type SocialLink = { name: string; url: string; handle: string; Icon: typeof RiInstagramLine };

/**
 * The handle, taken from the URL rather than written out beside it. Two reasons: it cannot
 * drift out of step with the link the way a hardcoded string would, and it means the page
 * states nothing about the accounts that is not already true of the URL it links to.
 */
function handleFromUrl(url: string): string {
  const slug = url.replace(/\/+$/, "").split("/").pop() ?? "";
  return slug.startsWith("@") ? slug : `@${slug}`;
}

/**
 * Section heading: a numbered micro-label above a rule. The number is the only ornament on
 * the page and it earns its place by saying where you are in a document with no navigation.
 */
function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-baseline gap-5 md:mb-14">
      <span className="type-label text-foreground/35">{index}</span>
      <span className="type-label">{children}</span>
      <span className="rule rule-draw flex-1" />
    </div>
  );
}

export default function Page() {
  // Both of these were CMS reads that already fell back to exactly these values, so the
  // rendered page is unchanged by the decoupling — what changes is that editing them is a
  // deploy rather than an admin login. See src/lib/socials.ts.
  const contactEmail = CONTACT_EMAIL;
  const socials = resolveSocials();

  const socialLinks: SocialLink[] = [
    {
      name: "Instagram",
      url: socials.instagram,
      handle: handleFromUrl(socials.instagram),
      Icon: RiInstagramLine,
    },
    {
      name: "SoundCloud",
      url: socials.soundcloud,
      handle: handleFromUrl(socials.soundcloud),
      Icon: RiSoundcloudLine,
    },
    {
      name: "YouTube",
      url: socials.youtube,
      handle: handleFromUrl(socials.youtube),
      Icon: RiYoutubeLine,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
      {/* ── Hero ─────────────────────────────────────────────────────────────────
          Full height, but the content sits low rather than dead-centre: the empty
          upper half is what gives the starfield room to be the thing you notice first. */}
      <header className="flex min-h-svh flex-col justify-end pb-20 md:pb-28">
        <p
          className="type-label reveal mb-7"
          style={{ "--reveal-delay": "0.15s" } as React.CSSProperties}
        >
          Techno collective
        </p>

        {/* Two lines, hard-broken. At this size the break is a composition decision, not
            something to leave to the container width. */}
        <h1
          className="type-display reveal max-w-5xl text-balance"
          style={{ "--reveal-delay": "0.3s" } as React.CSSProperties}
        >
          Change
          <br />
          Through Music
        </h1>

        <p
          className="type-body reveal mt-9 max-w-xl"
          style={{ "--reveal-delay": "0.5s" } as React.CSSProperties}
        >
          A young techno collective across Aachen, Berlin and Cologne — a platform for emerging
          artists, events for a growing community, and an upcoming label.
        </p>

        <div
          className="reveal mt-16 flex items-center gap-4"
          style={{ "--reveal-delay": "0.7s" } as React.CSSProperties}
        >
          <span className="type-label">Scroll</span>
          <span className="rule w-24" />
        </div>
      </header>

      {/* ── The collective ───────────────────────────────────────────────────────── */}
      <section className="pb-28 md:pb-40" aria-labelledby="collective">
        <SectionLabel index="01">The collective</SectionLabel>

        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <h2 id="collective" className="type-display-sm col-span-full text-balance md:col-span-7">
            A platform for emerging artists, and the events that put them in front of people.
          </h2>

          <div className="type-body col-span-full space-y-5 md:col-span-5">
            <p>
              We are CrimsonC9, a young techno collective from Aachen, Berlin and Cologne — serving
              as a platform for emerging artists by hosting events for a growing community, and
              releasing music as an upcoming label on SoundCloud.
            </p>
            <p>
              You can see what we do on the channels below, or reach out directly if you want to
              work with us.
            </p>
          </div>
        </div>

        {/* Full-bleed within the container, no frame, no rounding. The image is the only
            photograph on the page and it is allowed to simply be one. */}
        <figure className="mt-16 md:mt-24">
          <Image
            src="/event-garden.webp"
            alt="A CrimsonC9 crowd dancing in a garden under a disco ball, hands in the air around the decks."
            width={1920}
            height={1080}
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="h-auto w-full"
          />
          <figcaption className="type-label mt-5">A CrimsonC9 event</figcaption>
        </figure>
      </section>

      {/* ── Channels ─────────────────────────────────────────────────────────────
          Rows separated by hairlines rather than three icon tiles. Each row carries the
          platform, what is actually on it, and an arrow that moves on hover. */}
      <section className="pb-28 md:pb-40" aria-labelledby="channels">
        <SectionLabel index="02">Where to find us</SectionLabel>
        <h2 id="channels" className="sr-only">
          Our channels
        </h2>

        <ul>
          {socialLinks.map(({ name, url, handle, Icon }) => (
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="row-link text-muted-foreground group flex items-center gap-6 py-7 md:py-9"
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                <span className="type-display-sm text-foreground flex-1">{name}</span>
                <span className="type-label hidden sm:block">{handle}</span>
                <RiArrowRightUpLine className="row-arrow size-5 shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────────────── */}
      <section className="pb-28 md:pb-40" aria-labelledby="contact">
        <SectionLabel index="03">Get in touch</SectionLabel>

        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="col-span-full md:col-span-5">
            <h2 id="contact" className="type-display-sm text-balance">
              Collaborate with us, or ask us anything.
            </h2>
            <p className="type-body mt-7">
              Booking, collaboration, volunteering, or something else entirely — this reaches us
              directly.
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="link-underline type-label text-foreground mt-8 inline-block"
            >
              {contactEmail}
            </a>
          </div>

          <div className="col-span-full md:col-span-7">
            <CollaborationForm contactEmail={contactEmail} />
          </div>
        </div>
      </section>
    </div>
  );
}
