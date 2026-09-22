import { sharedStageAmount } from './shared-stage';
/** Shared, camera-independent card choreography. Units are Three world units. */
export type CardPose = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
};
export const CARD_WIDTH = 2.355;
export const CARD_HEIGHT = 3.29;
export const CARD_DEPTH = 0.06;
export const CARD_GAP = 0.12;
// This order never swaps, including on hover or interrupted/reversed scrolls.
export const DEPTH_ORDER = [0, 4, 1, 3, 2] as const;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export function cardPose(index: number, chapter: number, mobile: boolean): CardPose {
  const i = index - 2;
  if (chapter === 0)
    return {
      x: i * (mobile ? 1.17 : 1.87),
      y: (mobile ? -1.8 : -1.55) - Math.abs(i) * 0.29,
      z: -Math.abs(i) * 0.48,
      rx: 0.025,
      ry: i * -0.07,
      rz: i * -0.135,
      s: mobile ? 0.72 : 0.9,
    };
  if (chapter === 1)
    return index === 2
      ? {
          x: mobile ? 0 : 2.45,
          y: mobile ? -2.02 : -0.12,
          z: 0.65,
          rx: 0,
          ry: -0.07,
          rz: 0.025,
          s: mobile ? 0.83 : 1.22,
        }
      : {
          x: (mobile ? 0 : 2.45) + i * 0.52,
          y: (mobile ? -2.02 : -0.22) - Math.abs(i) * 0.14,
          z: -1.15,
          rx: 0.025,
          ry: i * 0.035,
          rz: i * -0.105,
          s: 0.76,
        };
  if (chapter === 2)
    return {
      x: (mobile ? 0 : 2.7) + ((index % 3) - 1) * (mobile ? 1.12 : 1.55),
      y: (mobile ? -1.48 : 0.75) - Math.floor(index / 3) * (mobile ? 1.65 : 2.1),
      z: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      s: mobile ? 0.43 : 0.55,
    };
  return {
    x: (mobile ? -0.9 : 1.45) + i * 0.13,
    y: (mobile ? -2.04 : -0.4) - Math.abs(i) * 0.07,
    z: 0,
    rx: 0,
    ry: -0.07,
    rz: i * -0.025,
    s: mobile ? 0.5 : 0.85,
  };
}
export function sampleCard(index: number, progress: number, mobile: boolean): CardPose {
  // 1 → 1.18 is the scanning hold, not the start of the collection morph.
  const p =
    progress <= 1
      ? progress
      : progress < 1.18
        ? 1
        : progress < 2
          ? 1 + (progress - 1.18) / 0.82
          : Math.min(3, progress);
  const floor = Math.min(2, Math.floor(p));
  const a = cardPose(index, floor, mobile),
    b = cardPose(index, floor + 1, mobile);
  const pose = Object.fromEntries(
    Object.keys(a).map((k) => [k, lerp(a[k as keyof CardPose], b[k as keyof CardPose], p - floor)]),
  ) as CardPose;
  const space = sharedStageAmount(progress);
  // Keep the original fan → scanner → grid → stack. Only position the composition.
  // On small screens the final stack returns left to make room for its collection count.
  const compact = mobile ? 1 - Math.min(1, Math.max(0, progress - 2)) : 1;
  const scale = lerp(1, mobile ? 1 - 0.2 * compact : 0.93, space);
  pose.x = pose.x * scale + space * (mobile ? 0.62 * compact : -0.9);
  pose.y -= mobile ? 0 : 0.25 * space;
  pose.s *= scale;
  return pose;
}
/** Exact half-extent along world Z of the rotated physical card (Euler XYZ). */
export function depthExtent(p: CardPose) {
  const a = Math.cos(p.rx),
    b = Math.sin(p.rx),
    c = Math.cos(p.ry),
    d = Math.sin(p.ry),
    e = Math.cos(p.rz),
    f = Math.sin(p.rz);
  return (
    p.s *
    ((Math.abs(b * f - a * e * d) * CARD_WIDTH) / 2 +
      (Math.abs(b * e + a * d * f) * CARD_HEIGHT) / 2 +
      (Math.abs(a * c) * CARD_DEPTH) / 2)
  );
}
/** Separate complete card volumes, not just their centre points. Run AFTER interpolation. */
export function separateCards(poses: CardPose[]): CardPose[] {
  const safe = poses.map((p) => ({ ...p }));
  for (let n = DEPTH_ORDER.length - 2; n >= 0; n--) {
    const back = safe[DEPTH_ORDER[n]],
      front = safe[DEPTH_ORDER[n + 1]];
    back.z = Math.min(back.z, front.z - depthExtent(front) - depthExtent(back) - CARD_GAP);
  }
  return safe;
}
export function initialCards(mobile: boolean) {
  return separateCards(Array.from({ length: 5 }, (_, i) => cardPose(i, 0, mobile)));
}

// Same world-to-camera transform as Canvas: fov 40°, camera z 12.8.
// CSS uses a downwards Y axis, hence the sign conversion in the matrix below.
export function posterTransform(p: CardPose) {
  const a = Math.cos(p.rx),
    b = Math.sin(p.rx),
    c = Math.cos(p.ry),
    d = Math.sin(p.ry),
    e = Math.cos(p.rz),
    f = Math.sin(p.rz);
  const matrix = [
    c * e,
    -(a * f + b * e * d),
    b * f - a * e * d,
    0,
    c * f,
    a * e - b * f * d,
    -(b * e + a * f * d),
    0,
    d,
    b * c,
    a * c,
    0,
    0,
    0,
    0,
    1,
  ];
  return `translate(-50%, -50%) translate3d(calc(${p.x} * var(--world-unit)), calc(${-p.y} * var(--world-unit)), calc(${p.z} * var(--world-unit))) matrix3d(${matrix.join(',')}) scale(${p.s})`;
}
