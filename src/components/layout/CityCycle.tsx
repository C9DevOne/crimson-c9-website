"use client";

import { useEffect, useState } from "react";

/**
 * The three cities as one line that changes, rather than all three at once (Aaron, CRI-23).
 *
 * Replaces "Aachen · Berlin · Cologne" in the header. One name at a time reads as a place
 * the collective *is* right now; a list reads as a footer.
 *
 * A cross-fade rather than the vertical roll this site used to have. The roll had to own a
 * fixed line height and clip to it, which is fine mid-paragraph but makes a header cell
 * jump the moment a longer name comes round. Fading in place can't shift the layout.
 *
 * The element keeps a stable width — `ch` sized to the longest name — so the header's grid
 * never reflows as the word changes. Without that the centred mark drifts a few pixels
 * every six seconds, which is the kind of thing you notice without being able to say why.
 */
const CITIES = ["Aachen", "Berlin", "Cologne"] as const;

/** Long enough to read, short enough that you see it change if you linger. */
const DWELL_MS = 4200;
const FADE_MS = 500;

export function CityCycle({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Respected here rather than only in CSS: with reduced motion the line should settle
    // on one name and stop, not fade without transitions.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fadeTimer: ReturnType<typeof setTimeout>;

    const cycle = setInterval(() => {
      setVisible(false);
      fadeTimer = setTimeout(() => {
        setIndex((previous) => (previous + 1) % CITIES.length);
        setVisible(true);
      }, FADE_MS);
    }, DWELL_MS);

    return () => {
      clearInterval(cycle);
      clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <span className={className}>
      {/* All three names are in the DOM for assistive tech and for anyone with JavaScript
          off, where the component never cycles and the first name alone would understate
          where the collective actually is. Only one is ever shown. */}
      <span className="sr-only">Aachen, Berlin and Cologne</span>

      <span
        aria-hidden="true"
        className="inline-block text-right transition-opacity ease-out"
        style={{
          minWidth: "7ch",
          opacity: visible ? 1 : 0,
          transitionDuration: `${FADE_MS}ms`,
        }}
      >
        {CITIES[index]}
      </span>
    </span>
  );
}
