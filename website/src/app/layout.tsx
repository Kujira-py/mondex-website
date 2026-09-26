import type { Metadata, Viewport } from 'next';
import './onest-critical.css';
import './globals.css';
import './content.css';
import { LanguageProvider } from '@/components/Language';
export const metadata: Metadata = {
  metadataBase: new URL('https://mondextcg.com'),
  robots: { index: true, follow: true },
  icons: { icon: '/assets/orbit.svg', apple: '/assets/orbit.svg' },
};
export const viewport: Viewport = { themeColor: '#f8f8fb' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = 'en';
  return (
    <html lang={locale}>
      <body>
        <noscript>
          <style>{`.mx-reveal{opacity:1!important;transform:none!important}.mx-bar span{transform:none!important}.hs-card,.hs-corner{opacity:1!important}`}</style>
        </noscript>
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
