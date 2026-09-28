'use client';

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { localeCookie, messages, resolveLocale, type Locale, type Messages } from '@/lib/messages';

// A device-local preference for the statically hosted website.
let sessionLocale: Locale | undefined;
const languageEvent = 'mondex-language-change';
// The home page exists twice, at / and /de/, so search engines can index
// both languages; there the path decides. Other pages switch in place.
const germanHome = () => /^\/de\/?$/.test(window.location.pathname);
const englishHome = () => window.location.pathname === '/';
function readLocale(): Locale {
  if (sessionLocale) return sessionLocale;
  try {
    if (germanHome()) return 'de';
    const requested = new URLSearchParams(window.location.search).get('lang');
    if (requested === 'de' || requested === 'en') return requested;
    const value = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${localeCookie}=`))
      ?.split('=')[1];
    return resolveLocale(value);
  } catch {
    return 'en';
  }
}
function subscribe(listener: () => void) {
  window.addEventListener(languageEvent, listener);
  return () => window.removeEventListener(languageEvent, listener);
}

const LanguageContext = createContext<{
  locale: Locale;
  copy: Messages;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const router = useRouter();
  const locale = useSyncExternalStore(subscribe, readLocale, () => initialLocale);
  const copy = messages[locale];
  const setLocale = useCallback((next: Locale) => {
    sessionLocale = next;
    try {
      document.cookie = `${localeCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    } catch {
      // The current page still switches if the browser blocks preference storage.
    }
    const query = new URLSearchParams(window.location.search);
    query.delete('lang');
    const tail = (query.size ? `?${query}` : '') + window.location.hash;
    if (next === 'de' && englishHome()) router.push(`/de/${tail}`);
    else if (next === 'en' && germanHome()) router.push(`/${tail}`);
    window.dispatchEvent(new Event(languageEvent));
  }, [router]);
  useEffect(() => {
    document.documentElement.lang = locale;
    const url = new URL(window.location.href);
    const requested = url.searchParams.get('lang');
    if (requested === 'de' || requested === 'en') {
      setLocale(requested);
      url.searchParams.delete('lang');
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    }
  }, [locale, setLocale]);
  return (
    <LanguageContext.Provider value={{ locale, copy, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LanguageProvider is required');
  return context;
}

export function LanguageSwitch() {
  const { locale, copy, setLocale } = useLanguage();
  return (
    <div className="language-switch" role="group" aria-label={copy.nav.language}>
      <button
        type="button"
        lang="en"
        aria-label="English"
        aria-pressed={locale === 'en'}
        onClick={() => setLocale('en')}
      >
        EN
      </button>
      <button
        type="button"
        lang="de"
        aria-label="Deutsch"
        aria-pressed={locale === 'de'}
        onClick={() => setLocale('de')}
      >
        DE
      </button>
    </div>
  );
}
