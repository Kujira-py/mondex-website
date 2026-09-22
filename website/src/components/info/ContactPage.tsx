'use client';
import type { ReactNode } from 'react';
import { Arrow } from '../Primitives';
import { mailto, contactEmail as CONTACT_EMAIL } from '@/lib/site-content';
import { useLanguage } from '../Language';
import type { Locale } from '@/lib/messages';
import { InfoIntro, Local } from './shared';

type Topic = { title: string; text: ReactNode; subject: string };
type ContactCopy = {
  label: string;
  title: string;
  intro: string;
  emailLabel: string;
  password: string;
  postal: ReactNode;
  topicsTitle: string;
  topicsIntro: string;
  subjectLabel: string;
  emailWith: (subject: string) => string;
  topics: Topic[];
};

const copy: Record<Locale, ContactCopy> = {
  en: {
    label: 'Contact',
    title: 'Questions, bugs or ideas? Write to us.',
    intro: 'Email is the best way to reach MonDex. Write to us from your own mail app.',
    emailLabel: 'Email us',
    password: 'MonDex will never ask for your password by email. If someone does, it isn’t us.',
    postal: (
      <>
        More information: <Local to="/impressum">Legal Notice</Local> and{' '}
        <Local to="/datenschutz">Privacy Policy</Local>.
      </>
    ),
    topicsTitle: 'What people write to us about',
    topicsIntro: 'Using the suggested subject line helps us sort your email quickly.',
    subjectLabel: 'Subject',
    emailWith: (subject) => `Email us with the subject “${subject}”`,
    topics: [
      {
        title: 'App support and bug reports',
        subject: 'Support',
        text: (
          <>
            Something not working as it should? Tell us what happened, and include your MonDex app
            version and your iPhone model. If a scan didn’t recognise a card, a photo of the card
            helps a lot.
          </>
        ),
      },
      {
        title: 'Account and data requests',
        subject: 'Data request',
        text: (
          <>
            Want to see, correct, delete or export your data? You can do most of this yourself in
            the app: see <Local to="/datenschutz#your-rights">your rights and controls</Local> in
            our Privacy Policy. For anything else, write from the email address your account uses
            (or tell us which one it is), so we can find your account.
          </>
        ),
      },
      {
        title: 'Privacy questions',
        subject: 'Privacy',
        text: (
          <>
            Curious what we store, where, and for how long? Our{' '}
            <Local to="/datenschutz">Privacy Policy</Local> explains it in plain language. If your
            question isn’t answered there, ask us.
          </>
        ),
      },
      {
        title: 'Press and partnerships',
        subject: 'Press & partnerships',
        text: (
          <>
            Writing about MonDex, or have an idea for working together? Tell us a little about
            yourself and what you have in mind.
          </>
        ),
      },
      {
        title: 'Feedback and feature ideas',
        subject: 'Feedback',
        text: (
          <>
            Missing something in MonDex, or love something about it? We’d like to hear it, big or
            small.
          </>
        ),
      },
    ],
  },
  de: {
    label: 'Kontakt',
    title: 'Fragen, Fehler oder Ideen? Schreib uns.',
    intro:
      'Am besten erreichst du MonDex per E-Mail. Schreib uns einfach aus deinem eigenen Mailprogramm.',
    emailLabel: 'Schreib uns',
    password:
      'MonDex fragt dich nie per E-Mail nach deinem Passwort. Wenn das jemand tut, sind es nicht wir.',
    postal: (
      <>
        Weitere Informationen: <Local to="/impressum">Impressum</Local> und{' '}
        <Local to="/datenschutz">Datenschutz</Local>.
      </>
    ),
    topicsTitle: 'Worum es in deiner Nachricht gehen kann',
    topicsIntro: 'Mit dem vorgeschlagenen Betreff können wir deine E-Mail schneller zuordnen.',
    subjectLabel: 'Betreff',
    emailWith: (subject) => `E-Mail mit dem Betreff „${subject}“ schreiben`,
    topics: [
      {
        title: 'App-Support und Fehlerberichte',
        subject: 'Support',
        text: (
          <>
            Etwas funktioniert nicht wie gedacht? Beschreib kurz, was passiert ist, und nenn uns
            deine MonDex-Version und dein iPhone-Modell. Wenn ein Scan eine Karte nicht erkannt hat,
            hilft uns ein Foto der Karte sehr.
          </>
        ),
      },
      {
        title: 'Konto- und Datenanfragen',
        subject: 'Datenanfrage',
        text: (
          <>
            Du möchtest deine Daten einsehen, korrigieren, löschen oder exportieren? Das meiste
            davon kannst du selbst in der App erledigen, siehe{' '}
            <Local to="/datenschutz#your-rights">deine Rechte und Einstellungen</Local> in der
            Datenschutzerklärung. Für alles andere schreib uns am besten von der E-Mail-Adresse
            deines Kontos (oder nenn sie uns), damit wir dein Konto finden.
          </>
        ),
      },
      {
        title: 'Fragen zum Datenschutz',
        subject: 'Datenschutz',
        text: (
          <>
            Du willst wissen, was wir speichern, wo und wie lange? Unsere{' '}
            <Local to="/datenschutz">Datenschutzerklärung</Local> erklärt es in einfacher Sprache.
            Wenn deine Frage dort nicht beantwortet wird, frag uns.
          </>
        ),
      },
      {
        title: 'Presse und Kooperationen',
        subject: 'Presse & Kooperationen',
        text: (
          <>
            Du schreibst über MonDex oder hast eine Idee für eine Zusammenarbeit? Erzähl uns kurz,
            wer du bist und was du vorhast.
          </>
        ),
      },
      {
        title: 'Feedback und Ideen',
        subject: 'Feedback',
        text: (
          <>
            Dir fehlt etwas in MonDex, oder dir gefällt etwas besonders? Wir freuen uns über jede
            Rückmeldung, ob groß oder klein.
          </>
        ),
      },
    ],
  },
};

export default function ContactPage() {
  const { locale } = useLanguage();
  const c = copy[locale];
  return (
    <>
      <InfoIntro label={c.label} title={c.title}>
        <p>{c.intro}</p>
      </InfoIntro>
      <section className="contact-panel" aria-labelledby="contact-email-label">
        <div>
          <p id="contact-email-label" className="contact-label">
            {c.emailLabel}
          </p>
          <a className="contact-email" href={mailto()}>
            {CONTACT_EMAIL}
          </a>
        </div>
        <ul className="contact-facts">
          <li>
            <span>{c.password}</span>
          </li>
          <li>
            <span>{c.postal}</span>
          </li>
        </ul>
      </section>
      <section className="contact-topics" aria-labelledby="contact-topics-title">
        <h2 id="contact-topics-title">{c.topicsTitle}</h2>
        <p>{c.topicsIntro}</p>
        <ul className="topic-list">
          {c.topics.map(({ title, text, subject }) => (
            <li key={subject}>
              <h3>{title}</h3>
              <p>{text}</p>
              <a className="topic-subject" href={mailto(subject)} aria-label={c.emailWith(subject)}>
                <span>
                  <small>{c.subjectLabel}</small>
                  {subject}
                </span>
                <Arrow />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
