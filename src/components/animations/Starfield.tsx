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
      </svg>

      {/* Two washes over the stars, both extremely faint. The vignette stops the field
          reaching the corners, which is what keeps it feeling like a sky rather than
          wallpaper; the crimson is the only colour on the page that is not type. */}
      <div className="starfield-vignette absolute inset-0" />
      <div className="starfield-ember absolute inset-0" />
    </div>
  );
}
