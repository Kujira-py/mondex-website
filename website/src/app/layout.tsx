import type { Metadata, Viewport } from 'next';
import './base.css';
import { LanguageProvider } from '@/components/Language';
import { APP_STORE_ID, APP_STORE_LIVE } from '@/lib/launch';
export const metadata: Metadata = {
  metadataBase: new URL('https://mondextcg.com'),
  robots: { index: true, follow: true },
  icons: { icon: '/assets/orbit.svg', apple: '/assets/orbit.svg' },
  // Safari's Smart App Banner, once MonDex is on the App Store.
  other: APP_STORE_LIVE ? { 'apple-itunes-app': `app-id=${APP_STORE_ID}` } : undefined,
};
export const viewport: Viewport = { themeColor: '#f7f6fa' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = 'en';
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/onest-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
