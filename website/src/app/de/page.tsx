import { type Metadata } from 'next';
import Home from '@/home/Home';
import { homeCopy } from '@/home/copy';
import { LanguageProvider } from '@/components/Language';
import { homeAlternates } from '@/home/seo';
import '@/home/home.css';
import '@/home/hero.css';

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
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
};

export default function GermanHome() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='de'" }} />
      <LanguageProvider initialLocale="de">
        <Home />
      </LanguageProvider>
    </>
  );
}
