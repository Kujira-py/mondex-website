'use client';
// The signature moment: a page of the Pokédex fills while you scroll. Each
// silhouette takes its colours in a slow diagonal wave; the count follows.
// Scrubbed on wide screens, played once in view on phones.
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { EASE, WIDE, onceInView, prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const IDS = [1, 3, 4, 6, 7, 9, 25, 54, 94, 129, 133, 142, 143, 149, 150, 151, 155, 175, 197, 245,
  249, 257, 258, 282, 384, 393, 448, 470, 487, 493, 495, 570, 607, 643, 658, 700, 722, 778, 813, 887];
// Four stay undiscovered: there is always a next one.
const MISSING = new Set([149, 487, 643, 887]);
const COLS = 8;

export function DexWave({ count, replay }: { count: string; replay: string }) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [take, setTake] = useState(0);
  const [played, setPlayed] = useState(false);
  const total = IDS.filter((id) => !MISSING.has(id)).length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tiles = q('.dw-tile:not(.dw-missing)');
      const state = { n: 0 };
      const build = () => {
        const tl = gsap.timeline();
        tl.set(q('.dw-color'), { autoAlpha: 0, scale: 0.86 });
        tl.set(state, { n: 0 });
        // Diagonal order: top-left first, like light moving across the page.
        tiles.forEach((tile: Element) => {
          const i = Number((tile as HTMLElement).dataset.i);
          const at = ((i % COLS) + Math.floor(i / COLS)) * 0.12;
          tl.to(tile.querySelector('.dw-color'), { autoAlpha: 1, scale: 1, duration: 0.5, ease: EASE }, at);
        });
        tl.to(state, {
          n: total,
          duration: tl.duration(),
          ease: 'none',
          onUpdate: () => {
            if (counter.current) counter.current.textContent = String(Math.round(state.n));
          },
        }, 0);
        return tl;
      };
      if (prefersReducedMotion()) {
        build().progress(1).pause();
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(WIDE, () => {
        ScrollTrigger.create({
          trigger: root.current!.closest('.mx-dex'),
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          animation: build().pause(),
        });
      });
      mm.add('(max-width: 899px)', () => {
        const tl = build().pause().duration(2.6);
        return onceInView(root.current!, () => {
          tl.play();
          setPlayed(true);
        }, 0.3);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [take], revertOnUpdate: true },
  );

  return (
    <div className="dw" ref={root}>
      <p className="dw-count" aria-live="off">
        <span ref={counter} className="dw-number">
          0
        </span>{' '}
        <span className="dw-of">{count}</span>
      </p>
      <div className="dw-grid" aria-hidden="true">
        {IDS.map((id, i) => (
          <div key={id} className={`dw-tile ${MISSING.has(id) ? 'dw-missing' : ''}`} data-i={i}>
            <img className="dw-shadow" src={`/assets/pokemon-${id}.webp`} alt="" loading="lazy" />
            {!MISSING.has(id) && (
              <img className="dw-color" src={`/assets/pokemon-${id}.webp`} alt="" loading="lazy" />
            )}
          </div>
        ))}
      </div>
      {played && (
        <button className="mx-replay" type="button" onClick={() => setTake((n) => n + 1)}>
          {replay}
        </button>
      )}
    </div>
  );
}
