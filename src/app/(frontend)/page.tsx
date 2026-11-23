import type { Metadata } from "next";
import Image from "next/image";
import {
  RiArrowRightUpLine,
  RiInstagramLine,
  RiSoundcloudLine,
  RiYoutubeLine,
} from "react-icons/ri";

import { CollaborationForm } from "@/components/forms/CollaborationForm";
import { ElectricHeadline } from "@/components/hero/ElectricHeadline";
import { resolveSocials } from "@/lib/socials";

/**
 * The landing page — a single self-contained introduction to the collective, standing in
 * for the full site while the prototype is built behind it (WORKING_LOG.md).
 *
 * Design direction is CRI-22. The structure still follows the two reference sites — one
 * ground, hairlines instead of panels, micro-labels carrying the structure — with three
 * decisions Aaron made on top:
 *
 *  - the headline is the centrepiece, set in Cinzel Decorative over the event photograph,
 *    with the chromatic-displacement treatment and pointer parallax
 *  - the contact form and the channels keep the glass treatment, which is why glass is
 *    back in globals.css for those two places and nowhere else
 *  - the statement headings that used to open sections 01 and 03 are gone
 *
 * Desktop and mobile are deliberately not the same composition. Desktop fills the width
 * and keeps type proportionally small; mobile drops to one column and sizes up, because
 * the desktop proportions are unreadable at 375px rather than merely tighter.
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
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────────────
          Breaks out of the page container to run full-bleed. The photograph is the only
          thing on the site that fills a viewport, which is what makes the headline over it
          read as the centrepiece rather than as one more block. */}
      <header className="relative flex min-h-svh flex-col justify-end overflow-hidden">
        <div className="hero-photo absolute inset-0 -z-10">
          <Image
            src="/event-garden.webp"
            alt=""
            fill
            // The hero image is the largest thing on the page and the first thing painted,
            // so it is the one image worth the priority hint.
            priority
            sizes="100vw"
            className="h-full w-full"
          />
          <div className="hero-scrim absolute inset-0" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-5 pb-20 md:px-10 md:pb-28">
          <h1
            className="type-hero reveal"
            style={{ "--reveal-delay": "0.35s" } as React.CSSProperties}
          >
            <ElectricHeadline>Change Through Music</ElectricHeadline>
          </h1>

          <p
            className="type-body reveal mt-7 max-w-xl md:mt-9"
            style={{ "--reveal-delay": "0.55s" } as React.CSSProperties}
          >
            We are CrimsonC9, a young techno collective from Aachen, Berlin and Cologne — serving as
            a platform for emerging artists by hosting events for a growing community, and releasing
            music as an upcoming label on SoundCloud.
          </p>

          <div
            className="reveal mt-10 flex items-center gap-4 md:mt-16"
            style={{ "--reveal-delay": "0.75s" } as React.CSSProperties}
          >
            <span className="type-label">Scroll</span>
            <span className="rule w-16 md:w-24" />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        {/* ── Upcoming events ─────────────────────────────────────────────────────
            Added CRI-22. Deliberately the bare minimum of words: Aaron asked that only his
            own copy appear on the page, and there is none for this section yet, so this
            says what it is and links out and nothing more. Once there is real event copy —
            or, better, once the shop exposes the next date — this becomes a listing rather
            than a door.

            It links out to the shop rather than embedding it. ADR-0009 said the widget
            would be embedded into /events to keep the visual identity through the purchase
            flow; that ADR predates the shop being its own Next app on its own subdomain
            and needs superseding either way. */}
        <section className="pb-24 md:pb-40" aria-labelledby="events">
          <h2 id="events" className="type-body mb-10 md:mb-14">
            Upcoming events
          </h2>

          <a
            href="https://tickets.crimsonc9.com"
            className="glass-panel sheen text-muted-foreground hover:text-foreground flex flex-col gap-6 rounded-3xl p-6 transition-colors duration-500 sm:flex-row sm:items-center sm:justify-between md:p-10"
          >
            <span>
              <span className="text-foreground block text-xl md:text-2xl">Tickets</span>
              <span className="type-label mt-1 block">tickets.crimsonc9.com</span>
            </span>
            <RiArrowRightUpLine className="size-6 shrink-0" aria-hidden="true" />
          </a>
        </section>

        {/* ── Channels ───────────────────────────────────────────────────────────── */}
        <section className="pb-24 md:pb-40" aria-labelledby="channels">
          <h2 id="channels" className="type-body mb-10 md:mb-14">
            You can check out what we do on these channels
          </h2>

          {/* Tiles rather than text rows (Aaron, CRI-22: the visual icons back). Three
              across on desktop, stacked on mobile where three 20rem tiles in a row would
              each be too small to read. */}
          <ul className="grid gap-4 sm:grid-cols-3 md:gap-6">
            {socialLinks.map(({ name, url, handle, Icon }) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel sheen text-muted-foreground hover:text-foreground flex flex-col items-start gap-5 rounded-3xl p-6 transition-colors duration-500 md:gap-7 md:p-8"
                >
                  <Icon className="text-glow-crimson size-7 md:size-8" aria-hidden="true" />
                  <span>
                    <span className="text-foreground block text-lg md:text-xl">{name}</span>
                    <span className="type-label mt-1 block">{handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Contact ────────────────────────────────────────────────────────────── */}
        <section className="pb-24 md:pb-40" aria-labelledby="contact">
          <h2 id="contact" className="type-body mb-10 md:mb-14">
            Or reach out if you want to collaborate with us, or have any other enquiry
          </h2>

          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <a
                href={`mailto:${contactEmail}`}
                className="link-underline type-label text-foreground inline-block"
              >
                {contactEmail}
              </a>
            </div>

            {/* The form in its panel, as it was before the redesign. */}
            <div className="md:col-span-8">
              <div className="glass-panel rounded-[2rem] p-6 md:p-10">
                <CollaborationForm contactEmail={contactEmail} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
