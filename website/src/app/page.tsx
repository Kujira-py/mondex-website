import { type Metadata } from 'next';
import Home from '@/home/Home';
import { MOTION_SCRIPT } from '@/home/motionScript';
import { homeCopy } from '@/home/copy';
import { homeAlternates } from '@/home/seo';
import { homeJsonLd } from '@/lib/structured-data';
import '@/home/home.css';
import '@/home/scenes.css';

const { title, description } = homeCopy.en.meta;
export const metadata: Metadata = {
  title,
  description,
  alternates: homeAlternates('/'),
  openGraph: {
    title,
    description,
    url: 'https://mondextcg.com/',
    siteName: 'MonDex',
    locale: 'en_US',
    alternateLocale: 'de_DE',
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og.jpg'] },
};
export default function EnglishHome() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: homeJsonLd('en') }} />
      <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      <Home />
    </>
  );
}
