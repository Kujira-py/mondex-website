'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguage } from './Language';
// The wrapper owns layout; the inner face exclusively owns pointer tilt and directional sheen.
export function HoloCard({
  id,
  name,
  className = '',
  onClick,
  pressed = false,
  tilt = 10,
  tabIndex,
}: {
  id: string;
  name: string;
  className?: string;
  onClick?: () => void;
  pressed?: boolean;
  tilt?: number;
  tabIndex?: number;
}) {
  const { copy } = useLanguage();
  const ref = useRef<HTMLButtonElement>(null);
  const setters = useRef<Record<string, ReturnType<typeof gsap.quickTo>> | null>(null);
  useGSAP(
    () => {
      if (!ref.current) return;
      const values: Record<string, ReturnType<typeof gsap.quickTo>> = {};
      for (const property of ['--rx', '--ry', '--mx', '--my', '--foil'])
        values[property] = gsap.quickTo(ref.current, property, {
          duration: 0.32,
          ease: 'power3.out',
        });
      setters.current = values;
      return () => {
        setters.current = null;
      };
    },
    { scope: ref },
  );
  const move = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (
      e.pointerType !== 'mouse' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !setters.current
    )
      return;
    const r = e.currentTarget.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width,
      y = (e.clientY - r.top) / r.height;
    const values = {
      '--rx': (y - 0.5) * -2 * tilt,
      '--ry': (x - 0.5) * 2 * tilt,
      '--mx': x * 100,
      '--my': y * 100,
      '--foil': 0.55,
    };
    for (const [key, value] of Object.entries(values)) {
      setters.current[key].tween.duration(0.32);
      setters.current[key](value);
    }
  };
  const reset = () => {
    if (!setters.current) return;
    for (const [key, value] of Object.entries({
      '--rx': 0,
      '--ry': 0,
      '--mx': 50,
      '--my': 50,
      '--foil': 0,
    })) {
      setters.current[key].tween.duration(0.65);
      setters.current[key](value);
    }
  };
  return (
    <button
      ref={ref}
      className={`holo-card ${className}`}
      aria-label={copy.card.select.replace('{name}', name)}
      aria-pressed={pressed}
      tabIndex={tabIndex}
      onBlur={reset}
      onPointerMove={move}
      onPointerLeave={reset}
      onClick={onClick}
    >
      <span className="holo-face">
        <img
          src={`/assets/card-${id}.webp`}
          width="660"
          height="922"
          alt={copy.card.alt.replace('{name}', name)}
          loading="lazy"
        />
        <span className="holo-foil" />
        <span className="holo-glare" />
      </span>
    </button>
  );
}
