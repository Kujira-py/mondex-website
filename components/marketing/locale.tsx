"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import english from "./en.json";
export type Locale = "de" | "en";
const translations: Record<string, string> = english;
const LocaleContext = createContext({ locale: "de" as Locale, setLocale: (() => {}) as (locale: Locale) => void, t: (text: string) => text, href: (path: string) => path });
export function LocaleProvider({ initialLocale = "de", children }: { initialLocale?: Locale; children: ReactNode }) {
  const [locale, setLanguage] = useState(initialLocale);
  const setLocale = (value: Locale) => {
    setLanguage(value);
    const url = new URL(window.location.href);
    if (value === "en") url.searchParams.set("lang", "en"); else url.searchParams.delete("lang");
    window.history.replaceState(window.history.state, "", url);
  };
  useEffect(() => { document.documentElement.lang = locale; document.title = locale === "en" ? "MonDex — Your cards. Your MonDex." : "MonDex — Deine Karten. Dein MonDex."; }, [locale]);
  const t = (text: string) => locale === "en" ? translations[text] ?? text : text;
  const href = (path: string) => {
    if (locale === "de" || path.startsWith("#")) return path;
    const [pathname, hash] = path.split("#");
    return `${pathname || "/"}?lang=en${hash ? `#${hash}` : ""}`;
  };
  return <LocaleContext.Provider value={{ locale, setLocale, t, href }}>{children}</LocaleContext.Provider>;
}
export const useLocale = () => useContext(LocaleContext);
