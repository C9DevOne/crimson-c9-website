import type { IconType } from "react-icons";

/**
 * A channel link as a see-through 3D block with the icon turning inside it.
 *
 * Aaron, CRI-23: the old glass tiles were "a bit bulky" — "see through 3d boxes with the
 * social media icon turning inside a bit like in mario bros".
 *
 * The Mario reference is doing real work in the design. In a Mario block the *box* stays
 * put and the thing inside moves; knocking it makes it jump once and settle. So: the box
 * sits at a fixed tilt, the icon rotates on its own axis continuously, and hover bumps the
 * whole block up with an overshoot in the easing — struck, not lifted — while the icon
 * speeds up.
 *
 * Built from five real faces rather than one bordered div with a shadow, because
 * "see-through" has to mean it: you look through the front face, past the icon, and out
 * through the back of the box. A faked cube loses that the moment it tilts.
 *
 * `DEPTH` is half the box's depth — each face is pushed out by this much from the centre,
 * so the box is `DEPTH * 2` deep. The size comes from the parent, so the faces are
 * `inset: 0` and only the Z translation is fixed.
 */
const DEPTH = 34;

export function SocialBlock({
  name,
  handle,
  url,
  Icon,
}: {
  name: string;
  handle: string;
  url: string;
  Icon: IconType;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="sblock-link group flex flex-col items-center gap-6 py-4 text-center"
    >
      <span className="sblock-scene block size-28 md:size-32">
        {/* `block` (Tailwind's display utility) as well as `sblock` (ours). They were one
              class before the rename and dropping it collapsed the box to a 0×0 inline
              element with the faces invisible — the icons kept rendering, so it looked
              like a styling miss rather than a layout one. */}
        <span className="sblock relative block size-full">
          {/* Back first, then the sides, then the front. Painting order matters here:
              with real 3D faces and no z-index juggling, the browser sorts them by depth,
              and the front face must be the one catching the light. */}
          <span
            className="sblock-face"
            style={{ transform: `translateZ(-${DEPTH}px) rotateY(180deg)` }}
            aria-hidden="true"
          />
          <span
            className="sblock-face"
            style={{ transform: `rotateY(-90deg) translateZ(${DEPTH}px)` }}
            aria-hidden="true"
          />
          <span
            className="sblock-face"
            style={{ transform: `rotateY(90deg) translateZ(${DEPTH}px)` }}
            aria-hidden="true"
          />
          <span
            className="sblock-face"
            style={{ transform: `rotateX(90deg) translateZ(${DEPTH}px)` }}
            aria-hidden="true"
          />
          <span
            className="sblock-face"
            style={{ transform: `rotateX(-90deg) translateZ(${DEPTH}px)` }}
            aria-hidden="true"
          />

          {/* Suspended in the middle of the box, not mounted to a face. */}
          <span className="sblock-icon" aria-hidden="true">
            <Icon className="size-9 md:size-10" />
          </span>

          <span
            className="sblock-face sblock-face-front"
            style={{ transform: `translateZ(${DEPTH}px)` }}
            aria-hidden="true"
          />
        </span>
      </span>

      <span>
        <span className="text-foreground block text-lg md:text-xl">{name}</span>
        <span className="type-label mt-1 block">{handle}</span>
      </span>
    </a>
  );
}
