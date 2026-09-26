'use client';
// The quiet sections: they rise in once, and a few details answer a touch.
import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { onceInView } from './motion';
import type { HomeCopy } from './copy';

/** Children rise in once when they come into view (CSS does the motion). */
export function Reveal({ children, className = '', as: Tag = 'div', lock = false }: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'header';
  /** Framed by the scanner's corners under the pointer. */
  lock?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => (ref.current ? onceInView(ref.current, () => setShown(true), 0.2) : undefined), []);
  return (
    <Tag ref={ref as never} className={`mx-reveal ${shown ? 'is-in' : ''} ${className}`} data-lock={lock || undefined}>
      {children}
    </Tag>
  );
}

export function Title({ lines, as: Tag = 'h2' }: { lines: readonly string[]; as?: 'h1' | 'h2' }) {
  return (
    <Tag className="mx-title">
      {lines[0]}
      <br />
      <span className="mx-accent">{lines[1]}</span>
    </Tag>
  );
}

export function Phone({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return (
    <div className="mx-phone" data-lock>
      <img src={src} alt={alt} width={660} height={1434} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </div>
  );
}

const CARDS = [
  ['card-charizard', 'Charizard ex', '199/165', '$352'],
  ['card-umbreon', 'Umbreon VMAX', '215/203', '$1,024'],
  ['card-pikachu', 'Pikachu', '173/165', '$76'],
] as const;

// A page of Pokémon 151 (all real sv3pt5 cards): owned in colour, missing pale.
const SET_PAGE = [
  ['bulbasaur', true], ['squirtle', false], ['pikachu', true], ['venusaur', false],
  ['charizard', true], ['blastoise', true], ['mew', true],
] as const;

// Real paths from the app (goals.mjs); the progress is example data.
const GOALS = [
  { portrait: 25, share: 142 / 151 },
  { portrait: 6, share: 18 / 25 },
  { portrait: 257, share: 1 },
];

export function Collection({ c }: { c: HomeCopy['collection'] }) {
  const [values, setValues] = useState(true);
  return (
    <div className="mx-bento">
      <Reveal className="mx-tile mx-tile-sets" lock>
        <h3>{c.sets[0]}</h3>
        <p>{c.sets[1]}</p>
        <div className="mx-set">
          <div className="mx-set-head">
            <b>{c.setName}</b>
            <span>{c.setProgress}</span>
          </div>
          <div className="mx-bar">
            <span />
          </div>
          <div className="mx-missing">
            {SET_PAGE.map(([card, owned]) => (
              <img key={card} src={`/assets/card-${card}.webp`} alt="" loading="lazy" className={owned ? 'is-owned' : ''} />
            ))}
            <span className="mx-pocket" aria-hidden="true" />
          </div>
        </div>
      </Reveal>
      <Reveal className="mx-tile mx-tile-values" lock>
        <h3>{c.values[0]}</h3>
        <p>{c.values[1]}</p>
        <label className="mx-switch">
          <span>{c.valuesToggle}</span>
          <input type="checkbox" role="switch" checked={values} onChange={(e) => setValues(e.target.checked)} />
          <i aria-hidden="true" />
        </label>
        <ul className={`mx-values ${values ? '' : 'is-hidden'}`}>
          {CARDS.map(([img, name, number, price]) => (
            <li key={img}>
              <img src={`/assets/${img}.webp`} alt="" loading="lazy" />
              <span>
                <b>{name}</b>
                <small>{number}</small>
              </span>
              <em aria-hidden={!values}>{price}</em>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal className="mx-tile mx-tile-goals" lock>
        <h3>{c.goals[0]}</h3>
        <p>{c.goals[1]}</p>
        <ul className="mx-goals">
          {c.goalItems.map(([name, progress], i) => (
            <li key={name} className={i === 2 ? 'is-earned' : ''} style={{ '--goal': GOALS[i].share } as CSSProperties}>
              <img src={`/assets/pokemon-${GOALS[i].portrait}.webp`} alt="" loading="lazy" />
              <span>
                <b>{name}</b>
                <i aria-hidden="true">
                  <em />
                </i>
              </span>
              <small>{i === 2 ? <span className="mx-star" aria-hidden="true">★</span> : null}{progress}</small>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

export function Faq({ items }: { items: readonly (readonly [string, string])[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <div className="mx-faq">
      {items.map(([question, answer], i) => (
        <div key={question} className={`mx-qa ${open === i ? 'is-open' : ''}`}>
          <h3>
            <button
              type="button"
              aria-expanded={open === i}
              aria-controls={`${id}-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {question}
              <span className="mx-plus" aria-hidden="true" />
            </button>
          </h3>
          <div className="mx-answer" id={`${id}-${i}`} role="region">
            <div>
              <p>{answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const ENDPOINT = 'https://mondex-api.onrender.com/api/v1/waitlist';

export function Waitlist({ c, locale, compact = false }: {
  c: HomeCopy['waitlist'];
  locale: 'en' | 'de';
  compact?: boolean;
}) {
  const id = useId();
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [error, setError] = useState<'email' | 'rate' | 'server' | null>(null);
  const input = useRef<HTMLInputElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'busy') return;
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get('email') || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email');
      input.current?.focus();
      return;
    }
    setState('busy');
    setError(null);
    try {
      const campaign = new URLSearchParams(window.location.search).get('utm_campaign')?.trim();
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: (campaign || (compact ? 'website-hero' : 'website-launch')).slice(0, 64),
          locale,
          website: String(fields.get('website') || ''),
        }),
      });
      if (response.ok) setState('done');
      else {
        setState('idle');
        setError(response.status === 422 ? 'email' : response.status === 429 ? 'rate' : 'server');
      }
    } catch {
      setState('idle');
      setError('server');
    }
  }
  if (state === 'done')
    return (
      <div className="mx-done" role="status">
        <span aria-hidden="true">✓</span>
        <p>
          <b>{c.success}</b> {c.successBody}
        </p>
      </div>
    );
  return (
    <form className={`mx-form ${compact ? 'is-compact' : ''}`} onSubmit={submit} noValidate>
      <div className="mx-field">
        <label htmlFor={`${id}-email`} className="sr-only">
          {c.email}
        </label>
        <input
          ref={input}
          id={`${id}-email`}
          name="email"
          type="email"
          placeholder={c.email}
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={254}
          aria-invalid={error === 'email'}
          aria-describedby={`${id}-note`}
          onChange={() => error === 'email' && setError(null)}
        />
        <button type="submit" className="mx-button" disabled={state === 'busy'}>
          {state === 'busy' ? c.sending : c.action}
        </button>
      </div>
      <div className="mx-trap" aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="mx-note" id={`${id}-note`} role={error ? 'alert' : undefined}>
        {error === 'email'
          ? c.emailError
          : error === 'rate'
            ? c.rateError
            : error === 'server'
              ? c.serverError
              : (
                <>
                  {c.consent}{' '}
                  <a href="/datenschutz/#website">{c.privacy}</a>
                </>
              )}
      </p>
    </form>
  );
}
