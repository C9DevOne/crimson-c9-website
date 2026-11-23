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
        <LanternMark />
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
 * The lantern, as a sphere of light suspended between two beams.
 *
 * Aaron, CRI-22: "more of a glowing sphere of light with the glow increasing when hovering
 * … two dark or wooden rectangle shapes sitting above and beneath it (even with a little
 * space, making it a little dream like)".
 *
 * The gap is the whole idea, so it is built with layout rather than drawing: three
 * elements in a column with space between them, and nothing joining the beams to the orb.
 * Suspending a light between two pieces of timber with no visible support is the thing
 * that reads as a dream, and any strut or cord would undo it.
 *
 * The beams are narrower than the orb is wide, which keeps them reading as beams rather
 * than as a frame enclosing it.
 *
 * Drawn in DOM rather than SVG: the glow is three animated box-shadows (see `.orb-core` in
 * globals.css), and box-shadow on an HTML element is cheaper to animate than the
 * equivalent SVG filter, which would re-rasterise every frame.
 */
function LanternMark({ className }: { className?: string }) {
  return (
    <span className={`flex flex-col items-center ${className ?? ""}`} aria-hidden="true">
      <span className="orb-beam orb-beam-top h-[5px] w-[26px] rounded-[1px] md:h-[6px] md:w-[30px]" />
      <span className="orb-core my-[7px] block size-[22px] rounded-full md:my-2 md:size-[26px]" />
      <span className="orb-beam orb-beam-bottom h-[5px] w-[26px] rounded-[1px] md:h-[6px] md:w-[30px]" />
    </span>
  );
}
