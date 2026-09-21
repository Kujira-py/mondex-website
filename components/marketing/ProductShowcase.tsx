"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  House,
  Layers3,
  ScanLine,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { useLocale } from "./locale";
import { assetPath } from "./seo";
import { Orbit } from "./shared";
import ScannerVisual from "./ScannerVisual";
import Reveal from "./Reveal";

const screens = [
  {
    id: "scanner",
    label: "Scanner",
    title: "Auto, Snap, Batch und Packs.",
    description:
      "Auto erkennt Karten fortlaufend direkt auf dem iPhone. Snap erfasst eine Karte, Batch hält die Kamera für Stapel bereit und Packs fasst ein Opening als Session zusammen.",
    image: "/marketing/app/scanner.webp",
    alt: "Aktueller MonDex Scanner mit Snap, Auto und Batch",
    icon: ScanLine,
  },
  {
    id: "home",
    label: "Home",
    title: "Dein Sammeln auf einen Blick.",
    description:
      "Sammlungsgröße, Dex-Fortschritt und zuletzt hinzugefügte Karten kommen auf einer ruhigen Startseite zusammen — damit dein nächster Schritt sofort klar ist.",
    image: "/marketing/app/home.webp",
    alt: "Aktuelle MonDex Startseite mit Sammlung und Dex-Fortschritt",
    icon: House,
  },
  {
    id: "pokedex",
    label: "Pokédex",
    title: "Aus Karten werden Entdeckungen.",
    description:
      "Pokémon, Entwicklungspfade und Generationen machen sichtbar, welche Arten du schon entdeckt hast und welche deinem persönlichen Dex noch fehlen.",
    image: "/marketing/app/pokedex.webp",
    alt: "Aktueller persönlicher Pokédex in MonDex",
    icon: Sparkles,
  },
  {
    id: "collection",
    label: "Sammlung",
    title: "Jedes Exemplar bleibt eindeutig.",
    description:
      "Karten, Sets, Varianten, Sprachen und Zustände bleiben getrennt durchsuchbar. So ist eine Lieblingskarte nicht nur ein Bild, sondern dein tatsächliches Exemplar.",
    image: "/marketing/app/collection.webp",
    alt: "Aktuelle Kartenansicht der MonDex Sammlung",
    icon: Layers3,
  },
  {
    id: "binders",
    label: "Binder",
    title: "Alben, die sich wie deine anfühlen.",
    description:
      "Dex-, Karten- und Showcase-Binder geben deiner Sammlung eine eigene Ordnung. Vorlagen, Cover und Taschen lassen sich rund um deine Sammelidee gestalten.",
    image: "/marketing/app/binders.webp",
    alt: "Aktuelle Binder-Bibliothek in MonDex",
    icon: BookOpen,
  },
  {
    id: "portfolio",
    label: "Portfolio",
    title: "Wert mit nachvollziehbarem Kontext.",
    description:
      "Verlauf, Holdings, Aktivität und erweiterte Analysen zeigen, was bepreist werden kann. Unvollständige Abdeckung wird erklärt und Marktwerte lassen sich vollständig ausblenden.",
    image: "/marketing/app/portfolio.webp",
    alt: "Aktuelle Portfolio- und Analyseansicht in MonDex",
    icon: ChartNoAxesCombined,
  },
] as const;

type ScreenId = (typeof screens)[number]["id"];

const truths = [
  {
    icon: WifiOff,
    title: "Scannen, auch wenn das Netz weg ist.",
    body: "Unterstützte Kamera-Scans werden mit einem zuvor geladenen Offline-Paket erkannt. Gespeicherte Karten warten lokal und werden später genau einmal synchronisiert.",
  },
  {
    icon: ShieldCheck,
    title: "Unsicherheit bleibt sichtbar.",
    body: "Ein Treffer erzeugt nicht automatisch Besitz. Unklare Karten und Druckvarianten bleiben prüfbar, bevor du sie bestätigst oder bewusst automatisch hinzufügen lässt.",
  },
] as const;

export default function ProductShowcase() {
  const { t } = useLocale();
  const [activeId, setActiveId] = useState<ScreenId>("scanner");
  const active = screens.find((screen) => screen.id === activeId) ?? screens[0];

  return (
    <section id="app-einblicke" className="product-showcase" aria-labelledby="showcase-title">
      <Reveal className="container showcase-heading">
        <div>
          <h2 id="showcase-title">{t("Direkt aus dem aktuellen MonDex.")}</h2>
          <p>
            {t(
              "Keine erfundenen Mockups: Diese Ansichten stammen aus dem aktuellen iOS-Entwicklungsbuild und zeigen die Beispielsammlung der App.",
            )}
          </p>
        </div>
        <p className="build-stamp">
          <Orbit />
          <span>
            <strong>{t("Aktueller Entwicklungsbuild")}</strong>
            {t("Stand 20. September 2026 · Beispieldaten")}
          </span>
        </p>
      </Reveal>

      <div className="container showcase-layout">
        <div className="showcase-rail" role="tablist" aria-label={t("App-Ansicht auswählen")}>
          {screens.map((screen) => {
            const Icon = screen.icon;
            const selected = screen.id === active.id;
            return (
              <button
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="showcase-screen"
                tabIndex={selected ? 0 : -1}
                className="showcase-choice"
                key={screen.id}
                onClick={() => setActiveId(screen.id)}
                onKeyDown={(event) => {
                  const index = screens.findIndex((item) => item.id === screen.id);
                  const next =
                    event.key === "ArrowDown" || event.key === "ArrowRight"
                      ? (index + 1) % screens.length
                      : event.key === "ArrowUp" || event.key === "ArrowLeft"
                        ? (index - 1 + screens.length) % screens.length
                        : event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? screens.length - 1
                            : -1;
                  if (next < 0) return;
                  event.preventDefault();
                  setActiveId(screens[next].id);
                  const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]");
                  tabs?.[next]?.focus();
                }}
              >
                <Icon size={19} strokeWidth={1.7} />
                <span>{t(screen.label)}</span>
                <ArrowUpRight size={16} className="showcase-arrow" />
              </button>
            );
          })}
        </div>

        <div className="showcase-stage" id="showcase-screen" role="tabpanel" aria-live="polite">
          <div className="showcase-copy" key={`${active.id}-copy`}>
            <h3>{t(active.title)}</h3>
            <p>{t(active.description)}</p>
          </div>
          <div className="showcase-device-wrap">
            <div className="showcase-orbit" aria-hidden="true" />
            {active.id === "scanner" ? (
              <ScannerVisual key={active.id} className="showcase-screen" alt={t(active.alt)} eager />
            ) : (
              <img
                key={active.id}
                className="showcase-screen"
                src={assetPath(active.image)}
                width="603"
                height="1311"
                alt={t(active.alt)}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            )}
          </div>
        </div>
      </div>

      <div className="container product-truths">
        {truths.map(({ icon: Icon, title, body }) => (
          <article key={title}>
            <Icon size={22} strokeWidth={1.6} />
            <div>
              <h3>{t(title)}</h3>
              <p>{t(body)}</p>
            </div>
          </article>
        ))}
        <p className="platform-truth">
          {t(
            "Die Aufnahmen zeigen den aktuellen iOS-Build. MonDex startet zuerst auf dem iPhone; Android wird entwickelt, ist aber noch nicht abschließend getestet.",
          )}
        </p>
      </div>
    </section>
  );
}
