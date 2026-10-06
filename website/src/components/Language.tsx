'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { localeCookie, messages, resolveLocale, type Locale, type Messages } from '@/lib/messages';
import { counterpart, isGermanPath } from '@/lib/guides';

// A device-local preference for the statically hosted website.
let sessionLocale: Locale | undefined;
const languageEvent = 'mondex-language-change';
// The home page and the guides exist in both languages (/de/… is German), so
// search engines can index both; there the path decides. Pages that exist in
// one language only (contact, legal) switch in place.
function readLocale(): Locale {
  try {
    if (isGermanPath(window.location.pathname)) return 'de';
    if (counterpart(window.location.pathname, 'de')) return 'en';
    if (sessionLocale) return sessionLocale;
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
  // A page that exists in both languages takes its language from the URL, on
  // the server and after client navigation alike; others keep the stored choice.
  const pathname = usePathname();
  const fromPath = pathname
    ? isGermanPath(pathname)
      ? 'de'
      : counterpart(pathname, 'de')
        ? 'en'
        : undefined
    : undefined;
  const stored = useSyncExternalStore(subscribe, readLocale, () => initialLocale);
  const locale: Locale = fromPath ?? stored;
  const copy = messages[locale];
  const setLocale = useCallback(
    (next: Locale) => {
      sessionLocale = next;
      try {
        document.cookie = `${localeCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
      } catch {
        // The current page still switches if the browser blocks preference storage.
      }
      const query = new URLSearchParams(window.location.search);
      query.delete('lang');
      const tail = (query.size ? `?${query}` : '') + window.location.hash;
      const other = counterpart(window.location.pathname, next);
      if (other && other !== window.location.pathname) router.push(`${other}${tail}`);
      window.dispatchEvent(new Event(languageEvent));
    },
    [router],
  );
  useEffect(() => {
    document.documentElement.lang = locale;
    const url = new URL(window.location.href);
    const requested = url.searchParams.get('lang');
    if (requested === 'de' || requested === 'en') {
      setLocale(requested);
      url.searchParams.delete('lang');
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
      return;
    }
    // A language the visitor chose before opens a page that exists in both
    // languages in that language. Only an explicit choice (the cookie), never
    // the browser's language: search engines must see each URL as it is.
    if (sessionLocale) return;
    let saved: string | undefined;
    try {
      saved = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(`${localeCookie}=`))
        ?.split('=')[1];
    } catch {
      return;
    }
    if ((saved === 'de' || saved === 'en') && saved !== locale) {
      const other = counterpart(url.pathname, saved);
      if (other) router.replace(`${other}${url.search}${url.hash}`);
    }
  }, [locale, setLocale, router]);
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
