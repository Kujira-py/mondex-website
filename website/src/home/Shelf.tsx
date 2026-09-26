'use client';
// The catalogue as a discovery: cards wait pale, like undiscovered Pokédex
// entries, and take their colour where you look -- under the pointer, or at
// the middle of the screen on a phone. The rows travel with the scroll
// (cards one way, sets the other) and never move by themselves. Under
// reduced motion everything is in colour and the rows scroll by hand.
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CARDS = [
  'charizard', 'umbreon', 'pikachu', 'lugia', 'gengar', 'rayquaza', 'mew', 'sylveon', 'giratina',
  'blastoise', 'gardevoir', 'dragonite', 'eevee', 'suicune', 'mewtwo', 'venusaur', 'tyranitar',
  'leafeon', 'arceus', 'reshiram', 'blaziken', 'groudon', 'dialga', 'xerneas', 'magikarp',
  'aerodactyl', 'iron-leaves', 'houndour',
];
// The Pokémon on each card, for the ones whose artwork the site carries.
const POKEMON: Record<string, number> = {
  charizard: 6, umbreon: 197, pikachu: 25, lugia: 249, gengar: 94, rayquaza: 384, mew: 151,
  sylveon: 700, giratina: 487, blastoise: 9, gardevoir: 282, dragonite: 149, eevee: 133,
  suicune: 245, mewtwo: 150, venusaur: 3, leafeon: 470, arceus: 493, reshiram: 643,
  blaziken: 257, magikarp: 129, aerodactyl: 142,
};
const SETS = [
  'sv3pt5', 'base1', 'swsh7', 'me1', 'sv8pt5', 'neo1', 'xy12', 'sv4pt5', 'cel25', 'swsh12pt5',
  'base2', 'sm12', 'sv6', 'ex7', 'sv2', 'bw1', 'swsh45', 'dp1', 'me2', 'sv10', 'base5', 'sm115',
];
/** Fully in colour within this distance of the focus, pale beyond FADE more. */
const NEAR = 90;
const FADE = 220;

export function Shelf({ cardsLabel, setsLabel }: { cardsLabel: string; setsLabel: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      if (prefersReducedMotion()) {
        el.classList.add('is-still');
        return;
      }
      const cards = gsap.utils.toArray<HTMLElement>('.sh-card', el);
      const [cardRow, setRow] = gsap.utils.toArray<HTMLElement>('.sh-set', el);
      // The rows travel with the scroll: cards to the left, sets to the right.
      const travel = (row: HTMLElement) => Math.max(row.scrollWidth - el.clientWidth, 0);
      const drift = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true },
        onUpdate: () => paint(),
      });
      drift
        .fromTo(cardRow, { x: () => -travel(cardRow) * 0.15 }, { x: () => -travel(cardRow) * 0.6, ease: 'none' }, 0)
        .fromTo(setRow, { x: () => -travel(setRow) * 0.6 }, { x: () => -travel(setRow) * 0.15, ease: 'none' }, 0);

      // Where the collector is looking: the pointer over the shelf, else the middle.
      let focus: number | null = null;
      let frame = 0;
      const paint = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const x = focus ?? window.innerWidth / 2;
          for (const card of cards) {
            const box = card.getBoundingClientRect();
            const distance = Math.abs(box.left + box.width / 2 - x);
            const pale = Math.min(Math.max((distance - NEAR) / FADE, 0), 1);
            card.style.setProperty('--pale', pale.toFixed(3));
          }
        });
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        focus = event.clientX;
        paint();
      };
      const leave = () => {
        focus = null;
        paint();
      };
      el.addEventListener('pointermove', move, { passive: true });
      el.addEventListener('pointerleave', leave);
      window.addEventListener('resize', paint);
      paint();
      return () => {
        cancelAnimationFrame(frame);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        window.removeEventListener('resize', paint);
      };
    },
    { scope: root },
  );

  return (
    <div className="sh" ref={root}>
      <div className="sh-row" role="group" aria-label={cardsLabel}>
        <div className="sh-set">
          {CARDS.map((card) => (
            <div key={card} className={`sh-card ${POKEMON[card] ? 'has-pop' : ''}`}>
              <div className="sh-face">
                <img src={`/assets/card-${card}.webp`} alt="" loading="lazy" decoding="async" width="660" height="922" />
              </div>
              {POKEMON[card] ? (
                <img className="sh-pop" src={`/assets/pokemon-${POKEMON[card]}.webp`} alt="" loading="lazy" decoding="async" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="sh-row" role="group" aria-label={setsLabel}>
        <div className="sh-set">
          {SETS.map((set) => (
            <div key={set} className="sh-logo">
              <img src={`/assets/set-${set}.webp`} alt="" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
