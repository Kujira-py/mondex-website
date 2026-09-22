import { sharedStageAmount } from './shared-stage';

/** One slow rhythm shared by the cards and the mark, including the opening fan. */
export function ensembleMotion(progress: number, seconds: number) {
  const amount = sharedStageAmount(progress);
  const phase = (seconds * Math.PI * 2) / 10;
  // Ease in from the exact poster pose, then blend into the existing chapter motion.
  const opening = (1 - amount) * (1 - Math.exp(-seconds * 1.2));
  return {
    amount,
    phase,
    sway: amount * Math.sin(phase),
    lift: amount * Math.sin(phase * 2),
    float: opening * Math.sin(phase),
  };
}
