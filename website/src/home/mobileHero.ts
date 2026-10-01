import gsap from 'gsap';
import { EASE_IN_OUT } from './motion';

/** Guide only the first downward gesture; subsequent scrolling stays native. */
export function attachMobileHero(element: HTMLElement, play: () => void, replay: boolean) {
  const header = document.querySelector<HTMLElement>('.mx-header');
  const stage = element.querySelector<HTMLElement>('.hp-stage')!;
  const headerBottom = () => header?.getBoundingClientRect().bottom ?? 72;
  const destination = () => window.scrollY + element.getBoundingClientRect().top - headerBottom();
  let available = !replay && window.scrollY < 24 && !window.location.hash;
  let played = false;
  let touch: { x: number; y: number } | null = null;
  let captured = false;
  let tween: gsap.core.Tween | undefined;
  let frame = 0;
  let lastWheel = 0;

  const isControl = (target: EventTarget | null) => target instanceof Element &&
    !!target.closest('a, button, input, textarea, select, [contenteditable], .mx-header');
  const isEditing = () => document.activeElement?.matches('input, textarea, select, [contenteditable]');
  const canGuide = (target: EventTarget | null) => available && window.scrollY < 24 &&
    !isControl(target) && !isEditing() &&
    !header?.classList.contains('is-open') && (window.visualViewport?.scale ?? 1) === 1;

  const startPlayback = () => {
    if (played) return;
    played = true;
    if (!captured) releaseGestures();
    play();
  };
  const checkVisibility = () => {
    frame = 0;
    if (played || tween || window.scrollY <= 0) return;
    const box = stage.getBoundingClientRect();
    const viewport = window.visualViewport;
    const bottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
    if (box.top >= headerBottom() && box.bottom <= bottom) startPlayback();
  };
  const onScroll = () => {
    if (played) return;
    if (available && window.scrollY >= 24 && !tween) {
      available = false;
      releaseGestures();
    }
    if (!frame) frame = requestAnimationFrame(checkVisibility);
  };
  const stop = () => {
    tween?.kill();
    tween = undefined;
    captured = false;
    if (!available) releaseGestures();
  };
  const guide = () => {
    available = false;
    const start = window.scrollY;
    const position = { progress: 0 };
    tween = gsap.to(position, {
      progress: 1,
      duration: 0.7,
      ease: EASE_IN_OUT,
      onUpdate: () => {
        // Re-measure in case Safari's browser chrome or the page layout changes.
        window.scrollTo({ top: start + (destination() - start) * position.progress, behavior: 'instant' });
      },
      onComplete: () => {
        tween = undefined;
        window.scrollTo({ top: destination(), behavior: 'instant' });
        startPlayback();
      },
    });
  };
  const onTouchStart = (event: TouchEvent) => {
    // A fresh gesture can interrupt the guided movement, including a pinch.
    stop();
    touch = event.touches.length === 1 && canGuide(event.target)
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
      : null;
  };
  const onTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 1) {
      stop();
      touch = null;
      return;
    }
    if (captured) {
      if (event.cancelable) event.preventDefault();
      return;
    }
    if (!touch) return;
    const dx = event.touches[0].clientX - touch.x;
    const dy = touch.y - event.touches[0].clientY;
    if ((Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) || dy < -10) {
      touch = null;
    } else if (dy > 10 && event.cancelable) {
      event.preventDefault();
      captured = true;
      touch = null;
      guide();
    }
  };
  const onTouchEnd = () => {
    captured = false;
    touch = null;
    if (!available && !tween) releaseGestures();
  };
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      stop();
      return;
    }
    const now = performance.now();
    if (tween) {
      if (event.deltaY < 0 || now - lastWheel > 180) stop();
      else if (event.cancelable) event.preventDefault();
    } else if (event.deltaY > 0 && event.cancelable && canGuide(event.target)) {
      event.preventDefault();
      guide();
    }
    lastWheel = now;
  };
  const onNavigation = () => {
    available = false;
    stop();
  };
  const onClick = (event: MouseEvent) => {
    stop();
    if (event.target instanceof Element && event.target.closest('a[href*="#"]')) onNavigation();
  };
  const releaseGestures = () => {
    // Remove non-passive handlers once the first gesture finishes so later
    // scrolling can stay on the browser's compositor during the animation.
    window.removeEventListener('hashchange', onNavigation);
    window.removeEventListener('keydown', onNavigation);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchEnd);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('click', onClick);
  };

  if (replay) startPlayback();
  else checkVisibility();
  if (played) return () => {};
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('hashchange', onNavigation);
  window.addEventListener('keydown', onNavigation);
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('click', onClick);
  return () => {
    stop();
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    releaseGestures();
  };
}
