'use client';

import { useLanguage } from './Language';
import { Arrow, Brand } from './Primitives';
import { siteContent } from '@/lib/site-content';
import { WaitlistForm } from './WaitlistForm';

export function LaunchSection() {
  const { locale } = useLanguage();
  const c = siteContent[locale].launch;
  return (
    <section className="launch-section" id="vormerken" aria-labelledby="launch-title">
      <div className="section-shell launch-inner">
        <img src="/assets/orbit.svg" width="64" height="64" alt="" loading="lazy" />
        <h2 id="launch-title">
          {c.title}
          <br />
          <em>{c.accent}</em>
        </h2>
        <p className="launch-body">{c.body}</p>
        <WaitlistForm />
        <p className="launch-note">{c.note}</p>
      </div>
    </section>
  );
}

export function FAQSection() {
  const { locale } = useLanguage();
  const c = siteContent[locale];
  return (
    <section className="faq-section section-shell" id="faq" aria-labelledby="faq-title">
      <div className="faq-intro">
        <h2 id="faq-title">{c.faqTitle}</h2>
        <p>{c.faqIntro}</p>
      </div>
      <div className="faq-list">
        {c.faq.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <span className="faq-symbol" aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function SiteFooter({ home = false }: { home?: boolean }) {
  const { copy, locale } = useLanguage();
  const c = siteContent[locale].footer;
  const root = home ? '' : '/';
  return (
    <footer className="site-footer complete-footer section-shell">
      <div className="footer-top">
        <a href={`${root}#produkt`} aria-label={copy.footer.home}>
          <Brand />
        </a>
        <a className="text-link" href={`${root}#produkt`}>
          {copy.footer.top}
          <Arrow up />
        </a>
      </div>
      <div className="footer-columns">
        <p className="footer-tagline">{copy.footer.tagline}</p>
        <nav aria-label={c.explore}>
          <h2>{c.explore}</h2>
          {['scanner', 'sammlung', 'portfolio', 'entdecken'].map((id, i) => (
            <a key={id} href={`${root}#${id}`}>
              {c.links[i]}
            </a>
          ))}
        </nav>
        <nav aria-label={c.learn}>
          <h2>{c.learn}</h2>
          {[
            'pokemon-tcg-scanner',
            'pokemon-card-collection-tracker',
          ].map((path, i) => (
            <a key={path} href={`/${path}/`}>
              {c.guides[i]}
            </a>
          ))}
          <a href={`${root}#fragen`}>{c.faq}</a>
        </nav>
        <nav aria-label={c.support}>
          <h2>{c.support}</h2>
          <a href="/kontakt/">{c.contact}</a>
          <a href="/datenschutz/">{c.privacy}</a>
          <a href="/impressum/">{c.legal}</a>
          <a href={`${root}#vormerken`}>{c.waitlist}</a>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>{c.copyright}</span>
        <p>{copy.footer.legal}</p>
      </div>
    </footer>
  );
}
