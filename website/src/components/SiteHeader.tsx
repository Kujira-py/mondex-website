'use client';
import { useEffect, useRef, useState } from 'react';
import { Arrow, Brand } from './Primitives';
import { LanguageSwitch, useLanguage } from './Language';
export function SiteHeader({ home = false }: { home?: boolean }) {
  const { copy, locale } = useLanguage();
  const root = home ? '' : '/';
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
        <a href={`${root}#produkt`} onClick={() => setOpen(false)} aria-label={copy.nav.home}>
          <Brand />
        </a>
        <nav
          id="main-navigation"
          className={`main-nav ${open ? 'is-open' : ''}`}
          aria-label={copy.nav.main}
        >
          {['scanner', 'sammlung', 'portfolio', 'entdecken'].map((id, i) => (
            <a key={id} href={`${root}#${id}`} onClick={() => setOpen(false)}>
              {copy.nav.items[i]}
            </a>
          ))}
          <a
            className="mobile-waitlist-link"
            href={`${root}#vormerken`}
            onClick={() => setOpen(false)}
          >
            {locale === 'en' ? 'Join the waitlist' : 'Zum Launch vormerken'}
          </a>
          <a className="mobile-contact-link" href="/kontakt/" onClick={() => setOpen(false)}>
            {locale === 'en' ? 'Contact' : 'Kontakt'}
          </a>
        </nav>
        <div className="nav-actions">
          <LanguageSwitch />
          <a className="nav-cta" href={`${root}#vormerken`} onClick={() => setOpen(false)}>
            {locale === 'en' ? 'Join the waitlist' : 'Vormerken'} <Arrow />
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
