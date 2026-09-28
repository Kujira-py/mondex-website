import { type Metadata } from 'next';
import Home from '@/home/Home';
import { homeCopy } from '@/home/copy';
import { homeAlternates } from '@/home/seo';
import '@/home/home.css';
import '@/home/hero.css';

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
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: title }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
};
export default Home;
