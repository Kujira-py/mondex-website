/** Leave the opening fan untouched, then reveal the mark once beside the cards. */
export function sharedStageAmount(progress: number) {
  const t = Math.min(1, Math.max(0, (progress - 0.12) / 0.88));
  return t * t * t * (t * (t * 6 - 15) + 10);
}
