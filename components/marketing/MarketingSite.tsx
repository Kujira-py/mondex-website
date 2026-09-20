"use client";

import type { CSSProperties } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  Layers3,
  ScanLine,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { LocaleProvider, type Locale, useLocale } from "./locale";
import { assetPath } from "./seo";
import { demoCards } from "./data";
import { CardImage, Orbit } from "./shared";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import ProductShowcase from "./ProductShowcase";
import ScannerVisual from "./ScannerVisual";
import WaitlistSection from "./WaitlistForm";
import FaqSection from "./FaqSection";
import Reveal from "./Reveal";

const featureCards = [
  {
    id: "scan",
    number: "01",
    icon: ScanLine,
    title: "Eine Kamera. Vier Wege zu scannen.",
    body: "Snap für eine Karte, Auto für fortlaufende Erkennung, Batch für Stapel und Packs für dein nächstes Opening.",
    image: "/marketing/app/scanner.webp",
    alt: "MonDex Scanner mit Snap, Auto und Batch",
    className: "feature-scan",
  },
  {
    id: "dex",
    number: "02",
    icon: Sparkles,
    title: "Jede Karte füllt deinen Pokédex.",
    body: "Arten, Generationen und Entwicklungspfade machen aus einer Kartenliste eine persönliche Entdeckungsreise.",
    image: "/marketing/app/pokedex.webp",
    alt: "Persönlicher Pokédex in MonDex",
    className: "feature-dex",
  },
  {
    id: "offline",
    number: "03",
    icon: WifiOff,
    title: "Offline weiterscannen.",
    body: "Mit einem zuvor geladenen Paket erkennt MonDex unterstützte Scans ohne Netz und synchronisiert gespeicherte Ergebnisse später.",
    className: "feature-offline",
  },
  {
    id: "binder",
    number: "04",
    icon: BookOpen,
    title: "Binder, die nach dir aussehen.",
    body: "Dex-, Karten- und Showcase-Binder geben Favoriten, Sets und Sammelzielen ihren eigenen Platz.",
    image: "/marketing/app/binders.webp",
    alt: "Binder-Bibliothek in MonDex",
    className: "feature-binder",
  },
  {
    id: "collection",
    number: "05",
    icon: Layers3,
    title: "Nicht nur Karten. Deine Exemplare.",
    body: "Varianten, Sprache, Zustand und Stückzahl bleiben getrennt — damit deine Sammlung auch im Detail stimmt.",
    image: "/marketing/app/collection.webp",
    alt: "Kartensammlung in MonDex",
    className: "feature-collection",
  },
  {
    id: "portfolio",
    number: "06",
    icon: ChartNoAxesCombined,
    title: "Wert, wenn du ihn sehen willst.",
    body: "Portfolio, Verlauf und Analysen erklären die Preisabdeckung. Marktwerte lassen sich jederzeit vollständig ausblenden.",
    image: "/marketing/app/portfolio.webp",
    alt: "Portfolio-Analyse in MonDex",
    className: "feature-portfolio",
  },
] as const;

function HeroVisual() {
  const { t } = useLocale();
  return (
    <div className="new-hero-visual" aria-label={t("Aktuelle Ansichten der MonDex App")}>
      <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
      <div className="hero-device hero-device-back" aria-hidden="true">
        <img src={assetPath("/marketing/app/collection.webp")} width="603" height="1311" alt="" />
      </div>
      <div className="hero-device hero-device-main">
        <img src={assetPath("/marketing/app/home.webp")} width="603" height="1311" alt={t("Aktuelle MonDex Startseite")} />
      </div>
      <div className="hero-device hero-device-front" aria-hidden="true">
        <ScannerVisual alt="" eager />
      </div>
      <p className="hero-build-note"><span />{t("Aktueller iOS-Entwicklungsbuild")}</p>
    </div>
  );
}

function FeatureGrid() {
  const { t } = useLocale();
  return (
    <section className="new-features" id="features" aria-labelledby="features-title">
      <Reveal className="container feature-intro">
        <p className="section-kicker">{t("ALLES AN EINEM ORT")}</p>
        <h2 id="features-title">{t("Gebaut für die Art, wie du wirklich sammelst.")}</h2>
        <p>{t("Nicht nur ein Scanner und nicht nur eine Liste. MonDex verbindet den Moment vor der Kamera mit allem, was danach wichtig bleibt.")}</p>
      </Reveal>
      <div className="container feature-grid">
        {featureCards.map(({ icon: Icon, ...feature }, index) => (
          <Reveal className={`feature-card ${feature.className}`} key={feature.id}>
            <article>
              <div className="feature-card-copy">
                <div className="feature-index"><Icon size={19} strokeWidth={1.8} /><span>{feature.number}</span></div>
                <h3>{t(feature.title)}</h3>
                <p>{t(feature.body)}</p>
              </div>
              {"image" in feature ? (
                <div className="feature-screen" aria-hidden="true">
                  {feature.id === "scan" ? (
                    <ScannerVisual alt={t(feature.alt)} eager={index < 2} />
                  ) : (
                    <img src={assetPath(feature.image)} width="603" height="1311" alt={t(feature.alt)} loading={index < 2 ? "eager" : "lazy"} decoding="async" />
                  )}
                </div>
              ) : (
                <div className="offline-visual" aria-hidden="true">
                  <span className="offline-ring"><WifiOff size={34} /></span>
                  <span>{t("Lokal erkannt")}</span>
                  <i />
                  <span>{t("Später synchronisiert")}</span>
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CardRibbon() {
  const { t } = useLocale();
  const cards = demoCards.slice(0, 10);
  const loopCards = [...cards, ...cards];
  return (
    <section className="card-ribbon" aria-labelledby="ribbon-title">
      <Reveal className="container ribbon-heading">
        <p className="section-kicker">{t("DEINE KARTEN BLEIBEN IM MITTELPUNKT")}</p>
        <h2 id="ribbon-title">{t("Von der ersten Karte bis zur letzten Variante.")}</h2>
        <a href="#app-einblicke">{t("Die aktuelle App entdecken")}<ArrowDownRight size={19} /></a>
      </Reveal>
      <div className="card-marquee" aria-label={t("Beispielkarten aus der MonDex Vorschau")}>
        <div className="card-marquee-track">
          {[0, 1].map((copy) => (
            <div className="card-marquee-group" aria-hidden={copy === 1 || undefined} key={copy}>
              {loopCards.map((card, index) => (
                <figure className="ribbon-card" key={`${copy}-${index}-${card.id}`} style={{ "--card-tilt": `${[-3, 2, -1, 3, -2][index % 5]}deg` } as CSSProperties}>
                  <CardImage card={card} small decorative={copy === 1} />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPrinciples() {
  const { t } = useLocale();
  const principles = [
    { icon: ShieldCheck, title: "Erst prüfen, dann besitzen.", body: "Ein Treffer macht eine Karte nicht automatisch zu deinem Besitz. Unklare Zuordnungen und Druckvarianten bleiben sichtbar." },
    { icon: Layers3, title: "Karten zuerst. Preise danach.", body: "Sammlung, Pokédex und Binder funktionieren als Kern. Marktwerte sind eine optionale Perspektive, kein Anlageversprechen." },
    { icon: Sparkles, title: "Fortschritt, der sich persönlich anfühlt.", body: "Neue Arten, vollständige Reihen und selbst gestaltete Binder machen deinen eigenen Sammelweg sichtbar." },
  ];
  return (
    <section className="principles-section" aria-labelledby="principles-title">
      <div className="container principles-layout">
        <Reveal className="principles-heading">
          <Orbit />
          <p className="section-kicker">{t("WAS MONDEX WICHTIG IST")}</p>
          <h2 id="principles-title">{t("Präzise genug für deine Sammlung. Ruhig genug für jeden Tag.")}</h2>
        </Reveal>
        <div className="principles-list">
          {principles.map(({ icon: Icon, title, body }, index) => (
            <Reveal className="principle-row" key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Icon size={24} strokeWidth={1.6} />
              <div><h3>{t(title)}</h3><p>{t(body)}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketingContent() {
  const { t, locale } = useLocale();
  return (
    <>
      <a className="skip-link" href="#main">{t("Zum Inhalt")}</a>
      <SiteHeader />
      <main className="mondex-landing" lang={locale} id="main" tabIndex={-1}>
        <section className="new-hero" id="top" aria-labelledby="hero-title">
          <div className="new-hero-noise" aria-hidden="true" />
          <div className="container new-hero-grid">
            <div className="new-hero-copy">
              <p className="hero-kicker"><span />{t("DEINE SAMMLUNG. NEU ENTDECKT.")}</p>
              <h1 id="hero-title">{t("Deine Sammlung.")}<br /><em>{t("Bis ins letzte Exemplar.")}</em></h1>
              <p className="new-hero-description">{t("Scanne Karten in Sekunden, behalte jede Variante im Blick und sieh, wie aus deiner Sammlung ein persönlicher Pokédex wird.")}</p>
              <div className="new-hero-actions">
                <a className="button hero-primary" href="#vormerken">{t("Zum Launch vormerken")}<ArrowUpRight size={18} /></a>
                <a className="hero-text-link" href="#features">{t("Features entdecken")}<ArrowDownRight size={18} /></a>
              </div>
              <p className="new-hero-meta">{t("Launch zuerst auf dem iPhone")}<span />{t("Android in Entwicklung")}</p>
            </div>
            <HeroVisual />
          </div>
        </section>
        <noscript><p className="container noscript-note">{t("Alle Produktinformationen sind sichtbar. Für die interaktiven Demos und die Launch-Anmeldung aktiviere bitte JavaScript.")}</p></noscript>
        <FeatureGrid />
        <CardRibbon />
        <ProductShowcase />
        <ProductPrinciples />
        <div className="launch-shell"><WaitlistSection source="home-redesign" /></div>
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}

export default function MarketingSite({ initialLocale = "en" }: { initialLocale?: Locale }) {
  return <LocaleProvider initialLocale={initialLocale}><MarketingContent /></LocaleProvider>;
}
