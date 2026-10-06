import { type Metadata } from 'next';
import Home from '@/home/Home';
import { MOTION_SCRIPT } from '@/home/motionScript';
import { homeCopy } from '@/home/copy';
import { LanguageProvider } from '@/components/Language';
import { homeAlternates } from '@/home/seo';
import { homeJsonLd } from '@/lib/structured-data';
import '@/home/home.css';
import '@/home/scenes.css';

// The German home page: the same page rendered in German, so search engines
// index both languages (hreflang in homeAlternates).
const { title, description } = homeCopy.de.meta;
export const metadata: Metadata = {
  title,
  description,
  alternates: homeAlternates('/de/'),
  openGraph: {
    title,
    description,
    url: 'https://mondextcg.com/de/',
    siteName: 'MonDex',
    locale: 'de_DE',
    alternateLocale: 'en_US',
    type: 'website',
    images: [{ url: '/og-de.jpg', width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og-de.jpg'] },
};

export default function GermanHome() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: homeJsonLd('de') }} />
      <script
        dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='de';" + MOTION_SCRIPT }}
      />
      <LanguageProvider initialLocale="de">
        <Home />
      </LanguageProvider>
    </>
  );
}
