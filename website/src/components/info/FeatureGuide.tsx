'use client';
import Link from 'next/link';
import { useLanguage } from '../Language';
import { InfoIntro, InfoSections } from './shared';
import { Arrow } from '../Primitives';
import { featureContent, type FeaturePath } from '@/lib/feature-content';
import { siteContent } from '@/lib/site-content';

export function FeatureGuide({ path }: { path: FeaturePath }) {
  const { locale } = useLanguage();
  const c = featureContent[path][locale];
  return (
    <>
      <InfoIntro label={c.label} title={c.title}>
        <p>{c.intro}</p>
      </InfoIntro>
      <div className="guide-actions">
        <a className="button primary" href={`/#${c.anchor}`}>
          {c.demo}
          <Arrow />
        </a>
        <Link className="text-link" href="/#vormerken">
          {siteContent[locale].launch.action}
          <Arrow />
        </Link>
      </div>
      <InfoSections
        toc={locale === 'en' ? 'In this guide' : 'In diesem Überblick'}
        sections={c.sections.map((section, i) => ({
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
        }))}
      />
    </>
  );
}
