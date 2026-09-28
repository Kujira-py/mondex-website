'use client';
import { useState, useSyncExternalStore } from 'react';
import { useLanguage } from '../Language';
import type { Locale } from '@/lib/messages';
import { Arrow } from '../Primitives';
import { InfoIntro } from './shared';

// TODO: MonDex's App Store link once the app is listed. Until then the second
// button offers the waitlist instead of a link that goes nowhere.
const APP_STORE_URL: string | null = null;

// The app's invitation codes: 8 characters without look-alikes (no 0/O, 1/I),
// as the MonDex backend makes them (services/referral_service.py).
const CODE = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/;
function normalizeInviteCode(raw: string | null | undefined): string | null {
  const text = (raw ?? '').replace(/[\s\-_.]/g, '').toUpperCase();
  return CODE.test(text) ? text : null;
}

/** The code from ?code= (where 404.html sends /i/<code>) or the path itself. */
function codeFromLocation(): string | null {
  try {
    const query = new URLSearchParams(window.location.search).get('code');
    const path = window.location.pathname.match(/\/i\/([^/]+)\/?$/)?.[1];
    return normalizeInviteCode(query) ?? normalizeInviteCode(path && decodeURIComponent(path));
  } catch {
    return null;
  }
}

const unchanging = () => () => {};

type InviteCopy = {
  label: string;
  title: string;
  intro: string;
  noCode: string;
  codeLabel: string;
  copy: string;
  copied: string;
  open: string;
  store: string;
  storeSoon: string;
  installed: string;
};

const copy: Record<Locale, InviteCopy> = {
  en: {
    label: 'Invitation',
    title: 'You’ve been invited to MonDex',
    intro:
      'A friend invited you to MonDex, the app for Pokémon card collectors. Enter their code in the app: once you have scanned 20 cards and used MonDex on 3 days, you both get 7 days of MonDex Plus.',
    noCode: 'This link is missing its invitation code. Ask your friend to send it again.',
    codeLabel: 'Invitation code',
    copy: 'Copy code',
    copied: 'Copied',
    open: 'Open in MonDex',
    store: 'Download on the App Store',
    storeSoon: 'Coming to the App Store: join the waitlist',
    installed: 'Already installed? Enter the code under Settings → Invite a friend.',
  },
  de: {
    label: 'Einladung',
    title: 'Du wurdest zu MonDex eingeladen',
    intro:
      'Jemand hat dich zu MonDex eingeladen, der App für Pokémon-Kartensammler. Gib den Code in der App ein: Sobald du 20 Karten gescannt und MonDex an 3 Tagen genutzt hast, bekommt ihr beide 7 Tage MonDex Plus.',
    noCode:
      'In diesem Link fehlt der Einladungscode. Bitte die Person, die dich eingeladen hat, ihn noch einmal zu schicken.',
    codeLabel: 'Einladungscode',
    copy: 'Code kopieren',
    copied: 'Kopiert',
    open: 'In MonDex öffnen',
    store: 'Im App Store laden',
    storeSoon: 'Bald im App Store: auf die Warteliste',
    installed: 'Schon installiert? Gib den Code unter Einstellungen → Freunde einladen ein.',
  },
};

export default function InvitePage() {
  const { locale } = useLanguage();
  const c = copy[locale];
  // The code is in this visit's URL, so the static page is drawn without it
  // (undefined) and the browser fills it in.
  const code = useSyncExternalStore(unchanging, codeFromLocation, () => undefined);
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the code stays selectable on the page.
    }
  }

  return (
    <>
      <InfoIntro label={c.label} title={c.title}>
        <p>{code === null ? c.noCode : c.intro}</p>
      </InfoIntro>
      {code && (
        <section className="contact-panel invite-panel" aria-labelledby="invite-code-label">
          <div>
            <p id="invite-code-label" className="contact-label">
              {c.codeLabel}
            </p>
            <p className="invite-code" aria-label={code.split('').join(' ')}>
              {code.slice(0, 4)}
              <span aria-hidden="true"> </span>
              {code.slice(4)}
            </p>
            <button type="button" className="text-link invite-copy" onClick={copyCode} aria-live="polite">
              {copied ? c.copied : c.copy}
            </button>
          </div>
          <div className="invite-actions">
            <a className="button primary" href={`mondex://invite/${code}`}>
              {c.open}
              <Arrow />
            </a>
            <a className="text-link" href={APP_STORE_URL ?? '/#vormerken'}>
              {APP_STORE_URL ? c.store : c.storeSoon}
              <Arrow />
            </a>
          </div>
        </section>
      )}
      {code !== null && <p className="invite-installed">{c.installed}</p>}
    </>
  );
}
