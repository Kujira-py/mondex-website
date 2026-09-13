"use client";
import { LocaleProvider, type Locale, useLocale } from "./locale";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import SiteHeader from "./SiteHeader";
import AppPreview from "./AppPreview";
import DexDiscoveryDemo from "./DexDiscoveryDemo";
import BinderShowcase from "./BinderShowcase";
import ScanReactionDemo from "./ScanReactionDemo";
import CollectionPreview, { PortfolioPreview } from "./CollectionPreview";
import WaitlistSection from "./WaitlistForm";
import FaqSection from "./FaqSection";
import SiteFooter from "./SiteFooter";
import { DemoProvider } from "./state";
function MarketingContent() {
  const { t, locale } = useLocale();
  return <DemoProvider><a className="skip-link" href="#main">{t("Zum Inhalt")}</a><SiteHeader /><main lang={locale} id="main" tabIndex={-1}><section className="container hero" id="top" aria-labelledby="hero-title"><div className="hero-copy"><p className="eyebrow">{t("DEINE SAMMLUNG. NEU ENTDECKT.")}</p><h1 id="hero-title">{t("Deine Karten.")}<br />{t("Dein MonDex.")}</h1><p className="hero-description">{t("Die Pokémon-TCG-App für Kartenscans, digitale Binder und deinen persönlichen Pokédex. Entdecke, wie MonDex deine Sammlung zusammenbringt.")}</p><div className="hero-actions"><a className="button primary" href="#vormerken">{t("Zum Launch vormerken")}{" "}<ArrowUpRight size={18} /></a><a className="text-button" href="#app-vorschau" onClick={() => document.getElementById("app-vorschau")?.querySelector<HTMLButtonElement>("[role=tab][aria-selected=true]")?.focus({ preventScroll: true })}>{t("App ansehen")}{" "}<ArrowUpRight size={18} /></a></div><p className="hero-note"><span className="status-dot" />{t("MonDex entsteht gerade.")}<br /><span>{t("Entdecke die interaktiven Produktdemos.")}</span></p></div><AppPreview /><a className="hero-scroll" href="#entdecken"><ArrowDown size={16} /><span>{t("Deine Sammlung kann mehr.")}</span></a></section><noscript><p className="container noscript-note">{t("Alle Produktinformationen sind sichtbar. Für die interaktiven Demos und die Launch-Anmeldung aktiviere bitte JavaScript.")}</p></noscript><DexDiscoveryDemo /><BinderShowcase /><ScanReactionDemo /><CollectionPreview /><PortfolioPreview /><WaitlistSection source="home" /><FaqSection /></main><SiteFooter /></DemoProvider>;
}

export default function MarketingSite({ initialLocale = "en" }: { initialLocale?: Locale }) { return <LocaleProvider initialLocale={initialLocale}><MarketingContent /></LocaleProvider>; }
