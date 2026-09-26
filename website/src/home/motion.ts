'use client';
// Shared motion rules for the home page: one easing family, reduced motion
// respected everywhere, pinned scroll scenes only on wide screens.
import { useEffect, useState } from 'react';

export const EASE = 'power3.out';
export const EASE_IN_OUT = 'power2.inOut';

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Wide screens pin scenes to the scroll; phones play them once in view. */
export const WIDE = '(min-width: 900px)';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** Calls `onEnter` once when the element is well inside the viewport. */
export function onceInView(element: Element, onEnter: () => void, threshold = 0.35) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        onEnter();
      }
    },
    { threshold },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
