'use client';
// The hero's one moment, told inside the phone: a card is held to the
// camera, the corners lock on, a light reads it, it is found -- and its
// Pokémon takes its place in the Pokédex. Scrubbed by scroll on wide
// screens; played once in view on phones; shown finished under reduced
// motion. The same story as the app's own onboarding.
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { EASE, EASE_IN_OUT, WIDE, onceInView, prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DEX = [1, 4, 6, 7, 25, 133, 143, 150, 151, 197, 249, 384];
const FOUND = 6;
const OWNED = new Set([1, 7, 25, 133, 143, 151, 197, 249, 384]);

export function HeroScan({ found, slot, replay }: { found: string; slot: string; replay: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [take, setTake] = useState(0);
  const [playedOnce, setPlayedOnce] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      // The card arrives by itself when the page opens and the corners lock
      // on: the hero is never an empty phone.
      const intro = () =>
        gsap
          .timeline({ defaults: { ease: EASE } })
          .fromTo(
            q('.hs-card'),
            { scale: 1.1, rotate: -5, y: 36, autoAlpha: 0 },
            { autoAlpha: 1, scale: 1, rotate: 0, y: 0, duration: 1.2, delay: 0.25 },
          )
          .fromTo(
            q('.hs-corner'),
            { autoAlpha: 0, scale: 1.25 },
            { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.04 },
            '-=0.3',
          );
      // What scrolling tells: it is read, found, and joins the Pokédex.
      const story = () => {
        const tl = gsap.timeline({ defaults: { ease: EASE } });
        tl.set(q('.hs-camera'), { yPercent: 0, autoAlpha: 1 })
          .set(q('.hs-dex'), { yPercent: 18, autoAlpha: 0 })
          .set(q('.hs-sweep'), { yPercent: -120, autoAlpha: 0 })
          .set(q('.hs-found'), { y: 12, autoAlpha: 0 })
          .set(q('.hs-slot-art'), { autoAlpha: 0, scale: 0.7 })
          .set(q('.hs-count-new'), { yPercent: 100, autoAlpha: 0 })
          .set(q('.hs-count-old'), { yPercent: 0, autoAlpha: 1 })
          .to({}, { duration: 0.3 })
          // A light passes over it.
          .to(q('.hs-sweep'), { autoAlpha: 1, duration: 0.15 })
          .to(q('.hs-sweep'), { yPercent: 120, duration: 1, ease: EASE_IN_OUT }, '<')
          .to(q('.hs-sweep'), { autoAlpha: 0, duration: 0.2 }, '-=0.2')
          // Found.
          .to(q('.hs-found'), { y: 0, autoAlpha: 1, duration: 0.5 }, '-=0.05')
          .to({}, { duration: 0.6 })
          // The camera gives way to the Pokédex.
          .to(q('.hs-camera'), { yPercent: -14, autoAlpha: 0, duration: 0.8, ease: EASE_IN_OUT })
          .to(q('.hs-dex'), { yPercent: 0, autoAlpha: 1, duration: 0.9 }, '-=0.5')
          // Its slot is filled; the count moves on by one.
          .to(q('.hs-slot-art'), { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.1')
          .to(q('.hs-slot'), { boxShadow: '0 0 0 2px #7050b8', duration: 0.3 }, '<')
          .to(q('.hs-count-old'), { yPercent: -100, autoAlpha: 0, duration: 0.45 }, '<0.15')
          .to(q('.hs-count-new'), { yPercent: 0, autoAlpha: 1, duration: 0.45 }, '<')
          .to({}, { duration: 0.8 });
        return tl;
      };

      if (prefersReducedMotion()) {
        intro().progress(1).pause();
        story().progress(1).pause();
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(WIDE, () => {
        intro();
        const tl = story().pause();
        ScrollTrigger.create({
          trigger: root.current!.closest('.mx-hero'),
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          animation: tl,
        });
      });
      mm.add('(max-width: 899px)', () => {
        const tl = gsap.timeline({ paused: true }).add(intro()).add(story(), '-=0.2');
        return onceInView(root.current!, () => {
          tl.play();
          setPlayedOnce(true);
        }, 0.5);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [take], revertOnUpdate: true },
  );

  return (
    <div className="hs" ref={root}>
      <div className="hs-phone" aria-hidden="true">
        <div className="hs-island" />
        <div className="hs-screen">
          <div className="hs-camera">
            <div className="hs-viewfinder">
              <img className="hs-card" src="/assets/card-charizard.webp" alt="" width="240" height="335" />
              {['tl', 'tr', 'bl', 'br'].map((c) => (
                <span key={c} className={`hs-corner hs-${c}`} />
              ))}
              <span className="hs-sweep" />
            </div>
            <div className="hs-found">
              <span className="hs-check">✓</span>
              <span>
                <b>Charizard ex</b>
                <small>{found}</small>
              </span>
            </div>
          </div>
          <div className="hs-dex">
            <div className="hs-dex-head">
              <b>Pokédex</b>
              <span className="hs-count">
                <span className="hs-count-old">11</span>
                <span className="hs-count-new">12</span>
                <span className="hs-count-of"> / 1025</span>
              </span>
            </div>
            <div className="hs-grid">
              {DEX.map((id) => (
                <div key={id} className={`hs-tile ${id === FOUND ? 'hs-slot' : ''}`}>
                  <small>#{String(id).padStart(3, '0')}</small>
                  <div className="hs-art">
                    <img className="hs-silhouette" src={`/assets/pokemon-${id}.webp`} alt="" decoding="async" />
                    {(OWNED.has(id) || id === FOUND) && (
                      <img
                        className={id === FOUND ? 'hs-slot-art' : 'hs-owned'}
                        src={`/assets/pokemon-${id}.webp`}
                        alt=""
                      />
                    )}
                  </div>
                  {id === FOUND && <small className="hs-slot-name">{slot}</small>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {playedOnce && (
        <button className="mx-replay hs-replay" type="button" onClick={() => setTake((n) => n + 1)}>
          {replay}
        </button>
      )}
    </div>
  );
}
