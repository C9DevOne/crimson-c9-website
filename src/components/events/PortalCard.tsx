import { RiArrowRightUpLine } from "react-icons/ri";

/**
 * The door to the ticket shop, built as a miniature of the shop's own front page.
 *
 * Aaron, CRI-23: "a holographic portal card (in the bunker dreams 2 theme style) that
 * links to the ticket page… kind of a miniature view of the background of the tickets
 * page. And Bunker Dreams 2 and 15.1 on it."
 *
 * The theme is quoted from `c9-tickets/docs/design.md`, not invented: a black ground with
 * a great deal of empty space, 夢 ("dream") large and very faint as a watermark, the glow
 * sphere, and an icy wash rising from the bottom edge in `--dream` (#82c3ff), a blue the
 * shop uses *only* inside a glow.
 *
 * That blue is the point. The shop's stylesheet notes that this website has a crimson glow
 * where it has an icy one — so this card is the single place on crimsonc9.com where the
 * cold blue appears, and that is what makes it read as a window into somewhere else rather
 * than as another panel.
 *
 * Static by design. The shop animates its orb on a canvas with three tumbling rings; a
 * teaser card on another site does not need a paint loop, so the orb here is CSS and the
 * rings are reduced to one.
 *
 * Everything event-specific is a prop. The shop's own rule is that no event name is ever
 * hardcoded, and the same should hold here the moment there is a second event.
 */
export function PortalCard({
  name,
  date,
  venue,
  href,
}: {
  name: string;
  /** Short form for the card face — the shop carries the full date. */
  date: string;
  venue: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="portal group block rounded-[1.75rem] px-7 py-12 md:px-12 md:py-20"
      aria-label={`${name}, ${date}, ${venue} — tickets`}
    >
      {/* Decoration only, and never the sole label for anything clickable — the shop's
          rule, kept. The accessible name is on the anchor above. */}
      <span className="portal-kanji" aria-hidden="true">
        夢
      </span>
      <span className="portal-wash" aria-hidden="true" />
      <span className="portal-holo" aria-hidden="true" />

      <span className="relative z-10 flex flex-col items-center gap-7 text-center md:gap-9">
        <span className="portal-orb block size-14 md:size-16" aria-hidden="true" />

        <span className="flex flex-col items-center gap-3">
          <span className="type-label">CrimsonC9 präsentiert</span>
          <span className="type-display-sm block">{name}</span>
        </span>

        <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {/* The date is the loudest thing after the name: it is the single fact somebody
              scanning this card is looking for. */}
          <span className="font-display text-foreground text-3xl leading-none md:text-4xl">
            {date}
          </span>
          <span className="type-label">{venue}</span>
        </span>

        <span className="type-label text-foreground inline-flex items-center gap-2">
          Tickets
          <RiArrowRightUpLine className="row-arrow size-4" aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}
