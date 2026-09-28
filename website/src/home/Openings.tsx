'use client';
// Pack openings: a pack tears open once in view, its pulls rise out in a
// fan, and a receipt sets what was paid beside what came out -- the app's
// Opening mode and its openings ledger. The pack is drawn in MonDex's own
// colours with the set's logo, not a copy of real booster packaging.
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { EASE, onceInView, prefersReducedMotion } from './motion';
import type { HomeCopy } from './copy';

gsap.registerPlugin(useGSAP);

export function Openings({ c }: { c: HomeCopy['openings'] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const tl = gsap
        .timeline({ paused: true, defaults: { ease: EASE } })
        .fromTo(q('.op-pack'), { y: 24, rotate: -4, autoAlpha: 0 }, { y: 0, rotate: -2, autoAlpha: 1, duration: 0.8 })
        // The top strip tears away.
        .fromTo(q('.op-strip'), { y: 0, rotate: 0, autoAlpha: 1 }, { y: -26, x: 18, rotate: 14, autoAlpha: 0, duration: 0.7, ease: 'power2.in' }, '+=0.15')
        // The pulls rise out and fan.
        .fromTo(
          q('.op-card'),
          { y: 70, rotate: 0, x: 0, autoAlpha: 0 },
          {
            y: (i: number) => [-118, -132, -150][i],
            x: (i: number) => [-58, -4, 56][i],
            rotate: (i: number) => [-12, -2, 10][i],
            autoAlpha: 1,
            duration: 1,
            stagger: 0.12,
            ease: 'back.out(1.2)',
          },
          '-=0.25',
        )
        .fromTo(q('.op-line:not(.op-result)'), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.14 }, '-=0.6')
        .fromTo(q('.op-result'), { scale: 0.92, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.6)' }, '-=0.1');
      if (prefersReducedMotion()) {
        tl.progress(1);
        return;
      }
      return onceInView(root.current!, () => tl.play(), 0.35);
    },
    { scope: root },
  );

  return (
    <div className="op" ref={root}>
      <div className="op-stage" aria-hidden="true">
        <div className="op-cards">
          <span className="op-card op-back" />
          <span className="op-card op-back" />
          <img className="op-card" src="/assets/card-pikachu.webp" alt="" loading="lazy" />
        </div>
        <div className="op-pack">
          <span className="op-strip" />
          <img src="/assets/set-sv3pt5.webp" alt="" loading="lazy" />
          <img className="op-orbit" src="/assets/orbit.svg" alt="" />
        </div>
      </div>
      <div className="op-receipt">
        <p className="op-line">
          <span>{c.paid}</span>
          <b>{c.values[0]}</b>
        </p>
        <p className="op-line">
          <span>
            {c.pulled}
            <small>Pikachu · 173/165 {c.more}</small>
          </span>
          <b>{c.values[1]}</b>
        </p>
        <p className="op-line op-result">
          <span>{c.result}</span>
          <b>{c.values[2]}</b>
        </p>
      </div>
    </div>
  );
}
