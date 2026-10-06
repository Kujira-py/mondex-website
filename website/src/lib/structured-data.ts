// JSON-LD for search engines and AI search: who makes MonDex, what the app is,
// what it costs, and the questions the page answers. Every value here must be
// visible on the page it is embedded in (Google's rule for structured data):
// prices and answers come from the same copy the page shows. No ratings or
// download counts until the App Store has real ones.
import { homeCopy } from '@/home/copy';
import { APP_STORE_LIVE, appStoreUrl } from './launch';

export const SITE = 'https://mondextcg.com';
const ORG = `${SITE}/#organization`;
const WEBSITE = `${SITE}/#website`;
const APP = `${SITE}/#app`;

type Locale = 'en' | 'de';
type Json = Record<string, unknown>;

const organization: Json = {
  '@type': 'Organization',
  '@id': ORG,
  name: 'MonDex',
  url: `${SITE}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE}/assets/mondex-logo-512.png`,
    width: 512,
    height: 512,
  },
  email: 'contact@mondextcg.com',
};

const website = (locale: Locale): Json => ({
  '@type': 'WebSite',
  '@id': WEBSITE,
  name: 'MonDex',
  alternateName: 'MonDex TCG',
  url: `${SITE}/`,
  inLanguage: locale,
  publisher: { '@id': ORG },
});

/** The app itself, with the free download and both MonDex Plus plans. */
export function appEntity(locale: Locale): Json {
  const de = locale === 'de';
  const currency = de ? 'EUR' : 'USD';
  const availability = APP_STORE_LIVE
    ? 'https://schema.org/InStock'
    : 'https://schema.org/PreOrder';
  const plan = (name: string, price: string, duration: string): Json => ({
    '@type': 'Offer',
    name,
    price,
    priceCurrency: currency,
    availability,
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price,
      priceCurrency: currency,
      billingDuration: duration,
    },
  });
  return {
    '@type': 'MobileApplication',
    '@id': APP,
    name: 'MonDex',
    alternateName: de ? 'MonDex – Pokémon-Karten-Scanner' : 'MonDex – Pokémon card scanner',
    description: homeCopy[locale].meta.description,
    operatingSystem: 'iOS',
    applicationCategory: 'LifestyleApplication',
    inLanguage: ['en', 'de'],
    url: APP_STORE_LIVE ? appStoreUrl(locale, 'schema') : `${SITE}${de ? '/de/' : '/'}`,
    image: `${SITE}/${de ? 'og-de.jpg' : 'og.jpg'}`,
    publisher: { '@id': ORG },
    featureList: de
      ? [
          'Pokémon-Karten scannen: Auto-Modus ohne Knopfdruck, Stapel mit bis zu 100 Karten',
          'Englische und japanische Karten, auch offline',
          'Pokédex mit allen 1.025 Pokémon, der sich beim Sammeln füllt',
          'Preise von Cardmarket in Euro, TCGplayer und eBay inklusive PSA 10',
          'Preisalarme per Mitteilung',
          'Deutsche Kartennamen',
          'Import aus anderen Apps und Tabellen',
        ]
      : [
          'Pokémon card scanner: hands-free Auto mode and Batch scanning of up to 100 cards',
          'English and Japanese cards, also offline',
          'A Pokédex of all 1,025 Pokémon that fills as you collect',
          'Prices from TCGplayer, eBay including PSA 10, and Cardmarket in euros',
          'Price alerts by push notification',
          'Set completion for English and Japanese sets',
          'Import from other apps and spreadsheets',
        ],
    offers: [
      {
        '@type': 'Offer',
        name: de ? 'MonDex (kostenlos)' : 'MonDex (free)',
        price: '0',
        priceCurrency: currency,
        availability,
      },
      plan(de ? 'MonDex Plus monatlich' : 'MonDex Plus monthly', '3.99', 'P1M'),
      plan(de ? 'MonDex Plus jährlich' : 'MonDex Plus yearly', '29.99', 'P1Y'),
    ],
  };
}

function faqPage(locale: Locale): Json {
  const items = homeCopy[locale].faq.items;
  return {
    '@type': 'FAQPage',
    '@id': `${SITE}${locale === 'de' ? '/de/' : '/'}#faq`,
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item[0],
      acceptedAnswer: { '@type': 'Answer', text: APP_STORE_LIVE && item[2] ? item[2] : item[1] },
    })),
  };
}

/** Everything the home page says about itself. */
export function homeJsonLd(locale: Locale): string {
  return serialise({
    '@context': 'https://schema.org',
    '@graph': [organization, website(locale), appEntity(locale), faqPage(locale)],
  });
}

/** A guide page: its place in the site, and what it is about. */
export function guideJsonLd(
  locale: Locale,
  path: string,
  name: string,
  description: string,
  faq: [string, string][] = [],
): string {
  const home = locale === 'de' ? `${SITE}/de/` : `${SITE}/`;
  return serialise({
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebPage',
        '@id': `${SITE}${path}`,
        url: `${SITE}${path}`,
        name,
        description,
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE },
        about: { '@id': APP },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'MonDex', item: home },
            { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
          ],
        },
      },
      appEntity(locale),
      ...(faq.length
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${SITE}${path}#questions`,
              inLanguage: locale,
              mainEntity: faq.map(([question, answer]) => ({
                '@type': 'Question',
                name: question,
                acceptedAnswer: { '@type': 'Answer', text: answer },
              })),
            },
          ]
        : []),
    ],
  });
}

// `<` is escaped so no string in the data can close the script element.
const serialise = (data: Json) => JSON.stringify(data).replace(/</g, '\\u003c');
