"use client";
import { useLocale } from "./locale";
import { Brand } from "./shared";
export default function SiteFooter() {
  const { t, href: localHref } = useLocale();
  return <footer className="site-footer container"><Brand /><nav aria-label={t("Weitere Informationen")}><a href={localHref("/kontakt")}>{t("Kontakt")}</a><a href={localHref("/datenschutz")}>{t("Datenschutz")}</a><a href={localHref("/impressum")}>{t("Impressum")}</a></nav><span>© MonDex</span></footer>;
}
