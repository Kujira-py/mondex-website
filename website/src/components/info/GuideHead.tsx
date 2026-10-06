// Server-side head data for a guide page: title, description, canonical,
// hreflang pair, link preview and JSON-LD.
import type { Metadata } from 'next';
import { featureContent } from '@/lib/feature-content';
import { GUIDE_PATHS, type GuideId, type Locale } from '@/lib/guides';
import { guideJsonLd } from '@/lib/structured-data';

export function guideMetadata(id: GuideId, locale: Locale): Metadata {
  const { title, description } = featureContent[id][locale].meta;
  const path = GUIDE_PATHS[id][locale];
  const image = locale === 'de' ? '/og-de.jpg' : '/og.jpg';
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: GUIDE_PATHS[id].en,
        de: GUIDE_PATHS[id].de,
        'x-default': GUIDE_PATHS[id].en,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://mondextcg.com${path}`,
      siteName: 'MonDex',
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      alternateLocale: locale === 'de' ? 'en_US' : 'de_DE',
      type: 'article',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export function GuideJsonLd({ id, locale }: { id: GuideId; locale: Locale }) {
  const c = featureContent[id][locale];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: guideJsonLd(locale, GUIDE_PATHS[id][locale], c.label, c.meta.description, c.faq),
      }}
    />
  );
}
