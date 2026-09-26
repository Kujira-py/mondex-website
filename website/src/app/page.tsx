import { type Metadata } from 'next';
import Home from '@/home/Home';
import { homeCopy } from '@/home/copy';
import '@/home/home.css';

const { title, description } = homeCopy.en.meta;
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: { title, description, url: 'https://mondextcg.com/', siteName: 'MonDex', type: 'website' },
};
export default Home;
