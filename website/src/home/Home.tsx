'use client';
// mondextcg.com. One idea per screen, objects you can almost touch, and
// motion that plays by itself instead of asking for long scrolls. Phone-first:
// everything moves on the compositor, loops pause off screen, Reduce Motion
// gets a still page.
import { useEffect, useRef } from 'react';
import { Brand } from '@/components/Primitives';
import { LanguageSwitch, useLanguage } from '@/components/Language';
import { APP_STORE_LIVE, appStoreUrl } from '@/lib/launch';
import { homeCopy } from './copy';
import { featureContent } from '@/lib/feature-content';
import { GUIDE_PATHS, type GuideId } from '@/lib/guides';
import { usePageMotion } from './motion';
import { GetApp } from './GetApp';
import {
  Bento,
  DexOrbit,
  Faq,
  FinalOrbit,
  Heading,
  HeroStage,
  Marquee,
  Plans,
  PriceShowcase,
  ScanShowcase,
  SetRows,
  Statement,
} from './Scenes';

export default function Home() {
  const { locale } = useLanguage();
  const c = homeCopy[locale];
  const page = useRef<HTMLDivElement>(null);
  usePageMotion(page);
  useEffect(() => {
    document.title = c.meta.title;
  }, [c.meta.title]);
  const cta = APP_STORE_LIVE ? appStoreUrl(locale, 'header') : '#holen';
  return (
    <div className="mx" ref={page} data-tone="light">
      <a className="mx-skip" href="#inhalt">
        {c.skip}
      </a>
      <header className="nav">
        <div className="nav-pill">
          <a href="#top" className="nav-brand" aria-label="MonDex">
            <Brand />
          </a>
          <nav className="nav-links" aria-label={locale === 'de' ? 'Hauptnavigation' : 'Main'}>
            <a href="#scanner">{c.nav.scan}</a>
            <a href="#pokedex">{c.nav.dex}</a>
            <a href="#preise">{c.nav.prices}</a>
            <a href="#plus">{c.nav.plus}</a>
            <a href="#fragen">{c.nav.faq}</a>
          </nav>
          <LanguageSwitch />
          <a className="nav-cta" href={cta} data-magnet>
            <span>{APP_STORE_LIVE ? c.nav.ctaLive : c.nav.cta}</span>
          </a>
        </div>
      </header>

      <main id="inhalt">
        <section className="hero" id="top" data-tone="light">
          <div className="hero-copy">
            {/* The badge is part of the h1, so the page's main heading names what MonDex is. */}
            <Heading
              parts={c.hero.title}
              as="h1"
              inlineLast
              className="hd-hero"
              kicker={
                <span className="hero-badge">
                  <img src="/assets/orbit.svg" alt="" width={18} height={18} />
                  {c.hero.badge}
                </span>
              }
            />
            <p className="lead hero-lead">{c.hero.body}</p>
            <div className="hero-cta">
              <GetApp c={c.waitlist} store={c.store} locale={locale} placement="hero" proof />
            </div>
          </div>
          <HeroStage c={c} />
        </section>

        <section className="st" data-tone="light">
          <Statement text={c.statement} />
        </section>

        <section
          className="ss is-lilac"
          id="scanner"
          data-tone="lilac"
          aria-labelledby="scan-title"
        >
          <ScanShowcase c={c.scan} />
        </section>

        <section className="dx is-night" id="pokedex" data-tone="night">
          <div className="sec-head is-centred">
            <p className="eyebrow">{c.dex.eyebrow}</p>
            <Heading parts={c.dex.title} />
            <p className="lead" data-reveal>
              {c.dex.body}
            </p>
          </div>
          <DexOrbit c={c.dex} locale={locale} />
        </section>

        <section className="ps" id="preise" data-tone="light">
          <div className="sec-head is-centred">
            <p className="eyebrow">{c.prices.eyebrow}</p>
            <Heading parts={c.prices.title} />
          </div>
          <PriceShowcase c={c.prices} />
        </section>

        <section className="cg is-night" data-tone="night">
          <div className="sec-head is-centred">
            <p className="eyebrow">{c.catalogue.eyebrow}</p>
            <Heading parts={c.catalogue.title} />
            <p className="lead" data-reveal>
              {c.catalogue.body}
            </p>
          </div>
          <Marquee />
          <SetRows c={c.catalogue} />
        </section>

        <section className="bt-sec" data-tone="light">
          <div className="sec-head is-centred">
            <p className="eyebrow">{c.more.eyebrow}</p>
            <Heading parts={c.more.title} />
          </div>
          <Bento c={c.more} />
        </section>

        <section className="pl" id="plus" data-tone="light">
          <div className="sec-head is-centred">
            <p className="eyebrow">{c.plus.eyebrow}</p>
            <Heading parts={c.plus.title} />
          </div>
          <Plans c={c.plus} />
        </section>

        <section className="fq-sec" id="fragen" data-tone="light">
          <div className="sec-head">
            <Heading parts={[c.faq.title]} className="hd-small" />
          </div>
          <Faq items={c.faq.items} live={APP_STORE_LIVE} />
        </section>

        <section className="fin is-night" id="holen" data-tone="night">
          <FinalOrbit>
            <Heading parts={c.final.title} />
            <p className="lead" data-reveal>
              {APP_STORE_LIVE ? c.final.bodyLive : c.final.body}
            </p>
            <div className="fin-cta" data-reveal>
              <GetApp c={c.waitlist} store={c.store} locale={locale} placement="final" dark />
            </div>
          </FinalOrbit>
        </section>
      </main>

      <footer className="ft is-night" data-tone="night">
        <div className="ft-top">
          <p>{c.footer.tagline}</p>
          <nav aria-label={locale === 'de' ? 'Ratgeber' : 'Guides'}>
            {(['scanner', 'value', 'collection'] as GuideId[]).map((guide) => (
              <a key={guide} href={GUIDE_PATHS[guide][locale]}>
                {featureContent[guide][locale].label}
              </a>
            ))}
          </nav>
          <nav aria-label="Footer">
            <a href="/kontakt/">{c.footer.contact}</a>
            <a href="/datenschutz/">{c.footer.privacy}</a>
            <a href="/nutzungsbedingungen/">{c.footer.terms}</a>
            <a href="/impressum/">{c.footer.imprint}</a>
          </nav>
        </div>
        <p className="ft-word" aria-hidden="true">
          M<img src="/assets/orbit.svg" alt="" width={200} height={200} />
          nDex
        </p>
        <p className="ft-fine">{c.footer.note}</p>
        <p className="ft-fine">© 2026 MonDex. {c.footer.legal}</p>
      </footer>
    </div>
  );
}
