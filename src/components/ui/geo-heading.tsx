/**
 * A two-line heading arranged around a central ornament:
 *
 *     Welcome   ╱▔▔╲   to our
 *               ╱ ▔▔ ╲
 *     Digital  ╱ ▔▔▔ ╲  Home
 *
 * The words sit in an outer column each and the ornament occupies the middle, spanning both
 * rows. Built as a component so any heading can take the treatment rather than it being
 * hand-placed once.
 *
 * **Reading order is why the DOM order looks odd.** The spans are written in the order they
 * should be *read* — "Welcome", "to our", "Digital", "Home" — and CSS grid places them
 * visually. Writing them in visual order (left column, then right) would make a screen
 * reader announce "Welcome Digital to our Home", which is nonsense. Grid placement is free
 * to reorder; the DOM is not.
 *
 * On narrow screens the three columns collapse to two and the ornament drops below the
 * words, where it has room to be seen.
 */

import type { ReactNode } from "react";

import { cn } from "./utils";

export function GeoHeading({
  id,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  ornament,
  className,
}: {
  id?: string;
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  ornament: ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "font-display grid items-center gap-x-4 gap-y-2",
        // The centre column is `auto` so it takes the ornament's natural width — a fixed or
        // fractional track squeezes the SVG, which scales to fit and renders as a sliver.
        // The outer `1fr` columns then share what's left, pushing the words in against it.
        "grid-cols-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-x-8",
        className,
      )}
    >
      <span className="col-start-1 row-start-1 text-right sm:text-right">{topLeft}</span>
      <span className="col-start-2 row-start-1 text-left sm:col-start-3">{topRight}</span>
      <span className="col-start-1 row-start-2 text-right sm:text-right">{bottomLeft}</span>
      <span className="col-start-2 row-start-2 text-left sm:col-start-3">{bottomRight}</span>

      <span
        aria-hidden="true"
        className={cn(
          "col-span-2 col-start-1 row-start-3 flex justify-center pt-4",
          "sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:pt-0",
        )}
      >
        {ornament}
      </span>
    </h2>
  );
}
