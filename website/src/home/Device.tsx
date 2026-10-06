'use client';
// An iPhone 17 Pro drawn in CSS (titanium band, buttons, Dynamic Island,
// glass), and the MonDex screens drawn in HTML inside it, so every part of
// them can move. Screen sizes are in app points: 1pt = 100cqw / 402.
import type { CSSProperties, ReactNode } from 'react';

export function Iphone({
  children,
  className = '',
  dark = false,
  style,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={`ip ${className}`} style={style} aria-hidden="true">
      <span className="ip-side" />
      <span className="ip-btn ip-action" />
      <span className="ip-btn ip-up" />
      <span className="ip-btn ip-down" />
      <span className="ip-btn ip-power" />
      <div className="ip-band">
        <div className={`ip-screen ${dark ? 'is-dark' : ''}`}>
          {children}
          <span className="ip-island" />
          <span className="ip-glass" />
        </div>
      </div>
    </div>
  );
}

export function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div className={`ap-status ${light ? 'is-light' : ''}`}>
      <b>9:41</b>
      <span>
        <svg viewBox="0 0 18 12" width="18" height="12">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" width="16" height="12">
          <path d="M8 2.2c2.4 0 4.6.9 6.2 2.5l1.3-1.3A10.6 10.6 0 0 0 8 .4C5.1.4 2.4 1.5.5 3.4l1.3 1.3A8.8 8.8 0 0 1 8 2.2Zm0 3.6c1.4 0 2.7.5 3.7 1.4l1.3-1.3A7.1 7.1 0 0 0 8 4c-1.9 0-3.6.7-5 1.9l1.3 1.3c1-.9 2.3-1.4 3.7-1.4Zm0 3.6c.5 0 1 .2 1.3.5L8 11.2 6.7 9.9c.3-.3.8-.5 1.3-.5Z" />
        </svg>
        <i className="ap-battery">
          <i />
        </i>
      </span>
    </div>
  );
}

const TAB_ICONS: Record<string, ReactNode> = {
  home: <path d="M4 11.2 12 4l8 7.2V20h-5.4v-5.2H9.4V20H4z" />,
  dex: (
    <>
      <path d="M6 4h11a1 1 0 0 1 1 1v15H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Z" />
      <path d="M5 18a2 2 0 0 1 2-2h11" />
    </>
  ),
  scan: <path d="M4 9V5h4M16 5h4v4M20 15v4h-4M8 19H4v-4" />,
  cards: (
    <>
      <rect x="8" y="3.5" width="11" height="14" rx="2" />
      <path d="M5 7v11a2.5 2.5 0 0 0 2.5 2.5H15" />
    </>
  ),
  value: <path d="M4 18l5-6 4 3 7-8M4 21h16" />,
};

export function TabBar({ active, labels }: { active: string; labels: readonly string[] }) {
  return (
    <div className="ap-tabs">
      <div className="ap-tabs-pill">
        {['home', 'dex', 'scan', 'cards', 'value'].map((key, i) => (
          <span key={key} className={key === active ? 'is-active' : ''}>
            <svg viewBox="0 0 24 24">{TAB_ICONS[key]}</svg>
            {labels[i]}
          </span>
        ))}
      </div>
      <span className="ap-tabs-search">
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      </span>
    </div>
  );
}

export function OrbitWord({ word }: { word: string }) {
  // "Home" with the Orbit mark as its o, as the app's page titles do.
  const i = word.toLowerCase().indexOf('o');
  if (i < 0) return <>{word}</>;
  return (
    <>
      {word.slice(0, i)}
      <img className="ap-orbit-o" src="/assets/orbit.svg" alt="" width={24} height={24} />
      {word.slice(i + 1)}
    </>
  );
}

type HomeText = {
  title: string;
  collection: string;
  cards: string;
  pokedex: string;
  edit: string;
  continueLabel: string;
  path: string;
  togo: string;
  viewDex: string;
  recent: string;
  tabs: readonly string[];
};

/** The app's Home tab, as it is on main. */
export function HomeScreen({ t }: { t: HomeText }) {
  return (
    <div className="ap ap-home">
      <StatusBar />
      <div className="ap-head">
        <b className="ap-title">
          <OrbitWord word={t.title} />
        </b>
        <span className="ap-avatar">L</span>
      </div>
      <div className="ap-collection">
        <small>{t.collection}</small>
        <p>
          <b>15</b> {t.cards}
        </p>
        <div className="ap-dexline">
          <span>{t.pokedex}</span>
          <span>10 / 1,025</span>
        </div>
        <i className="ap-bar">
          <i style={{ width: '4%' }} />
        </i>
        <div className="ap-minifan">
          <img
            src="/assets/card-charizard-300.webp"
            alt=""
            width={300}
            height={419}
            decoding="async"
          />
          <img
            src="/assets/card-gengar-300.webp"
            alt=""
            width={300}
            height={419}
            decoding="async"
          />
          <img
            src="/assets/card-umbreon-300.webp"
            alt=""
            width={300}
            height={419}
            decoding="async"
          />
        </div>
      </div>
      <div className="ap-dots">
        <span>
          <i className="is-on" />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>{t.edit} ›</span>
      </div>
      <div className="ap-goal">
        <small>{t.continueLabel}</small>
        <div className="ap-goal-row">
          <b>{t.path}</b>
          <span>
            <b>9</b> / 151
          </span>
        </div>
        <i className="ap-bar">
          <i style={{ width: '6%' }} />
        </i>
        <div className="ap-goal-row is-small">
          <span>{t.togo}</span>
          <span className="ap-ink">{t.viewDex} ›</span>
        </div>
        <div className="ap-shadows">
          {[1, 4, 5, 8, 9].map((n) => (
            <img
              key={n}
              src={`/assets/pokemon-${n}-160.webp`}
              alt=""
              width={160}
              height={160}
              decoding="async"
            />
          ))}
          <span>+137</span>
        </div>
      </div>
      <div className="ap-recent">
        <b>{t.recent} ›</b>
        <div>
          {['gengar', 'mew', 'pikachu', 'umbreon'].map((card) => (
            <img
              key={card}
              src={`/assets/card-${card}-300.webp`}
              alt=""
              width={300}
              height={419}
              decoding="async"
            />
          ))}
        </div>
      </div>
      <TabBar active="home" labels={t.tabs} />
    </div>
  );
}

type ScanText = {
  modes: readonly string[];
  cards: readonly (readonly string[])[];
  total: readonly string[];
};

const SCAN_ART = ['charizard', 'mew', 'pikachu'] as const;

/** Auto, driven by the scene's --p: three cards come in, lock, and are filed. */
export function ScannerScreen({ t }: { t: ScanText }) {
  return (
    <div className="ap ap-scan">
      <StatusBar light />
      <div className="ap-scan-top">
        <span className="ap-round">
          <svg viewBox="0 0 24 24">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </span>
        <span className="ap-scan-total">
          {t.total.map((label, k) => (
            <b
              key={k}
              className={k === 1 ? 'is-first' : undefined}
              style={{ '--k': k } as CSSProperties}
            >
              {label}
            </b>
          ))}
        </span>
        <span className="ap-round">
          <svg viewBox="0 0 24 24">
            <path d="M13 3 6 13h5l-1 8 7-10h-5z" />
          </svg>
        </span>
      </div>
      <div className="ap-scan-frame">
        <i className="c1" />
        <i className="c2" />
        <i className="c3" />
        <i className="c4" />
        {SCAN_ART.map((art, i) => (
          <div
            key={art}
            className={`ap-scan-card ${i === 0 ? 'is-first' : ''}`}
            style={{ '--i': i } as CSSProperties}
          >
            <img
              src={`/assets/card-${art}-460.webp`}
              alt=""
              width={460}
              height={642}
              loading="lazy"
              decoding="async"
            />
            <span className="ap-scan-lock" />
          </div>
        ))}
      </div>
      {t.cards.map(([name, meta, price], i) => (
        <div
          key={name}
          className={`ap-scan-result ${i === 0 ? 'is-first' : ''}`}
          style={{ '--i': i } as CSSProperties}
        >
          <img
            src={`/assets/card-${SCAN_ART[i]}-300.webp`}
            alt=""
            width={300}
            height={419}
            loading="lazy"
            decoding="async"
          />
          <span>
            <b>{name}</b>
            <small>{meta}</small>
          </span>
          <em>{price}</em>
          <i />
        </div>
      ))}
      <div className="ap-scan-modes">
        <span className="is-on">{t.modes[0]}</span>
        <span>{t.modes[1]}</span>
      </div>
      <div className="ap-scan-tray">
        {SCAN_ART.map((art, i) => (
          <img
            key={art}
            src={`/assets/card-${art}-300.webp`}
            alt=""
            width={300}
            height={419}
            loading="lazy"
            decoding="async"
            className={i === 0 ? 'is-first' : undefined}
            style={{ '--i': i } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

type CardText = {
  name: string;
  number: string;
  set: string;
  track: string;
  rarity: string;
  manage: string;
  yours: [string, string];
  boxes: readonly (readonly string[])[];
};

/** A card's window: the art, then the four market boxes. */
export function CardScreen({ t, compact = false }: { t: CardText; compact?: boolean }) {
  return (
    <div className="ap ap-card">
      <StatusBar />
      <div className="ap-card-scroll">
        <div className="ap-card-art">
          <img
            src="/assets/card-mew-460.webp"
            alt=""
            width={460}
            height={642}
            loading="lazy"
            decoding="async"
          />
          <span className="holo" />
        </div>
        <div className="ap-card-title">
          <b>{t.name}</b>
          <span>{t.number}</span>
        </div>
        <div className="ap-card-row">
          <span className="ap-chip">{t.set}</span>
          <span className="ap-chip is-track">{t.track}</span>
        </div>
        <small className="ap-rarity">★★ {t.rarity}</small>
        <div className="ap-card-row">
          <span className="ap-manage">{t.manage}</span>
          <span className="ap-yours">
            <small>{t.yours[0]}</small>
            <b>{t.yours[1]}</b>
          </span>
        </div>
        {compact ? null : (
          <div className="ap-markets">
            {t.boxes.map(([market, value, label], i) => (
              <div key={market} className={`ap-market m${i}`}>
                <b className="ap-market-name">{market}</b>
                <strong>{value}</strong>
                <small>{label}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
