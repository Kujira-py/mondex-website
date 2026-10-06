'use client';
// The page's scenes. Nothing is tied to the scroll position: parts start on
// .is-in (once), loops run while .is-playing, hover runs on the spring in
// motion.ts. Everything moves on transform and opacity.
import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { countUp } from './motion';
import { CardScreen, HomeScreen, Iphone, ScannerScreen } from './Device';
import type { HomeCopy } from './copy';
import { EN_SETS, JA_SETS, SET_COUNTS } from './sets';

const css = (vars: Record<string, string | number>) => vars as CSSProperties;

/** A heading whose words rise in one by one; the last part is the quieter second tone. */
export function Heading({
  parts,
  as: Tag = 'h2',
  id,
  inlineLast = false,
  className = '',
  kicker,
}: {
  parts: readonly string[];
  as?: 'h1' | 'h2';
  id?: string;
  inlineLast?: boolean;
  className?: string;
  /** A short line above the heading that belongs to it (the hero's “Pokémon card scanner”). */
  kicker?: ReactNode;
}) {
  let w = 0;
  return (
    <Tag className={`hd ${className}`} id={id} data-reveal>
      {kicker}
      {parts.map((part, i) => {
        const accent = i === parts.length - 1 && parts.length > 1;
        return (
          <Fragment key={i}>
            {/* A space before the break, so the heading reads as words in text form too. */}
            {i > 0 ? (
              inlineLast && i === parts.length - 1 ? (
                ' '
              ) : (
                <>
                  {' '}
                  <br />
                </>
              )
            ) : null}
            <span className={accent ? 'hd-accent' : undefined}>
              {part.split(' ').map((word, j) => (
                <Fragment key={j}>
                  {j > 0 ? ' ' : null}
                  <span className="hd-w" style={css({ '--w': w++ })}>
                    {word}
                  </span>
                </Fragment>
              ))}
            </span>
          </Fragment>
        );
      })}
    </Tag>
  );
}

/** A card face that tilts toward the pointer, with a foil that catches the light. */
export function Holo({
  src,
  w = 460,
  className = '',
  strength = 18,
  lazy = true,
  srcSet,
  sizes,
}: {
  src: string;
  w?: number;
  className?: string;
  strength?: number;
  lazy?: boolean;
  srcSet?: string;
  sizes?: string;
}) {
  return (
    <span className={`holo-card ${className}`} data-tilt={strength}>
      <span className="tf">
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt=""
          width={w}
          height={Math.round(w * 1.395)}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
        />
        <span className="holo-foil" />
        <span className="holo-glare" />
      </span>
    </span>
  );
}

/** Two words that turn into each other, letter by letter. */
function FlipText({ a, b, className = '' }: { a: string; b: string; className?: string }) {
  const letters = (word: string) =>
    [...word].map((ch, i) => (
      <i key={i} style={css({ '--i': i })}>
        {ch === ' ' ? ' ' : ch}
      </i>
    ));
  return (
    <span className={`flip ${className}`} aria-hidden="true">
      <span className="flip-a">{letters(a)}</span>
      <span className="flip-b">{letters(b)}</span>
    </span>
  );
}

// ——— Hero ———
const FAN = ['umbreon', 'mew', 'charizard', 'gengar', 'pikachu', 'rayquaza'] as const;

export function HeroStage({ c }: { c: HomeCopy }) {
  return (
    <div className="hs" data-play>
      <div className="hs-fan">
        {FAN.map((art, i) => (
          <span
            key={art}
            className="hs-slot"
            style={css({ '--k': i - 2.5, '--ak': Math.abs(i - 2.5), '--n': i })}
          >
            <span className="hs-float">
              <Holo
                src={`/assets/card-${art}-460.webp`}
                srcSet={`/assets/card-${art}-300.webp 300w, /assets/card-${art}-460.webp 460w`}
                sizes="(min-width: 960px) 230px, 44vw"
                lazy={false}
              />
            </span>
          </span>
        ))}
      </div>
      <div className="hs-phone-wrap" data-tilt="8">
        <Iphone className="hs-phone">
          <HomeScreen t={c.home} />
        </Iphone>
        <span className="hs-chip hs-chip0">
          <img src="/assets/card-charizard-300.webp" alt="" width={300} height={419} />
          <span>
            <b>{c.hero.chips[0][0]}</b>
            <small>{c.hero.chips[0][1]}</small>
          </span>
          <i className="ok" />
        </span>
        <span className="hs-chip hs-chip1">
          <img className="mon" src="/assets/pokemon-6-160.webp" alt="" width={160} height={160} />
          <span>
            <small>{c.hero.chips[1][0]}</small>
            <b>{c.hero.chips[1][1]}</b>
          </span>
        </span>
        <span className="hs-chip hs-chip2">
          <span className="ring" style={css({ '--v': 142 / 151 })} />
          <span>
            <b>{c.hero.chips[2][0]}</b>
            <small>{c.hero.chips[2][1]}</small>
          </span>
        </span>
      </div>
    </div>
  );
}

// ——— Statement: one short line, revealed once ———
export function Statement({ text }: { text: string }) {
  return (
    <p className="st-text" data-reveal>
      {text.split(' ').map((token, i) => {
        const pic = token.match(/^\{(\w+)(?::([\w-]+))?\}$/);
        const style = css({ '--i': i });
        if (!pic)
          return (
            <span key={i} className="st-w" style={style}>
              {token}{' '}
            </span>
          );
        const [, kind, value] = pic;
        return (
          <span key={i} className={`st-pic st-${kind}`} style={style} aria-hidden="true">
            {kind === 'card' ? (
              <img src={`/assets/card-${value}-300.webp`} alt="" width={300} height={419} />
            ) : (
              <img src="/assets/orbit.svg" alt="" width={40} height={40} />
            )}{' '}
          </span>
        );
      })}
    </p>
  );
}

// ——— Scanning: the phone plays Auto by itself while it is on screen ———
const POINT_ICONS = [
  <path key="a" d="M4 9V5h4M16 5h4v4M20 15v4h-4M8 19H4v-4M9 12l2 2 4-4" />,
  <path key="b" d="M8 4h11v14M5 7h11v14H5z" />,
  <path key="c" d="M7 18h10a4 4 0 0 0 .8-7.9A6 6 0 0 0 6.2 9.6 4.3 4.3 0 0 0 7 18ZM4 4l16 16" />,
];

export function ScanShowcase({ c }: { c: HomeCopy['scan'] }) {
  return (
    <div className="sc">
      <div className="sc-copy">
        <p className="eyebrow">{c.eyebrow}</p>
        <Heading parts={c.title} id="scan-title" />
        <p className="sc-speed" data-reveal>
          <span className="sc-clock" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <circle className="sc-clock-track" cx="24" cy="24" r="21" />
              <circle className="sc-clock-run" cx="24" cy="24" r="21" pathLength="1" />
              <path className="sc-clock-ok" d="M16 24.5l5.5 5.5L32.5 19" pathLength="1" />
            </svg>
          </span>
          <strong>
            {c.speed[0]}
            <span> s</span>
          </strong>
          <span className="sc-speed-text">
            <b>{c.speed[1]}</b>
            <small>{c.speed[2]}</small>
          </span>
        </p>
        <ul className="sc-points">
          {c.points.map(([title, body], i) => (
            <li key={title} data-reveal style={css({ '--i': i })}>
              <span className="sc-icon">
                <svg viewBox="0 0 24 24">{POINT_ICONS[i]}</svg>
              </span>
              <span>
                <b>{title}</b>
                <small>{body}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="sc-stage" data-play data-reveal>
        <span className="sc-halo" />
        <span className="sc-device">
          <Iphone className="sc-phone" dark>
            <ScannerScreen t={c.screen} />
          </Iphone>
        </span>
        {c.chips.map((chip, j) => (
          <span key={chip} className={`sc-chip sc-chip${j}`}>
            <i />
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

// ——— Pokédex orbit ———
const INNER = [1, 25, 4, 133, 7, 94, 54, 150, 129, 197, 143, 151, 149, 175, 155, 282, 257, 249];
const UNSEEN = new Set([4, 54, 129, 143, 175, 257, 249, 155]);
const OUTER = [
  2, 3, 5, 6, 8, 9, 10, 11, 12, 142, 245, 258, 384, 393, 448, 470, 487, 493, 495, 570, 607, 643,
  658, 700,
];

export function DexOrbit({ c, locale }: { c: HomeCopy['dex']; locale: 'en' | 'de' }) {
  const counter = useRef<HTMLSpanElement>(null);
  useEffect(
    () =>
      counter.current
        ? countUp(counter.current, 280, 312, locale === 'de' ? 'de-DE' : 'en-US', 1800)
        : undefined,
    [locale],
  );
  let unseen = 0;
  return (
    <div className="dx-orbit" data-play data-moving>
      <div className="dx-ring dx-r2">
        {OUTER.map((id, i) => (
          <span
            key={id}
            className="dx-tile"
            data-hover
            style={css({ '--a': `${(360 / OUTER.length) * i}deg` })}
          >
            <span className="dx-in">
              <img
                className={i % 3 === 1 ? '' : 'is-shadow'}
                src={`/assets/pokemon-${id}-160.webp`}
                alt=""
                width={160}
                height={160}
                loading="lazy"
                decoding="async"
              />
            </span>
          </span>
        ))}
      </div>
      <div className="dx-ring dx-r1">
        {INNER.map((id, i) => {
          const hidden = UNSEEN.has(id);
          const d = hidden ? unseen++ : 0;
          return (
            <span
              key={id}
              className={`dx-tile ${hidden ? 'is-found' : ''}`}
              data-hover
              style={css({ '--a': `${(360 / INNER.length) * i}deg`, '--d': `${d * 1.6}s` })}
            >
              <span className="dx-in" tabIndex={-1}>
                <img
                  className="is-shadow"
                  src={`/assets/pokemon-${id}-160.webp`}
                  alt=""
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className="is-colour"
                  src={`/assets/pokemon-${id}-160.webp`}
                  alt=""
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                />
                <span className="dx-name">{c.names[id]}</span>
              </span>
            </span>
          );
        })}
      </div>
      <div className="dx-core">
        <span className="dx-count" ref={counter}>
          312
        </span>
        <span className="dx-of">{c.counter}</span>
        <span className="dx-new">
          <img src="/assets/pokemon-6-160.webp" alt="" width={160} height={160} loading="lazy" />
          {c.fresh}
        </span>
      </div>
    </div>
  );
}

// ——— Prices: one card, every market around it ———
export function PriceShowcase({ c }: { c: HomeCopy['prices'] }) {
  return (
    <div className="pr">
      <article className="pr-main" data-reveal data-play data-spot>
        <div className="pr-text">
          <h3>{c.markets.title}</h3>
          <p>{c.markets.body}</p>
        </div>
        <div className="pr-stage">
          <Iphone className="pr-phone">
            <CardScreen t={c.card} compact />
          </Iphone>
          {c.card.boxes.map(([market, value, label], i) => (
            <div key={market} className={`pr-box b${i}`} style={css({ '--i': i })}>
              <b>
                <i />
                {market}
              </b>
              <strong>{value}</strong>
              <small>{label}</small>
            </div>
          ))}
        </div>
      </article>
      <article className="pr-tile pr-alerts" data-reveal data-spot>
        <div className="pr-text">
          <h3>{c.alerts.title}</h3>
          <p>{c.alerts.body}</p>
        </div>
        <AlertScene c={c.alerts} />
      </article>
      <article className="pr-tile pr-hide" data-reveal data-play data-spot>
        <div className="pr-text">
          <h3>{c.hide.title}</h3>
          <p>{c.hide.body}</p>
        </div>
        <HideValues c={c.hide} />
      </article>
    </div>
  );
}

function AlertScene({ c }: { c: HomeCopy['prices']['alerts'] }) {
  return (
    <div className="al" aria-hidden="true">
      <div className="al-push">
        <span className="al-app">
          <img src="/assets/orbit.svg" alt="" width={24} height={24} />
        </span>
        <span className="al-text">
          <b>{c.push[0]}</b>
          <span>{c.push[1]}</span>
        </span>
        <small>{c.push[2]}</small>
      </div>
      <div className="al-card">
        <div className="al-head">
          <img
            src="/assets/card-charizard-300.webp"
            alt=""
            width={300}
            height={419}
            loading="lazy"
          />
          <span>
            <b>{c.tracker[0]}</b>
            <small>{c.tracker[1]}</small>
            <strong>{c.tracker[2]}</strong>
          </span>
          <em>{c.tracker[3]}</em>
        </div>
        <span className="al-reached">✓ {c.tracker[4]}</span>
        <svg className="al-chart" viewBox="0 0 320 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="al-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#7554bd" stopOpacity="0.22" />
              <stop offset="1" stopColor="#7554bd" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line className="al-target" x1="0" x2="320" y1="34" y2="34" />
          <path
            className="al-area"
            d="M0 96 L28 90 L56 98 L84 84 L112 89 L140 76 L168 82 L196 72 L224 66 L252 70 L280 46 L304 22 L304 120 L0 120 Z"
          />
          <path
            className="al-line"
            pathLength="1"
            d="M0 96 L28 90 L56 98 L84 84 L112 89 L140 76 L168 82 L196 72 L224 66 L252 70 L280 46 L304 22"
          />
          <circle className="al-dot" cx="304" cy="22" r="5" />
        </svg>
      </div>
    </div>
  );
}

function HideValues({ c }: { c: HomeCopy['prices']['hide'] }) {
  const [shown, setShown] = useState(true);
  const touched = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  // Until someone uses the switch, it shows itself off while on screen.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      const playing = root.current?.closest('.is-playing');
      if (!touched.current && playing) setShown((v) => !v);
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className={`hv ${shown ? '' : 'is-hidden'}`} ref={root}>
      <label className="hv-switch">
        <span>{c.toggle}</span>
        <input
          type="checkbox"
          role="switch"
          checked={shown}
          onChange={(e) => {
            touched.current = true;
            setShown(e.target.checked);
          }}
        />
        <i aria-hidden="true" />
      </label>
      <ul>
        {c.rows.map(([name, meta, price, art]) => (
          <li key={name}>
            <img
              src={`/assets/card-${art}-300.webp`}
              alt=""
              width={300}
              height={419}
              loading="lazy"
            />
            <span>
              <b>{name}</b>
              <small>{meta}</small>
            </span>
            <em aria-hidden={!shown}>
              <span className="hv-price">{price}</span>
              <span className="hv-dots">•••</span>
            </em>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ——— Catalogue marquee ———
const ROW_A = [
  'charizard',
  'umbreon',
  'mew',
  'pikachu',
  'gengar',
  'rayquaza',
  'lugia',
  'sylveon',
  'eevee',
  'mewtwo',
  'gardevoir',
  'dragonite',
  'suicune',
  'giratina',
  'arceus',
];
const ROW_B = [
  'blastoise',
  'venusaur',
  'leafeon',
  'tyranitar',
  'reshiram',
  'xerneas',
  'dialga',
  'groudon',
  'blaziken',
  'aerodactyl',
  'magikarp',
  'houndour',
  'squirtle',
  'bulbasaur',
  'iron-leaves',
];

export function Marquee() {
  return (
    <div className="mq" data-play data-moving aria-hidden="true">
      {[ROW_A, ROW_B].map((row, r) => (
        <div key={r} className={`mq-row mq-row${r}`}>
          <div className="mq-track">
            {[...row, ...row].map((art, i) => (
              <span key={i} className="mq-card">
                <Holo src={`/assets/card-${art}-300.webp`} w={300} strength={18} />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** The sets the app knows, English and Japanese: two slow rows of logos. */
export function SetRows({ c }: { c: HomeCopy['catalogue'] }) {
  const rows = [
    { sets: EN_SETS, label: c.sets[0], count: SET_COUNTS.en, lang: 'en' },
    { sets: JA_SETS, label: c.sets[1], count: SET_COUNTS.ja, lang: 'ja' },
  ];
  return (
    <div className="sr" data-play>
      {rows.map((row) => (
        <div key={row.lang} className={`sr-row sr-${row.lang}`}>
          <p className="sr-label">
            <b>{row.label}</b>
            <span>
              {row.count}+ {c.sets[2]}
            </span>
          </p>
          <div className="sr-view">
            <div className="sr-track">
              {/* The row runs twice for a seamless loop; only the first copy is named. */}
              {[...row.sets, ...row.sets].map(([id, name, w, h], i) => (
                <img
                  key={i}
                  src={`/assets/sets/${id}.webp`}
                  alt={i < row.sets.length ? name : ''}
                  aria-hidden={i < row.sets.length ? undefined : true}
                  width={w}
                  height={h}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ——— Everything else: small tiles that come alive ———
export function Bento({ c }: { c: HomeCopy['more'] }) {
  return (
    <ul className="bt-grid" data-play>
      <li className="bt bt-lang" data-reveal data-spot>
        <div className="bt-art">
          <Holo src="/assets/card-charizard-300.webp" w={300} className="bt-card" />
          <span className="bt-lang-name">
            <span className="bt-flags" aria-hidden="true">
              <i className="f0">EN</i>
              <i className="f1">DE</i>
            </span>
            <FlipText a={c.langDemo[0]} b={c.langDemo[1]} />
          </span>
        </div>
        <h3>{c.lang[0]}</h3>
        <p>{c.lang[1]}</p>
      </li>
      <li className="bt bt-jp" data-reveal data-spot>
        <div className="bt-art">
          <span className="bt-seg" aria-hidden="true">
            <i />
            <span>EN</span>
            <span>JP</span>
          </span>
          <FlipText a={c.jpDemo[1].split(' · ')[0]} b={c.jpDemo[0]} className="is-jp" />
        </div>
        <h3>{c.jp[0]}</h3>
        <p>{c.jp[1]}</p>
      </li>
      <li className="bt bt-import" data-reveal data-spot>
        <div className="bt-art" aria-hidden="true">
          <span className="bt-sheet">
            <b>{c.importDemo[0]}</b>
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="bt-flight">
            {['mew', 'pikachu', 'umbreon'].map((art, i) => (
              <img
                key={art}
                src={`/assets/card-${art}-300.webp`}
                alt=""
                width={300}
                height={419}
                loading="lazy"
                style={css({ '--i': i })}
              />
            ))}
          </span>
          <span className="bt-hub">
            <img src="/assets/orbit.svg" alt="" width={36} height={36} />
          </span>
          <span className="bt-done">✓ {c.importDemo[1]}</span>
        </div>
        <h3>{c.import[0]}</h3>
        <p>{c.import[1]}</p>
      </li>
      <li className="bt bt-offline" data-reveal data-spot>
        <div className="bt-art" aria-hidden="true">
          <span className="bt-toggle">
            <svg viewBox="0 0 24 24">
              <path d="M10.5 3.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V9l7 4v2l-7-2v5l2 1.5V21L12 20l-3.5 1v-1.5l2-1.5v-5l-7 2v-2l7-4z" />
            </svg>
            {c.offlineDemo[0]}
            <i />
          </span>
          <span className="bt-row">
            <img
              src="/assets/card-charizard-300.webp"
              alt=""
              width={300}
              height={419}
              loading="lazy"
            />
            <span>
              <b>{c.offlineDemo[1]}</b>
              <small>{c.offlineDemo[2]}</small>
            </span>
            <i />
          </span>
        </div>
        <h3>{c.offline[0]}</h3>
        <p>{c.offline[1]}</p>
      </li>
      <li className="bt bt-widget" data-reveal data-spot>
        <div className="bt-art" aria-hidden="true">
          <span className="bt-wg">
            <span className="bt-wg-ring" style={css({ '--v': 142 / 151 })}>
              <img
                src="/assets/pokemon-25-160.webp"
                alt=""
                width={160}
                height={160}
                loading="lazy"
              />
            </span>
            <b>{c.widgetDemo[0]}</b>
            <small>{c.widgetDemo[1]}</small>
          </span>
          <span className="bt-wg is-small">
            <b>15</b>
            <small>{c.widgetDemo[2]}</small>
          </span>
        </div>
        <h3>{c.widget[0]}</h3>
        <p>{c.widget[1]}</p>
      </li>
      <li className="bt bt-goals" data-reveal data-spot>
        <div className="bt-art" aria-hidden="true">
          {c.goalsDemo.map(([name, value, share], i) => (
            <span
              key={name}
              className={`bt-goal ${share === '1' ? 'is-done' : ''}`}
              style={css({ '--v': share, '--i': i })}
            >
              <img
                src={`/assets/pokemon-${[151, 6, 257][i]}-160.webp`}
                alt=""
                width={160}
                height={160}
                loading="lazy"
              />
              <span>
                <b>{name}</b>
                <i>
                  <i />
                </i>
              </span>
              <small>
                {share === '1' ? '★ ' : ''}
                {value}
              </small>
            </span>
          ))}
        </div>
        <h3>{c.goals[0]}</h3>
        <p>{c.goals[1]}</p>
      </li>
    </ul>
  );
}

// ——— Plus ———
export function Plans({ c }: { c: HomeCopy['plus'] }) {
  const [yearly, setYearly] = useState(true);
  return (
    <>
      <div className="pl-switch" role="radiogroup" aria-label={c.paid.name} data-reveal>
        <span className="pl-thumb" style={css({ '--x': yearly ? 1 : 0 })} />
        <button type="button" role="radio" aria-checked={!yearly} onClick={() => setYearly(false)}>
          {c.billing[0]}
        </button>
        <button type="button" role="radio" aria-checked={yearly} onClick={() => setYearly(true)}>
          {c.billing[1]} <em>{c.save}</em>
        </button>
      </div>
      <div className="pl-grid">
        <div className="pl-card" data-reveal>
          <h3>{c.free.name}</h3>
          <p className="pl-price">
            {c.free.price} <small>{c.free.per}</small>
          </p>
          <ul>
            {c.free.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="pl-card is-plus" data-reveal data-tilt="5">
          <div className="tf">
            <h3>
              <img src="/assets/orbit.svg" alt="" width={22} height={22} /> {c.paid.name}
            </h3>
            <p className="pl-price" key={yearly ? 'y' : 'm'}>
              {yearly ? c.paid.year : c.paid.month}{' '}
              <small>{yearly ? c.paid.perYear : c.paid.perMonth}</small>
            </p>
            <p className="pl-note">{yearly ? c.paid.yearNote : ' '}</p>
            <ul>
              {c.paid.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="pl-week" data-reveal>
        <div className="pl-days" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <i key={i} style={css({ '--i': i })} />
          ))}
          <small>{c.days[0]}</small>
          <small>{c.days[1]}</small>
        </div>
        <p>
          <b>{c.week}</b> {c.weekNote} <span>{c.invite}</span>
        </p>
      </div>
    </>
  );
}

// ——— FAQ ———
export function Faq({ items, live }: { items: readonly (readonly string[])[]; live: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <div className="fq">
      {items.map((item, i) => (
        <div key={item[0]} className={`fq-item ${open === i ? 'is-open' : ''}`} data-reveal>
          <h3>
            <button
              type="button"
              aria-expanded={open === i}
              aria-controls={`${id}-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {item[0]}
              <span aria-hidden="true" />
            </button>
          </h3>
          <div className="fq-body" id={`${id}-${i}`} role="region">
            <div>
              <p>{(live && item[2]) || item[1]}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ——— Final ———
const ORBITING = ['charizard', 'mew', 'pikachu', 'umbreon', 'gengar'] as const;

export function FinalOrbit({ children }: { children: ReactNode }) {
  return (
    <div className="fo" data-play>
      <div className="fo-stage" aria-hidden="true">
        <span className="fo-ring fo-r1" />
        <span className="fo-ring fo-r2" />
        <span className="fo-ring fo-r3" />
        <img
          className="fo-logo"
          src="/assets/orbit.svg"
          alt=""
          width={96}
          height={96}
          loading="lazy"
        />
        <div className="fo-cards">
          {ORBITING.map((art, i) => (
            <span
              key={art}
              className="fo-card"
              style={css({ '--a': `${(360 / ORBITING.length) * i}deg` })}
            >
              <span className="fo-in">
                <img
                  src={`/assets/card-${art}-300.webp`}
                  alt=""
                  width={300}
                  height={419}
                  loading="lazy"
                  decoding="async"
                />
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="fo-core">{children}</div>
    </div>
  );
}
