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
export const viewport: Viewport = { themeColor: '#f0edf5' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = 'en';
  return (
    <html lang={locale}>
      <body>
        <noscript>
          <style>{`.showcase{height:auto!important}.story-stage{height:auto!important;overflow:clip!important}.story-chapter{position:relative!important;opacity:1!important;visibility:visible!important;min-height:650px!important;padding-top:110px!important}.chapter-0{min-height:900px!important}.static-story-card{display:block!important}.hero-card-controls,.story-bottom,.journey-anchor{display:none!important}.scene-poster{height:900px!important}.story-chapter:not(:first-child){background:#f0edf5;border-top:1px solid #d4cddd}.language-switch,.collection-tabs,.dex-filter{display:none!important}.collection-stage{display:flex;flex-wrap:wrap;gap:18px;align-content:center;justify-content:center;height:auto;min-height:450px;padding:40px 0}.collection-card-layout{position:relative;left:auto;top:auto;width:120px;transform:none}.binder-page{display:none}.collection-card-layout:nth-of-type(n+8){display:none}.story-insight{display:none}@media(max-width:759px){.chapter-0{min-height:830px!important;justify-content:flex-start!important;padding-top:130px!important;gap:0!important}.scene-poster{height:830px!important}.story-chapter{min-height:830px!important;flex-direction:column!important;align-items:center!important;gap:40px}.static-story-card{width:200px!important;margin:0 auto 60px!important}}`}</style>
        </noscript>
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
