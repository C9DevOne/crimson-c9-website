/**
 * The pagoda — the structure the welcome heading is arranged around. It sits in the centre
 * column between "Welcome / Digital" and "to our / Home", spanning both lines.
 *
 * Drawn entirely in the tapered-curve vocabulary from `shapes.ts`: roofs are swooping filled
 * sweeps that sag between the ridge and sharpen to a point at each eave, the finial is a
 * four-point sparkle, and orbital rings tie it to the wider ornament set. No straight edges
 * and no uniform-width strokes anywhere — an earlier pass built this from triangles and
 * rectangles and it read as a fir tree.
 *
 * Portrait by design, since it has to hold the full height of a two-line heading.
 *
 * Server-rendered, CSS-animated, no client JavaScript.
 */

import type { CSSProperties } from "react";

import { orbitalRingPath, roofPath, sparklePath } from "./shapes";

const W = 170;
const H = 250;
const CX = W / 2;

/** Storeys, bottom to top. */
const TIERS = 4;
/** Eave line of the lowest roof. */
const BASE_Y = 205;
/** Vertical distance between one roof and the next. */
const GAP = 42;
/** Half-width of the widest roof. */
const BASE_HALF_WIDTH = 72;
/** Each storey is this fraction of the one below. */
const TIER_SCALE = 0.87;
/** Ridge height above the eave line. */
const RISE = 20;
/** Roof depth at its thickest. */
const THICKNESS = 9;
/** How far the eave tips kick up. */
const LIFT = 7;

type Tier = {
  index: number;
  y: number;
  halfWidth: number;
  roof: string;
};

function buildTiers(): Tier[] {
  return Array.from({ length: TIERS }, (_, index) => {
    const halfWidth = BASE_HALF_WIDTH * TIER_SCALE ** index;
    return {
      index,
      y: BASE_Y - index * GAP,
      halfWidth,
      roof: roofPath(halfWidth, RISE, THICKNESS, LIFT),
    };
  });
}

export function PagodaScene({ className }: { className?: string }) {
  const tiers = buildTiers();
  const top = tiers[TIERS - 1];
  const apexY = top.y - RISE - THICKNESS;
  const finialY = apexY - 30;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <defs>
        <linearGradient id="pagoda-fill" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" style={{ stopColor: "var(--brand-crimson)" }} />
          <stop offset="55%" style={{ stopColor: "var(--glow-crimson)" }} />
          <stop offset="100%" style={{ stopColor: "var(--glow-accent)" }} />
        </linearGradient>
      </defs>

      <g className="growth-glow">
        {/* Storey walls first, so each roof overlaps the wall beneath it. Stadium shapes
            rather than rectangles — fully rounded ends, no corners. */}
        <g fill="color-mix(in srgb, var(--brand-crimson) 90%, transparent)">
          {tiers.map((tier) => {
            const width = tier.halfWidth * 0.52;
            return (
              <rect
                key={tier.index}
                x={CX - width / 2}
                y={tier.y - 2}
                width={width}
                height={28}
                rx={width / 2}
                className="growth-pop"
                style={{ "--grow-delay": `${(TIERS - tier.index) * 0.09}s` } as CSSProperties}
              />
            );
          })}
        </g>

        {/* Roofs.
            Positioning lives on a wrapping <g>, not on the path itself. An SVG `transform`
            attribute is just the CSS `transform` property by another name, so putting one on
            the same element as .growth-pop — which animates `transform` — means the
            animation's final `transform: none` erases the positioning and every roof
            collapses onto the SVG origin. Separate elements, separate transforms. */}
        <g fill="url(#pagoda-fill)">
          {tiers.map((tier) => (
            <g key={tier.index} transform={`translate(${CX} ${tier.y})`}>
              <path
                d={tier.roof}
                className="growth-pop"
                style={
                  { "--grow-delay": `${(TIERS - tier.index) * 0.09 + 0.04}s` } as CSSProperties
                }
              />
            </g>
          ))}
        </g>

        {/* Spire */}
        <path
          d={`M ${CX} ${apexY} L ${CX} ${finialY + 10}`}
          stroke="var(--glow-crimson)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Finial: a sparkle inside a tilted orbital ring. */}
        <path
          d={orbitalRingPath(30, 11, 2.4)}
          fillRule="evenodd"
          fill="var(--glow-accent)"
          opacity="0.75"
          transform={`translate(${CX} ${finialY}) rotate(-16)`}
          className="orbit-slow"
        />
        <path
          d={sparklePath(17, 0.12)}
          fill="var(--glow-accent)"
          transform={`translate(${CX} ${finialY})`}
          className="lantern-flame"
        />
      </g>

      {/* Loose sparkles, off the structure's axis so the composition isn't symmetrical. */}
      <g fill="var(--glow-crimson)">
        <path
          d={sparklePath(9, 0.13)}
          transform={`translate(${CX + 58} ${finialY + 64})`}
          className="twinkle"
          opacity="0.8"
        />
        <path
          d={sparklePath(6, 0.13)}
          transform={`translate(${CX - 62} ${finialY + 112})`}
          className="twinkle"
          style={{ animationDelay: "1.6s" }}
          opacity="0.65"
        />
        <path
          d={sparklePath(5, 0.13)}
          transform={`translate(${CX + 50} ${BASE_Y - 8})`}
          className="twinkle"
          style={{ animationDelay: "3.1s" }}
          opacity="0.5"
        />
      </g>
    </svg>
  );
}
