/** A book keeps both turned leaves. It returns them before closing; resets happen under the lid. */
export const BINDER_DURATION = 35;
export const PAGE_W = 2.42;
export const PAGE_H = 3.36;
export const smooth = (a: number, b: number, t: number) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * x * (x * (x * 6 - 15) + 10);
};
export function binderState(t: number) {
  return {
    open: smooth(0.7, 3.7, t) * (1 - smooth(30.2, 33.5, t)),
    leaves: [
      {
        flip: smooth(8.2, 11.8, t) * (1 - smooth(26.1, 29.7, t)),
        fill: smooth(4.3, 6.9, t),
        alpha: smooth(4, 4.8, t),
        right: 0.115,
        left: 0.075,
      },
      {
        flip: smooth(16.7, 20.3, t) * (1 - smooth(22.1, 25.7, t)),
        fill: smooth(12.8, 15.4, t),
        alpha: smooth(12.5, 13.3, t),
        right: 0.075,
        left: 0.115,
      },
    ],
  };
}
/** Every point follows an elevated arc; the leaf never dives through the supporting stack. */
export function leafPoint(u: number, flip: number, right: number, left: number) {
  const theta = Math.PI * flip;
  const lift = Math.sin(theta);
  return {
    x: u * PAGE_W * Math.cos(theta),
    z:
      right +
      (left - right) * smooth(0, 1, flip) +
      u * PAGE_W * lift +
      Math.sin(Math.PI * u) * lift * 0.16,
  };
}
