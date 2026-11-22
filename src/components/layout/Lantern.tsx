"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RiInstagramLine, RiSoundcloudLine, RiYoutubeLine } from "react-icons/ri";

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
    <div ref={containerRef} className="relative">
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
        <LanternMark className="h-10 w-auto md:h-11" />
      </button>

      <div
        id="lantern-menu"
        data-open={open}
        inert={!open}
        className="lantern-panel border-hairline bg-background/95 absolute top-full left-0 mt-4 w-56 border p-5"
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
            <div className="rule my-5" />
            <ul className="flex items-center gap-5">
              {socialLinks.map(({ name, url, Icon }) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="text-muted-foreground hover:text-foreground inline-block transition-colors"
                  >
                    <Icon className="size-4" aria-hidden="true" />
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
      className="type-label hover:text-foreground block py-2 transition-colors"
    >
      {children}
    </Link>
  );
}

/**
 * The lantern, drawn with depth.
 *
 * `CONCEPT_page-universal-menu.md` §1 asks for "realistic, not pixel-art… glass texture,
 * drop shadow, a sense of weight and light". A flat geometric version replaced that on
 * 2026-10-02; this returns to the concept (CRI-22, Aaron: "more polished, realistic").
 *
 * The depth is four gradients and a blur, not an illustration:
 *  - the paper body is lit from the upper left and falls off to a dark right edge
 *  - a blurred warm core sits behind the paper, so the light reads as *inside* the shade
 *  - the caps are a metal gradient with a highlight band
 *  - a specular arc on the upper left is what actually sells the surface as curved
 *
 * Gradient ids are suffixed because this mark can appear more than once on a page (menu
 * and, later, a footer mark); duplicate ids would make the second instance reference the
 * first one's gradients.
 */
const LANTERN_CX = 32;
const LANTERN_CY = 44;
const LANTERN_RX = 19;
const LANTERN_RY = 21;

/** Rib chords, as vertical offsets from the body centre. */
const RIB_OFFSETS = [-12, -6, 0, 6, 12];

function LanternMark({ className, idSuffix = "menu" }: { className?: string; idSuffix?: string }) {
  const paper = `lantern-paper-${idSuffix}`;
  const metal = `lantern-metal-${idSuffix}`;
  const core = `lantern-core-${idSuffix}`;
  const sheen = `lantern-sheen-${idSuffix}`;
  const blur = `lantern-blur-${idSuffix}`;

  // Each rib is an ellipse chord, so the ribs narrow towards the top and bottom the way
  // they would on a real shade. Derived from the radii rather than eyeballed, so the shape
  // survives being resized.
  const ribs = RIB_OFFSETS.map((dy) => {
    const halfWidth = LANTERN_RX * Math.sqrt(Math.max(0, 1 - (dy / LANTERN_RY) ** 2));
    return { y: LANTERN_CY + dy, halfWidth: Math.round(halfWidth * 0.93 * 10) / 10 };
  });

  return (
    <svg viewBox="0 0 64 80" className={className} aria-hidden="true" focusable="false">
      <defs>
        {/* Lit from the upper left, falling to a dark right edge — the single biggest
            contributor to the thing reading as a cylinder rather than a disc. */}
        <linearGradient id={paper} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0%" stopColor="color-mix(in srgb, var(--glow-crimson) 42%, #1a0406)" />
          <stop offset="38%" stopColor="color-mix(in srgb, var(--glow-crimson) 62%, #230507)" />
          <stop offset="72%" stopColor="var(--brand-crimson)" />
          <stop offset="100%" stopColor="#1b0305" />
        </linearGradient>

        <linearGradient id={metal} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6b6b70" />
          <stop offset="28%" stopColor="#d7d7dc" />
          <stop offset="55%" stopColor="#8a8a90" />
          <stop offset="100%" stopColor="#4a4a4f" />
        </linearGradient>

        <radialGradient id={core}>
          <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.95" />
          <stop offset="55%" stopColor="var(--glow-accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--glow-accent)" stopOpacity="0" />
        </radialGradient>

        {/* Specular arc: bright at the top of the sweep, gone by the bottom. */}
        <linearGradient id={sheen} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <filter id={blur} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
      </defs>

      {/* Cord. Outside the spin group — a hanging lantern turns under its cord, it does not
          take the cord with it. */}
      <path
        d="M32 3 L32 15"
        stroke="color-mix(in srgb, var(--foreground) 34%, transparent)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      <g className="lantern-spin" style={{ transformOrigin: `${LANTERN_CX}px ${LANTERN_CY}px` }}>
        {/* The light, behind the paper and blurred, so it glows through rather than
            sitting on top of it. */}
        <ellipse
          className="lantern-core"
          cx={LANTERN_CX}
          cy={LANTERN_CY}
          rx="15"
          ry="17"
          fill={`url(#${core})`}
          filter={`url(#${blur})`}
        />

        {/* Top cap. */}
        <rect x="24" y="15" width="16" height="4.5" rx="1.2" fill={`url(#${metal})`} />
        <rect x="24" y="15" width="16" height="1.4" rx="0.7" fill="#ffffff" opacity="0.32" />

        {/* The shade. */}
        <ellipse
          cx={LANTERN_CX}
          cy={LANTERN_CY}
          rx={LANTERN_RX}
          ry={LANTERN_RY}
          fill={`url(#${paper})`}
        />

        {/* Ribs, drawn darker than the paper so they read as seams in it rather than as
            lines drawn over it. */}
        {ribs.map((rib, i) => (
          <path
            key={i}
            d={`M ${LANTERN_CX - rib.halfWidth} ${rib.y} L ${LANTERN_CX + rib.halfWidth} ${rib.y}`}
            stroke="#120203"
            strokeOpacity="0.4"
            strokeWidth="0.9"
          />
        ))}

        {/* Vertical seam, off-centre towards the lit side. */}
        <path
          d={`M ${LANTERN_CX - 7} ${LANTERN_CY - 19} Q ${LANTERN_CX - 9.5} ${LANTERN_CY} ${LANTERN_CX - 7} ${LANTERN_CY + 19}`}
          stroke="#ffffff"
          strokeOpacity="0.07"
          strokeWidth="0.8"
          fill="none"
        />

        {/* Specular highlight. */}
        <path
          d={`M ${LANTERN_CX - 12.5} ${LANTERN_CY - 13} Q ${LANTERN_CX - 16} ${LANTERN_CY} ${LANTERN_CX - 12} ${LANTERN_CY + 13}`}
          stroke={`url(#${sheen})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rim light on the dark edge — stops the right side dissolving into the page. */}
        <ellipse
          cx={LANTERN_CX}
          cy={LANTERN_CY}
          rx={LANTERN_RX}
          ry={LANTERN_RY}
          fill="none"
          stroke="color-mix(in srgb, var(--glow-crimson) 55%, transparent)"
          strokeWidth="0.7"
        />

        {/* Bottom cap and finial. */}
        <rect x="26" y="63.5" width="12" height="4" rx="1" fill={`url(#${metal})`} />
        <path
          d="M32 67.5 L32 73"
          stroke="color-mix(in srgb, var(--foreground) 26%, transparent)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle
          cx="32"
          cy="74.5"
          r="1.6"
          fill="color-mix(in srgb, var(--foreground) 30%, transparent)"
        />
      </g>
    </svg>
  );
}
