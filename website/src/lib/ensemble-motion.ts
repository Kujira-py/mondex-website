import { sharedStageAmount } from './shared-stage';

/** One slow breath shared by the cards and the mark. No idle motion in the opening. */
export function ensembleMotion(progress: number, seconds: number) {
  const amount = sharedStageAmount(progress);
  const phase = (seconds * Math.PI * 2) / 10;
  return {
    amount,
    phase,
    sway: amount * Math.sin(phase),
    lift: amount * Math.sin(phase * 2),
  };
}
