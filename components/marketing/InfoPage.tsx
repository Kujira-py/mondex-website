"use client";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { LocaleProvider, useLocale, type Locale } from "./locale";
import ContactPage from "./info/ContactPage";
import PrivacyPage from "./info/PrivacyPage";
import LegalNoticePage from "./info/LegalNoticePage";

const pages = { "/kontakt": ContactPage, "/datenschutz": PrivacyPage, "/impressum": LegalNoticePage };
export type InfoPath = keyof typeof pages;

function InfoContent({ path }: { path: InfoPath }) {
  const { t, locale } = useLocale();
  const Body = pages[path];
  return <>
    <a className="skip-link" href="#main">{t("Zum Inhalt")}</a>
    <SiteHeader />
    <main id="main" lang={locale} className="container info-page" tabIndex={-1}><Body /></main>
    <SiteFooter />
  </>;
}
export default function InfoPage({ path, initialLocale }: { path: InfoPath; initialLocale: Locale }) {
  return <LocaleProvider initialLocale={initialLocale} pagePath={path}><InfoContent path={path} /></LocaleProvider>;
}
