"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale } from "./locale";
import { Brand } from "./shared";

export default function SiteFooter() {
  const { t, href: localHref } = useLocale();
  return (
    <footer className="footer-shell">
      <div className="container footer-main">
        <div className="footer-brand">
          <Brand />
          <p>{t("Scannen, ordnen und entdecken — eine Sammlung, die sich wirklich nach deiner anfühlt.")}</p>
          <a href={localHref("/#vormerken")}>{t("Zum Launch vormerken")}<ArrowUpRight size={16} /></a>
        </div>
        <nav aria-label={t("Produkt")}>
          <strong>{t("Produkt")}</strong>
          <a href={localHref("/#features")}>{t("Features")}</a>
          <a href={localHref("/#app-einblicke")}>{t("Aktuelle App")}</a>
          <a href={localHref("/pokemon-tcg-scanner")}>{t("Pokémon-Karten scannen")}</a>
          <a href={localHref("/digital-pokemon-card-binder")}>{t("Digitale Pokémon-Binder")}</a>
        </nav>
        <nav aria-label={t("Weitere Informationen")}>
          <strong>{t("Mehr")}</strong>
          <a href={localHref("/pokemon-card-collection-tracker")}>{t("Pokémon-Sammlung verwalten")}</a>
          <a href={localHref("/kontakt")}>{t("Kontakt")}</a>
          <a href={localHref("/datenschutz")}>{t("Datenschutz")}</a>
          <a href={localHref("/impressum")}>{t("Impressum")}</a>
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 MonDex</span>
        <span>{t("Nicht mit Nintendo oder The Pokémon Company verbunden.")}</span>
      </div>
    </footer>
  );
}
