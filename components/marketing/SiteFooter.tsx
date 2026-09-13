"use client";
import { useLocale } from "./locale";
import { Brand } from "./shared";
export default function SiteFooter() {
  const { t, href: localHref } = useLocale();
  return <footer className="site-footer container"><nav className="feature-footer-links" aria-label="MonDex"><a href={localHref("/pokemon-tcg-scanner")}>{t("Pokémon-Karten scannen")}</a><a href={localHref("/digital-pokemon-card-binder")}>{t("Digitale Pokémon-Binder")}</a><a href={localHref("/pokemon-card-collection-tracker")}>{t("Pokémon-Sammlung verwalten")}</a></nav><Brand /><nav aria-label={t("Weitere Informationen")}><a href={localHref("/kontakt")}>{t("Kontakt")}</a><a href={localHref("/datenschutz")}>{t("Datenschutz")}</a><a href={localHref("/impressum")}>{t("Impressum")}</a></nav><span>© MonDex</span></footer>;
}
