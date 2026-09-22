'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { useLanguage } from './Language';
import { Arrow } from './Primitives';

export const WAITLIST_ENDPOINT = 'https://mondex-api.onrender.com/api/v1/waitlist';
const subscribe = () => () => {};
const copy = {
  en: {
    email: 'Email address',
    name: 'First name',
    optional: '(optional)',
    platform: 'Your phone',
    either: 'No preference',
    hint: 'MonDex launches on iPhone first.',
    action: 'Join the waitlist',
    sending: 'Joining…',
    success: 'You’re on the list.',
    successBody: 'We’ll email you when MonDex is ready. Thanks for being part of it.',
    emailError: 'Please enter a valid email address.',
    rateError: 'Too many attempts. Please wait a few minutes before trying again.',
    serverError: 'We couldn’t confirm your signup. Please try again.',
    consent:
      'By joining, you agree to receive one email when MonDex launches. You can withdraw at any time.',
    privacy: 'How we use your details',
    noScript: 'Enable JavaScript to join, or contact us at',
  },
  de: {
    email: 'E-Mail-Adresse',
    name: 'Vorname',
    optional: '(optional)',
    platform: 'Dein Smartphone',
    either: 'Keine Präferenz',
    hint: 'MonDex startet zuerst auf dem iPhone.',
    action: 'Zum Launch vormerken',
    sending: 'Wird eingetragen…',
    success: 'Du stehst auf der Liste.',
    successBody: 'Wir schreiben dir, sobald MonDex bereit ist. Schön, dass du dabei bist.',
    emailError: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    rateError: 'Zu viele Versuche. Bitte warte einige Minuten, bevor du es erneut versuchst.',
    serverError: 'Wir konnten deine Anmeldung nicht bestätigen. Bitte versuche es erneut.',
    consent:
      'Mit deiner Anmeldung stimmst du einer E-Mail zum Start von MonDex zu. Du kannst deine Zustimmung jederzeit widerrufen.',
    privacy: 'So verwenden wir deine Angaben',
    noScript: 'Aktiviere JavaScript zur Anmeldung oder schreibe uns an',
  },
} as const;

export function WaitlistForm() {
  const { locale } = useLanguage();
  const c = copy[locale];
  const id = useId();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<'email' | 'rate' | 'server' | null>(null);
  const inFlight = useRef(false);
  const email = useRef<HTMLInputElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (done) confirmation.current?.focus();
  }, [done]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const fields = new FormData(event.currentTarget);
    const address = String(fields.get('email') || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError('email');
      email.current?.focus();
      return;
    }
    inFlight.current = true;
    setBusy(true);
    setError(null);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const platform = fields.get('platform');
      const campaign = new URLSearchParams(window.location.search).get('utm_campaign')?.trim();
      const response = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        credentials: 'omit',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: address,
          name:
            String(fields.get('name') || '')
              .trim()
              .slice(0, 120) || undefined,
          platform: platform === 'ios' || platform === 'android' ? platform : undefined,
          source: (campaign || 'website-launch').slice(0, 64),
          locale,
          website: String(fields.get('website') || ''),
        }),
      });
      if (response.ok) setDone(true);
      else if (response.status === 422) {
        setError('email');
        email.current?.focus();
      } else setError(response.status === 429 ? 'rate' : 'server');
    } catch {
      setError('server');
    } finally {
      window.clearTimeout(timer);
      inFlight.current = false;
      setBusy(false);
    }
  }

  if (done)
    return (
      <div className="waitlist-confirmation" ref={confirmation} role="status" tabIndex={-1}>
        <span className="waitlist-check" aria-hidden="true">
          ✓
        </span>
        <h3>{c.success}</h3>
        <p>{c.successBody}</p>
      </div>
    );

  return (
    <>
      <form className="waitlist-form" method="post" onSubmit={submit} noValidate aria-busy={busy}>
        <fieldset disabled={!hydrated} className="waitlist-fields">
          <legend className="sr-only">{c.action}</legend>
          <div className="waitlist-field">
            <label htmlFor={`${id}-email`}>{c.email}</label>
            <input
              ref={email}
              id={`${id}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              autoCapitalize="off"
              spellCheck={false}
              maxLength={254}
              aria-invalid={error === 'email'}
              aria-describedby={error === 'email' ? `${id}-error` : undefined}
              onChange={() => {
                if (error === 'email') setError(null);
              }}
            />
          </div>
          <div className="waitlist-field">
            <label htmlFor={`${id}-name`}>
              {c.name} <span>{c.optional}</span>
            </label>
            <input
              id={`${id}-name`}
              name="name"
              type="text"
              autoComplete="given-name"
              maxLength={120}
            />
          </div>
          <fieldset className="waitlist-platform">
            <legend>
              {c.platform} <span>{c.optional}</span>
            </legend>
            <div>
              {[
                ['ios', 'iPhone'],
                ['android', 'Android'],
                ['', c.either],
              ].map(([value, label]) => (
                <label key={value}>
                  <input type="radio" name="platform" value={value} defaultChecked={value === ''} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <p>{c.hint}</p>
          </fieldset>
          <div className="waitlist-trap" aria-hidden="true">
            <label>
              Website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <p className="waitlist-consent" id={`${id}-consent`}>
            {c.consent}{' '}
            <a className="inline-link" href="/datenschutz/#website">
              {c.privacy}
            </a>
            .
          </p>
          <button
            className="button primary"
            type="submit"
            aria-disabled={busy}
            aria-describedby={`${id}-consent ${id}-error`}
          >
            {busy ? c.sending : c.action}
            <Arrow />
          </button>
          <p className="waitlist-error" id={`${id}-error`} role="alert">
            {error === 'email'
              ? c.emailError
              : error === 'rate'
                ? c.rateError
                : error === 'server'
                  ? c.serverError
                  : ''}
          </p>
        </fieldset>
      </form>
      <noscript>
        <p>
          {c.noScript} <a href="mailto:contact@mondextcg.com">contact@mondextcg.com</a>.
        </p>
      </noscript>
    </>
  );
}
