"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import english from "./en.json";
import { BASE_PATH, SITE_URL, canonicalUrl, localizedPath, searchPages, structuredData } from "./seo";
export type Locale = "de" | "en";
const translations: Record<string, string> = english;
const LocaleContext = createContext({ locale: "en" as Locale, pagePath: "/", setLocale: (() => {}) as (locale: Locale) => void, t: (text: string) => text, href: (path: string) => path });

export function LocaleProvider({ initialLocale = "en", pagePath = "/", children }: { initialLocale?: Locale; pagePath?: string; children: ReactNode }) {
  const [locale, setLanguage] = useState(initialLocale);
  const setLocale = (value: Locale) => {
    setLanguage(value);
    window.history.replaceState(window.history.state, "", localizedPath(pagePath, value) + window.location.hash);
  };
  // Old shared links (?lang=en, /en/…) predate English becoming the unprefixed default; move them to the canonical URL.
  useEffect(() => {
    const { search, pathname, hash } = window.location;
    if (new URLSearchParams(search).get("lang") === "en" || pathname.startsWith(`${BASE_PATH}/en/`)) {
      window.history.replaceState(window.history.state, "", localizedPath(pagePath, "en") + hash);
    }
  }, [pagePath]);
  useEffect(() => {
    document.documentElement.lang = locale;
    const copy = searchPages[pagePath][locale];
    document.title = copy.title;
    const values: Record<string, string> = {
      'meta[name="description"]': copy.description,
      'meta[property="og:title"]': copy.title,
      'meta[property="og:description"]': copy.description,
      'meta[property="og:url"]': canonicalUrl(pagePath, locale),
      'meta[property="og:locale"]': locale === "en" ? "en_US" : "de_DE",
      'meta[property="og:locale:alternate"]': locale === "en" ? "de_DE" : "en_US",
      'meta[property="og:image"]': `${SITE_URL}/marketing/og-mondex-${locale}.png`,
      'meta[property="og:image:alt"]': locale === "en" ? "MonDex — Pokémon TCG scanning, digital binders and collection tracking" : "MonDex — Pokémon-Karten scannen, digitale Binder und Sammlung verwalten",
      'meta[name="twitter:title"]': copy.title,
      'meta[name="twitter:description"]': copy.description,
      'meta[name="twitter:image"]': `${SITE_URL}/marketing/og-mondex-${locale}.png`,
    };
    Object.entries(values).forEach(([selector, value]) => document.head.querySelector(selector)?.setAttribute("content", value));
    document.head.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl(pagePath, locale));
  }, [locale, pagePath]);
  const t = (text: string) => locale === "en" ? translations[text] ?? text : text;
  const href = (path: string) => path.startsWith("#") ? path : localizedPath(path, locale);
  return <LocaleContext.Provider value={{ locale, pagePath, setLocale, t, href }}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(pagePath, locale)).replace(/</g, "\\u003c") }} />
    {children}
  </LocaleContext.Provider>;
}
export const useLocale = () => useContext(LocaleContext);
