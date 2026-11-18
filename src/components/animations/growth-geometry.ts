/**
 * Generative growth geometry — pure functions, no React, no DOM, no browser APIs.
 *
 * Produces the vine structures behind the landing page: the hero mark and the
 * background field both come from here. Split out from the components for two reasons —
 * the geometry is genuinely shared, and keeping it pure means it runs identically on the
 * server and in the browser.
 *
 * That second point is load-bearing. Every random value comes from a *seeded* PRNG
 * rather than `Math.random()`, so a given seed always produces the same structure.
 * Without that, the server and the client would grow different vines and React would
 * throw a hydration mismatch — which would defeat the whole approach, because the point
 * of generating the SVG this way is that it renders entirely on the server and ships
 * zero client JavaScript.
 *
 * Direct implementation of the "digital-natural symbiosis" direction in VISION.md §3:
 * code-generated plant structures woven into the page rather than pasted in as images.
 */

/** Trims float noise out of path data — shorter SSR payload, no visible difference. */
const round = (n: number) => Math.round(n * 10) / 10;

/**
 * Deterministic PRNG (mulberry32). Small, fast, and far better than good enough for
 * decorative geometry. Hand-rolled rather than installed because the stack is scoped
 * deliberately (VISION.md §5) and a seeded random number is not worth a dependency.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type GrowthBranch = {
  /**
   * SVG path data. Rendered with `pathLength="1"` so a single CSS dash animation can
   * draw any branch regardless of its real length — no measuring, no JS.
   */
  d: string;
  /** Recursion depth; 0 is the trunk. Drives stroke width, opacity, and draw delay. */
  depth: number;
};

export type GrowthTip = { x: number; y: number; depth: number };

export type GrowthStructure = {
  branches: GrowthBranch[];
  tips: GrowthTip[];
};

export type GrowthOptions = {
  seed: number;
  /** Where the trunk starts, in the consuming SVG's viewBox units. */
  origin: [number, number];
  /** Initial heading in radians. `-Math.PI / 2` points straight up. */
  angle: number;
  /** Trunk segment length, in viewBox units. */
  length: number;
  /** How many generations to grow. */
  maxDepth: number;
  /** Half-angle in radians applied either side of the parent heading at a split. */
  spread?: number;
  /** Length multiplier per generation — below 1 so growth tapers. */
  decay?: number;
  /** Probability a node splits in two rather than continuing as one. */
  splitChance?: number;
  /**
   * Hard ceiling on branch count. Splitting is probabilistic, so a generous `maxDepth`
   * could otherwise produce a few thousand paths on an unlucky seed and bloat the DOM.
   */
  maxBranches?: number;
};

/**
 * Grows one vine structure. Breadth-first rather than recursive, so `maxBranches` caps
 * total output evenly across the whole structure instead of cutting one arbitrary
 * sub-tree short while others run to full depth.
 */
export function growStructure({
  seed,
  origin,
  angle,
  length,
  maxDepth,
  spread = 0.5,
  decay = 0.74,
  splitChance = 0.7,
  maxBranches = 160,
}: GrowthOptions): GrowthStructure {
  const rand = mulberry32(seed);
  const branches: GrowthBranch[] = [];
  const tips: GrowthTip[] = [];

  type Node = { x: number; y: number; angle: number; length: number; depth: number };
  const queue: Node[] = [{ x: origin[0], y: origin[1], angle, length, depth: 0 }];

  while (queue.length > 0 && branches.length < maxBranches) {
    const node = queue.shift()!;

    // Wander slightly off the inherited heading so nothing grows in a dead straight line.
    const heading = node.angle + (rand() - 0.5) * 0.4;
    const endX = node.x + Math.cos(heading) * node.length;
    const endY = node.y + Math.sin(heading) * node.length;

    // Control point sits at the segment midpoint, pushed perpendicular to the heading.
    // The push is signed, so consecutive segments curl opposite ways — that alternation
    // is what reads as a vine rather than as a uniform arc.
    const curl = (rand() - 0.5) * node.length * 0.6;
    const midX = (node.x + endX) / 2 + Math.cos(heading + Math.PI / 2) * curl;
    const midY = (node.y + endY) / 2 + Math.sin(heading + Math.PI / 2) * curl;

    branches.push({
      d: `M ${round(node.x)} ${round(node.y)} Q ${round(midX)} ${round(midY)} ${round(endX)} ${round(endY)}`,
      depth: node.depth,
    });

    if (node.depth >= maxDepth) {
      tips.push({ x: round(endX), y: round(endY), depth: node.depth });
      continue;
    }

    const children = rand() < splitChance ? 2 : 1;
    for (let i = 0; i < children; i += 1) {
      // A single child drifts gently; a pair fans out either side by an uneven amount,
      // because a perfectly symmetric split looks manufactured.
      const lean =
        children === 1
          ? (rand() - 0.5) * spread
          : (i === 0 ? -spread : spread) * (0.6 + rand() * 0.8);

      queue.push({
        x: endX,
        y: endY,
        angle: heading + lean,
        length: node.length * decay,
        depth: node.depth + 1,
      });
    }
  }

  // Anything still queued when the ceiling hit is a tip by definition — it never grew.
  for (const node of queue) {
    tips.push({ x: round(node.x), y: round(node.y), depth: node.depth });
  }

  return { branches, tips };
}

export type Spore = {
  x: number;
  y: number;
  r: number;
  /** Seconds, negative — starts the field mid-drift rather than all motes in lockstep. */
  delay: number;
  duration: number;
  /** Drift distance in viewBox units. */
  drift: number;
};

/**
 * Drifting motes scattered through the background field — the "something is in the air"
 * layer. Seeded for the same hydration reason as the vines.
 */
export function growSpores(seed: number, count: number, width: number, height: number): Spore[] {
  const rand = mulberry32(seed);

  return Array.from({ length: count }, () => ({
    x: round(rand() * width),
    y: round(rand() * height),
    r: round(0.8 + rand() * 1.8),
    delay: round(-rand() * 20),
    duration: round(14 + rand() * 16),
    drift: round(8 + rand() * 20),
  }));
}
