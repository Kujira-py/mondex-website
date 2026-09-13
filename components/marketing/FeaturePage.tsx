"use client";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { LocaleProvider, useLocale, type Locale } from "./locale";
import { featureContent } from "./feature-content";
import { featurePaths, type FeaturePath } from "./seo";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

function FeatureContent({ path }: { path: FeaturePath }) {
  const { locale, href, t } = useLocale();
  const copy = featureContent[path][locale];
  return <>
    <a className="skip-link" href="#main">{t("Zum Inhalt")}</a>
    <SiteHeader />
    <main id="main" lang={locale} className="container feature-page" tabIndex={-1}>
      <nav className="feature-breadcrumb" aria-label={locale === "en" ? "Breadcrumb" : "Brotkrumennavigation"}>
        <a href={href("/")}><ArrowLeft size={16} />MonDex</a><span aria-current="page">{copy.label}</span>
      </nav>
      <article>
        <header className="feature-intro"><h1>{copy.title}</h1><p>{copy.intro}</p>
          <a className="button primary" href={href(`/#${copy.anchor}`)}>{copy.demo}<ArrowUpRight size={18} /></a>
        </header>
        <div className="feature-layout">
          <nav className="feature-toc" aria-label={locale === "en" ? "On this page" : "Auf dieser Seite"}>
            <strong>{locale === "en" ? "On this page" : "Auf dieser Seite"}</strong>
            {copy.sections.map((section, index) => <a key={index} href={`#topic-${index + 1}`}>{section.title}</a>)}
          </nav>
          <div className="feature-body">{copy.sections.map((section, index) => <section key={index} id={`topic-${index + 1}`} aria-labelledby={`topic-title-${index + 1}`}>
            <h2 id={`topic-title-${index + 1}`}>{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.steps && <ol>{section.steps.map(step => <li key={step}>{step}</li>)}</ol>}
          </section>)}</div>
        </div>
      </article>
      <aside className="feature-related" aria-labelledby="related-title"><h2 id="related-title">{locale === "en" ? "Keep exploring MonDex" : "MonDex weiter entdecken"}</h2>
        {featurePaths.filter(other => other !== path).map(other => <a href={href(other)} key={other}>{featureContent[other][locale].label}<ArrowUpRight size={18} /></a>)}
      </aside>
    </main><SiteFooter />
  </>;
}
export default function FeaturePage({ path, initialLocale }: { path: FeaturePath; initialLocale: Locale }) {
  return <LocaleProvider pagePath={path} initialLocale={initialLocale}><FeatureContent path={path} /></LocaleProvider>;
}
