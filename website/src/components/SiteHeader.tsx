'use client';
import { useEffect, useRef, useState } from 'react';
import { Arrow, Brand } from './Primitives';
import { LanguageSwitch, useLanguage } from './Language';
import { APP_STORE_LIVE, appStoreUrl } from '@/lib/launch';

const SECTIONS = {
  en: [
    ['scanner', 'Scanner'],
    ['pokedex', 'Pokédex'],
    ['preise', 'Prices'],
    ['fragen', 'FAQ'],
  ],
  de: [
    ['scanner', 'Scanner'],
    ['pokedex', 'Pokédex'],
    ['preise', 'Preise'],
    ['fragen', 'Fragen'],
  ],
} as const;
export function SiteHeader({ home = false }: { home?: boolean }) {
  const { copy, locale } = useLanguage();
  // The home page exists in both languages; its sections share their ids.
  const homeHref = home ? '' : locale === 'de' ? '/de/' : '/';
  const cta = APP_STORE_LIVE ? appStoreUrl(locale, 'info-header') : `${homeHref}#holen`;
  const ctaLabel = APP_STORE_LIVE
    ? locale === 'de'
      ? 'Laden'
      : 'Download'
    : locale === 'de'
      ? 'MonDex holen'
      : 'Get MonDex';
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        menu.current?.focus();
      }
    };
    const resize = () => {
      if (window.innerWidth >= 760) setOpen(false);
    };
    window.addEventListener('keydown', escape);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('keydown', escape);
      window.removeEventListener('resize', resize);
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="nav-shell">
        <a href={`${homeHref}#top`} onClick={() => setOpen(false)} aria-label={copy.nav.home}>
          <Brand />
        </a>
        <nav
          id="main-navigation"
          className={`main-nav ${open ? 'is-open' : ''}`}
          aria-label={copy.nav.main}
        >
          {SECTIONS[locale].map(([id, label]) => (
            <a key={id} href={`${homeHref}#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="mobile-waitlist-link" href={cta} onClick={() => setOpen(false)}>
            {ctaLabel}
          </a>
          <a className="mobile-contact-link" href="/kontakt/" onClick={() => setOpen(false)}>
            {locale === 'en' ? 'Contact' : 'Kontakt'}
          </a>
        </nav>
        <div className="nav-actions">
          <LanguageSwitch />
          <a className="nav-cta" href={cta} onClick={() => setOpen(false)}>
            {ctaLabel} <Arrow />
          </a>
          <button
            ref={menu}
            className="menu-toggle"
            aria-label={open ? copy.nav.close : copy.nav.open}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
