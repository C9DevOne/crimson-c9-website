import type { Metadata } from "next";
import Image from "next/image";
import { RiInstagramLine, RiSoundcloudLine, RiYoutubeLine } from "react-icons/ri";

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

/**
 * Section heading: a micro-label with a rule running off to the right.
 *
 * The 01/02/03 numbering was dropped at Aaron's request (CRI-22). It was defensible while
 * the page had no navigation, but it implied a sequence the content does not actually
 * have — these are three unrelated sections, not three steps.
 */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-baseline gap-5 md:mb-14">
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
          <p
            className="type-label reveal mb-5 md:mb-7"
            style={{ "--reveal-delay": "0.2s" } as React.CSSProperties}
          >
            Techno collective
          </p>

          <h1
            className="type-hero reveal"
            style={{ "--reveal-delay": "0.35s" } as React.CSSProperties}
          >
            {/* Two lines, hard-broken: at this size the break is a composition decision,
                not something to leave to the container width. Each line is its own
                headline so the ghosts register per line rather than smearing across the
                gap between them. */}
            <span className="block">
              <ElectricHeadline>Change</ElectricHeadline>
            </span>
            <span className="block">
              <ElectricHeadline>Through Music</ElectricHeadline>
            </span>
          </h1>

          <p
            className="type-body reveal mt-7 max-w-xl md:mt-9"
            style={{ "--reveal-delay": "0.55s" } as React.CSSProperties}
          >
            A young techno collective across Aachen, Berlin and Cologne — a platform for emerging
            artists, events for a growing community, and an upcoming label.
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
        {/* ── The collective ─────────────────────────────────────────────────────── */}
        <section className="pt-24 pb-24 md:pt-32 md:pb-40" aria-labelledby="collective">
          <SectionLabel>The collective</SectionLabel>
          <h2 id="collective" className="sr-only">
            The collective
          </h2>

          {/* Two columns of running text on desktop, one on mobile. The copy is short
              enough that a single wide measure would run past a comfortable line length at
              this container width. */}
          <div className="type-body grid gap-7 md:grid-cols-2 md:gap-16 lg:gap-24">
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
        </section>

        {/* ── Channels ───────────────────────────────────────────────────────────── */}
        <section className="pb-24 md:pb-40" aria-labelledby="channels">
          <SectionLabel>Where to find us</SectionLabel>
          <h2 id="channels" className="sr-only">
            Our channels
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
                  className="glass-panel glass-interactive text-muted-foreground hover:text-foreground flex flex-col items-start gap-5 rounded-3xl p-6 transition-colors duration-500 md:gap-7 md:p-8"
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
          <SectionLabel>Get in touch</SectionLabel>
          <h2 id="contact" className="sr-only">
            Get in touch
          </h2>

          <div className="grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <p className="type-body">
                Booking, collaboration, volunteering, or something else entirely — this reaches us
                directly.
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="link-underline type-label text-foreground mt-6 inline-block"
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
