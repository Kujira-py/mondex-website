/** Relative scroll weights. Continuous transitions get room; settled scenes need little scroll. */
export const storyBeats = [
  { progress: 0, duration: 0.18, ease: 'none' },
  { progress: 1, duration: 2.1, ease: 'power1.inOut' },
  { progress: 1.18, duration: 0.55, ease: 'none' },
  { progress: 2, duration: 1.75, ease: 'power1.inOut' },
  { progress: 2, duration: 0.18, ease: 'none' },
  { progress: 3, duration: 1.75, ease: 'power1.inOut' },
  { progress: 3, duration: 0.28, ease: 'none' },
] as const;
export const storyDuration = storyBeats.reduce((total, beat) => total + beat.duration, 0);
export const chapterTransitions = [0.3, 2.93, 4.86] as const;
// Native chapter links land on the settled compositions, including after a resize.
export const chapterStops = [2.5, 4.67, 6.65] as const;
