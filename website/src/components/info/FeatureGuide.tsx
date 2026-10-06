'use client';
import { useLanguage } from '../Language';
import { InfoIntro, InfoSections } from './shared';
import { Arrow } from '../Primitives';
import { featureContent } from '@/lib/feature-content';
import { GUIDE_PATHS, type GuideId } from '@/lib/guides';

export function FeatureGuide({ id }: { id: GuideId }) {
  const { locale } = useLanguage();
  const c = featureContent[id][locale];
  const home = locale === 'de' ? '/de/' : '/';
  const other = (Object.keys(GUIDE_PATHS) as GuideId[]).filter((guide) => guide !== id);
  const sections = c.sections.map((section, i) => ({
    id: `section-${i + 1}`,
    title: section.title,
    body: (
      <>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {section.steps && (
          <ol>
            {section.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        )}
      </>
    ),
  }));
  if (c.faq.length)
    sections.push({
      id: 'questions',
      title: locale === 'de' ? 'Häufige Fragen' : 'Common questions',
      body: (
        <div className="guide-faq">
          {c.faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      ),
    });
  sections.push({
    id: 'more',
    title: locale === 'de' ? 'Mehr zu MonDex' : 'More about MonDex',
    body: (
      <ul className="guide-links">
        {other.map((guide) => (
          <li key={guide}>
            <a href={GUIDE_PATHS[guide][locale]}>{featureContent[guide][locale].label}</a>
          </li>
        ))}
        <li>
          <a href={`${home}#fragen`}>
            {locale === 'de' ? 'Alle Fragen und Antworten' : 'All questions and answers'}
          </a>
        </li>
      </ul>
    ),
  });
  return (
    <>
      <InfoIntro label={c.label} title={c.title} head={false}>
        <p>{c.intro}</p>
      </InfoIntro>
      <div className="guide-actions">
        <a className="button primary" href={`${home}#${c.anchor}`}>
          {c.demo}
          <Arrow />
        </a>
        <a className="text-link" href={`${home}#holen`}>
          {locale === 'de' ? 'Zum Launch vormerken' : 'Join the launch list'}
          <Arrow />
        </a>
      </div>
      <InfoSections
        toc={locale === 'en' ? 'In this guide' : 'In diesem Überblick'}
        sections={sections}
      />
    </>
  );
}
