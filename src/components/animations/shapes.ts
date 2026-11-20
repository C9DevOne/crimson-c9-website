/**
 * The shape vocabulary: tapered, flowing geometry.
 *
 * Everything here returns SVG path data for a **filled closed curve**, not a stroked line.
 * That distinction is the whole point — these shapes are thick in the middle and sharpen to
 * a point at their tips, and a stroke has one width everywhere. Variable width can only come
 * from describing both sides of the shape and filling between them.
 *
 * All paths are generated around a local origin of (0, 0), so callers position and rotate
 * them with a transform rather than baking coordinates in. That keeps every shape reusable
 * at any size, angle and place on the page.
 *
 * Pure functions, no React and no browser APIs, so they run identically on the server.
 */

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Four-point sparkle with concave sides.
 *
 * `pinch` is what makes it read as a sparkle rather than a diamond: it pulls the curve
 * controls in toward the centre, so the sides bow inward and the points come out needle
 * sharp. At 1 the sides are straight and you get a plain rhombus; the useful range is
 * roughly 0.08–0.25.
 */
export function sparklePath(radius: number, pinch = 0.14): string {
  const c = r1(radius * pinch);
  const r = r1(radius);

  return [
    `M 0 ${-r}`,
    `Q ${c} ${-c} ${r} 0`,
    `Q ${c} ${c} 0 ${r}`,
    `Q ${-c} ${c} ${-r} 0`,
    `Q ${-c} ${-c} 0 ${-r}`,
    "Z",
  ].join(" ");
}

/**
 * A petal — sharp at both tips, widest across the middle. The building block for foliage
 * and for the flower-like clusters in the background.
 */
export function petalPath(length: number, width: number): string {
  const l = r1(length);
  const w = r1(width);
  const shoulder = r1(length * 0.35);

  return [
    `M 0 ${-l}`,
    `C ${w} ${-shoulder} ${w} ${shoulder} 0 ${l}`,
    `C ${-w} ${shoulder} ${-w} ${-shoulder} 0 ${-l}`,
    "Z",
  ].join(" ");
}

/**
 * An S-shaped swash, tapering to a point at both ends and thickest through the middle of
 * the curve — the calligraphic stroke in the ornament set.
 */
export function swashPath(length: number, amplitude: number, thickness: number): string {
  const l = r1(length);
  const a = r1(amplitude);
  const t = r1(thickness);

  return [
    `M ${-l} ${a}`,
    // Upper edge, sweeping across to the far tip.
    `C ${r1(-l * 0.25)} ${r1(a - t * 1.6)} ${r1(l * 0.25)} ${r1(-a - t * 1.6)} ${l} ${-a}`,
    // Lower edge, returning with less offset so the middle carries the weight.
    `C ${r1(l * 0.3)} ${r1(-a + t * 0.6)} ${r1(-l * 0.3)} ${r1(a + t * 0.6)} ${-l} ${a}`,
    "Z",
  ].join(" ");
}

/**
 * A tapered orbital ring. Built as an outer ellipse with an inner ellipse subtracted via
 * `fill-rule: evenodd`; offsetting the inner one makes the band thicker on one side than the
 * other, which is what stops it reading as a plain mechanical outline.
 *
 * The consumer must set `fillRule="evenodd"` on the path for the hole to appear.
 */
export function orbitalRingPath(rx: number, ry: number, thickness: number, skew = 0.45): string {
  const ellipse = (ex: number, ey: number, cx: number, cy: number) =>
    [
      `M ${r1(cx - ex)} ${r1(cy)}`,
      `A ${r1(ex)} ${r1(ey)} 0 1 0 ${r1(cx + ex)} ${r1(cy)}`,
      `A ${r1(ex)} ${r1(ey)} 0 1 0 ${r1(cx - ex)} ${r1(cy)}`,
      "Z",
    ].join(" ");

  return [
    ellipse(rx, ry, 0, 0),
    ellipse(rx - thickness, ry - thickness, 0, -thickness * skew),
  ].join(" ");
}

/**
 * One pagoda roof: a single swooping sweep that sags between the ridge and the eaves, then
 * flicks up to a sharp tip at each end.
 *
 * The control points for the upper edge sit *low* — near the eave line rather than between
 * the two endpoints — which is what produces the concave sag. Pulling them up instead gives
 * a dome, and the roof stops reading as a pagoda entirely.
 *
 * @param halfWidth  Distance from the centre to each eave tip.
 * @param rise       Height of the ridge above the eave line.
 * @param thickness  Depth of the roof at its thickest, in the middle.
 * @param lift       How far the eave tips kick up above the eave line.
 */
export function roofPath(halfWidth: number, rise: number, thickness: number, lift: number): string {
  const hw = r1(halfWidth);
  const sag = r1(-lift - (rise - lift) * 0.08);

  return [
    `M ${-hw} ${r1(-lift)}`,
    `Q ${r1(-halfWidth * 0.52)} ${sag} 0 ${r1(-rise - thickness)}`,
    `Q ${r1(halfWidth * 0.52)} ${sag} ${hw} ${r1(-lift)}`,
    // Underside, returning with a shallower sag so the roof is thickest at the ridge and
    // vanishes to nothing at the tips.
    `Q ${r1(halfWidth * 0.48)} ${r1(sag + thickness * 0.5)} 0 ${r1(-rise)}`,
    `Q ${r1(-halfWidth * 0.48)} ${r1(sag + thickness * 0.5)} ${-hw} ${r1(-lift)}`,
    "Z",
  ].join(" ");
}
