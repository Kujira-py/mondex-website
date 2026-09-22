'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguage } from './Language';

const pocketThemes = [
  {
    en: 'A little Kanto nostalgia',
    de: 'Ein Stück Kanto',
    cards: [
      'bulbasaur',
      'squirtle',
      'pikachu',
      'venusaur',
      'blastoise',
      'charizard',
      'mew',
      'dragonite',
      'mewtwo',
    ],
  },
  {
    en: 'The art of collecting',
    de: 'Die Kunst des Sammelns',
    cards: [
      'leafeon',
      'suicune',
      'arceus',
      'gardevoir',
      'magikarp',
      'houndour',
      'sylveon',
      'groudon',
      'giratina',
    ],
  },
];

/** A digital pocket sheet. No physical pages, intersecting leaves or card-cover illusion. */
export function PocketCollection({ running }: { running: boolean }) {
  const { locale } = useLanguage();
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const sheets = root.current!.querySelectorAll('.pocket-theme');
        const tl = gsap.timeline({ paused: true, repeat: -1 });
        sheets.forEach((sheet, i) => {
          const at = i * 12;
          const incoming = sheet.querySelectorAll('.pocket-incoming');
          tl.fromTo(
            sheet,
            { autoAlpha: 0, x: 12 },
            { autoAlpha: 1, x: 0, duration: 1.1, ease: 'sine.inOut' },
            at,
          ).set(incoming, { autoAlpha: 0, y: -28, z: 35, rotationX: -8 }, at);
          incoming.forEach((card, n) => {
            tl.to(
              card,
              { autoAlpha: 1, y: 0, z: 0, rotationX: 0, duration: 1.65, ease: 'power2.out' },
              at + 1.4 + n * 1.65,
            );
          });
          tl.to(sheet, { autoAlpha: 0, x: -12, duration: 1.1, ease: 'sine.inOut' }, at + 10.9);
        });
        timeline.current = tl;
        return () => {
          tl.kill();
          timeline.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  useEffect(() => {
    timeline.current?.paused(!running);
  }, [running]);
  return (
    <div className="pocket-collection" ref={root} data-running={running} aria-hidden="true">
      {pocketThemes.map((theme, i) => (
        <div className="pocket-theme" key={theme.en} data-theme={i}>
          <div className="pocket-sheet">
            {theme.cards.map((id, n) => (
              <div className="digital-pocket" key={id}>
                <img
                  className={n > 5 ? 'pocket-incoming' : ''}
                  src={`/assets/card-${id}.webp`}
                  alt=""
                  width="660"
                  height="922"
                  loading="lazy"
                />
                <span className="pocket-lip" />
              </div>
            ))}
          </div>
          <span className="pocket-theme-name">{theme[locale]}</span>
        </div>
      ))}
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m4 10 4 4 8-8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OfflineCollection({ running }: { running: boolean }) {
  const { copy, locale } = useLanguage();
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const el = root.current!;
        const online = el.querySelector('.offline-connection-online');
        const local = el.querySelector('.offline-connection-local');
        const cards = el.querySelectorAll('.offline-find');
        const tl = gsap.timeline({ paused: true, repeat: -1 });
        cards.forEach((card, i) => {
          const at = i * 12;
          const match = card.querySelector('.offline-match');
          tl.fromTo(
            online,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 1, ease: 'sine.inOut' },
            at + 1,
          )
            .fromTo(local, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, at + 1.3)
            .fromTo(
              card,
              { autoAlpha: 0, y: 16 },
              { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power2.out' },
              at + 2.3,
            )
            .fromTo(
              match,
              { autoAlpha: 0, y: 6 },
              { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' },
              at + 4.3,
            )
            .to(card, { autoAlpha: 0, y: -8, duration: 1, ease: 'sine.inOut' }, at + 10)
            .to(local, { autoAlpha: 0, duration: 0.8 }, at + 10.8)
            .to(online, { autoAlpha: 1, duration: 1 }, at + 11);
        });
        timeline.current = tl;
        return () => {
          tl.kill();
          timeline.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  useEffect(() => {
    timeline.current?.paused(!running);
  }, [running]);
  return (
    <div className="offline-collection" ref={root} data-running={running} aria-hidden="true">
      <div className="offline-connection">
        <span className="offline-connection-online">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M3 8a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0m-9 4a4 4 0 0 1 6 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
          {locale === 'de' ? 'Verbunden' : 'Connected'}
        </span>
        <span className="offline-connection-local">
          <img src="/assets/orbit.svg" alt="" width="20" height="20" />
          {locale === 'de' ? 'Offline. Weiter sammeln.' : 'Offline. Still collecting.'}
        </span>
      </div>
      <div className="offline-find-space">
        {['lugia', 'arceus'].map((id) => (
          <div className="offline-find" key={id}>
            <img
              className="offline-found-card"
              src={`/assets/card-${id}.webp`}
              alt=""
              width="660"
              height="922"
              loading="lazy"
            />
            <div className="offline-match">
              <span className="offline-confirm">
                <Check />
              </span>
              <strong>{id === 'lugia' ? 'Lugia' : 'Arceus V'}</strong>
              <span>{locale === 'de' ? 'Auf dem Gerät erkannt' : 'Recognised on your device'}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="offline-pack">
        <i>
          <Check />
        </i>
        <div>
          <strong>{copy.features.pack}</strong>
          <span>{copy.features.ready}</span>
        </div>
        <b>100%</b>
      </div>
    </div>
  );
}
