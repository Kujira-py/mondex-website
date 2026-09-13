"use client";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { LocaleProvider, useLocale, type Locale } from "./locale";
function InfoContent({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  const { t, href, locale } = useLocale();
  return <><SiteHeader /><main lang={locale} className="container info-page"><a className="text-button" href={href("/")}><ArrowLeft size={17} />{t("Zur Produktseite")}</a><h1>{t(title)}</h1><span className="info-status">{t("Prototyp · Inhalt noch zu ergänzen")}</span><div className="info-copy">{paragraphs.map(paragraph => <p key={paragraph}>{t(paragraph)}</p>)}</div></main><SiteFooter /></>;
}
export default function InfoPage({ title, paragraphs, initialLocale, pagePath }: { title: string; paragraphs: string[]; initialLocale: Locale; pagePath: string }) { return <LocaleProvider initialLocale={initialLocale} pagePath={pagePath}><InfoContent title={title} paragraphs={paragraphs} /></LocaleProvider>; }
