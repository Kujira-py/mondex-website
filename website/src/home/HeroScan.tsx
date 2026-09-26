'use client';
// The hero: an iPhone running MonDex's real scanner. A card is brought into
// the guide, its outline is traced and it is matched; then its Pokémon steps
// out of the card and flies into its place in the Dex. The screens copy the
// app (scanner-reference.md, the Dex tab) in a 402 × 874 pt layout, so the
// flight is computed in the same points the CSS uses.
//
// Wide screens: the phone arrives by itself, scrolling tells the rest.
// Phones: the whole story plays once in view. Reduced motion: final state.
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { EASE, EASE_IN_OUT, WIDE, onceInView, prefersReducedMotion } from './motion';
import type { HomeCopy } from './copy';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DEX = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const FOUND = 6;
const UNDISCOVERED = new Set([9]);

// Boxes in points (402 wide screen). Keep in step with home.css.
const POPPED = { cx: 201, cy: 300, size: 190 }; // the art's resting box above the card
const IN_CARD = { cx: 239, cy: 313, size: 70 }; // Charizard inside the card illustration
const SLOT = { cx: 16 + 2 * 126 + 59, cy: 246 + 152 + 30 + 44, size: 88 }; // #006's artwork box

type Phone = HomeCopy['phone'];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const ICONS = {
  close: 'M6 6l12 12M18 6L6 18',
  torch: 'M8 3h8l-1 6H9L8 3zm1 6h6v11a1 1 0 01-1 1h-4a1 1 0 01-1-1V9zm3 4v2',
  undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3',
  help: 'M12 21a9 9 0 100-18 9 9 0 000 18zm-2.5-11.5a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2.2M12 17h.01',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4V8zm8 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
  auto: 'M3 7h13v10H3zM16 10l5-3v10l-5-3',
  batch: 'M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5M3 16l9 5 9-5',
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zm9 3l-4-4',
  sliders: 'M4 8h10M18 8h2M4 16h2M10 16h10M14 5v6M6 13v6',
  home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4v-9z',
  book: 'M5 4h6a2 2 0 012 2v14a2 2 0 00-2-2H5V4zm14 0h-6a2 2 0 00-2 2v14a2 2 0 012-2h6V4z',
  scan: 'M4 9V5h4M16 5h4v4M20 15v4h-4M8 19H4v-4',
  cards: 'M8 7V4h11v14h-3M5 7h11v14H5z',
  value: 'M4 18l5-6 4 3 7-9M4 21h16',
};

export function HeroScan({ phone, german, replay }: { phone: Phone; german: boolean; replay: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [take, setTake] = useState(0);
  const [played, setPlayed] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const screen = root.current!.querySelector<HTMLElement>('.hp-screen')!;
      const pt = () => screen.clientWidth / 402;
      const from = (box: { cx: number; cy: number; size: number }) => ({
        x: () => (box.cx - POPPED.cx) * pt(),
        y: () => (box.cy - POPPED.cy) * pt(),
        scale: box.size / POPPED.size,
      });

      // The phone arrives, and a card is brought into the guide.
      const intro = () =>
        gsap
          .timeline({ defaults: { ease: EASE } })
          .fromTo(q('.hp-phone'), { y: 60, rotateY: -24, rotateX: 12, autoAlpha: 0 }, { y: 0, rotateY: -14, rotateX: 6, autoAlpha: 1, duration: 1.5 })
          .fromTo(
            q('.hp-card'),
            { xPercent: 38, yPercent: 70, rotateX: 38, rotateZ: -16, scale: 0.86, autoAlpha: 0 },
            { xPercent: 0, yPercent: 0, rotateX: 7, rotateZ: -3, scale: 1, autoAlpha: 1, duration: 1.4 },
            0.55,
          )
          .fromTo(q('.hp-guide'), { '--glow': 0.25 }, { '--glow': 0.6, duration: 0.8 }, 1.3);

      // What the scroll tells.
      const story = () => {
        const tl = gsap.timeline({ defaults: { ease: EASE } });
        tl.set(q('.hp-trace rect'), { strokeDashoffset: 1 })
          .set(q('.hp-trace'), { autoAlpha: 0 })
          .set(q('.hp-sheen'), { xPercent: -130 })
          .set(q('.hp-receipt'), { y: () => 24 * pt(), autoAlpha: 0 })
          .set(q('.hp-price-value'), { yPercent: 60, autoAlpha: 0 })
          .set(q('.hp-price-empty'), { yPercent: 0, autoAlpha: 1 })
          .set(q('.hp-pop'), { ...from(IN_CARD), autoAlpha: 0 })
          .set(q('.hp-dex'), { autoAlpha: 0, '--reveal': '0%' })
          .set(q('.hp-burst'), { autoAlpha: 0, scale: 0.4 })
          .set(q('.hp-scanner'), { autoAlpha: 1, scale: 1 })
          .set(q('.hp-slot-shadow'), { autoAlpha: 1 })
          .set(q('.hp-slot-name'), { autoAlpha: 0, yPercent: 40 })
          .set(q('.hp-slot-unknown'), { autoAlpha: 1, yPercent: 0 })
          .set(q('.hp-ring'), { scale: 0.6, autoAlpha: 0 })
          .set(q('.hp-status'), { color: '#f5f5f7' })
          // The phone turns to face you; the card steadies in the guide.
          .to(q('.hp-phone'), { rotateY: 0, rotateX: 0, duration: 2.2, ease: EASE_IN_OUT }, 0)
          .to(q('.hp-card'), { rotateX: 0, rotateZ: 0, duration: 0.9 }, 0.2)
          // Its outline is traced, a light crosses the surface, the guide locks on.
          .to(q('.hp-trace'), { autoAlpha: 1, duration: 0.2 }, 0.9)
          .to(q('.hp-trace rect'), { strokeDashoffset: 0, duration: 1.1, ease: EASE_IN_OUT }, 0.9)
          .to(q('.hp-sheen'), { xPercent: 130, duration: 1.2, ease: EASE_IN_OUT }, 1.2)
          .to(q('.hp-guide'), { '--glow': 1, scale: 0.985, duration: 0.5 }, 1.8)
          // Matched: the receipt rises, the value rolls in.
          .to(q('.hp-receipt'), { y: 0, autoAlpha: 1, duration: 0.7 }, 2.2)
          .to(q('.hp-price-empty'), { yPercent: -60, autoAlpha: 0, duration: 0.4 }, 2.3)
          .to(q('.hp-price-value'), { yPercent: 0, autoAlpha: 1, duration: 0.5 }, 2.4)
          // The Pokémon steps out of its card.
          .to(q('.hp-card'), { rotateX: 22, scale: 0.94, filter: 'brightness(0.72)', duration: 1, ease: EASE_IN_OUT }, 3.3)
          .to(q('.hp-trace'), { autoAlpha: 0, duration: 0.4 }, 3.3)
          .to(q('.hp-pop'), { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 1.2, ease: 'back.out(1.3)' }, 3.45)
          .to(q('.hp-burst'), { autoAlpha: 1, scale: 1, duration: 1.1 }, 3.5)
          // The scanner gives way to the Dex, and it flies to its place.
          // The Dex opens from the very place the Pokémon will land.
          .set(q('.hp-dex'), { autoAlpha: 1 }, 4.9)
          .to(q('.hp-dex'), { '--reveal': '130%', duration: 1.4, ease: 'power2.inOut' }, 4.9)
          .to(q('.hp-scanner'), { scale: 0.97, duration: 1.2, ease: EASE_IN_OUT }, 4.9)
          .to(q('.hp-burst'), { autoAlpha: 0, scale: 1.4, duration: 0.8 }, 4.9)
          .to(q('.hp-status'), { color: '#20212c', duration: 0.5 }, 5.2)
          .to(q('.hp-pop'), { ...from(SLOT), duration: 1.3, ease: 'power3.inOut' }, 5.2)
          .to(q('.hp-slot-shadow'), { autoAlpha: 0, duration: 0.3 }, 6.25)
          .to(q('.hp-ring'), { scale: 1.35, autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 6.4)
          .to(q('.hp-ring'), { autoAlpha: 0, duration: 0.6 }, 6.75)
          .to(q('.hp-slot-unknown'), { yPercent: -40, autoAlpha: 0, duration: 0.4 }, 6.4)
          .to(q('.hp-slot-name'), { yPercent: 0, autoAlpha: 1, duration: 0.5 }, 6.5)
          .to({}, { duration: 0.9 });
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
        ScrollTrigger.create({
          trigger: root.current!.closest('.mx-hero'),
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
          animation: story().pause(),
        });
      });
      mm.add('(max-width: 899px)', () => {
        const tl = gsap.timeline({ paused: true }).add(intro()).add(story(), '-=0.4');
        return onceInView(root.current!, () => {
          tl.play();
          setPlayed(true);
        }, 0.45);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [take], revertOnUpdate: true },
  );

  const mask = (id: number) => ({ maskImage: `url(/assets/pokemon-${id}.webp)`, WebkitMaskImage: `url(/assets/pokemon-${id}.webp)` });

  return (
    <div className="hp" ref={root}>
      <div className="hp-stage">
        <div className="hp-phone" aria-hidden="true">
          <span className="hp-key hp-key-action" />
          <span className="hp-key hp-key-up" />
          <span className="hp-key hp-key-down" />
          <span className="hp-key hp-key-power" />
          <span className="hp-key hp-key-control" />
          <div className="hp-bezel">
            <div className="hp-screen">
              <div className="hp-scanner">
                <div className="hp-desk" />
                <div className="hp-guide">
                  <i className="hp-gc hp-gc-tl" />
                  <i className="hp-gc hp-gc-tr" />
                  <i className="hp-gc hp-gc-bl" />
                  <i className="hp-gc hp-gc-br" />
                </div>
                <div className="hp-card">
                  <img src="/assets/card-charizard.webp" alt="" width="660" height="922" />
                  <span className="hp-sheen" />
                  <svg className="hp-trace" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <rect x="0.6" y="0.6" width="98.8" height="98.8" rx="4.5" ry="3.2" pathLength="1" />
                  </svg>
                </div>
                <div className="hp-top">
                  <p className="hp-mark">
                    <img src="/assets/orbit.svg" alt="" />
                    MonDex
                  </p>
                  <div className="hp-controls">
                    <span className="hp-round"><Icon d={ICONS.close} /></span>
                    <span className="hp-round is-dim"><Icon d={ICONS.torch} /></span>
                    <span className="hp-price">
                      <span className="hp-price-empty">—</span>
                      <span className="hp-price-value">{phone.price}</span>
                    </span>
                    <span className="hp-round is-dim"><Icon d={ICONS.undo} /></span>
                    <span className="hp-round"><Icon d={ICONS.help} /></span>
                  </div>
                  <p className="hp-caption">{phone.estimated}</p>
                </div>
                <div className="hp-receipt">
                  <img src="/assets/card-charizard.webp" alt="" />
                  <span className="hp-receipt-text">
                    <small>✓ {phone.matched}</small>
                    <b>Charizard ex</b>
                    <small>{phone.set}</small>
                    <em>{phone.discovery}</em>
                  </span>
                  <span className="hp-receipt-price">{phone.price}</span>
                </div>
                <div className="hp-bottom">
                  <div className="hp-modes">
                    <span className="is-on"><Icon d={ICONS.camera} />{phone.modes[0]}</span>
                    <span><Icon d={ICONS.auto} />{phone.modes[1]}</span>
                    <span><Icon d={ICONS.batch} />{phone.modes[2]}</span>
                  </div>
                  <span className="hp-lang"><Icon d={ICONS.globe} />{german ? 'DE' : 'EN'}</span>
                  <span className="hp-go"><Icon d={ICONS.arrow} /></span>
                </div>
                <p className="hp-tagline">SCAN · IDENTIFY · COLLECT</p>
              </div>

              <div className="hp-dex">
                <p className="hp-dex-title">{phone.dex}</p>
                <div className="hp-tabs">
                  {phone.tabs.map((tab, i) => (
                    <span key={tab} className={i === 0 ? 'is-on' : ''}>{tab}</span>
                  ))}
                </div>
                <div className="hp-search">
                  <span><Icon d={ICONS.search} />{phone.search}</span>
                  <Icon d={ICONS.sliders} />
                </div>
                <p className="hp-total">{phone.total}</p>
                <div className="hp-grid">
                  {DEX.map((id, i) => (
                    <div key={id} className={`hp-tile ${id === FOUND ? 'hp-slot' : ''}`}>
                      <small>#{String(id).padStart(3, '0')}</small>
                      <div className="hp-art">
                        {id === FOUND ? (
                          <>
                            <span className="hp-shadow hp-slot-shadow" style={mask(id)} />
                            <span className="hp-ring" />
                          </>
                        ) : UNDISCOVERED.has(id) ? (
                          <span className="hp-shadow" style={mask(id)} />
                        ) : (
                          <img src={`/assets/pokemon-${id}.webp`} alt="" />
                        )}
                      </div>
                      {id === FOUND ? (
                        <span className="hp-name hp-swap">
                          <span className="hp-slot-unknown">{phone.undiscovered}</span>
                          <span className="hp-slot-name">{phone.names[i]}</span>
                        </span>
                      ) : (
                        <span className={`hp-name ${UNDISCOVERED.has(id) ? 'is-unknown' : ''}`}>
                          {UNDISCOVERED.has(id) ? phone.undiscovered : phone.names[i]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="hp-bar">
                  <div className="hp-bar-tabs">
                    {[ICONS.home, ICONS.book, ICONS.scan, ICONS.cards, ICONS.value].map((d, i) => (
                      <span key={d} className={i === 1 ? 'is-on' : ''}>
                        <Icon d={d} />
                        {phone.bar[i]}
                      </span>
                    ))}
                  </div>
                  <span className="hp-bar-search"><Icon d={ICONS.search} /></span>
                </div>
              </div>

              <span className="hp-burst" />
              <img className="hp-pop" src="/assets/pokemon-6-large.webp" alt="" />
              <div className="hp-status">
                <b>9:41</b>
                <span className="hp-status-icons">
                  <svg viewBox="0 0 18 12" aria-hidden="true">
                    <rect x="0" y="8" width="3" height="4" rx="1" />
                    <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                    <rect x="10" y="3" width="3" height="9" rx="1" />
                    <rect x="15" y="0" width="3" height="12" rx="1" />
                  </svg>
                  <svg viewBox="0 0 16 12" aria-hidden="true">
                    <path d="M8 11.6l2.4-2.9a3.4 3.4 0 00-4.8 0L8 11.6zM3.4 6.4a6.7 6.7 0 019.2 0l1.7-2a9.3 9.3 0 00-12.6 0l1.7 2z" />
                  </svg>
                  <span className="hp-battery">
                    <i />
                  </span>
                </span>
              </div>
              <div className="hp-island" />
              <div className="hp-home" />
              <div className="hp-glass" />
            </div>
          </div>
        </div>
        <div className="hp-floor" />
      </div>
      <p className="hp-note">
        {phone.simulated}
        <sup className="mx-ref">
          <a href="#note-3">3</a>
        </sup>
      </p>
      {played && (
        <button className="mx-replay hp-replay" type="button" onClick={() => setTake((n) => n + 1)}>
          {replay}
        </button>
      )}
    </div>
  );
}
