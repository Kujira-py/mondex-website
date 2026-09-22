'use client';
import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteContent';
import { useLanguage } from '@/components/Language';

export default function InformationLayout({ children }: { children: ReactNode }) {
  const { locale } = useLanguage();
  return (
    <>
      <a className="skip-link" href="#content">
        {locale === 'en' ? 'Skip to content' : 'Zum Inhalt springen'}
      </a>
      <SiteHeader />
      <main id="content" className="info-main section-shell">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
