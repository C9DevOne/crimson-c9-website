"use client";

/**
 * The polar lights from the ticket shop, rendered inside the portal card.
 *
 * Ported from `c9-tickets/src/components/sky/Aurora.tsx` (Aaron, 25 Nov: "Polaris, denn es
 * wird kalt"), deliberately unchanged in its maths and colours. That fidelity is the whole
 * point of this file: Aaron asked for the card to feel like *seeing through* into the
 * ticket site rather than like a button with a picture on it, and the only way that reads
 * honestly is if what you see through the glass is the actual sky on the other side.
 *
 * Copied rather than shared, for the same reason the ZeptoMail transport is: the two apps
 * deploy independently and share no package. If the shop's sky changes, change this too —
 * a portal onto a sky that no longer exists is worse than no portal.
 *
 * Curtains of light hang from a wavy lower edge with vertical rays drifting sideways: mint
 * at the edge, dream blue through the middle, violet fading out at the top.
 *
 * Cheap on purpose. It draws onto a 240×120 canvas which CSS then stretches and blurs, so
 * a frame is a few hundred 1px `drawImage` calls rather than a full-size paint. 30fps,
 * paused off-screen and in hidden tabs, and a single still frame under reduced motion.
 */
import { useEffect, useRef } from "react";

const W = 240;
const H = 120;

type Band = {
  /** Lower edge, as a fraction of the height. */
  base: number;
  amp: number;
  /** Curtain height, as a fraction. */
  len: number;
  speed: number;
  phase: number;
  alpha: number;
  stops: [number, string][];
};

const BANDS: Band[] = [
  {
    base: 0.62,
    amp: 0.1,
    len: 0.5,
    speed: 1,
    phase: 0,
    alpha: 1,
    stops: [
      [0, "rgba(140,255,225,0.95)"],
      [0.18, "rgba(110,230,210,0.8)"],
      [0.55, "rgba(130,195,255,0.45)"],
      [1, "rgba(150,110,255,0)"],
    ],
  },
  {
    base: 0.48,
    amp: 0.08,
    len: 0.42,
    speed: 0.7,
    phase: 2.1,
    alpha: 0.8,
    stops: [
      [0, "rgba(130,195,255,0.9)"],
      [0.3, "rgba(120,160,255,0.6)"],
      [1, "rgba(170,120,255,0)"],
    ],
  },
  {
    base: 0.74,
    amp: 0.06,
    len: 0.3,
    speed: 1.3,
    phase: 4.2,
    alpha: 0.6,
    stops: [
      [0, "rgba(190,255,240,0.9)"],
      [0.4, "rgba(130,220,255,0.35)"],
      [1, "rgba(130,195,255,0)"],
    ],
  },
];

/** One vertical gradient strip per band, drawn stretched per column. */
function strip(band: Band) {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 64, 0, 0); // bottom → top
  for (const [offset, colour] of band.stops) gradient.addColorStop(offset, colour);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1, 64);
  return canvas;
}

function draw(ctx: CanvasRenderingContext2D, strips: HTMLCanvasElement[], t: number) {
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = "lighter";

  BANDS.forEach((band, i) => {
    const s = t * band.speed;
    for (let x = 0; x < W; x++) {
      const u = x / W;
      const edge =
        H *
        (band.base +
          band.amp * Math.sin(u * 5.2 + s * 0.13 + band.phase) +
          band.amp * 0.5 * Math.sin(u * 11.7 - s * 0.21 + band.phase * 1.7));
      // Rays: fine vertical structure that drifts, plus a slow breathing of the whole band.
      const rays =
        0.55 +
        0.45 * Math.sin(u * 46 + s * 0.5 + 3 * Math.sin(u * 6.3 + s * 0.17 + band.phase)) ** 2;
      const envelope = Math.sin(Math.PI * u) ** 0.8; // fade towards the sides
      const breathe = 0.75 + 0.25 * Math.sin(s * 0.23 + u * 2.5 + band.phase);
      const len = H * band.len * (0.75 + 0.35 * Math.sin(u * 3.1 + s * 0.09 + band.phase));
      ctx.globalAlpha = Math.min(1, band.alpha * rays * envelope * breathe);
      ctx.drawImage(strips[i], x, edge - len, 1, len + 2);
    }
  });

  ctx.globalAlpha = 1;
}

export function Aurora({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = W;
    canvas.height = H;
    const strips = BANDS.map(strip);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(ctx, strips, 40);
      return;
    }

    let visible = true;
    let raf = 0;
    let last = 0;
    let t = 40; // start mid-motion, not on a symmetric first frame

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30fps is plenty for something this slow
      const dt = last ? Math.min(now - last, 100) / 1000 : 0;
      last = now;
      if (!visible || document.hidden) return;
      t += dt;
      draw(ctx, strips, t);
    };

    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    observer.observe(canvas);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
