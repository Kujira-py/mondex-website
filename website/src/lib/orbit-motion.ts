import { lerp, type CardPose } from './card-motion';
import { ensembleMotion } from './ensemble-motion';

const smooth = (t: number) => {
  const n = Math.min(1, Math.max(0, t));
  return n * n * n * (n * (n * 6 - 15) + 10);
};

/** Follow the fan → scan → grid → stack, keeping the mark beside the active cards. */
export function orbitPose(progress: number, mobile: boolean, seconds = 0): CardPose {
  const opening: CardPose = {
    x: mobile ? 1.8 : 4.3,
    y: mobile ? -2 : -1.7,
    z: -3.5,
    rx: 0.26,
    ry: -0.55,
    rz: -0.24,
    s: mobile ? 0.038 : 0.052,
  };
  const scan: CardPose = {
    x: mobile ? -2 : 5.1,
    y: mobile ? -0.56 : 0.45,
    z: -3.5,
    rx: 0.12,
    ry: -0.32,
    rz: -0.17,
    s: mobile ? 0.0125 : 0.018,
  };
  const collect: CardPose = {
    ...scan,
    x: mobile ? -1.86 : 5.3,
    y: mobile ? -0.45 : 2.95,
    rx: -0.08,
    ry: 0.12,
    rz: 0.24,
  };
  const understand: CardPose = {
    ...scan,
    x: mobile ? -1.62 : 3.7,
    y: mobile ? -0.46 : 0.95,
    rx: 0.2,
    ry: -0.3,
    rz: -0.12,
  };
  const breath = ensembleMotion(progress, seconds);
  const a = progress <= 1.18 ? opening : progress <= 2 ? scan : collect;
  const b = progress <= 1.18 ? scan : progress <= 2 ? collect : understand;
  const blend =
    progress <= 1.18
      ? breath.amount
      : smooth(progress <= 2 ? (progress - 1.18) / 0.82 : progress - 2);
  const pose = Object.fromEntries(
    Object.keys(a).map((key) => [
      key,
      lerp(a[key as keyof CardPose], b[key as keyof CardPose], blend),
    ]),
  ) as CardPose;

  // A small curved path, with the cards quietly answering the same rhythm.
  // Rotation exposes the existing thick, bright bevel without a full attention-grabbing spin.
  pose.x += breath.sway * (mobile ? 0.14 : 0.2);
  pose.y += breath.lift * (mobile ? 0.14 : 0.19);
  pose.rx += breath.lift * 0.12;
  pose.ry += breath.sway * 0.34;
  pose.rz += breath.sway * 0.2;
  // The opening mark stays behind the fan and gently rises with the same air current.
  pose.y += breath.float * (mobile ? 0.11 : 0.13);
  pose.rx += breath.float * 0.025;
  pose.rz += breath.float * 0.014;
  return pose;
}
