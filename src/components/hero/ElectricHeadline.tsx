"use client";

import { useEffect, useRef } from "react";

/**
 * The hero headline: three stacked copies of the same words, two of them coloured ghosts
 * that pull apart as the pointer approaches (CRI-22, option A).
 *
 * This component exists only to publish the pointer position; everything visual is in
 * `.electric-*` in globals.css. That split matters — the text is server-rendered and
 * readable before any JavaScript runs, and if this never hydrates the ghosts simply sit at
 * their resting offset.
 *
 * The real text is in the face copy. The ghosts are `aria-hidden`, so a screen reader hears
 * the headline once rather than three times.
 */
export function ElectricHeadline({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Respect the OS setting here as well as in CSS: the CSS can stop the jitter, but only
    // this can stop the component doing per-frame work for an effect nobody will see.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let frame = 0;
    let pending = false;
    let mx = 0;
    let my = 0;
    let pull = 0;

    function commit() {
      pending = false;
      if (!element) return;
      element.style.setProperty("--mx", mx.toFixed(3));
      element.style.setProperty("--my", my.toFixed(3));
      element.style.setProperty("--pull", pull.toFixed(3));
    }

    function schedule() {
      if (pending) return;
      pending = true;
      frame = requestAnimationFrame(commit);
    }

    /**
     * Tracked on the window rather than the headline itself. The effect should respond to
     * the cursor crossing the hero, including the large empty area around the text — a
     * listener on the element would only fire once the pointer was already on the letters,
     * by which point the interesting part of the movement has happened.
     */
    function onPointerMove(event: PointerEvent) {
      if (!element) return;
      const box = element.getBoundingClientRect();
      if (!box.width || !box.height) return;

      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;

      // Normalised to the headline's own size, so the displacement feels the same on a
      // phone as on a wide desktop instead of scaling with the viewport.
      mx = Math.max(-1, Math.min(1, (event.clientX - cx) / (box.width / 2)));
      my = Math.max(-1, Math.min(1, (event.clientY - cy) / (box.height / 2)));

      // Falls off with distance from the headline, measured in multiples of its own height
      // so it is resolution-independent. 0.35 at rest keeps a permanent faint separation —
      // at zero the headline looks plain until touched, which reads as broken.
      const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
      const reach = box.height * 4;
      pull = 0.35 + 0.65 * Math.max(0, 1 - distance / reach);

      schedule();
    }

    function onPointerLeave() {
      mx = 0;
      my = 0;
      pull = 0.35;
      schedule();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span ref={ref} className={`electric ${className ?? ""}`}>
      <span className="electric-ghost electric-ghost-r" aria-hidden="true">
        {children}
      </span>
      <span className="electric-ghost electric-ghost-c" aria-hidden="true">
        {children}
      </span>
      <span className="electric-face">{children}</span>
    </span>
  );
}
