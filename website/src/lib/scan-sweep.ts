import { gsap } from 'gsap';

/** Reset while invisible, then reveal at the top. Shared by both scanner views. */
export function addScanSweep(timeline: gsap.core.Timeline, beam: Element, at: number) {
  timeline
    .set(beam, { top: '2%', autoAlpha: 0 }, at)
    .to(beam, { autoAlpha: 1, duration: 0.45, ease: 'sine.out' }, at + 0.1)
    .to(beam, { top: '98%', duration: 2.6, ease: 'sine.inOut' }, at + 0.3)
    .to(beam, { autoAlpha: 0, duration: 0.55, ease: 'sine.in' }, at + 2.9);
  return timeline;
}
