'use client';
// mondextcg.com: the Pokédex leads. Six sections, one moment each.
import { useEffect, useRef, useState } from 'react';
import { Brand } from '@/components/Primitives';
import { LanguageSwitch, useLanguage } from '@/components/Language';
import { homeCopy } from './copy';
import { HeroScan } from './HeroScan';
import { DexWave } from './DexWave';
import { Shelf } from './Shelf';
import { Openings } from './Openings';
import { attachDepth } from './depth';
import { Collection, Faq, Note, Phone, Reveal, Title, Waitlist } from './Sections';

export default function Home() {
  const { locale } = useLanguage();
  const c = homeCopy[locale];
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const page = useRef<HTMLDivElement>(null);
  useEffect(() => (page.current ? attachDepth(page.current) : undefined), []);
  useEffect(() => {
    document.title = c.meta.title;
    const dex = document.getElementById('entdecken');
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      // Dark while the Pokédex section sits under the header's middle.
      const box = dex?.getBoundingClientRect();
      setDark(!!box && box.top <= 36 && box.bottom >= 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [c.meta.title]);
  const links: [string, string][] = [
    ['#scanner', c.nav.scan],
    ['#entdecken', c.nav.dex],
    ['#sammlung', c.nav.collection],
    ['#fragen', c.nav.faq],
  ];
  return (
    <div className="mx" ref={page}>
      <a className="mx-skip" href="#inhalt">
        {locale === 'de' ? 'Zum Inhalt' : 'Skip to content'}
      </a>
      <header className={`mx-header ${scrolled ? 'is-scrolled' : ''} ${menu ? 'is-open' : ''} ${dark && !menu ? 'is-dark' : ''}`}>
        <div className="mx-header-bar">
          <a href="#produkt" aria-label="MonDex" onClick={() => setMenu(false)}>
            <Brand />
          </a>
          <nav className="mx-nav" aria-label={locale === 'de' ? 'Hauptnavigation' : 'Main'}>
            {links.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenu(false)}>
                {label}
              </a>
            ))}
          </nav>
          <div className="mx-header-actions">
            <LanguageSwitch />
            <a className="mx-button mx-button-small" href="#vormerken">
              {c.nav.cta}
            </a>
            <button
              type="button"
              className="mx-menu"
              aria-expanded={menu}
              aria-label={menu ? c.menu[1] : c.menu[0]}
              onClick={() => setMenu(!menu)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main id="inhalt">
        <section className="mx-hero" id="produkt">
          <div className="mx-hero-stage">
            <div className="mx-hero-copy">
              <p className="mx-eyebrow">{c.hero.eyebrow}</p>
              <Title as="h1" lines={c.hero.title} />
              <p className="mx-lead">{c.hero.body}</p>
              <Waitlist c={c.waitlist} locale={locale} compact />
            </div>
            <HeroScan phone={c.phone} german={locale === 'de'} replay={c.replay} />
          </div>
        </section>

        <section className="mx-section mx-scan" id="scanner">
          <Reveal className="mx-section-head">
            <p className="mx-eyebrow">{c.scan.eyebrow}</p>
            <Title lines={c.scan.title} />
            <p className="mx-lead">{c.scan.body}</p>
          </Reveal>
          <ul className="mx-facts">
            {c.scan.facts.map(([title, text, note]) => (
              <Reveal as="li" key={title} depth>
                <b>{title}</b>
                <span>
                  {text}
                  {note ? <Note n={note} /> : null}
                </span>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="mx-dex" id="entdecken">
          <div className="mx-dex-stage">
            <Reveal className="mx-section-head">
              <p className="mx-eyebrow">{c.dex.eyebrow}</p>
              <Title lines={c.dex.title} />
              <p className="mx-lead">{c.dex.body}</p>
            </Reveal>
            <DexWave count={c.dex.count} replay={c.replay} />
          </div>
        </section>

        <section className="mx-shelf" aria-labelledby="katalog-title">
          <Reveal className="mx-section-head">
            <p className="mx-eyebrow">{c.shelf.eyebrow}</p>
            <h2 className="mx-title" id="katalog-title">
              {c.shelf.title[0]}
              <br />
              <span className="mx-accent">{c.shelf.title[1]}</span>
            </h2>
            <p className="mx-lead">{c.shelf.body}</p>
          </Reveal>
          <Shelf cardsLabel={c.shelf.title[0]} setsLabel={c.shelf.title[1]} />
        </section>

        <section className="mx-section" id="sammlung">
          <span id="portfolio" className="mx-anchor" />
          <Reveal className="mx-section-head">
            <p className="mx-eyebrow">{c.collection.eyebrow}</p>
            <Title lines={c.collection.title} />
          </Reveal>
          <Collection c={c.collection} />
        </section>

        <section className="mx-section mx-openings" id="openings">
          <div className="mx-openings-grid">
            <Reveal className="mx-section-head">
              <p className="mx-eyebrow">{c.openings.eyebrow}</p>
              <Title lines={c.openings.title} />
              <p className="mx-lead">{c.openings.body}</p>
            </Reveal>
            <Openings c={c.openings} />
          </div>
        </section>

        <section className="mx-section mx-gallery">
          <Reveal className="mx-section-head">
            <p className="mx-eyebrow">{c.gallery.eyebrow}</p>
            <h2 className="mx-title">
              {c.gallery.title}
              <Note n={3} />
            </h2>
          </Reveal>
          <div className="mx-shots">
            {(['home', 'dex', 'cards', 'card'] as const).map((shot, i) => (
              <Reveal key={shot} className="mx-shot">
                <Phone src={`/assets/app/${shot}.webp`} alt={c.gallery.shots[i]} />
                <p>{c.gallery.shots[i]}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-section mx-questions" id="fragen">
          <Reveal className="mx-section-head">
            <h2 className="mx-title">{c.faq.title}</h2>
          </Reveal>
          <Faq items={c.faq.items} />
        </section>

        <section className="mx-section mx-final" id="vormerken">
          <Reveal className="mx-final-inner">
            <Title lines={c.waitlist.title} />
            <p className="mx-lead">{c.waitlist.body}</p>
            <Waitlist c={c.waitlist} locale={locale} />
          </Reveal>
        </section>
      </main>

      <footer className="mx-footer">
        <div className="mx-footer-top">
          <div>
            <Brand />
            <p>{c.footer.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <a href="/kontakt/">{c.footer.contact}</a>
            <a href="/datenschutz/">{c.footer.privacy}</a>
            <a href="/impressum/">{c.footer.imprint}</a>
          </nav>
        </div>
        <ol className="mx-notes">
          {c.footer.notes.map((note, i) => (
            <li key={note} id={`note-${i + 1}`}>
              {note}
            </li>
          ))}
        </ol>
        <p className="mx-legal">
          © {new Date().getFullYear()} MonDex. {c.footer.legal}
        </p>
      </footer>
    </div>
  );
}
