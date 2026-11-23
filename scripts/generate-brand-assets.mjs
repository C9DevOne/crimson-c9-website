// Generates the favicon and the Open Graph image from assets already in the repo, so both
// stay in step with the brand without a design round-trip. Run again if the logo changes.
import sharp from "sharp";

const BACKGROUND = { r: 5, g: 5, b: 5, alpha: 1 }; // --background, #050505

// ── Favicon ────────────────────────────────────────────────────────────────────────
// NOTE: this replaced an existing `src/app/icon.png` — the black dragon silhouette on
// transparency, committed in c42808a. That one disappears entirely in a dark browser tab
// strip, which is where most people will see it. This version puts the crimson mark on
// the page background so it reads in both. The original is recoverable with
// `git show c42808a:src/app/icon.png`.
// The logo is a tall 1629×2000 mark on transparency. Padding it into a square and
// brightening it the way the page does keeps it legible as a 16px browser-tab icon —
// dropped in raw it reads as a dark smudge on a dark tab strip.
const ICON = 512;
const logo = await sharp("public/crimson-logo.webp")
  .resize({ height: Math.round(ICON * 0.78), fit: "inside" })
  .modulate({ brightness: 1.9, saturation: 1.15 })
  .toBuffer();

await sharp({ create: { width: ICON, height: ICON, channels: 4, background: BACKGROUND } })
  .composite([{ input: logo, gravity: "center" }])
  .png()
  .toFile("src/app/icon.png");

// Apple touch icon, 180×180 (CRI-5). iOS ignores `icon.png` and will screenshot the page
// instead if this is missing, which looks like a bug rather than a brand.
const appleLogo = await sharp("public/crimson-logo.webp")
  .resize({ height: Math.round(180 * 0.74), fit: "inside" })
  .modulate({ brightness: 1.9, saturation: 1.15 })
  .toBuffer();

await sharp({ create: { width: 180, height: 180, channels: 4, background: BACKGROUND } })
  .composite([{ input: appleLogo, gravity: "center" }])
  .png()
  .toFile("src/app/apple-icon.png");

// ── Open Graph image ───────────────────────────────────────────────────────────────
// Lives in `src/app/(frontend)/`, not `src/app/`. This project has no `app/layout.tsx` —
// each route group carries its own — so a metadata file at the app root has no segment to
// attach to and Next emits no `og:image` at all. The icon survives there because icons are
// resolved globally; the OG image is not.
//
// 1200×630 is the size every platform crops from. The event photo with the page's own
// scrim over it, and the mark centred — no text: the title and description come from the
// metadata, and burning them into the image means they can never be changed without
// regenerating it.
const OG_W = 1200;
const OG_H = 630;

const photo = await sharp("public/event-garden.webp")
  .resize(OG_W, OG_H, { fit: "cover", position: "attention" })
  .toBuffer();

const scrim = Buffer.from(
  `<svg width="${OG_W}" height="${OG_H}">
     <defs>
       <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0%" stop-color="#050505" stop-opacity="0.88"/>
         <stop offset="45%" stop-color="#050505" stop-opacity="0.72"/>
         <stop offset="100%" stop-color="#050505" stop-opacity="0.94"/>
       </linearGradient>
     </defs>
     <rect width="${OG_W}" height="${OG_H}" fill="url(#g)"/>
   </svg>`,
);

const ogLogo = await sharp("public/crimson-logo.webp")
  .resize({ height: 300, fit: "inside" })
  .modulate({ brightness: 1.9, saturation: 1.15 })
  .toBuffer();

await sharp(photo)
  .composite([
    { input: scrim, blend: "over" },
    { input: ogLogo, gravity: "center" },
  ])
  // JPEG, not PNG: the same image as a PNG came out at 1.2 MB, and chat apps quietly skip
  // previews over roughly a megabyte. There is no transparency to preserve here.
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("src/app/(frontend)/opengraph-image.jpg");

for (const f of [
  "src/app/icon.png",
  "src/app/apple-icon.png",
  "src/app/(frontend)/opengraph-image.jpg",
]) {
  const m = await sharp(f).metadata();
  console.log(f, `${m.width}x${m.height}`, `${(m.size / 1024).toFixed(0)} KB`);
}
