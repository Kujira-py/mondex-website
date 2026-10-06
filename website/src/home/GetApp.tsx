'use client';
// How a visitor gets MonDex: the App Store once it is live (lib/launch.ts),
// until then one email on launch day. The form posts straight to the MonDex
// API, which only admits mondextcg.com through CORS.
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { APP_STORE_LIVE, appStoreUrl } from '@/lib/launch';
import type { HomeCopy } from './copy';

const ENDPOINT = 'https://mondex-api.onrender.com/api/v1/waitlist';

/** The public waitlist size, or null while the server keeps it private (under 1,000). */
let countRequest: Promise<number | null> | null = null;
function useWaitlistCount(enabled: boolean) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    if (!enabled) return;
    countRequest ??= fetch(`${ENDPOINT}/count`, { credentials: 'omit' })
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => (typeof body?.count === 'number' ? body.count : null))
      .catch(() => null);
    let live = true;
    countRequest.then((value) => live && setCount(value));
    return () => {
      live = false;
    };
  }, [enabled]);
  return count;
}

export function GetApp({
  c,
  store,
  locale,
  placement,
  proof = false,
  dark = false,
}: {
  c: HomeCopy['waitlist'];
  store: HomeCopy['store'];
  locale: 'en' | 'de';
  placement: string;
  proof?: boolean;
  dark?: boolean;
}) {
  if (APP_STORE_LIVE)
    return (
      <div className="mx-store">
        <a className="mx-badge" href={appStoreUrl(locale, placement)}>
          <img
            src={`/assets/badges/app-store-${locale}.svg`}
            alt={store.badge}
            width={160}
            height={53}
          />
        </a>
        <span className="mx-store-note">{store.note}</span>
      </div>
    );
  return <Waitlist c={c} locale={locale} placement={placement} proof={proof} dark={dark} />;
}

function Waitlist({
  c,
  locale,
  placement,
  proof,
  dark,
}: {
  c: HomeCopy['waitlist'];
  locale: 'en' | 'de';
  placement: string;
  proof: boolean;
  dark: boolean;
}) {
  const id = useId();
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [error, setError] = useState<'email' | 'rate' | 'server' | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const count = useWaitlistCount(proof);
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
          source: (campaign || `website-${placement}`).slice(0, 64),
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
      <div className={`mx-done ${dark ? 'is-dark' : ''}`} role="status">
        <span aria-hidden="true">✓</span>
        <p>
          <b>{c.success}</b> {c.successBody}
        </p>
      </div>
    );
  return (
    <form className={`mx-form ${dark ? 'is-dark' : ''}`} onSubmit={submit} noValidate>
      <div className="mx-field">
        <label htmlFor={`${id}-email`} className="sr-only">
          {c.email}
        </label>
        <input
          ref={input}
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
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
        {error === 'email' ? (
          c.emailError
        ) : error === 'rate' ? (
          c.rateError
        ) : error === 'server' ? (
          c.serverError
        ) : (
          <>
            <span className="mx-note-lead">
              {count
                ? c.proof.replace('{n}', count.toLocaleString(locale === 'de' ? 'de-DE' : 'en-US'))
                : c.platforms}
            </span>
            {' · '}
            {c.consent} <a href="/datenschutz/#website">{c.privacy}</a>
          </>
        )}
      </p>
    </form>
  );
}
