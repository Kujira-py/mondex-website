'use client';
import type { ReactNode } from 'react';
import { useLanguage } from '../Language';
import type { Locale } from '@/lib/messages';
import {
  Fill,
  InfoIntro,
  InfoSections,
  Local,
  Mail,
  Out,
  TERMS_LAST_UPDATED,
  formatDate,
  operator,
  trademark,
  type InfoSection,
} from './shared';

const APPLE_REFUND = 'https://reportaproblem.apple.com/';
const APPLE_TERMS = 'https://www.apple.com/legal/internet-services/itunes/';
const GOOGLE_REFUND = 'https://support.google.com/googleplay/answer/2479637';
const GOOGLE_TERMS = 'https://play.google.com/about/play-terms/';

type TermsCopy = {
  label: string;
  title: string;
  intro: ReactNode;
  updated: string;
  summaryTitle: string;
  summary: string;
  toc: string;
  sections: InfoSection[];
};

const copy: Record<Locale, TermsCopy> = {
  en: {
    label: 'Terms of Use',
    title: 'Terms of Use',
    intro: (
      <>
        The rules for using MonDex, in plain language: what’s free, how MonDex Plus works, and what
        you and we can expect from each other. If anything here is unclear, email us at{' '}
        <Mail subject="Terms of Use" />.
      </>
    ),
    updated: 'Last updated',
    summaryTitle: 'The short version',
    summary:
      'Collecting in MonDex is free. MonDex Plus is an optional subscription that you buy, manage and cancel in the App Store or Google Play. The Welcome Week is free and ends by itself. Prices are estimates, recognition can be wrong, and your cards, photos and notes stay yours.',
    toc: 'On this page',
    sections: [
      {
        id: 'about',
        title: 'What MonDex is',
        body: (
          <>
            <p>
              MonDex is an app for iPhone and Android for collecting Pokémon cards. You scan or
              search your cards, and MonDex organises them as a Pokédex, sets, binders and lists,
              with goals to collect towards and an estimate of what your collection is worth. This
              website shows what the app does.
            </p>
            <p>
              MonDex is offered by <Fill>{operator.name}</Fill>, <Fill>{operator.address}</Fill>{' '}
              (“we”, “us”). These terms apply between you and us when you use the MonDex app, your
              MonDex account or this website. Our full details are in the{' '}
              <Local to="/impressum">Legal Notice</Local>. How we handle your data is explained in
              the <Local to="/datenschutz">Privacy Policy</Local>.
            </p>
          </>
        ),
      },
      {
        id: 'account',
        title: 'Your account',
        body: (
          <>
            <p>
              You can try MonDex with a sample collection, without an account. To keep your own
              collection, you create an account in one of two ways:
            </p>
            <ul>
              <li>with your email address and a password; we confirm the address with a code</li>
              <li>with Sign in with Apple or Sign in with Google</li>
            </ul>
            <p>
              Please use an email address you can receive mail at, and keep your password to
              yourself. An account is for one person. If you think someone else is using your
              account, change your password and let us know.
            </p>
            <p>
              To create an account, you must be at least 16 years old, or have the permission of a
              parent or guardian.
            </p>
          </>
        ),
      },
      {
        id: 'plus',
        title: 'Free, and MonDex Plus',
        body: (
          <>
            <p>
              Your collection, Pokédex, sets, binders, lists and card prices are free. Adding cards
              by hand is free too.
            </p>
            <p>
              MonDex Plus is an optional subscription for collectors who want more, such as scanning
              and deeper analytics. The app shows which features are part of Plus before you buy it.
            </p>
            <h3>Price</h3>
            <p>
              MonDex Plus costs €3.99 a month or €29.99 a year. Outside the euro area, the store
              shows the price in your currency. The price the store shows before you confirm the
              purchase is the one that applies, including any VAT.
            </p>
            <h3>Billing through Apple or Google</h3>
            <p>
              You buy MonDex Plus in the app, through the Apple App Store or Google Play. Apple or
              Google take the payment and handle billing under their own terms; we never see your
              payment details. “Restore purchases” in the app links Plus to your MonDex account
              again, for example on a new phone.
            </p>
            <h3>Renewal and cancelling</h3>
            <p>
              Plus renews automatically for the same period, a month or a year, until you cancel it.
              You cancel in your App Store or Google Play account settings; the app takes you there
              from Settings → MonDex Plus. To stop the next renewal, cancel at least 24 hours before
              the current period ends. Cancelling takes effect at the end of the period you have
              already paid for, and Plus stays active until then.
            </p>
            <p>
              Deleting the app or your MonDex account doesn’t cancel a store subscription. Please
              cancel it in the store as well.
            </p>
            <h3>Refunds</h3>
            <p>
              Because Apple or Google take the payment, they handle refunds under their own rules.
              We can’t refund store purchases ourselves. You can ask Apple at{' '}
              <Out href={APPLE_REFUND}>reportaproblem.apple.com</Out> or Google through{' '}
              <Out href={GOOGLE_REFUND}>Google Play</Out>.
            </p>
            <h3>Price changes and offers</h3>
            <p>
              If the price of Plus changes, the store tells you before it applies to you and, where
              its rules require it, asks for your consent. Offers such as offer codes come with
              their own conditions, shown with the offer.
            </p>
          </>
        ),
      },
      {
        id: 'welcome-week',
        title: 'The Welcome Week',
        body: (
          <>
            <p>
              Every new collector can try everything in MonDex Plus for 7 days, free. We call it the
              Welcome Week.
            </p>
            <ul>
              <li>It starts with your first scan, not when you sign up.</li>
              <li>It needs no payment details.</li>
              <li>
                It ends by itself after 7 days. It doesn’t renew and doesn’t turn into a paid
                subscription.
              </li>
              <li>
                There is one Welcome Week per account and, on iPhone, one per device. To check the
                device, MonDex uses a feature of the iPhone’s operating system that identifies no
                one (see the <Local to="/datenschutz#plus">Privacy Policy</Local>).
              </li>
            </ul>
            <p>
              When it ends, everything you added stays in your collection. Scanning then needs
              MonDex Plus; adding cards by hand stays free.
            </p>
          </>
        ),
      },
      {
        id: 'invitations',
        title: 'Inviting friends',
        body: (
          <>
            <p>
              You can invite friends to MonDex with your personal invitation link. Once your friend
              has really used MonDex, you both get 7 extra days of MonDex Plus. What counts as
              really using it, for example a number of recognised scans on several days, is shown in
              the app when you invite someone.
            </p>
            <ul>
              <li>
                Extra days are added to your Plus time. They have no cash value and can’t be
                transferred or exchanged.
              </li>
              <li>
                Each device can receive one invitation reward, and the number of rewards per year is
                limited. The app shows the current limit.
              </li>
              <li>
                Invitations are for real people. Inviting yourself, creating accounts to collect
                rewards, or buying or selling invitations isn’t allowed.
              </li>
            </ul>
            <p>
              If we see signs of misuse, we may review a reward before granting it, hold it back, or
              take back days already granted. If you think we got it wrong, write to us and we’ll
              take another look.
            </p>
          </>
        ),
      },
      {
        id: 'prices',
        title: 'Prices are estimates',
        body: (
          <>
            <p>
              The market values in MonDex are estimates based on third-party market data, mainly
              TCGplayer market prices. They describe what comparable cards have recently sold for,
              usually English, ungraded cards in near-mint condition, converted into your display
              currency at a daily exchange rate.
            </p>
            <p>
              What your own card would fetch can be quite different: its condition, language and
              grading, and the place and moment of a sale, all matter. Prices can also be missing,
              out of date or wrong.
            </p>
            <p>
              Prices in MonDex are for information only. They aren’t financial or investment advice,
              and they aren’t an offer to buy or sell. Please don’t base buying or selling decisions
              on them alone.
            </p>
          </>
        ),
      },
      {
        id: 'recognition',
        title: 'Card recognition can be wrong',
        body: (
          <>
            <p>
              The scanner suggests which card it sees. Most of the time it’s right, but lookalike
              cards, reprints with the same artwork, special printings, glare or poor light can lead
              to a wrong or uncertain suggestion.
            </p>
            <p>
              That’s why you stay in charge: you review your cards before they’re saved. Please
              check the card, the set and the printing. You can correct or remove a card at any
              time.
            </p>
          </>
        ),
      },
      {
        id: 'content',
        title: 'Your content',
        body: (
          <>
            <p>
              What you add to MonDex stays yours: your notes, profile photo, bio and the details of
              your collection.
            </p>
            <p>
              So that we can run MonDex for you, you give us a non-exclusive, free permission to
              store, process, copy and display this content, only as far as the service needs it:
              for example to recognise a card, keep your collection up to date on your devices, show
              it to you and create exports. We don’t use it for anything else. We don’t use it for
              advertising, and we don’t use your photos to train AI models. The permission ends when
              you delete the content or your account; technical copies may remain for a short time
              until they are removed.
            </p>
            <p>
              Please only upload content you’re allowed to use, such as photos you took yourself.
            </p>
          </>
        ),
      },
      {
        id: 'fair-use',
        title: 'Fair use',
        body: (
          <>
            <p>Please use MonDex the way it’s meant to be used. In particular, please don’t:</p>
            <ul>
              <li>
                break the law or other people’s rights, including by uploading content that is
                illegal, offensive or not yours to share
              </li>
              <li>
                try to get around MonDex Plus, the Welcome Week or the invitation rules, for example
                with extra accounts
              </li>
              <li>
                attack, overload or disrupt MonDex, or access it in automated ways, such as bots or
                bulk copying of the catalogue and prices
              </li>
              <li>decompile or reverse engineer the app, except where the law allows it</li>
              <li>resell access to MonDex or its data</li>
            </ul>
            <p>
              If an account seriously or repeatedly breaks these rules, we may limit or suspend it.
              Where it’s reasonable, we’ll warn you first and listen to your side of the story.
            </p>
          </>
        ),
      },
      {
        id: 'availability',
        title: 'Availability and changes',
        body: (
          <>
            <p>
              We work hard to keep MonDex running, but we can’t promise that it will always be
              available or free of errors. Maintenance, updates, or problems at our service
              providers, with the card catalogue, price sources, or at Apple and Google can
              interrupt it. The catalogue can be incomplete; it holds the English printings.
            </p>
            <p>
              MonDex keeps developing, so features can change, be added or be removed. If a change
              noticeably limits what you’ve paid for with MonDex Plus, we’ll tell you in advance,
              and you can cancel. Your statutory rights are not affected.
            </p>
            <p>
              If we ever decide to shut MonDex down, we’ll tell you in good time so you can export
              your collection.
            </p>
          </>
        ),
      },
      {
        id: 'liability',
        title: 'Liability',
        body: (
          <>
            <p>
              We are liable without limitation for damage we cause intentionally or through gross
              negligence, for injury to life, body or health, under the German Product Liability Act
              (Produkthaftungsgesetz), and where we have given a guarantee.
            </p>
            <p>
              For slight negligence, we are only liable if we breach an essential contractual
              obligation: an obligation that makes the proper use of MonDex possible in the first
              place and that you may regularly rely on. In that case, our liability is limited to
              the damage that is typical and foreseeable for this kind of contract. Otherwise, we
              are not liable for slight negligence.
            </p>
            <p>
              These limits also apply to the people who work for us. Your statutory rights, for
              example if MonDex Plus doesn’t work as it should, are not affected.
            </p>
          </>
        ),
      },
      {
        id: 'withdrawal',
        title: 'Right of withdrawal (EU)',
        body: (
          <>
            <p>
              If you live in the EU and buy as a consumer, you can generally withdraw from a
              contract concluded online within 14 days, without giving a reason.
            </p>
            <p>
              You buy MonDex Plus in the app through Apple or Google, so the withdrawal rules of the
              store you bought it from apply: how you withdraw, how long you have, and when the
              right ends early for digital content and services that you’ve asked to start straight
              away. You’ll find them in the <Out href={APPLE_TERMS}>Apple Media Services Terms</Out>{' '}
              and the <Out href={GOOGLE_TERMS}>Google Play Terms of Service</Out>. To withdraw or
              ask for a refund, use <Out href={APPLE_REFUND}>reportaproblem.apple.com</Out> for the
              App Store or the <Out href={GOOGLE_REFUND}>Google Play refund page</Out>.
            </p>
            <p>
              The Welcome Week and extra days from invitations are free, so there’s nothing to
              withdraw from. If something about MonDex Plus itself isn’t right, write to us at{' '}
              <Mail subject="MonDex Plus" /> and we’ll help.
            </p>
          </>
        ),
      },
      {
        id: 'deleting',
        title: 'Ending and deleting your account',
        body: (
          <>
            <p>You can stop using MonDex at any time. In the app, you can:</p>
            <ul>
              <li>export your collection as CSV or JSON first, if you want to keep it</li>
              <li>deactivate your account; signing in again restores it</li>
              <li>
                delete your account permanently. This removes your collection and your sign-in data,
                and it can’t be undone.
              </li>
            </ul>
            <p>
              Deleting your account doesn’t cancel a MonDex Plus subscription. Cancel it in the App
              Store or Google Play first; any refund is up to Apple or Google.
            </p>
            <p>
              We can close an account for an important reason, such as serious or repeated misuse
              (see{' '}
              <a className="info-link" href="#fair-use">
                Fair use
              </a>
              ).
            </p>
          </>
        ),
      },
      {
        id: 'trademarks',
        title: 'Pokémon and other trademarks',
        body: (
          <>
            <p>{trademark.en}</p>
            <p>
              Card data is provided by <Out href="https://pokemontcg.io/">pokemontcg.io</Out>.
              Market prices are based on TCGplayer market data.
            </p>
          </>
        ),
      },
      {
        id: 'changes',
        title: 'Changes to these terms',
        body: (
          <p>
            We may update these terms when MonDex, the law or our service providers change. We’ll
            update the date at the top of this page and tell you about changes that matter in the
            app before they take effect. Where the law requires your agreement to a change, we’ll
            ask for it. If you don’t agree with a change, you can stop using MonDex, cancel Plus and
            delete your account.
          </p>
        ),
      },
      {
        id: 'law',
        title: 'Applicable law and disputes',
        body: (
          <>
            <p>
              The law of the Republic of Kosovo applies. If you use MonDex as a consumer, you keep
              the protection of the mandatory consumer laws of the country where you live.
            </p>
            <p>
              We are neither obliged nor willing to take part in dispute resolution proceedings
              before a consumer arbitration board.
            </p>
          </>
        ),
      },
    ],
  },
  de: {
    label: 'Nutzungsbedingungen',
    title: 'Nutzungsbedingungen',
    intro: (
      <>
        Die Regeln für MonDex in einfacher Sprache: was kostenlos ist, wie MonDex Plus funktioniert
        und was du von uns und wir von dir erwarten können. Wenn etwas unklar ist, schreib uns an{' '}
        <Mail subject="Nutzungsbedingungen" />.
      </>
    ),
    updated: 'Zuletzt aktualisiert',
    summaryTitle: 'Kurz gesagt',
    summary:
      'Sammeln ist in MonDex kostenlos. MonDex Plus ist ein freiwilliges Abo, das du im App Store oder bei Google Play abschließt, verwaltest und kündigst. Die Welcome Week ist kostenlos und endet von selbst. Preise sind Schätzungen, die Erkennung kann sich irren, und deine Karten, Fotos und Notizen bleiben deine.',
    toc: 'Auf dieser Seite',
    sections: [
      {
        id: 'about',
        title: 'Was MonDex ist',
        body: (
          <>
            <p>
              MonDex ist eine App für iPhone und Android, mit der du Pokémon-Karten sammelst. Du
              scannst oder suchst deine Karten, und MonDex ordnet sie in Pokédex, Sets, Binder und
              Listen, mit Sammelzielen und einer Schätzung, was deine Sammlung wert ist. Diese
              Website zeigt, was die App kann.
            </p>
            <p>
              MonDex wird angeboten von <Fill>{operator.name}</Fill>,{' '}
              <Fill>{operator.address}</Fill> („wir“, „uns“). Diese Bedingungen gelten zwischen dir
              und uns, wenn du die MonDex-App, dein MonDex-Konto oder diese Website nutzt. Alle
              Angaben zu uns findest du im <Local to="/impressum">Impressum</Local>. Wie wir mit
              deinen Daten umgehen, erklärt die{' '}
              <Local to="/datenschutz">Datenschutzerklärung</Local>.
            </p>
          </>
        ),
      },
      {
        id: 'account',
        title: 'Dein Konto',
        body: (
          <>
            <p>
              Du kannst MonDex mit einer Beispielsammlung ohne Konto ausprobieren. Für deine eigene
              Sammlung legst du ein Konto an, auf eine von zwei Arten:
            </p>
            <ul>
              <li>
                mit deiner E-Mail-Adresse und einem Passwort; die Adresse bestätigen wir mit einem
                Code
              </li>
              <li>mit „Mit Apple anmelden“ oder „Mit Google anmelden“</li>
            </ul>
            <p>
              Bitte gib eine E-Mail-Adresse an, unter der du erreichbar bist, und behalte dein
              Passwort für dich. Ein Konto ist für eine Person. Wenn du glaubst, dass jemand anderes
              dein Konto nutzt, ändere dein Passwort und sag uns Bescheid.
            </p>
            <p>
              Für ein Konto musst du mindestens 16 Jahre alt sein oder die Erlaubnis deiner Eltern
              oder Erziehungsberechtigten haben.
            </p>
          </>
        ),
      },
      {
        id: 'plus',
        title: 'Kostenlos und MonDex Plus',
        body: (
          <>
            <p>
              Deine Sammlung, dein Pokédex, Sets, Binder, Listen und Kartenpreise sind kostenlos.
              Karten von Hand hinzuzufügen ist ebenfalls kostenlos.
            </p>
            <p>
              MonDex Plus ist ein freiwilliges Abo für alle, die mehr wollen, etwa Scannen und
              tiefere Analysen. Welche Funktionen zu Plus gehören, zeigt dir die App, bevor du
              kaufst.
            </p>
            <h3>Preis</h3>
            <p>
              MonDex Plus kostet 3,99 € im Monat oder 29,99 € im Jahr. Außerhalb des Euroraums zeigt
              dir der Store den Preis in deiner Währung. Es gilt der Preis, den der Store vor dem
              Kauf anzeigt, einschließlich einer etwaigen Umsatzsteuer.
            </p>
            <h3>Bezahlung über Apple oder Google</h3>
            <p>
              Du kaufst MonDex Plus in der App, über den Apple App Store oder Google Play. Apple
              bzw. Google wickeln die Zahlung und Abrechnung nach ihren eigenen Bedingungen ab;
              deine Zahlungsdaten sehen wir nie. Mit „Käufe wiederherstellen“ verknüpfst du Plus
              wieder mit deinem MonDex-Konto, etwa auf einem neuen Handy.
            </p>
            <h3>Verlängerung und Kündigung</h3>
            <p>
              Plus verlängert sich automatisch um denselben Zeitraum, einen Monat oder ein Jahr, bis
              du kündigst. Du kündigst in den Einstellungen deines App-Store- oder
              Google-Play-Kontos; die App führt dich über Einstellungen → MonDex Plus dorthin. Damit
              sich dein Abo nicht erneut verlängert, kündige spätestens 24 Stunden vor Ende des
              laufenden Zeitraums. Die Kündigung wirkt zum Ende des bereits bezahlten Zeitraums; bis
              dahin bleibt Plus aktiv.
            </p>
            <p>
              Wenn du die App oder dein MonDex-Konto löschst, wird ein Store-Abo nicht gekündigt.
              Bitte kündige es zusätzlich im Store.
            </p>
            <h3>Erstattungen</h3>
            <p>
              Da Apple bzw. Google die Zahlung abwickeln, entscheiden sie nach ihren eigenen Regeln
              über Erstattungen. Store-Käufe können wir nicht selbst erstatten. Du kannst eine
              Erstattung bei Apple unter <Out href={APPLE_REFUND}>reportaproblem.apple.com</Out>{' '}
              oder bei <Out href={GOOGLE_REFUND}>Google Play</Out> beantragen.
            </p>
            <h3>Preisänderungen und Angebote</h3>
            <p>
              Ändert sich der Preis von Plus, informiert dich der Store, bevor er für dich gilt, und
              fragt nach deiner Zustimmung, wo seine Regeln das vorsehen. Angebote wie Angebotscodes
              haben eigene Bedingungen, die beim Angebot stehen.
            </p>
          </>
        ),
      },
      {
        id: 'welcome-week',
        title: 'Die Welcome Week',
        body: (
          <>
            <p>
              Jede neue Sammlerin und jeder neue Sammler kann alles aus MonDex Plus 7 Tage lang
              kostenlos ausprobieren. Wir nennen das die Welcome Week.
            </p>
            <ul>
              <li>Sie beginnt mit deinem ersten Scan, nicht mit der Registrierung.</li>
              <li>Du brauchst keine Zahlungsdaten.</li>
              <li>
                Sie endet nach 7 Tagen von selbst. Sie verlängert sich nicht und wird nicht zu einem
                bezahlten Abo.
              </li>
              <li>
                Es gibt eine Welcome Week pro Konto und auf dem iPhone eine pro Gerät. Um das Gerät
                zu prüfen, nutzt MonDex eine Funktion des iPhone-Betriebssystems, die niemanden
                identifiziert (siehe <Local to="/datenschutz#plus">Datenschutzerklärung</Local>).
              </li>
            </ul>
            <p>
              Wenn sie endet, bleibt alles in deiner Sammlung, was du hinzugefügt hast. Scannen
              braucht danach MonDex Plus; Karten von Hand hinzufügen bleibt kostenlos.
            </p>
          </>
        ),
      },
      {
        id: 'invitations',
        title: 'Freunde einladen',
        body: (
          <>
            <p>
              Du kannst Freundinnen und Freunde mit deinem persönlichen Einladungslink zu MonDex
              einladen. Sobald die eingeladene Person MonDex wirklich nutzt, bekommt ihr beide 7
              zusätzliche Tage MonDex Plus. Was als wirkliche Nutzung zählt, zum Beispiel eine
              Anzahl erkannter Scans an mehreren Tagen, zeigt dir die App, wenn du jemanden
              einlädst.
            </p>
            <ul>
              <li>
                Zusätzliche Tage werden deiner Plus-Zeit gutgeschrieben. Sie haben keinen Geldwert
                und lassen sich nicht übertragen oder eintauschen.
              </li>
              <li>
                Jedes Gerät kann eine Einladungsprämie erhalten, und die Zahl der Prämien pro Jahr
                ist begrenzt. Die aktuelle Grenze zeigt dir die App.
              </li>
              <li>
                Einladungen sind für echte Menschen. Dich selbst einzuladen, Konten nur für Prämien
                anzulegen oder Einladungen zu kaufen oder zu verkaufen, ist nicht erlaubt.
              </li>
            </ul>
            <p>
              Bei Anzeichen von Missbrauch können wir eine Prämie vor der Gutschrift prüfen,
              zurückhalten oder bereits gutgeschriebene Tage zurücknehmen. Wenn du meinst, dass wir
              uns geirrt haben, schreib uns, und wir sehen es uns noch einmal an.
            </p>
          </>
        ),
      },
      {
        id: 'prices',
        title: 'Preise sind Schätzungen',
        body: (
          <>
            <p>
              Die Marktwerte in MonDex sind Schätzungen auf Grundlage von Marktdaten Dritter, vor
              allem der Marktpreise von TCGplayer. Sie beschreiben, wofür vergleichbare Karten
              zuletzt verkauft wurden, meist englische, ungegradete Karten im Zustand Near Mint, und
              werden zu einem täglichen Wechselkurs in deine Anzeigewährung umgerechnet.
            </p>
            <p>
              Was deine eigene Karte einbringen würde, kann deutlich abweichen: Zustand, Sprache und
              Grading sowie Ort und Zeitpunkt eines Verkaufs spielen eine Rolle. Preise können auch
              fehlen, veraltet oder falsch sein.
            </p>
            <p>
              Preise in MonDex dienen nur zur Information. Sie sind keine Finanz- oder
              Anlageberatung und kein Angebot zum Kauf oder Verkauf. Bitte triff Kauf- oder
              Verkaufsentscheidungen nicht allein auf ihrer Grundlage.
            </p>
          </>
        ),
      },
      {
        id: 'recognition',
        title: 'Die Erkennung kann sich irren',
        body: (
          <>
            <p>
              Der Scanner schlägt vor, welche Karte er sieht. Meistens liegt er richtig, aber
              ähnliche Karten, Neudrucke mit gleichem Artwork, Sonderdrucke, Spiegelungen oder
              schlechtes Licht können zu einem falschen oder unsicheren Vorschlag führen.
            </p>
            <p>
              Deshalb behältst du die Kontrolle: Du prüfst deine Karten, bevor sie gespeichert
              werden. Achte bitte auf Karte, Set und Druckvariante. Du kannst eine Karte jederzeit
              korrigieren oder entfernen.
            </p>
          </>
        ),
      },
      {
        id: 'content',
        title: 'Deine Inhalte',
        body: (
          <>
            <p>
              Was du in MonDex einbringst, bleibt deins: deine Notizen, dein Profilfoto, deine Bio
              und die Angaben zu deiner Sammlung.
            </p>
            <p>
              Damit wir MonDex für dich betreiben können, räumst du uns ein einfaches,
              unentgeltliches Recht ein, diese Inhalte zu speichern, zu verarbeiten, zu
              vervielfältigen und anzuzeigen, und zwar nur, soweit der Dienst es braucht: zum
              Beispiel, um eine Karte zu erkennen, deine Sammlung auf deinen Geräten aktuell zu
              halten, sie dir anzuzeigen und Exporte zu erstellen. Für anderes nutzen wir sie nicht.
              Wir nutzen sie nicht für Werbung, und deine Fotos nicht zum Training von KI-Modellen.
              Das Recht endet, wenn du die Inhalte oder dein Konto löschst; technische Kopien können
              noch kurze Zeit bestehen, bis sie entfernt sind.
            </p>
            <p>
              Bitte lade nur Inhalte hoch, die du verwenden darfst, etwa Fotos, die du selbst
              gemacht hast.
            </p>
          </>
        ),
      },
      {
        id: 'fair-use',
        title: 'Faire Nutzung',
        body: (
          <>
            <p>Bitte nutze MonDex so, wie es gedacht ist. Insbesondere bitten wir dich, nicht:</p>
            <ul>
              <li>
                gegen Gesetze oder die Rechte anderer zu verstoßen, auch nicht, indem du Inhalte
                hochlädst, die rechtswidrig oder beleidigend sind oder die du nicht teilen darfst
              </li>
              <li>
                MonDex Plus, die Welcome Week oder die Regeln für Einladungen zu umgehen, etwa mit
                zusätzlichen Konten
              </li>
              <li>
                MonDex anzugreifen, zu überlasten oder zu stören oder automatisiert darauf
                zuzugreifen, etwa mit Bots oder indem du Katalog und Preise massenhaft kopierst
              </li>
              <li>
                die App zu dekompilieren oder zurückzuentwickeln, soweit das Gesetz es nicht erlaubt
              </li>
              <li>den Zugang zu MonDex oder seine Daten weiterzuverkaufen</li>
            </ul>
            <p>
              Bei ernsthaften oder wiederholten Verstößen können wir ein Konto einschränken oder
              sperren. Wo es zumutbar ist, warnen wir dich vorher und hören uns deine Sicht an.
            </p>
          </>
        ),
      },
      {
        id: 'availability',
        title: 'Verfügbarkeit und Änderungen',
        body: (
          <>
            <p>
              Wir geben uns viel Mühe, dass MonDex läuft, können aber nicht versprechen, dass es
              immer verfügbar und fehlerfrei ist. Wartung, Updates oder Probleme bei unseren
              Dienstleistern, beim Kartenkatalog, bei Preisquellen oder bei Apple und Google können
              es unterbrechen. Der Katalog kann unvollständig sein; er enthält die englischen
              Drucke.
            </p>
            <p>
              MonDex entwickelt sich weiter, deshalb können Funktionen sich ändern, hinzukommen oder
              wegfallen. Schränkt eine Änderung spürbar ein, wofür du bei MonDex Plus bezahlt hast,
              sagen wir dir vorher Bescheid, und du kannst kündigen. Deine gesetzlichen Rechte
              bleiben unberührt.
            </p>
            <p>
              Sollten wir MonDex eines Tages einstellen, sagen wir dir rechtzeitig Bescheid, damit
              du deine Sammlung exportieren kannst.
            </p>
          </>
        ),
      },
      {
        id: 'liability',
        title: 'Haftung',
        body: (
          <>
            <p>
              Wir haften unbeschränkt für Schäden, die wir vorsätzlich oder grob fahrlässig
              verursachen, für Schäden aus der Verletzung des Lebens, des Körpers oder der
              Gesundheit, nach dem Produkthaftungsgesetz und soweit wir eine Garantie übernommen
              haben.
            </p>
            <p>
              Bei leichter Fahrlässigkeit haften wir nur, wenn wir eine wesentliche Vertragspflicht
              verletzen, also eine Pflicht, deren Erfüllung die ordnungsgemäße Nutzung von MonDex
              überhaupt erst ermöglicht und auf deren Einhaltung du regelmäßig vertrauen darfst. In
              diesem Fall ist unsere Haftung auf den vertragstypischen, vorhersehbaren Schaden
              begrenzt. Im Übrigen haften wir für leichte Fahrlässigkeit nicht.
            </p>
            <p>
              Diese Regeln gelten auch für Personen, die für uns arbeiten. Deine gesetzlichen
              Rechte, etwa wenn MonDex Plus nicht funktioniert, wie es soll, bleiben unberührt.
            </p>
          </>
        ),
      },
      {
        id: 'withdrawal',
        title: 'Widerrufsrecht (EU)',
        body: (
          <>
            <p>
              Wenn du in der EU lebst und als Verbraucherin oder Verbraucher kaufst, kannst du einen
              online geschlossenen Vertrag in der Regel innerhalb von 14 Tagen ohne Angabe von
              Gründen widerrufen.
            </p>
            <p>
              MonDex Plus kaufst du in der App über Apple oder Google. Deshalb gelten die
              Widerrufsregeln des Stores, in dem du gekauft hast: wie du widerrufst, wie lange du
              Zeit hast und wann das Widerrufsrecht bei digitalen Inhalten und Diensten vorzeitig
              erlischt, die auf deinen Wunsch sofort beginnen. Du findest sie in den{' '}
              <Out href={APPLE_TERMS}>Bedingungen für Apple-Medienservices</Out> und in den{' '}
              <Out href={GOOGLE_TERMS}>Nutzungsbedingungen von Google Play</Out>. Für einen Widerruf
              oder eine Erstattung nutzt du <Out href={APPLE_REFUND}>reportaproblem.apple.com</Out>{' '}
              für den App Store oder die{' '}
              <Out href={GOOGLE_REFUND}>Erstattungsseite von Google Play</Out>.
            </p>
            <p>
              Die Welcome Week und zusätzliche Tage aus Einladungen sind kostenlos, da gibt es
              nichts zu widerrufen. Wenn mit MonDex Plus selbst etwas nicht stimmt, schreib uns an{' '}
              <Mail subject="MonDex Plus" />, und wir helfen dir.
            </p>
          </>
        ),
      },
      {
        id: 'deleting',
        title: 'Aufhören und Konto löschen',
        body: (
          <>
            <p>Du kannst jederzeit aufhören, MonDex zu nutzen. In der App kannst du:</p>
            <ul>
              <li>
                vorher deine Sammlung als CSV oder JSON exportieren, wenn du sie behalten willst
              </li>
              <li>dein Konto deaktivieren; wenn du dich wieder anmeldest, ist es wieder da</li>
              <li>
                dein Konto endgültig löschen. Dabei werden deine Sammlung und deine Anmeldedaten
                entfernt, und das lässt sich nicht rückgängig machen.
              </li>
            </ul>
            <p>
              Das Löschen deines Kontos kündigt kein MonDex-Plus-Abo. Kündige es vorher im App Store
              oder bei Google Play; über eine Erstattung entscheiden Apple bzw. Google.
            </p>
            <p>
              Aus wichtigem Grund, etwa bei ernsthaftem oder wiederholtem Missbrauch (siehe{' '}
              <a className="info-link" href="#fair-use">
                Faire Nutzung
              </a>
              ), können wir ein Konto schließen.
            </p>
          </>
        ),
      },
      {
        id: 'trademarks',
        title: 'Pokémon und andere Marken',
        body: (
          <>
            <p>{trademark.de}</p>
            <p>
              Die Kartendaten stammen von <Out href="https://pokemontcg.io/">pokemontcg.io</Out>.
              Die Marktpreise beruhen auf Marktdaten von TCGplayer.
            </p>
          </>
        ),
      },
      {
        id: 'changes',
        title: 'Änderungen dieser Bedingungen',
        body: (
          <p>
            Wir können diese Bedingungen anpassen, wenn sich MonDex, die Rechtslage oder unsere
            Dienstleister ändern. Dann aktualisieren wir das Datum oben auf dieser Seite und sagen
            dir wichtige Änderungen in der App, bevor sie gelten. Wo das Gesetz deine Zustimmung zu
            einer Änderung verlangt, fragen wir dich. Bist du mit einer Änderung nicht
            einverstanden, kannst du aufhören, MonDex zu nutzen, Plus kündigen und dein Konto
            löschen.
          </p>
        ),
      },
      {
        id: 'law',
        title: 'Anwendbares Recht und Streitbeilegung',
        body: (
          <>
            <p>
              Es gilt das Recht der Republik Kosovo. Nutzt du MonDex als Verbraucherin oder
              Verbraucher, behältst du den Schutz der zwingenden Verbraucherschutzvorschriften des
              Landes, in dem du deinen gewöhnlichen Aufenthalt hast.
            </p>
            <p>
              Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </>
        ),
      },
    ],
  },
};

export default function TermsPage() {
  const { locale } = useLanguage();
  const c = copy[locale];
  return (
    <>
      <InfoIntro label={c.label} title={c.title}>
        <p className="info-meta">
          <span>
            {c.updated}: <strong>{formatDate(TERMS_LAST_UPDATED, locale)}</strong>
          </span>
        </p>
        <p>{c.intro}</p>
      </InfoIntro>
      <aside className="info-summary" aria-labelledby="terms-summary-title">
        <h2 id="terms-summary-title">{c.summaryTitle}</h2>
        <p>{c.summary}</p>
      </aside>
      <InfoSections sections={c.sections} toc={c.toc} />
    </>
  );
}
