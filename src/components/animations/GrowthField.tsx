/**
 * The generative nature layer sitting behind the whole page.
 *
 * Three planes rather than one flat backdrop:
 *   - **back**  — distant growth along the bottom, barely registering
 *   - **mid**   — fuller foliage, closer and more present
 *   - **front** — branches reaching in from the left and right edges to frame the content
 *
 * The side branches get their own SVGs anchored to each edge (`xMinYMid` / `xMaxYMid`)
 * rather than living in the shared bottom viewBox. That's what keeps them touching the
 * actual viewport edges at any width — in one combined box they'd drift inward or crop off
 * entirely as the aspect ratio changed.
 *
 * Deliberately not a client component. The geometry is deterministic (see
 * `growth-geometry.ts`) and the motion is pure CSS, so this renders on the server and ships
 * no JavaScript at all.
 */

import type { CSSProperties } from "react";

import {
  growSpores,
  growStructure,
  type GrowthOptions,
  type GrowthStructure,
} from "./growth-geometry";

/** Stroke tapers with depth — trunk heaviest, outer tips hairline. */
const strokeWidth = (depth: number) => Math.max(0.5, 2.4 - depth * 0.4);

/** Opacity falls off with depth too, so a structure reads as receding rather than flat. */
const branchOpacity = (depth: number) => Math.max(0.16, 0.92 - depth * 0.13);

/**
 * Builds several structures, or `null` if anything throws.
 *
 * The geometry is pure maths with no real failure mode, but VISION.md §5 is explicit that
 * decorative features must never break the page — so the caller gets something it can
 * branch on and the page renders plainer instead of erroring.
 */
function growAll(stems: GrowthOptions[]): GrowthStructure[] | null {
  try {
    return stems.map(growStructure);
  } catch {
    return null;
  }
}

/** Shared renderer for one structure's branches and tip nodes. */
function Structure({ structure, delayStep }: { structure: GrowthStructure; delayStep: number }) {
  return (
    <>
      {structure.branches.map((branch, i) => (
        <path
          key={`b${i}`}
          d={branch.d}
          pathLength={1}
          className="growth-path"
          strokeWidth={strokeWidth(branch.depth)}
          opacity={branchOpacity(branch.depth)}
          style={{ "--grow-delay": `${(branch.depth * delayStep).toFixed(2)}s` } as CSSProperties}
        />
      ))}
      {structure.tips.map((tip, i) => (
        <circle
          key={`t${i}`}
          cx={tip.x}
          cy={tip.y}
          r={1.4}
          className="growth-tip"
          style={
            { "--grow-delay": `${(tip.depth * delayStep + 0.35).toFixed(2)}s` } as CSSProperties
          }
        />
      ))}
    </>
  );
}

const FIELD_W = 1200;
const FIELD_H = 760;
const SIDE_W = 340;
const SIDE_H = 900;

/** Distant growth along the bottom edge. */
const BACK_STEMS: GrowthOptions[] = [
  { seed: 4242, origin: [120, FIELD_H], angle: -Math.PI / 2 + 0.3, length: 74, maxDepth: 4 },
  { seed: 8891, origin: [480, FIELD_H], angle: -Math.PI / 2 - 0.2, length: 62, maxDepth: 4 },
  { seed: 1337, origin: [760, FIELD_H], angle: -Math.PI / 2 + 0.22, length: 68, maxDepth: 4 },
  { seed: 777, origin: [1090, FIELD_H], angle: -Math.PI / 2 - 0.34, length: 80, maxDepth: 4 },
];

/** Closer, fuller foliage — shorter and denser so it reads as nearer than the back layer. */
const MID_STEMS: GrowthOptions[] = [
  {
    seed: 31337,
    origin: [290, FIELD_H],
    angle: -Math.PI / 2 - 0.15,
    length: 92,
    maxDepth: 5,
    splitChance: 0.82,
  },
  {
    seed: 60613,
    origin: [640, FIELD_H],
    angle: -Math.PI / 2 + 0.1,
    length: 84,
    maxDepth: 5,
    splitChance: 0.82,
  },
  {
    seed: 9052,
    origin: [950, FIELD_H],
    angle: -Math.PI / 2 - 0.08,
    length: 98,
    maxDepth: 5,
    splitChance: 0.82,
  },
];

/**
 * Branches reaching in from an edge. Angle 0 points right, so the left edge grows inward at
 * ~0 and the right edge at ~π. Spread is wider than the upright stems because a branch
 * coming in sideways fans out rather than tapering to a point.
 */
function sideStems(side: "left" | "right"): GrowthOptions[] {
  const fromLeft = side === "left";
  const x = fromLeft ? 0 : SIDE_W;
  const base = fromLeft ? 0 : Math.PI;
  // Mirror the lean as well as the heading, so the right side isn't a visible copy.
  const lean = (amount: number) => (fromLeft ? amount : -amount);

  return [
    {
      seed: fromLeft ? 20261002 : 51404,
      origin: [x, SIDE_H * 0.17],
      angle: base + lean(0.34),
      length: 76,
      maxDepth: 5,
      spread: 0.62,
      splitChance: 0.78,
    },
    {
      seed: fromLeft ? 884412 : 991233,
      origin: [x, SIDE_H * 0.52],
      angle: base + lean(-0.12),
      length: 68,
      maxDepth: 4,
      spread: 0.58,
    },
    {
      seed: fromLeft ? 70707 : 30303,
      origin: [x, SIDE_H * 0.84],
      angle: base + lean(-0.42),
      length: 82,
      maxDepth: 5,
      spread: 0.6,
      splitChance: 0.78,
    },
  ];
}

/** One edge's framing branches. */
function SideBranches({ side }: { side: "left" | "right" }) {
  const stems = growAll(sideStems(side));
  if (!stems) return null;

  return (
    <svg
      viewBox={`0 0 ${SIDE_W} ${SIDE_H}`}
      preserveAspectRatio={`${side === "left" ? "xMin" : "xMax"}YMid slice`}
      className={`absolute top-0 h-full w-[38%] max-w-[420px] md:w-[30%] ${
        side === "left" ? "left-0" : "right-0 -scale-x-100"
      }`}
      focusable="false"
      fill="none"
    >
      <g
        stroke="var(--glow-crimson)"
        fill="var(--glow-crimson)"
        className="growth-layer-front growth-sway"
      >
        {stems.map((structure, i) => (
          <Structure key={i} structure={structure} delayStep={0.18} />
        ))}
      </g>
    </svg>
  );
}

export function GrowthField() {
  const back = growAll(BACK_STEMS);
  const mid = growAll(MID_STEMS);
  const spores = growSpores(31415, 30, FIELD_W, FIELD_H);

  // z-0 rather than a negative z-index: the page's content sits at z-10 above this.
  // Negative values depend on how ancestor stacking contexts resolve, so z-0 is the
  // predictable choice.
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Base wash, so the page isn't a flat black rectangle behind the glass. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_100%,color-mix(in_srgb,var(--brand-crimson)_30%,transparent),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_0%,color-mix(in_srgb,var(--glow-crimson)_9%,transparent),transparent_68%)]" />

      <svg
        viewBox={`0 0 ${FIELD_W} ${FIELD_H}`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
        focusable="false"
        fill="none"
      >
        {back && (
          <g stroke="var(--glow-crimson)" fill="var(--glow-crimson)" className="growth-layer-back">
            {back.map((structure, i) => (
              <Structure key={i} structure={structure} delayStep={0.22} />
            ))}
          </g>
        )}

        {mid && (
          <g stroke="var(--glow-crimson)" fill="var(--glow-crimson)" className="growth-layer-mid">
            {mid.map((structure, i) => (
              <Structure key={i} structure={structure} delayStep={0.16} />
            ))}
          </g>
        )}

        <g fill="var(--glow-crimson)">
          {spores.map((spore, i) => (
            <circle
              key={i}
              cx={spore.x}
              cy={spore.y}
              r={spore.r}
              className="growth-spore"
              style={
                {
                  "--grow-delay": `${spore.delay}s`,
                  "--spore-duration": `${spore.duration}s`,
                  "--spore-drift": `${spore.drift}px`,
                } as CSSProperties
              }
            />
          ))}
        </g>
      </svg>

      <SideBranches side="left" />
      <SideBranches side="right" />
    </div>
  );
}
