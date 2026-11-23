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
        <LanternMark open={open} />
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
 * The lantern: a shaded sphere of light suspended between two short beams.
 *
 * Aaron, CRI-22 — "a more realistic shader on it", the beams "should not span the whole
 * width but be a little smaller", and the click animation back.
 *
 * The shading is four stacked layers rather than one radial gradient, which is the
 * difference between a glowing disc and something spherical:
 *
 *  1. `.orb-body`     the sphere's own surface, lit from the upper left and falling to a
 *                     dark terminator on the lower right
 *  2. `.orb-rim`      a thin crescent of light on the shadow side — reflected light, the
 *                     thing that most reliably reads as roundness
 *  3. `.orb-specular` a small hard highlight where the light source hits the surface
 *  4. `.orb-bloom`    the light thrown into the air around it, which is what animates
 *
 * Opening the menu turns the whole assembly a full revolution and flares the light at the
 * same time. The rotation is on the outer element, not the sphere: a featureless sphere
 * turning is invisible, but the two beams carry the motion perfectly well, so the mark
 * reads as a hanging object swinging round while its light surges.
 */
function LanternMark({ open }: { open: boolean }) {
  return (
    <span
      className="lantern-spin flex flex-col items-center gap-[7px] md:gap-2"
      data-open={open}
      aria-hidden="true"
    >
      <span className="orb-beam orb-beam-top" />

      {/* The sphere. A grid so all four shading layers stack in one cell without
          absolute positioning, which would need a fixed size in pixels. */}
      <span className="orb-shell grid" data-open={open}>
        <span className="orb-bloom" />
        <span className="orb-body" />
        <span className="orb-rim" />
        <span className="orb-specular" />
      </span>

      <span className="orb-beam orb-beam-bottom" />
    </span>
  );
}
