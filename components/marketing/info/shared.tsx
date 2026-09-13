"use client";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocale, type Locale } from "../locale";

// Shared by the contact, privacy and legal pages. A value still in [BRACKETS] renders as a visible placeholder.
export const CONTACT_EMAIL = "contact@mondextcg.com";
export const operator = {
  name: "[FULL LEGAL NAME / COMPANY NAME]",
  address: "[STREET, POSTCODE, CITY, COUNTRY]",
  phone: "[Phone: optional]", // "" hides the row
  register: "[Company register / UID / VAT number, if any]", // "" hides the row
  responsible: "[NAME]",
};
// ISO date (e.g. "2026-10-01"); shown in each language's date format.
export const PRIVACY_LAST_UPDATED = "[DATE]";
export const COPYRIGHT_YEAR = "[YEAR]";

const isPlaceholder = (text: string) => /^\[[\s\S]*\]$/.test(text.trim());
export function Fill({ children }: { children: string }) {
  return isPlaceholder(children) ? <mark className="placeholder">{children}</mark> : <>{children}</>;
}
export function formatDate(value: string, locale: Locale) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return <Fill>{value}</Fill>;
  return new Date(`${value}T12:00:00Z`).toLocaleDateString(locale === "en" ? "en-GB" : "de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export const mailto = (subject?: string) => `mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
export const Mail = ({ subject }: { subject?: string }) => <a className="info-link" href={mailto(subject)}>{CONTACT_EMAIL}</a>;
// noreferrer: following a link from these pages doesn't tell the other site where you came from.
export const Out = ({ href, children }: { href: string; children: ReactNode }) => <a className="info-link" href={href} rel="noreferrer">{children}</a>;
export function Local({ to, children }: { to: string; children: ReactNode }) {
  const { href } = useLocale();
  return <a className="info-link" href={href(to)}>{children}</a>;
}

export function InfoIntro({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  const { href, locale } = useLocale();
  return <>
    <nav className="feature-breadcrumb" aria-label={locale === "en" ? "Breadcrumb" : "Brotkrumennavigation"}>
      <a href={href("/")}><ArrowLeft size={16} />MonDex</a><span aria-current="page">{label}</span>
    </nav>
    <header className="info-intro"><h1>{title}</h1>{children}</header>
  </>;
}

export function Rows({ items }: { items: [ReactNode, ReactNode][] }) {
  return <dl className="info-rows">{items.map(([term, detail], index) => <div key={index}><dt>{term}</dt><dd>{detail}</dd></div>)}</dl>;
}

export type InfoSection = { id: string; title: string; body: ReactNode };
export function InfoSections({ sections, toc }: { sections: InfoSection[]; toc?: string }) {
  const body = <div className="feature-body info-sections">{sections.map((section, index) => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
    <h2 id={`${section.id}-title`}>{toc && <span className="info-num">{index + 1}</span>}{section.title}</h2>
    {section.body}
  </section>)}</div>;
  if (!toc) return body;
  return <div className="feature-layout">
    <nav className="feature-toc info-toc" aria-label={toc}>
      <strong>{toc}</strong>
      {sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span className="info-num">{index + 1}</span>{section.title}</a>)}
    </nav>
    {body}
  </div>;
}
