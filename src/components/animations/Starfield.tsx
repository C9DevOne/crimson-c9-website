/**
 * The background: a field of very small stars on near-black.
 *
 * Replaces GrowthField's vines and PagodaScene (CRI-22). Built the same way GrowthField
 * was, and for the same reason: server-rendered SVG animated purely in CSS, so the
 * background costs no client JavaScript and no canvas paint loop on a page whose whole
 * point is to feel calm.
 *
 * The positions come from a seeded generator rather than `Math.random()`. That is not
 * fussiness — an unseeded field would differ between the server render and the client
 * hydration, and React would log a mismatch for every star. A fixed seed also means the
 * sky is the same sky on every deploy, so it can be art-directed rather than rerolled.
 */

/**
 * mulberry32 — small, fast, and good enough for scattering dots. Deterministic for a given
 * seed, which is the only property that matters here.
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = { cx: number; cy: number; r: number; opacity: number; twinkle: boolean; delay: number };

/**
 * One depth plane. Fewer, larger, brighter stars in front; many tiny dim ones behind.
 *
 * `drift` is the duration of that layer's horizontal travel — slower for the distant
 * layers, which is the whole parallax effect. There is no scroll listener: the layers move
 * continuously and very slowly, so the sky reads as deep rather than as a flat texture
 * without anything having to recompute on scroll.
 */
type Layer = {
  count: number;
  radius: [number, number];
  opacity: [number, number];
  drift: number;
  twinkleRate: number;
};

const LAYERS: Layer[] = [
  { count: 190, radius: [0.35, 0.75], opacity: [0.18, 0.42], drift: 420, twinkleRate: 0.08 },
  { count: 90, radius: [0.55, 1.0], opacity: [0.3, 0.6], drift: 260, twinkleRate: 0.16 },
  { count: 34, radius: [0.8, 1.45], opacity: [0.45, 0.85], drift: 170, twinkleRate: 0.3 },
];

/** The field is generated once at module load, not per render. */
const FIELD: Star[][] = LAYERS.map((layer, layerIndex) => {
  const random = seededRandom(0xc9 + layerIndex * 977);
  return Array.from({ length: layer.count }, () => {
    const [minRadius, maxRadius] = layer.radius;
    const [minOpacity, maxOpacity] = layer.opacity;
    return {
      cx: Math.round(random() * 1000 * 100) / 100,
      cy: Math.round(random() * 1000 * 100) / 100,
      r: Math.round((minRadius + random() * (maxRadius - minRadius)) * 100) / 100,
      opacity: Math.round((minOpacity + random() * (maxOpacity - minOpacity)) * 100) / 100,
      twinkle: random() < layer.twinkleRate,
      // Spread over a long cycle so no two stars pulse together — a synchronised sky
      // reads as a blinking error rather than as depth.
      delay: Math.round(random() * 9000) / 1000,
    };
  });
});

/**
 * Constellation lines: a travelling point of light that runs from one star to the next and
 * leaves a short trail behind it, then stops for a long time.
 *
 * Built as a dashed stroke whose offset animates, which is one composited property on one
 * element — far cheaper than animating a dot's position, and it gives the trail for free.
 * Pairs are chosen from the front layer only, where the stars are bright enough for the
 * line to look like it connects something.
 */
type Link = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  delay: number;
  duration: number;
};

const LINKS: Link[] = (() => {
  const random = seededRandom(0x1c9);
  const front = FIELD[2];
  const links: Link[] = [];

  for (let i = 0; i < 7; i += 1) {
    const a = front[Math.floor(random() * front.length)];
    // Pick the nearest star within a sensible range rather than any star: a line across
    // the whole sky reads as a scratch on the screen, not as a connection.
    let best: (typeof front)[number] | null = null;
    let bestDistance = Infinity;
    for (const candidate of front) {
      if (candidate === a) continue;
      const distance = Math.hypot(candidate.cx - a.cx, candidate.cy - a.cy);
      if (distance > 90 && distance < 260 && distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }
    if (!best) continue;

    links.push({
      x1: a.cx,
      y1: a.cy,
      x2: best.cx,
      y2: best.cy,
      length: Math.round(bestDistance * 10) / 10,
      // Spread over minutes. Each line fires for about two seconds in a cycle of its own
      // length, so at any moment most of the sky is doing nothing at all — which is what
      // makes the one that is firing worth noticing.
      delay: Math.round(random() * 90 * 10) / 10,
      duration: Math.round((42 + random() * 60) * 10) / 10,
    });
  }
  return links;
})();

/** Meteors: a short streak crossing a corner of the sky, rarely. */
type Meteor = {
  x: number;
  y: number;
  angle: number;
  length: number;
  delay: number;
  duration: number;
};

const METEORS: Meteor[] = (() => {
  const random = seededRandom(0x5e7);
  return Array.from({ length: 3 }, () => ({
    x: Math.round(random() * 700 * 10) / 10,
    y: Math.round(random() * 420 * 10) / 10,
    // Shallow downward angles only. A near-vertical streak reads as a falling object
    // rather than as something entering the atmosphere at a distance.
    angle: Math.round((18 + random() * 22) * 10) / 10,
    length: Math.round((90 + random() * 70) * 10) / 10,
    delay: Math.round(random() * 70 * 10) / 10,
    duration: Math.round((55 + random() * 50) * 10) / 10,
  }));
})();

export function Starfield({ className }: { className?: string }) {
  return (
    <div
      className={`starfield pointer-events-none fixed inset-0 -z-10 ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 1000"
        // `slice` rather than `meet`: the field should always cover the viewport, and
        // cropping a random scatter is invisible where letterboxing would not be.
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          {/* Only the front layer is bloomed. Blurring 300 dots would cost more than the
              whole rest of the page; blurring 34 of them is what makes the sky read as
              lit rather than as dust. */}
          <filter id="star-bloom" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="1.1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* A meteor is bright at its head and gone at its tail. A flat stroke with a
              fading opacity animation reads as a scratch; the gradient is what makes it
              read as something moving. */}
          <linearGradient id="meteor-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0" />
            <stop offset="72%" stopColor="var(--foreground)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
        </defs>
        {FIELD.map((stars, layerIndex) => (
          <g
            key={layerIndex}
            className="star-layer"
            style={{ ["--drift-duration" as string]: `${LAYERS[layerIndex].drift}s` }}
          >
            {stars.map((star, starIndex) => (
              <circle
                key={starIndex}
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill="var(--foreground)"
                filter={layerIndex === 2 ? "url(#star-bloom)" : undefined}
                opacity={star.opacity}
                className={star.twinkle ? "star-twinkle" : undefined}
                style={
                  star.twinkle
                    ? ({ ["--twinkle-delay" as string]: `${star.delay}s` } as React.CSSProperties)
                    : undefined
                }
              />
            ))}
          </g>
        ))}

        {/* Constellations. Drawn after the stars so the travelling point passes over them. */}
        <g className="star-links">
          {LINKS.map((link, i) => (
            <line
              key={i}
              x1={link.x1}
              y1={link.y1}
              x2={link.x2}
              y2={link.y2}
              className="star-link"
              style={
                {
                  // The dash is the moving point plus its trail; the gap is the rest of
                  // the line, so exactly one point is ever lit.
                  strokeDasharray: `14 ${link.length}`,
                  ["--link-length" as string]: `${link.length + 14}`,
                  ["--link-delay" as string]: `${link.delay}s`,
                  ["--link-duration" as string]: `${link.duration}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>

        {/* Meteors. */}
        <g className="star-meteors">
          {METEORS.map((meteor, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={meteor.length}
              y2="0"
              className="star-meteor"
              transform={`translate(${meteor.x} ${meteor.y}) rotate(${meteor.angle})`}
              style={
                {
                  ["--meteor-delay" as string]: `${meteor.delay}s`,
                  ["--meteor-duration" as string]: `${meteor.duration}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
      </svg>

      {/* Two washes over the stars, both extremely faint. The vignette stops the field
          reaching the corners, which is what keeps it feeling like a sky rather than
          wallpaper; the crimson is the only colour on the page that is not type. */}
      <div className="starfield-vignette absolute inset-0" />
      <div className="starfield-ember absolute inset-0" />
    </div>
  );
}
