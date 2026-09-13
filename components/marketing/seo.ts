import type { Metadata } from "next";
import type { Locale } from "./locale";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mondextcg.com").replace(/\/$/, "");
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const assetPath = (path: string) => `${BASE_PATH}${path}`;
export const featurePaths = ["/pokemon-tcg-scanner", "/digital-pokemon-card-binder", "/pokemon-card-collection-tracker"] as const;
export type FeaturePath = typeof featurePaths[number];

type SearchCopy = { title: string; description: string };
export const searchPages: Record<string, Record<Locale, SearchCopy>> = {
  "/": {
    en: { title: "MonDex | Pokémon TCG Scanner & Collection App", description: "Meet MonDex, a Pokémon TCG scanning and collection app in development. Explore card scanning, digital binders and your personal Pokédex in interactive demos." },
    de: { title: "MonDex | Pokémon-Karten scannen & Sammlung verwalten", description: "Entdecke MonDex: die App für Pokémon-TCG-Scans, digitale Binder und deinen persönlichen Pokédex. Jetzt Produktdemos der App in Entwicklung ausprobieren." },
  },
  "/pokemon-tcg-scanner": {
    en: { title: "Pokémon TCG Card Scanner App for Collectors | MonDex", description: "Explore MonDex’s Pokémon card scanning workflow: capture a card, review its set and printing, then add it to your collection. App in development." },
    de: { title: "Pokémon-TCG-Scanner: Karten erfassen & prüfen | MonDex", description: "So funktioniert der Pokémon-Kartenscanner in MonDex: Karte fotografieren, Set und Variante prüfen und zur Sammlung hinzufügen. App in Entwicklung." },
  },
  "/digital-pokemon-card-binder": {
    en: { title: "Digital Pokémon Card Binder & Album | MonDex", description: "Explore digital Pokémon card binders in MonDex. Arrange favourite cards, build a Pokédex album and browse pages in the interactive binder demo." },
    de: { title: "Digitaler Pokémon-Karten-Binder & Album | MonDex", description: "Gestalte digitale Pokémon-Karten-Binder mit MonDex. Lieblingskarten anordnen, Dex-Alben entdecken und in der interaktiven Binder-Demo blättern." },
  },
  "/pokemon-card-collection-tracker": {
    en: { title: "Pokémon Card Collection Tracker & Pokédex App | MonDex", description: "See how MonDex organises Pokémon cards, sets, variants and wishlists. Track collection progress in a personal Pokédex. Explore the product demo." },
    de: { title: "Pokémon-Kartensammlung verwalten & tracken | MonDex", description: "Behalte Pokémon-Karten, Sets, Varianten und Wunschlisten im Blick. Entdecke MonDex als Sammlungstracker mit persönlichem Pokédex in der Produktdemo." },
  },
  "/kontakt": {
    en: { title: "Contact | MonDex", description: "Get in touch with MonDex by email: app support, bug reports, account and data requests, privacy questions, press, partnerships and feature ideas." },
    de: { title: "Kontakt | MonDex", description: "Schreib MonDex per E-Mail: App-Support, Fehlerberichte, Konto- und Datenanfragen, Fragen zum Datenschutz, Presse, Kooperationen und Ideen." },
  },
  "/datenschutz": {
    en: { title: "Privacy Policy | MonDex", description: "What the MonDex website and app collect, why, where it’s kept and how you stay in control. No ads, no tracking, no selling your data." },
    de: { title: "Datenschutzerklärung | MonDex", description: "Was die MonDex-Website und -App erfassen, wofür, wo es gespeichert wird und wie du die Kontrolle behältst. Keine Werbung, kein Tracking, kein Datenverkauf." },
  },
  "/impressum": {
    en: { title: "Legal Notice | MonDex", description: "Legal notice for MonDex: operator and contact details, notes on card prices and grade estimates, and the Pokémon trademark notice." },
    de: { title: "Impressum | MonDex", description: "Impressum von MonDex: Betreiber- und Kontaktangaben, Hinweise zu Kartenpreisen und Zustandsschätzungen sowie der Pokémon-Markenhinweis." },
  },
};

export function localizedPath(path: string, locale: Locale) {
  const [pathname, hash] = path.split("#");
  const page = (pathname || "/").replace(/\/$/, "");
  return `${BASE_PATH}${locale === "de" ? "/de" : ""}${page}/${hash ? `#${hash}` : ""}`;
}
export const canonicalUrl = (path: string, locale: Locale) => `${SITE_URL}${localizedPath(path, locale).slice(BASE_PATH.length)}`;
export const isIndexable = (path: string) => path === "/" || featurePaths.includes(path as FeaturePath);

export function pageMetadata(path: string, locale: Locale): Metadata {
  const copy = searchPages[path][locale];
  const image = `${SITE_URL}/marketing/og-mondex-${locale}.png`;
  return {
    ...copy,
    applicationName: "MonDex",
    alternates: {
      canonical: canonicalUrl(path, locale),
      languages: { de: canonicalUrl(path, "de"), en: canonicalUrl(path, "en"), "x-default": canonicalUrl(path, "en") },
    },
    robots: isIndexable(path) ? { index: true, follow: true, "max-image-preview": "large" } : { index: false, follow: true },
    openGraph: { ...copy, type: "website", siteName: "MonDex", url: canonicalUrl(path, locale), locale: locale === "en" ? "en_US" : "de_DE", alternateLocale: locale === "en" ? "de_DE" : "en_US", images: [{ url: image, width: 1200, height: 630, alt: locale === "en" ? "MonDex — Pokémon TCG scanning, digital binders and collection tracking" : "MonDex — Pokémon-Karten scannen, digitale Binder und Sammlung verwalten" }] },
    twitter: { card: "summary_large_image", ...copy, images: [image] },
  };
}

export function structuredData(path: string, locale: Locale) {
  const copy = searchPages[path][locale];
  const url = canonicalUrl(path, locale);
  const appId = `${SITE_URL}/#app`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: "MonDex", inLanguage: ["de", "en"] },
      { "@type": "SoftwareApplication", "@id": appId, name: "MonDex", url: canonicalUrl("/", locale), applicationCategory: "LifestyleApplication", description: searchPages["/"][locale].description, operatingSystem: "iOS, Android", creativeWorkStatus: "In development", image: `${SITE_URL}/marketing/og-mondex-${locale}.png` },
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: copy.title, description: copy.description, inLanguage: locale, isPartOf: { "@id": `${SITE_URL}/#website` }, about: { "@id": appId }, ...(path !== "/" ? { breadcrumb: { "@id": `${url}#breadcrumbs` } } : {}) },
      ...(path === "/" ? [] : [{ "@type": "BreadcrumbList", "@id": `${url}#breadcrumbs`, itemListElement: [
        { "@type": "ListItem", position: 1, name: "MonDex", item: canonicalUrl("/", locale) },
        { "@type": "ListItem", position: 2, name: copy.title.replace(/ \| MonDex$/, ""), item: url },
      ] }]),
    ],
  };
}
