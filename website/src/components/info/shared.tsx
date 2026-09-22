'use client';
import Link from 'next/link';

import type { ReactNode } from 'react';
import type { Locale } from '@/lib/messages';
import { useLanguage } from '../Language';
import { Arrow } from '../Primitives';
import { contactEmail, mailto } from '@/lib/site-content';

// Original source leaves these facts open. Do not publish as a completed legal
// notice until the owner supplies them; see docs/content-migration.md.
export const operator = {
  name: '[FULL LEGAL NAME / COMPANY NAME]',
  address: '[STREET, POSTCODE, CITY, COUNTRY]',
  phone: '',
  register: '[Company register / UID / VAT number, if applicable]',
  responsible: '[NAME]',
};
export const COPYRIGHT_YEAR = '2026';
export const PRIVACY_LAST_UPDATED = '[DATE]';

export function LegalDraftNotice() {
  const { locale } = useLanguage();
  return (
    <aside className="legal-draft" data-legal-draft>
      <strong>
        {locale === 'en'
          ? 'Review draft — not yet complete'
          : 'Prüfentwurf — noch nicht vollständig'}
      </strong>
      <p>
        {locale === 'en'
          ? 'The original documents are missing operator details and several privacy facts. Marked entries still need to be supplied before this document can be published as a complete notice.'
          : 'In den ursprünglichen Dokumenten fehlen Betreiberangaben und einige Datenschutzinformationen. Markierte Angaben müssen ergänzt werden, bevor dieses Dokument vollständig veröffentlicht werden kann.'}
      </p>
    </aside>
  );
}
export function Fill({ children }: { children: string }) {
  return /^\[[\s\S]*\]$/.test(children.trim()) ? (
    <mark className="legal-pending" data-legal-pending>
      {children}
    </mark>
  ) : (
    <>{children}</>
  );
}
export function formatDate(value: string, locale: Locale) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? (
    new Date(`${value}T12:00:00Z`).toLocaleDateString(locale === 'en' ? 'en-GB' : 'de-DE', {
      dateStyle: 'long',
      timeZone: 'UTC',
    })
  ) : (
    <Fill>{value}</Fill>
  );
}
export const Mail = ({ subject }: { subject?: string }) => (
  <a href={mailto(subject)}>{contactEmail}</a>
);
export const Out = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} rel="noreferrer">
    {children}
  </a>
);
export function Local({ to, children }: { to: string; children: ReactNode }) {
  const [path, hash] = to.split('#');
  return <a href={`${path.replace(/\/$/, '')}/${hash ? `#${hash}` : ''}`}>{children}</a>;
}
export function InfoIntro({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  const { locale } = useLanguage();
  return (
    <>
      <title>{`${label} · MonDex`}</title>
      <meta
        name="description"
        content={
          locale === 'en'
            ? `${label} for MonDex, the Pokémon card collecting app.`
            : `${label} für MonDex, die App für deine Pokémon-Kartensammlung.`
        }
      />
      <nav
        className="info-breadcrumb"
        aria-label={locale === 'en' ? 'Breadcrumb' : 'Brotkrumennavigation'}
      >
        <Link href="/">
          <span>
            <Arrow />
          </span>{' '}
          MonDex
        </Link>
        <span aria-current="page">{label}</span>
      </nav>
      <header className="info-intro">
        <h1>{title}</h1>
        {children}
      </header>
    </>
  );
}
export function Rows({ items }: { items: [ReactNode, ReactNode][] }) {
  return (
    <dl className="info-rows">
      {items.map(([term, detail], i) => (
        <div key={i}>
          <dt>{term}</dt>
          <dd>{detail}</dd>
        </div>
      ))}
    </dl>
  );
}
export type InfoSection = { id: string; title: string; body: ReactNode };
export function InfoSections({ sections, toc }: { sections: InfoSection[]; toc?: string }) {
  return (
    <div className={toc ? 'info-layout' : 'info-single'}>
      {toc && (
        <nav className="info-toc" aria-label={toc}>
          <strong>{toc}</strong>
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
        </nav>
      )}
      <div className="info-sections">
        {sections.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            {section.body}
          </section>
        ))}
      </div>
    </div>
  );
}
