'use client';

import {
  Showcase,
  CollectionExplorer,
  ScannerDemo,
  DexExplorer,
  PortfolioExplorer,
  CardDiscoveryRail,
} from '@/components/Experience';
import { FeatureWindows } from '@/components/FeatureWindows';
import { useLanguage } from '@/components/Language';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter, LaunchSection, FAQSection } from '@/components/SiteContent';

export default function Home() {
  const { copy } = useLanguage();
  const { scanner, collection, portfolio, dex } = copy.sections;
  return (
    <>
      <a className="skip-link" href="#scanner">
        {copy.skip}
      </a>
      <title>{copy.meta.title}</title>
      <meta name="description" content={copy.meta.description} />
      <SiteHeader home />
      <main>
        <Showcase />
        <FeatureWindows />
        <section className="scanner-section" id="scanner" aria-labelledby="scanner-title">
          <div className="section-shell">
            <div className="section-heading">
              <span className="eyebrow">{scanner.label}</span>
              <h2 id="scanner-title">
                {scanner.title}
                <br />
                <em>{scanner.accent}</em>
              </h2>
              <p>
                {scanner.lines[0]}
                <br className="desktop-break" /> {scanner.lines[1]}
              </p>
            </div>
            <ScannerDemo />
          </div>
        </section>
        <section className="collection-section" id="sammlung" aria-labelledby="collection-title">
          <div className="section-shell">
            <div className="collection-heading">
              <div>
                <span className="eyebrow">{collection.label}</span>
                <h2 id="collection-title">
                  {collection.title}
                  <br />
                  <em>{collection.accent}</em>
                </h2>
              </div>
              <p>
                {collection.lines[0]} <br />
                {collection.lines[1]}
              </p>
            </div>
            <CollectionExplorer />
          </div>
        </section>
        <CardDiscoveryRail />
        <section className="portfolio-section" id="portfolio" aria-labelledby="portfolio-title">
          <div className="section-shell">
            <div className="portfolio-heading">
              <span className="eyebrow">{portfolio.label}</span>
              <h2 id="portfolio-title">
                {portfolio.title}
                <br />
                <em>{portfolio.accent}</em>
              </h2>
              <p>
                {portfolio.lines[0]}
                <br />
                {portfolio.lines[1]}
              </p>
            </div>
            <PortfolioExplorer />
          </div>
        </section>
        <section className="dex-section" id="entdecken" aria-labelledby="dex-title">
          <div className="section-shell">
            <div className="dex-heading">
              <div>
                <span className="eyebrow">{dex.label}</span>
                <h2 id="dex-title">
                  {dex.title}
                  <br />
                  <em>{dex.accent}</em>
                </h2>
              </div>
              <p>{dex.body}</p>
            </div>
            <DexExplorer />
          </div>
        </section>
        <FAQSection />
        <LaunchSection />
      </main>
      <SiteFooter home />
    </>
  );
}
