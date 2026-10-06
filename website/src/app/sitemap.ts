import type { MetadataRoute } from 'next';
import { PAGE_PAIRS } from '@/lib/guides';
export const dynamic = 'force-static';

const SITE = 'https://mondextcg.com';
// Each page with its other-language twin (hreflang), so search engines pair
// /pokemon-tcg-scanner/ with /de/pokemon-karten-scanner/ and so on.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGE_PAIRS.flatMap((pair) =>
    (['en', 'de'] as const).map((locale) => ({
      url: `${SITE}${pair[locale]}`,
      lastModified: now,
      changeFrequency: pair.en === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: pair.en === '/' ? 1 : 0.8,
      alternates: {
        languages: {
          en: `${SITE}${pair.en}`,
          de: `${SITE}${pair.de}`,
          'x-default': `${SITE}${pair.en}`,
        },
      },
    })),
  );
}
