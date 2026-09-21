"use client";

import { useState, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from "react";
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
import { demoCards, type DemoCard } from "./data";
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

const featurePeekSlots = [
  { x: "18%", y: "0px", hiddenX: "-50%", hiddenY: "0%", visibleX: "-50%", visibleY: "-60%", rotate: -12, vx: -0.18, vy: -1 },
  { x: "78%", y: "0px", hiddenX: "-50%", hiddenY: "0%", visibleX: "-50%", visibleY: "-58%", rotate: 11, vx: 0.18, vy: -1 },
  { x: "0px", y: "34%", hiddenX: "0%", hiddenY: "-50%", visibleX: "-58%", visibleY: "-50%", rotate: -9, vx: -1, vy: -0.2 },
  { x: "0px", y: "72%", hiddenX: "0%", hiddenY: "-50%", visibleX: "-58%", visibleY: "-50%", rotate: 8, vx: -1, vy: 0.18 },
  { x: "100%", y: "30%", hiddenX: "-100%", hiddenY: "-50%", visibleX: "-42%", visibleY: "-50%", rotate: 10, vx: 1, vy: -0.22 },
  { x: "100%", y: "70%", hiddenX: "-100%", hiddenY: "-50%", visibleX: "-42%", visibleY: "-50%", rotate: -8, vx: 1, vy: 0.2 },
  { x: "26%", y: "100%", hiddenX: "-50%", hiddenY: "-100%", visibleX: "-50%", visibleY: "-42%", rotate: -8, vx: -0.18, vy: 1 },
  { x: "74%", y: "100%", hiddenX: "-50%", hiddenY: "-100%", visibleX: "-50%", visibleY: "-42%", rotate: 10, vx: 0.18, vy: 1 },
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

function InteractiveFeatureCard({ children, cardOffset }: { children: ReactNode; cardOffset: number }) {
  const [burst, setBurst] = useState<{ id: number; width: number; cards: DemoCard[] } | null>(null);
  const [deckCycle, setDeckCycle] = useState(0);
  const peekCards = Array.from(
    { length: 5 },
    (_, index) => demoCards[(cardOffset * 2 + deckCycle * 5 + index * 7) % demoCards.length],
  );
  const peekLayouts = Array.from({ length: 5 }, (_, index) => featurePeekSlots[(cardOffset + index * 3) % featurePeekSlots.length]);
  const burstCards = burst?.cards ?? peekCards;

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") setDeckCycle((cycle) => cycle + 1);
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    setBurst({
      id: event.timeStamp,
      width: bounds.width,
      cards: peekCards,
    });
  };

  return (
    <div
      className={`feature-card-interaction${burst ? " is-bursting" : ""}`}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <div className="feature-peek-stack" aria-hidden="true">
        {peekCards.map((card, index) => (
          <img
            key={`${card.id}-${index}`}
            className="feature-peek-card"
            src={assetPath(`/marketing/card-${card.id}-small.webp`)}
            width="240"
            height="335"
            alt=""
            draggable="false"
            style={{
              "--peek-x": peekLayouts[index].x,
              "--peek-y": peekLayouts[index].y,
              "--peek-hidden-x": peekLayouts[index].hiddenX,
              "--peek-hidden-y": peekLayouts[index].hiddenY,
              "--peek-visible-x": peekLayouts[index].visibleX,
              "--peek-visible-y": peekLayouts[index].visibleY,
              "--peek-rotate": `${peekLayouts[index].rotate}deg`,
              "--peek-delay": `${120 + index * 45}ms`,
            } as CSSProperties}
          />
        ))}
      </div>
      <article>{children}</article>
      {burst ? (
        <div className="feature-card-burst" key={burst.id} aria-hidden="true">
          {burstCards.map((card, index) => {
            const layout = peekLayouts[index % peekLayouts.length];
            const copyDirection = index < peekLayouts.length ? -1 : 1;
            const distance = Math.min(360, Math.max(210, burst.width * 0.62));
            const spread = 72 * copyDirection;
            const dx = layout.vx * distance + -layout.vy * spread;
            const dy = layout.vy * distance * 0.78 + layout.vx * spread;
            return (
              <img
                key={`${burst.id}-${card.id}-${index}`}
                className="feature-burst-card"
                src={assetPath(`/marketing/card-${card.id}-small.webp`)}
                width="240"
                height="335"
                alt=""
                draggable="false"
                style={{
                  "--burst-x": layout.x,
                  "--burst-y": layout.y,
                  "--burst-origin-x": layout.visibleX,
                  "--burst-origin-y": layout.visibleY,
                  "--burst-dx": `${dx}px`,
                  "--burst-dy": `${dy}px`,
                  "--burst-start-rotate": `${layout.rotate}deg`,
                  "--burst-rotate": `${(index % 2 === 0 ? -1 : 1) * (82 + index * 17)}deg`,
                  "--burst-delay": `${index * 32}ms`,
                } as CSSProperties}
                onAnimationEnd={index === burstCards.length - 1 ? () => setBurst(null) : undefined}
              />
            );
          })}
        </div>
      ) : null}
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
            <InteractiveFeatureCard cardOffset={index}>
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
            </InteractiveFeatureCard>
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
        <Reveal className="launch-shell"><WaitlistSection source="home-redesign" /></Reveal>
        <Reveal><FaqSection /></Reveal>
      </main>
      <SiteFooter />
    </>
  );
}

export default function MarketingSite({ initialLocale = "en" }: { initialLocale?: Locale }) {
  return <LocaleProvider initialLocale={initialLocale}><MarketingContent /></LocaleProvider>;
}
