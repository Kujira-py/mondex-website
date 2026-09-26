'use client';
// Tiles marked data-depth come apart into layers under the pointer: the
// surface leans a few degrees toward it, headline, text and picture rise
// to different heights, and the rim catches a lilac light where the pointer
// is. CSS owns the motion (home.css, "Depth"); this only writes --rx, --ry,
// --px and --py. Mouse and trackpad only, never under reduced motion.
import { prefersReducedMotion } from './motion';

const MAX = 4;

export function attachDepth(root: HTMLElement) {
  if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  let active: HTMLElement | null = null;
  let last: PointerEvent | null = null;
  let frame = 0;

  const paint = () => {
    frame = 0;
    if (!active || !last) return;
    const box = active.getBoundingClientRect();
    const x = Math.min(Math.max((last.clientX - box.left) / box.width, 0), 1);
    const y = Math.min(Math.max((last.clientY - box.top) / box.height, 0), 1);
    active.style.setProperty('--ry', `${((x - 0.5) * 2 * MAX).toFixed(2)}deg`);
    active.style.setProperty('--rx', `${((0.5 - y) * 2 * MAX).toFixed(2)}deg`);
    active.style.setProperty('--px', `${(x * 100).toFixed(1)}%`);
    active.style.setProperty('--py', `${(y * 100).toFixed(1)}%`);
  };
  const release = (el: HTMLElement) => {
    el.classList.remove('is-deep');
    el.style.removeProperty('--rx');
    el.style.removeProperty('--ry');
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const el = (event.target as Element).closest<HTMLElement>('[data-depth]');
    if (el !== active) {
      if (active) release(active);
      active = el;
      active?.classList.add('is-deep');
    }
    last = event;
    if (active && !frame) frame = requestAnimationFrame(paint);
  };
  const leave = () => {
    if (active) release(active);
    active = null;
  };
  root.addEventListener('pointermove', move, { passive: true });
  root.addEventListener('pointerleave', leave);
  return () => {
    cancelAnimationFrame(frame);
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
  };
}
