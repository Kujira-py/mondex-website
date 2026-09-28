import type { Metadata } from 'next';

/** Canonical and hreflang links shared by the English and German home pages. */
export function homeAlternates(canonical: '/' | '/de/'): Metadata['alternates'] {
  return {
    canonical,
    languages: { en: '/', de: '/de/', 'x-default': '/' },
  };
}
