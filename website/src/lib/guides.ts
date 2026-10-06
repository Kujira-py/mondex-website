// The guide pages and where each language lives. English pages keep their
// first URLs; German pages have their own URLs with German words, so they can
// be found for German searches (hreflang links each pair).
export type GuideId = 'scanner' | 'value' | 'collection';
export type Locale = 'en' | 'de';

export const GUIDE_PATHS: Record<GuideId, Record<Locale, string>> = {
  scanner: { en: '/pokemon-tcg-scanner/', de: '/de/pokemon-karten-scanner/' },
  value: { en: '/pokemon-card-value/', de: '/de/pokemon-karten-wert/' },
  collection: { en: '/pokemon-card-collection-tracker/', de: '/de/pokemon-karten-sammlung/' },
};

/** Pages that exist in both languages, for the language switch and the sitemap. */
export const PAGE_PAIRS: Record<Locale, string>[] = [
  { en: '/', de: '/de/' },
  ...Object.values(GUIDE_PATHS),
];

/** The same page in the other language, if it has one. */
export function counterpart(pathname: string, to: Locale): string | undefined {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return PAGE_PAIRS.find((pair) => pair.en === path || pair.de === path)?.[to];
}

/** German pages live under /de/. */
export const isGermanPath = (pathname: string) => /^\/de(\/|$)/.test(pathname);
