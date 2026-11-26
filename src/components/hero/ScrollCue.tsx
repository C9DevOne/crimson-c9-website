"use client";

import { useEffect, useState } from "react";

/**
 * The scroll affordance, as a control rather than a caption (Aaron, CRI-23: "remove the
 * scroll text or make it cooler with functionality").
 *
 * It was a word and a rule that did nothing. Now it is a button that takes you to the next
 * section, which is what the word was describing anyway — and a thing that moves on its
 * own is a far better invitation to scroll than a thing that says "scroll".
 *
 * Three details that make it worth being a component:
 *
 *  - It **hides itself once you have scrolled**. A prompt to scroll that is still sitting
 *    there after you have scrolled is just furniture.
 *  - It scrolls to the *next section* rather than by a viewport, so it lands somewhere
 *    composed instead of mid-gap.
 *  - It honours reduced motion for the jump itself, not only for the animation — a smooth
 *    scroll is motion, and an instant jump is the correct fallback.
 */
export function ScrollCue({ targetId }: { targetId: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Hide as soon as the page has moved at all. `passive` because this never calls
    // preventDefault and a non-passive scroll listener blocks the compositor.
    const onScroll = () => setHidden(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function jump() {
    const target = document.getElementById(targetId);
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    <button
      type="button"
      onClick={jump}
      aria-label="Scroll to upcoming events"
      // `inert` as well as opacity: a faded-out control is still focusable and still
      // clickable, which is how a keyboard user ends up activating something invisible.
      inert={hidden}
      className="scroll-cue group inline-flex cursor-pointer items-center gap-4"
      data-hidden={hidden}
    >
      <span className="type-label group-hover:text-foreground transition-colors">Scroll</span>
      <span className="scroll-cue-track" aria-hidden="true">
        <span className="scroll-cue-dot" />
      </span>
    </button>
  );
}
