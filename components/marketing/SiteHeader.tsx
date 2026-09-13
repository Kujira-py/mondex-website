"use client";
import { useLocale } from "./locale";
import { localizedPath } from "./seo";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Brand } from "./shared";
const links = [{ label: "Entdecken", href: "/#entdecken" }, { label: "Binder", href: "/#binder" }, { label: "Fragen", href: "/#fragen" }];
export default function SiteHeader() {
  const { t, locale, pagePath, setLocale, href: localHref } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 16); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  useEffect(() => {
    if (!open) return;
    nav.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    const resize = () => { if (window.innerWidth >= 768) setOpen(false); };
    document.addEventListener("keydown", onKey); window.addEventListener("resize", resize);
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("resize", resize); };
  }, [open]);
  const close = () => { setOpen(false); toggle.current?.focus(); };
  return <header className={`site-header ${scrolled || open ? "is-scrolled" : ""}`}>
    <div className="container header-inner"><Brand /><nav aria-label={t("Hauptnavigation")} className="desktop-nav">{links.map(link => <a key={link.href} href={localHref(link.href)}>{t(link.label)}</a>)}</nav><a className="button primary header-cta" href={localHref("/#vormerken")}>{t("Zum Launch vormerken")}{" "}<ArrowUpRight size={16} /></a><div className="language-switch" role="group" aria-label={locale === "en" ? "Website language" : "Sprache der Website"}>{(["de", "en"] as const).map(language => <a href={localizedPath(pagePath, language)} hrefLang={language} key={language} lang={language} aria-label={language === "en" ? "English" : "Deutsch"} aria-current={locale === language ? "true" : undefined} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); setLocale(language); } }}>{language.toUpperCase()}</a>)}</div><button ref={toggle} type="button" className="icon-button menu-toggle" aria-label={open ? t("Menü schließen") : t("Menü öffnen")} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
    <nav id="mobile-nav" ref={nav} aria-label={t("Mobile Navigation")} className={`mobile-nav ${open ? "is-open" : ""}`} inert={!open} aria-hidden={!open}><div className="container">{links.map(link => <a key={link.href} href={localHref(link.href)} onClick={close}>{t(link.label)}<ArrowUpRight size={18} /></a>)}<a className="button primary" href={localHref("/#vormerken")} onClick={close}>{t("Zum Launch vormerken")}{" "}<ArrowUpRight size={18} /></a></div></nav>
  </header>;
}
