'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { catalogueSets } from '@/lib/catalogue';
import { useLanguage } from './Language';
const first = [
  'sv3pt5',
  'base1',
  'swsh7',
  'neo1',
  'sv2',
  'xy12',
  'swsh12pt5',
  'ex1',
  'sv8',
  'dp1',
  'swsh11',
  'bw1',
  'sm12',
  'sv9',
  'xy1',
  'ecard1',
];
const sets = [
  ...first.map((id) => catalogueSets.find((s) => s.id === id)).filter((s) => s !== undefined),
  ...catalogueSets.filter((s) => !first.includes(s.id)),
];
export function SetDiscoveryRail({ paused }: { paused: boolean }) {
  const { locale } = useLanguage();
  const root = useRef<HTMLDivElement>(null),
    loop = useRef<gsap.core.Tween | null>(null);
  const flags = useRef({ visible: false, paused });
  const sync = () => {
    loop.current?.paused(flags.current.paused || !flags.current.visible || document.hidden);
  };
  useEffect(() => {
    flags.current.paused = paused;
    sync();
  }, [paused]);
  useGSAP(
    () => {
      const el = root.current!,
        track = el.querySelector<HTMLElement>('.set-track')!,
        group = el.querySelector<HTMLElement>('.set-group')!;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const resize = () => {
          const progress = loop.current?.progress() ?? 0;
          loop.current?.kill();
          const width = group.offsetWidth;
          loop.current = gsap.fromTo(
            track,
            { x: -width },
            { x: 0, duration: width / 26, ease: 'none', repeat: -1, paused: true },
          );
          loop.current.progress(progress);
          sync();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(group);
        return () => {
          ro.disconnect();
          loop.current?.kill();
          loop.current = null;
          gsap.set(track, { clearProps: 'transform' });
        };
      });
      const io = new IntersectionObserver(
        ([e]) => {
          flags.current.visible = e.isIntersecting;
          sync();
        },
        { threshold: 0.01 },
      );
      io.observe(el);
      document.addEventListener('visibilitychange', sync);
      return () => {
        io.disconnect();
        document.removeEventListener('visibilitychange', sync);
        mm.revert();
      };
    },
    { scope: root },
  );
  return (
    <div className="set-discovery" ref={root}>
      <div className="set-heading section-shell">
        <h3>
          {locale === 'de'
            ? 'Vom ersten Booster bis zum nächsten.'
            : 'From the first pack to the next.'}
        </h3>
        <p>
          {locale === 'de'
            ? '174 Sets in unserem Katalog. Generationen voller Erinnerungen.'
            : '174 sets in our catalogue. Generations of memories.'}
        </p>
      </div>
      <div
        className="set-window"
        aria-label={
          locale === 'de'
            ? 'Pokémon-Sets im MonDex-Katalog'
            : 'Pokémon sets in the MonDex catalogue'
        }
      >
        <div className="set-track">
          {[0, 1].map((group) => (
            <div
              className={`set-group ${group ? 'is-clone' : ''}`}
              aria-hidden={!!group}
              key={group}
            >
              {sets.map((s) => (
                <div className="set-item" key={s.id}>
                  <img
                    src={`/assets/set-${s.id}.webp`}
                    alt=""
                    width="160"
                    height="80"
                    loading="lazy"
                  />
                  <span>{s.name}</span>
                  <small>{s.year}</small>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
