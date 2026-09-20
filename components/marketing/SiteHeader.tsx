"use client";
import { useLocale } from "./locale";
import { localizedPath } from "./seo";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight, Moon, Sun } from "lucide-react";
import { Brand } from "./shared";
const links = [{ label: "Features", href: "/#features" }, { label: "App", href: "/#app-einblicke" }, { label: "Fragen", href: "/#fragen" }];
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
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setDark(document.documentElement.dataset.theme === "dark"));
    return () => cancelAnimationFrame(frame);
  }, []);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.dataset.theme = "dark"; else delete document.documentElement.dataset.theme;
    try { localStorage.setItem("mondex-theme", next ? "dark" : "light"); } catch { /* storage blocked: the choice lasts for this page view */ }
  };
  const close = () => { setOpen(false); toggle.current?.focus(); };
  return <header className={`site-header ${scrolled || open ? "is-scrolled" : ""}`}>
    <div className="container header-inner"><Brand /><nav aria-label={t("Hauptnavigation")} className="desktop-nav">{links.map(link => <a key={link.href} href={localHref(link.href)}>{t(link.label)}</a>)}</nav><a className="button primary header-cta" href={localHref("/#vormerken")}>{t("Zum Launch vormerken")}{" "}<ArrowUpRight size={16} /></a><div className="language-switch" role="group" aria-label={locale === "en" ? "Website language" : "Sprache der Website"}>{(["de", "en"] as const).map(language => <a href={localizedPath(pagePath, language)} hrefLang={language} key={language} lang={language} aria-label={language === "en" ? "English" : "Deutsch"} aria-current={locale === language ? "true" : undefined} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); setLocale(language); } }}>{language.toUpperCase()}</a>)}</div><button type="button" className="icon-button theme-toggle" aria-label={t("Dunkles Design")} aria-pressed={dark} onClick={toggleTheme}><Moon className="icon-moon" size={17} /><Sun className="icon-sun" size={17} /></button><button ref={toggle} type="button" className="icon-button menu-toggle" aria-label={open ? t("Menü schließen") : t("Menü öffnen")} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
    <nav id="mobile-nav" ref={nav} aria-label={t("Mobile Navigation")} className={`mobile-nav ${open ? "is-open" : ""}`} inert={!open} aria-hidden={!open}><div className="container">{links.map(link => <a key={link.href} href={localHref(link.href)} onClick={close}>{t(link.label)}<ArrowUpRight size={18} /></a>)}<a className="button primary" href={localHref("/#vormerken")} onClick={close}>{t("Zum Launch vormerken")}{" "}<ArrowUpRight size={18} /></a></div></nav>
  </header>;
}
