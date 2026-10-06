'use client';
import type { ReactNode } from 'react';
import '@/app/globals.css';
import '@/app/content.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteContent';
import { useLanguage } from '@/components/Language';

/** Header, main and footer of the information pages, in either language. */
export function InfoShell({ children }: { children: ReactNode }) {
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
