"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RiInstagramLine, RiSoundcloudLine, RiYoutubeLine } from "react-icons/ri";

import { sparklePath } from "@/components/animations/shapes";

/**
 * The Lantern — the universal menu, per CONCEPT_page-universal-menu.md.
 *
 * Replaces the old navbar. Fixed top-left on every page, it spins a full turn on activation
 * and the panel unfurls out of that motion (§2 — the spin *is* the menu opening, not
 * decoration layered on top).
 *
 * Contents are live links only. The concept lists seven sections, but none of those routes
 * exist yet and the site-wide rule is that deferred items aren't rendered at all rather
 * than shown disabled — so while this is a single-page site the menu carries what actually
 * works. The seven go back in as each route ships.
 */

type Socials = {
  instagram?: string | null;
  youtube?: string | null;
  soundcloud?: string | null;
};

/** True when focus sits somewhere typing should win over a shortcut. */
function isTypingContext(element: Element | null): boolean {
  if (!element) return false;
  if (element instanceof HTMLElement && element.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName);
}

export function Lantern({ socials }: { socials?: Socials }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (!open) return;
        close();
        // Send focus back to the lantern — closing with Esc from inside the panel would
        // otherwise drop the keyboard user at the top of the document.
        buttonRef.current?.focus();
        return;
      }

      // Shift+Enter opens the menu directly (§3). The guard matters: without it, Shift+Enter
      // for a newline in the contact form's message field would pop the menu mid-sentence.
      if (event.key === "Enter" && event.shiftKey) {
        if (isTypingContext(document.activeElement)) return;
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!open) return;
      if (containerRef.current?.contains(event.target as Node)) return;
      close();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  const socialLinks = [
    { name: "Instagram", url: socials?.instagram, Icon: RiInstagramLine },
    { name: "YouTube", url: socials?.youtube, Icon: RiYoutubeLine },
    { name: "SoundCloud", url: socials?.soundcloud, Icon: RiSoundcloudLine },
  ].flatMap(({ name, url, Icon }) => (url ? [{ name, url, Icon }] : []));

  return (
    <div ref={containerRef} className="fixed top-5 left-5 z-50 md:top-7 md:left-7">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        data-open={open}
        aria-expanded={open}
        aria-controls="lantern-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="lantern-button block cursor-pointer"
      >
        <LanternMark className="h-14 w-auto md:h-16" />
      </button>

      <div
        id="lantern-menu"
        data-open={open}
        inert={!open}
        className="lantern-panel glass-panel absolute top-full left-0 mt-3 w-60 rounded-3xl p-5"
      >
        <nav aria-label="Site">
          <ul className="flex flex-col gap-1">
            <li>
              <MenuLink href="/imprint" onNavigate={close}>
                Imprint
              </MenuLink>
            </li>
            <li>
              <MenuLink href="/terms" onNavigate={close}>
                Terms &amp; Privacy
              </MenuLink>
            </li>
          </ul>
        </nav>

        {socialLinks.length > 0 && (
          <>
            <div className="via-glow-crimson/40 my-4 h-px bg-gradient-to-r from-transparent to-transparent" />
            <ul className="flex items-center gap-5 px-3">
              {socialLinks.map(({ name, url, Icon }) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="text-muted-foreground hover:text-glow-crimson inline-block transition-colors duration-300"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function MenuLink({
  href,
  onNavigate,
  children,
}: {
  href: "/imprint" | "/terms";
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="font-ui text-muted-foreground hover:text-foreground hover:bg-foreground/5 block rounded-xl px-3 py-2 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300"
    >
      {children}
    </Link>
  );
}

/**
 * The lantern, as flat geometry — a chōchin reduced to a circle, two bars and three chords.
 *
 * This replaces an earlier dimensional drawing with glass gradients and a highlight.
 * CONCEPT_page-universal-menu.md §1 still specifies "realistic, not pixel-art… glass
 * texture, drop shadow, a sense of weight and light", which this deliberately no longer
 * follows: the site moved to flat 2D geometry (Aaron, 2026-10-02). **That section of the
 * concept doc needs updating** — as written it would send the next person back to the
 * dimensional version.
 *
 * Everything is built from the same vocabulary the rest of the page now uses: circles,
 * straight bars, thick strokes, flat fills. The ribs are chords of the body circle, with
 * their half-widths derived from the radius rather than eyeballed, so the shape stays
 * correct if the circle is ever resized.
 */
const LANTERN_R = 19;
const LANTERN_CX = 32;
const LANTERN_CY = 46;

/** Rib chords, as vertical offsets from the circle's centre. */
const RIB_OFFSETS = [-9, 0, 9];

function LanternMark({ className }: { className?: string }) {
  const ribs = RIB_OFFSETS.map((dy) => {
    // Chord half-width at this height, inset slightly so it stops short of the outline.
    const halfWidth = Math.sqrt(LANTERN_R ** 2 - dy ** 2) * 0.86;
    return { y: LANTERN_CY + dy, halfWidth: Math.round(halfWidth * 10) / 10 };
  });

  return (
    <svg viewBox="0 0 64 80" className={className} aria-hidden="true" focusable="false">
      {/* Cord. Outside the spin group — a hanging lantern turns under its cord. */}
      <path
        d="M32 4 L32 18"
        stroke="var(--muted-foreground)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <g
        className="lantern-spin"
        style={{ transformOrigin: `${LANTERN_CX}px ${LANTERN_CY}px` }}
        strokeLinecap="round"
      >
        {/* Top and bottom caps — plain bars, no taper. */}
        <rect x="23" y="16" width="18" height="5" rx="2.5" fill="var(--glow-crimson)" />
        <rect x="25" y="70" width="14" height="5" rx="2.5" fill="var(--glow-crimson)" />

        {/* Body: one circle doing all the work. */}
        <circle
          cx={LANTERN_CX}
          cy={LANTERN_CY}
          r={LANTERN_R}
          fill="color-mix(in srgb, var(--brand-crimson) 70%, transparent)"
          stroke="var(--glow-crimson)"
          strokeWidth="3.5"
        />

        {/* Ribs. */}
        {ribs.map((rib, i) => (
          <path
            key={i}
            d={`M ${LANTERN_CX - rib.halfWidth} ${rib.y} L ${LANTERN_CX + rib.halfWidth} ${rib.y}`}
            stroke="var(--glow-crimson)"
            strokeOpacity="0.55"
            strokeWidth="2"
          />
        ))}

        {/* The light inside, as a four-point sparkle rather than a plain dot — it shares the
            ornament vocabulary used across the page, and reads as light rather than as a
            bulb. */}
        <path
          className="lantern-flame"
          d={sparklePath(9, 0.13)}
          transform={`translate(${LANTERN_CX} ${LANTERN_CY})`}
          fill="var(--glow-accent)"
        />
      </g>
    </svg>
  );
}
