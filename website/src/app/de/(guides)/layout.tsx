import type { ReactNode } from 'react';
import { LanguageProvider } from '@/components/Language';
import { InfoShell } from '@/components/info/InfoShell';

// German guides: their own URLs, rendered in German from the start (the
// root layout's provider starts in English).
export default function GermanGuidesLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider initialLocale="de">
      <InfoShell>{children}</InfoShell>
    </LanguageProvider>
  );
}
