'use client';
// The page's motion engine, one hook. Everything it does ends in a class or a
// CSS custom property; CSS does the moving, on transform and opacity only.
//
//  [data-reveal]  gets .is-in once, when it comes into view.
//  [data-play]    gets .is-playing while visible (loops pause off screen).
//  [data-tone]    sets the header's tone while it is under the header.
//  [data-tilt]    tilts toward the pointer on a spring: --rx/--ry, light at --mx/--my,
//                 hover strength --h (0…1). Hover devices only.
//  [data-spot]    a light that follows the pointer at --sx/--sy (hover devices).
//  [data-magnet]  leans toward the pointer (hover devices).
//  [data-moving]  content that moves by itself: hover follows what passes under a still pointer.
//  [data-hover]   gets .is-hover under the pointer: CSS :hover would stick to an element
//                 that has moved away from a still pointer (hover devices).
//
// Nothing follows the scroll position: scenes play once or loop on their own,
// so scrolling never runs page code.
// The pre-paint switch (.mx-motion on <html>) is MOTION_SCRIPT in motionScript.ts.
// With Reduce Motion it is never set: CSS shows every scene in its resting state.
import { useEffect } from 'react';

export function usePageMotion(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    (window as unknown as { __mxReady?: boolean }).__mxReady = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: (() => void)[] = [];

    // Reveal once.
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
    );
    page.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el));
    cleanups.push(() => reveal.disconnect());

    // Play while visible.
    const play = new IntersectionObserver((entries) => {
      for (const entry of entries)
        entry.target.classList.toggle('is-playing', entry.isIntersecting);
    });
    page.querySelectorAll('[data-play]').forEach((el) => play.observe(el));
    cleanups.push(() => play.disconnect());

    // The header's tone: whichever chapter is under it.
    const tones = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            page.dataset.tone = (entry.target as HTMLElement).dataset.tone || 'light';
      },
      { rootMargin: '-34px 0px -94% 0px' },
    );
    page.querySelectorAll('[data-tone]').forEach((el) => tones.observe(el));
    cleanups.push(() => tones.disconnect());

    // Pointer: tilt, light and magnet, only where there is a real hover pointer.
    // Tilt runs on a spring (every frame eases toward the pointer), so cards
    // glide instead of stepping; only the elements still moving are written.
    // Scrolling, or a row that moves by itself (data-moving), slides content
    // under a still pointer without any pointer event: then the same handling
    // runs again from the last pointer position (one hit test per frame).
    if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      type Tilt = {
        el: HTMLElement;
        tx: number;
        ty: number;
        tm: [number, number];
        th: number;
        x: number;
        y: number;
        m: [number, number];
        h: number;
      };
      const tilts = new Map<HTMLElement, Tilt>();
      const moving = new Set<Tilt>();
      let active: Tilt | null = null;
      let magnet: HTMLElement | null = null;
      let spot: HTMLElement | null = null;
      let hovered: HTMLElement | null = null;
      let px = 0;
      let py = 0;
      let inside = false;
      let frame = 0;
      let resyncFrame = 0;
      let followFrame = 0;
      const ease = (from: number, to: number, k: number) => from + (to - from) * k;
      const step = () => {
        frame = 0;
        for (const t of moving) {
          t.x = ease(t.x, t.tx, 0.14);
          t.y = ease(t.y, t.ty, 0.14);
          t.m = [ease(t.m[0], t.tm[0], 0.18), ease(t.m[1], t.tm[1], 0.18)];
          t.h = ease(t.h, t.th, 0.14);
          const settled =
            Math.abs(t.x - t.tx) < 0.05 &&
            Math.abs(t.y - t.ty) < 0.05 &&
            Math.abs(t.h - t.th) < 0.01;
          if (settled) {
            // Land exactly on the target instead of creeping toward it.
            t.x = t.tx;
            t.y = t.ty;
            t.h = t.th;
          }
          const st = t.el.style;
          st.setProperty('--rx', `${t.x.toFixed(2)}deg`);
          st.setProperty('--ry', `${t.y.toFixed(2)}deg`);
          st.setProperty('--mx', `${t.m[0].toFixed(1)}%`);
          st.setProperty('--my', `${t.m[1].toFixed(1)}%`);
          st.setProperty('--h', t.h.toFixed(3));
          if (settled && t.th === 0) {
            moving.delete(t);
            t.el.classList.remove('is-tilting');
          }
        }
        if (moving.size) frame = requestAnimationFrame(step);
      };
      const kick = () => {
        if (!frame) frame = requestAnimationFrame(step);
      };
      const release = (t: Tilt) => {
        t.tx = t.ty = 0;
        t.tm = [50, 50];
        t.th = 0;
        moving.add(t);
      };
      const handle = (el: Element | null) => {
        const tiltEl = el?.closest<HTMLElement>('[data-tilt]') ?? null;
        if (active && active.el !== tiltEl) {
          release(active);
          active = null;
        }
        if (tiltEl) {
          let t = tilts.get(tiltEl);
          if (!t) {
            t = { el: tiltEl, tx: 0, ty: 0, tm: [50, 50], th: 0, x: 0, y: 0, m: [50, 50], h: 0 };
            tilts.set(tiltEl, t);
          }
          const r = tiltEl.getBoundingClientRect();
          const x = Math.min(1, Math.max(0, (px - r.left) / r.width));
          const y = Math.min(1, Math.max(0, (py - r.top) / r.height));
          const strength = Number(tiltEl.dataset.tilt || 14);
          t.tx = (0.5 - y) * strength;
          t.ty = (x - 0.5) * strength;
          t.tm = [x * 100, y * 100];
          t.th = 1;
          tiltEl.classList.add('is-tilting');
          active = t;
          moving.add(t);
        }
        const spotEl = el?.closest<HTMLElement>('[data-spot]') ?? null;
        if (spot && spot !== spotEl) spot.classList.remove('is-spot');
        spot = spotEl;
        if (spotEl) {
          const r = spotEl.getBoundingClientRect();
          spotEl.classList.add('is-spot');
          spotEl.style.setProperty('--sx', `${(px - r.left).toFixed(0)}px`);
          spotEl.style.setProperty('--sy', `${(py - r.top).toFixed(0)}px`);
        }
        const hoverEl = el?.closest<HTMLElement>('[data-hover]') ?? null;
        if (hovered && hovered !== hoverEl) hovered.classList.remove('is-hover');
        hovered = hoverEl;
        hoverEl?.classList.add('is-hover');
        const pull = el?.closest<HTMLElement>('[data-magnet]') ?? null;
        if (magnet && magnet !== pull) {
          magnet.classList.remove('is-pulled');
          magnet.style.removeProperty('--tx');
          magnet.style.removeProperty('--ty');
        }
        magnet = pull;
        if (pull) {
          const r = pull.getBoundingClientRect();
          pull.classList.add('is-pulled');
          pull.style.setProperty('--tx', `${((px - r.left - r.width / 2) * 0.2).toFixed(1)}px`);
          pull.style.setProperty('--ty', `${((py - r.top - r.height / 2) * 0.28).toFixed(1)}px`);
        }
        kick();
        if (el?.closest('[data-moving]') && !followFrame)
          followFrame = requestAnimationFrame(follow);
      };
      // While the pointer rests on a moving row, look again every frame.
      const follow = () => {
        followFrame = 0;
        if (inside) handle(document.elementFromPoint(px, py));
      };
      const resync = () => {
        resyncFrame = 0;
        if (inside) handle(document.elementFromPoint(px, py));
      };
      const onScroll = () => {
        if (inside && !resyncFrame) resyncFrame = requestAnimationFrame(resync);
      };
      const move = (e: PointerEvent) => {
        px = e.clientX;
        py = e.clientY;
        inside = true;
        handle(e.target as Element);
      };
      const leave = () => {
        inside = false;
        handle(null);
      };
      page.addEventListener('pointermove', move, { passive: true });
      page.addEventListener('pointerleave', leave);
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => {
        page.removeEventListener('pointermove', move);
        page.removeEventListener('pointerleave', leave);
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(frame);
        cancelAnimationFrame(resyncFrame);
        cancelAnimationFrame(followFrame);
      });
    }
    return () => cleanups.forEach((c) => c());
  }, [root]);
}

/** Counts from `from` to `to` once `element` is in view (or shows `to` at once with Reduce Motion). */
export function countUp(element: HTMLElement, from: number, to: number, locale: string, ms = 1400) {
  const format = (n: number) => n.toLocaleString(locale);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = format(to);
    return () => {};
  }
  let frame = 0;
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / ms);
        const eased = 1 - Math.pow(1 - t, 3);
        element.textContent = format(Math.round(from + (to - from) * eased));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    },
    { threshold: 0.6 },
  );
  observer.observe(element);
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
  };
}
