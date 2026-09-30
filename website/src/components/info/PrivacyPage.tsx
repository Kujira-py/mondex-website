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
  PRIVACY_LAST_UPDATED,
  Rows,
  formatDate,
  operator,
  type InfoSection,
} from './shared';

const GITHUB_PRIVACY =
  'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement';
const APPLE_PRIVACY = 'https://www.apple.com/legal/privacy/';
const GOOGLE_PRIVACY = 'https://policies.google.com/privacy';
const REVENUECAT_PRIVACY = 'https://www.revenuecat.com/privacy';

type PrivacyCopy = {
  label: string;
  title: string;
  intro: ReactNode;
  updated: string;
  framework: ReactNode;
  summaryTitle: string;
  summary: string;
  toc: string;
  sections: InfoSection[];
};

const copy: Record<Locale, PrivacyCopy> = {
  en: {
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    intro: (
      <>
        What the MonDex website and app collect, why we need it, where it’s kept and how you stay in
        control. If anything here is unclear, email us at <Mail subject="Privacy" />.
      </>
    ),
    updated: 'Last updated',
    framework: <>This policy follows the EU General Data Protection Regulation (GDPR).</>,
    summaryTitle: 'The short version',
    summary:
      'The website’s demos work without an account or camera access. Your language choice is stored in a preference cookie. App accounts, collections, MonDex Plus and the launch waitlist are described separately below.',
    toc: 'On this page',
    sections: [
      {
        id: 'responsible',
        title: 'Who is responsible',
        body: (
          <>
            <p>
              MonDex is run by <Fill>{operator.name}</Fill>, <Fill>{operator.address}</Fill>. We’re
              responsible for the personal data described on this page.
            </p>
            <p>
              You can reach us about anything in this policy at <Mail subject="Privacy" />. Our full
              details are in the <Local to="/impressum">Legal Notice</Local>.
            </p>
          </>
        ),
      },
      {
        id: 'website',
        title: 'The website and the waitlist',
        body: (
          <>
            <h3>Hosting</h3>
            <p>
              mondextcg.com is a static website hosted on GitHub Pages. To deliver the website,
              GitHub processes technical request data such as your IP address, browser information
              and the requested URL. See the{' '}
              <Out href={GITHUB_PRIVACY}>GitHub General Privacy Statement</Out> for more
              information.
            </p>
            <h3>The launch waitlist</h3>
            <p>
              When you submit the waitlist form on this website, your browser sends the following
              directly to the MonDex server (see{' '}
              <a className="info-link" href="#providers">
                section 11
              </a>
              ):
            </p>
            <ul>
              <li>your email address</li>
              <li>your first name and your platform (iPhone or Android), if you give them</li>
              <li>
                where on the site you signed up, or the campaign name if you arrived through a
                campaign link
              </li>
              <li>your selected website language, so the launch email can be in your language</li>
            </ul>
            <p>
              Joining the waitlist doesn’t create a MonDex account. We use these details for one
              thing: telling you when MonDex launches. We keep them until six months after MonDex
              launches. You can remove yourself at any time by emailing{' '}
              <Mail subject="Remove me from the waitlist" />.
            </p>
            <h3>Keeping bots out</h3>
            <p>
              The form contains a hidden field that people don’t see but bots tend to fill in. To
              limit repeated requests, our server briefly holds your IP address in memory. This
              rate-limit entry is not written to the waitlist database. Infrastructure request logs
              are separate; see the retention section.
            </p>
            <h3>Language preference and website resources</h3>
            <p>
              When you choose English or German, this website saves the cookie “mondex-language” for
              up to one year. It contains only your language choice and is not used for tracking.
              You can remove it through your browser settings; English is the default. Fonts, card
              images and application scripts are served with the website. Our website code adds no
              advertising or analytics tools. The card and portfolio demos use sample data and do
              not access your camera or create an account.
            </p>
          </>
        ),
      },
      {
        id: 'account',
        title: 'Your MonDex account',
        body: (
          <>
            <p>You can create an account in one of two ways.</p>
            <h3>Email and password</h3>
            <p>
              We store your password only as a hash, never in readable form. To confirm your email
              address, we send you a 6-digit code that’s valid for 15 minutes.
            </p>
            <h3>Sign in with Apple or Google</h3>
            <p>
              We receive your account identifier from Apple or Google and your verified email
              address. We never see your Apple or Google password. If you use Apple’s “Hide My
              Email”, we only see the relay address Apple creates for you.
            </p>
            <h3>Your profile (optional)</h3>
            <p>
              If you like, you can add a display name, a short bio (up to 280 characters), a profile
              photo, your display currency and your default card condition.
            </p>
          </>
        ),
      },
      {
        id: 'collection',
        title: 'Your collection',
        body: (
          <>
            <p>
              Your collection is stored on our server, so it’s there on any device you sign in on.
              It includes the cards you own and the details you enter:
            </p>
            <ul>
              <li>quantity, condition and language</li>
              <li>grading company, grade and certificate number</li>
              <li>purchase price and date</li>
              <li>notes</li>
              <li>your physical binders and boxes, including which card sits in which slot</li>
            </ul>
            <p>
              Purchase prices are used for one thing only: showing your gains and losses. Your cards
              first, their price second.
            </p>
          </>
        ),
      },
      {
        id: 'scanning',
        title: 'Card scanning and photos',
        body: (
          <>
            <h3>Camera and photo library</h3>
            <p>
              The app uses your camera only while you scan. It uses your photo library only when you
              choose a picture yourself, such as a card image or your profile photo.
            </p>
            <h3>Recognising a card</h3>
            <p>
              For online recognition, the app sends the photo to our server to compare it with the
              card catalogue. Supported offline camera scans use a previously downloaded recognition
              pack on your device. Scan photos aren’t saved on our server. We don’t use your photos
              to identify you, and we don’t use them to train AI models.
            </p>
            <h3>Grade</h3>
            <p>
              The Grade feature estimates a card’s condition from photos of its front and back. That
              analysis happens entirely on your phone, and nothing is uploaded. It’s an estimate,
              not a professional grade.
            </p>
          </>
        ),
      },
      {
        id: 'plus',
        title: 'MonDex Plus and purchases',
        body: (
          <>
            <h3>Buying Plus</h3>
            <p>
              MonDex Plus is sold through the Apple App Store and Google Play. Apple or Google take
              the payment and handle billing as independent providers, under their own privacy
              policies (<Out href={APPLE_PRIVACY}>Apple</Out>,{' '}
              <Out href={GOOGLE_PRIVACY}>Google</Out>). We never see your payment details. From the
              store, we learn what you bought and its status: the product, the store, when it
              started, when it renews or ends, and whether it was cancelled or refunded.
            </p>
            <p>
              The conditions for Plus are in our{' '}
              <Local to="/nutzungsbedingungen">Terms of Use</Local>.
            </p>
            <h3>RevenueCat</h3>
            <p>
              To check purchases and keep your Plus status up to date, we use RevenueCat
              (RevenueCat, Inc., USA). The app signs in to RevenueCat with an anonymous app user ID:
              your MonDex account ID, not your name or email address. For that ID, RevenueCat
              receives the store’s purchase receipts and transaction data (the Apple receipt or the
              Google Play purchase token) and when you last used the app. With each request it also
              receives technical data: your device type, operating system and its version, app
              version, locale, currency, store country and IP address. RevenueCat tells our server
              when a subscription starts, renews, ends or is refunded. It processes this data on our
              behalf and not for advertising. Transfers to RevenueCat in the USA are based on the EU
              Standard Contractual Clauses. See{' '}
              <Out href={REVENUECAT_PRIVACY}>RevenueCat’s privacy policy</Out>.
            </p>
            <h3>Welcome Week</h3>
            <p>
              Your Welcome Week starts with your first recognised scan. We store with your account
              when it started and when it ends.
            </p>
            <h3>One per device: Apple DeviceCheck</h3>
            <p>
              So that each iPhone gets only one Welcome Week and one invitation reward, the app uses
              Apple’s DeviceCheck. Apple keeps two bits per device for us: “Welcome Week used” and
              “invitation reward received”. The app creates a short-lived token on your phone, and
              our server sends it to Apple to read or set these two bits. Apple doesn’t tell us
              which device it is. The bits contain no personal data and identify no one. They stay
              with the device, even if you reinstall MonDex or delete your account. On Android,
              there is currently no equivalent check per device.
            </p>
          </>
        ),
      },
      {
        id: 'invitations',
        title: 'Invitations',
        body: (
          <>
            <p>
              When you invite a friend, you share your personal invitation link from your phone, for
              example through the share sheet. MonDex doesn’t email your friends and doesn’t read
              your contacts.
            </p>
            <p>When someone joins through an invitation, we store:</p>
            <ul>
              <li>your personal invitation code</li>
              <li>who invited whom, and when</li>
              <li>
                the invitation’s status (waiting, qualified, rewarded) and the extra Plus days
                granted
              </li>
              <li>
                for the invited account, counters that show whether it has really been used, such as
                the number of recognised scans and the days on which the app was opened
              </li>
            </ul>
            <p>
              We use this only to grant rewards and to prevent misuse, such as inviting yourself
              with the same account, device or email address. For the device, we use the DeviceCheck
              bits described in{' '}
              <a className="info-link" href="#plus">
                section 6
              </a>
              . The person who invited you doesn’t see your collection.
            </p>
          </>
        ),
      },
      {
        id: 'push',
        title: 'Price alerts and push notifications',
        body: (
          <>
            <p>
              You can set a price alert on a card, and MonDex tells you when its price rises above
              or drops below your target. We store the alert with your account: the card and
              printing, the target and its currency.
            </p>
            <p>
              The app asks for permission to send notifications only when you start a price alert.
              If you allow it, your phone gets a device token from Apple Push Notification service
              (on iPhone) or Firebase Cloud Messaging (on Android, a Google service). We store this
              token with your account, together with the platform and the app’s language, so the
              notification reaches this phone in your language. When an alert is reached, our server
              sends the notification through Apple or Google, who deliver it to your phone. It
              contains the card and its price.
            </p>
            <p>
              We delete a token when you sign out on that phone, when Apple or Google tell us it’s
              no longer valid, and when you delete your account. You can turn notifications off at
              any time in your phone’s settings. Price alerts in the sample collection never send
              notifications and stay on your device.
            </p>
          </>
        ),
      },
      {
        id: 'on-device',
        title: 'Data that stays on your device',
        body: (
          <>
            <p>
              Some things live only on your phone. They aren’t sent to us, which also means they
              don’t sync between your devices:
            </p>
            <ul>
              <li>favourites</li>
              <li>lists: Wishlist, For Trade, To Grade and your own custom lists</li>
              <li>binder designs and layouts</li>
              <li>achievements and stars</li>
              <li>your Home layout</li>
              <li>the “hide values” setting</li>
              <li>activity history</li>
              <li>unsent scan drafts</li>
              <li>the data behind the home-screen widgets</li>
            </ul>
            <p>
              The sample collection (“preview mode”) needs no account and sends nothing to our
              server.
            </p>
          </>
        ),
      },
      {
        id: 'what-we-dont-do',
        title: 'What we don’t do',
        body: (
          <>
            <ul>
              <li>No advertising.</li>
              <li>No tracking across apps or websites.</li>
              <li>No analytics or advertising SDKs.</li>
              <li>No selling or renting of your personal data.</li>
            </ul>
            <p>
              RevenueCat (see{' '}
              <a className="info-link" href="#plus">
                section 6
              </a>
              ) only tells us whether you have MonDex Plus. It isn’t used for advertising or
              tracking.
            </p>
            <p>The app’s privacy declaration to Apple says the same: no tracking.</p>
          </>
        ),
      },
      {
        id: 'providers',
        title: 'Service providers and where data goes',
        body: (
          <>
            <p>
              A few service providers help us run MonDex. They handle data on our behalf, for the
              purpose listed:
            </p>
            <Rows
              items={[
                [
                  'Render',
                  <>App server and database, including the waitlist. Region: Oregon, USA.</>,
                ],
                [
                  'Titan Email',
                  'Sending sign-up codes, password-reset codes and collection exports, and receiving the emails you send us.',
                ],
                [
                  'Sentry',
                  'Error reports from our server, so we can find and fix problems. Names, email addresses, passwords, sign-in tokens and IP addresses are removed before a report is sent.',
                ],
                ['Apple and Google', 'Sign-in, only if you choose Sign in with Apple or Google.'],
                [
                  'Apple App Store and Google Play',
                  'Selling and billing MonDex Plus, under their own terms and privacy policies.',
                ],
                [
                  'RevenueCat',
                  <>
                    Subscription status for MonDex Plus (see{' '}
                    <a className="info-link" href="#plus">
                      section 6
                    </a>
                    ). RevenueCat, Inc., USA.
                  </>,
                ],
                [
                  'Apple Push Notification service and Firebase Cloud Messaging',
                  <>
                    Delivering price-alert notifications to iPhone and Android (see{' '}
                    <a className="info-link" href="#push">
                      section 8
                    </a>
                    ).
                  </>,
                ],
                [
                  'Apple DeviceCheck',
                  <>
                    Two bits per iPhone for the Welcome Week and invitation rewards (see{' '}
                    <a className="info-link" href="#plus">
                      section 6
                    </a>
                    ).
                  </>,
                ],
                [
                  'GitHub Pages',
                  <>
                    Hosting this website (see{' '}
                    <a className="info-link" href="#website">
                      section 2
                    </a>
                    ).
                  </>,
                ],
              ]}
            />
            <h3>Card data and prices</h3>
            <p>
              Our card catalogue and prices come from pokemontcg.io, pokemonpricetracker.com and
              exchangerate.host. Our server requests card data and exchange rates from them. None of
              your personal data is sent to them.
            </p>
            <h3>International transfers</h3>
            <p>
              Some of our service providers are based, or process data, outside the EU and
              Switzerland, mainly in the USA: Render (app server and database), RevenueCat, Titan
              (email), Sentry (error reports), Apple (App Store, push notifications, Sign in with
              Apple), Google (Google Sign-In, Android push notifications, Google Play Billing) and
              GitHub (website hosting).
            </p>
            <p>
              Where the recipient is certified under the EU-US Data Privacy Framework (and, for data
              from Switzerland, the Swiss-US Data Privacy Framework), transfers are based on that
              framework. Otherwise, they are covered by the EU Standard Contractual Clauses
              (Commission Decision 2021/914), with the adaptations required for Switzerland, which
              are part of each provider’s data processing agreement.
            </p>
          </>
        ),
      },
      {
        id: 'emails',
        title: 'Emails we send',
        body: (
          <>
            <p>We only email you when there’s a reason to:</p>
            <ul>
              <li>a code to confirm your email address when you sign up</li>
              <li>a code when you reset your password</li>
              <li>your collection export, when you ask for one</li>
            </ul>
            <p>
              There are no marketing emails. The one exception: if you joined the waitlist, you’ll
              get a single email when MonDex launches.
            </p>
          </>
        ),
      },
      {
        id: 'retention',
        title: 'How long we keep data',
        body: (
          <Rows
            items={[
              ['Account and collection', 'Until you delete them.'],
              ['Sign-up codes', 'Expire after 15 minutes.'],
              ['Password-reset codes', 'Expire after 30 minutes.'],
              [
                'MonDex Plus status',
                <>
                  As long as your account exists. Deleting your MonDex account doesn’t delete your
                  purchase history at RevenueCat, which stays stored under your anonymous app user
                  ID. Email us at <Mail subject="Data request" /> and we’ll have it deleted there
                  too.
                </>,
              ],
              [
                'Welcome Week and invitations',
                <>
                  As long as your account exists. When you delete your account, they are deleted
                  immediately.
                </>,
              ],
              ['DeviceCheck bits', 'Kept by Apple with the device, not with your account.'],
              ['Price alerts', 'Until you remove the alert or delete your account.'],
              [
                'Push tokens',
                'Until you sign out on that phone, Apple or Google report the token as invalid, or you delete your account.',
              ],
              [
                'Waitlist',
                <>
                  See{' '}
                  <a className="info-link" href="#website">
                    section 2
                  </a>
                  .
                </>,
              ],
              ['Server logs', '7 days.'],
            ]}
          />
        ),
      },
      {
        id: 'your-rights',
        title: 'Your rights and controls in the app',
        body: (
          <>
            <p>You can do most of this yourself, right in the app:</p>
            <ul>
              <li>Export your collection as CSV or JSON, or have a CSV emailed to you.</li>
              <li>Edit your profile at any time.</li>
              <li>Deactivate your account. This is reversible: signing in again restores it.</li>
              <li>
                Delete your account permanently. This removes your collection and your sign-in data.
                If you use Sign in with Apple, we also revoke MonDex’s access with Apple.
              </li>
              <li>
                Cancel MonDex Plus in your App Store or Google Play account settings. Deleting your
                MonDex account doesn’t cancel a store subscription.
              </li>
              <li>
                Turn notifications off in your phone’s settings, and remove price alerts in the app.
              </li>
            </ul>
            <p>
              You can also email us at <Mail subject="Data request" /> to access, correct, delete or
              port your data, or to object to how we use it. And you have the right to complain to a
              data protection authority, in particular the one in the EU country where you live or,
              if you live in Switzerland, the Federal Data Protection and Information Commissioner
              (FDPIC).
            </p>
          </>
        ),
      },
      {
        id: 'security',
        title: 'Security',
        body: (
          <>
            <p>
              All connections use HTTPS. Passwords are stored only as hashes, codes work only once,
              and your sign-in tokens are kept in your phone’s secure storage.
            </p>
          </>
        ),
      },
      {
        id: 'children',
        title: 'Children',
        body: (
          <>
            <p>
              You need to be at least 16 to create a MonDex account. If you’re younger, you need the
              consent of a parent or guardian. If you think a child under 16 has given us personal
              data without that consent, email us at <Mail subject="Privacy" /> and we’ll delete it.
            </p>
          </>
        ),
      },
      {
        id: 'changes',
        title: 'Changes to this policy',
        body: (
          <>
            <p>
              When we change this policy, we’ll update the date at the top of this page. If a change
              matters for how we handle your data, we’ll also tell you in the app.
            </p>
          </>
        ),
      },
    ],
  },
  de: {
    label: 'Datenschutz',
    title: 'Datenschutzerklärung',
    intro: (
      <>
        Was die MonDex-Website und -App erfassen, wofür wir es brauchen, wo es gespeichert wird und
        wie du die Kontrolle behältst. Wenn etwas unklar ist, schreib uns an{' '}
        <Mail subject="Datenschutz" />.
      </>
    ),
    updated: 'Zuletzt aktualisiert',
    framework: <>Diese Erklärung richtet sich nach der EU-Datenschutz-Grundverordnung (DSGVO).</>,
    summaryTitle: 'Kurz gesagt',
    summary:
      'Die Website-Demos funktionieren ohne Konto und ohne Kamerazugriff. Deine Sprachwahl wird in einem Einstellungs-Cookie gespeichert. App-Konten, Sammlungen, MonDex Plus und die Launch-Warteliste werden unten getrennt beschrieben.',
    toc: 'Auf dieser Seite',
    sections: [
      {
        id: 'responsible',
        title: 'Wer verantwortlich ist',
        body: (
          <>
            <p>
              MonDex wird betrieben von <Fill>{operator.name}</Fill>,{' '}
              <Fill>{operator.address}</Fill>. Wir sind für die auf dieser Seite beschriebenen
              personenbezogenen Daten verantwortlich.
            </p>
            <p>
              Bei allen Fragen zu dieser Erklärung erreichst du uns unter{' '}
              <Mail subject="Datenschutz" />. Alle Angaben zu uns findest du im{' '}
              <Local to="/impressum">Impressum</Local>.
            </p>
          </>
        ),
      },
      {
        id: 'website',
        title: 'Website und Warteliste',
        body: (
          <>
            <h3>Hosting</h3>
            <p>
              mondextcg.com ist eine statische Website bei GitHub Pages. Beim Ausliefern der Website
              verarbeitet GitHub technische Anfragedaten wie deine IP-Adresse, Browserinformationen
              und die aufgerufene URL. Weitere Informationen findest du in der{' '}
              <Out href={GITHUB_PRIVACY}>Datenschutzerklärung von GitHub</Out>.
            </p>
            <h3>Die Launch-Warteliste</h3>
            <p>
              Wenn du das Wartelistenformular auf dieser Website absendest, sendet dein Browser
              Folgendes direkt an den MonDex-Server (siehe{' '}
              <a className="info-link" href="#providers">
                Abschnitt 11
              </a>
              ):
            </p>
            <ul>
              <li>deine E-Mail-Adresse</li>
              <li>
                deinen Vornamen und deine Plattform (iPhone oder Android), falls du sie angibst
              </li>
              <li>
                an welcher Stelle der Website du dich eingetragen hast, oder den Kampagnennamen,
                wenn du über einen Kampagnenlink gekommen bist
              </li>
              <li>
                die ausgewählte Website-Sprache, damit die Launch-E-Mail in deiner Sprache kommt
              </li>
            </ul>
            <p>
              Mit dem Eintrag in die Warteliste wird kein MonDex-Konto angelegt. Wir nutzen diese
              Angaben für genau eine Sache: dir Bescheid zu geben, wenn MonDex startet. Wir bewahren
              sie bis sechs Monate nach dem Launch von MonDex auf. Du kannst dich jederzeit
              austragen lassen, indem du an <Mail subject="Bitte von der Warteliste entfernen" />{' '}
              schreibst.
            </p>
            <h3>Schutz vor Bots</h3>
            <p>
              Das Formular enthält ein verstecktes Feld, das Menschen nicht sehen, Bots aber gern
              ausfüllen. Um wiederholte Anfragen zu begrenzen, hält unser Server deine IP-Adresse
              kurz im Arbeitsspeicher. Dieser Eintrag zur Anfragebegrenzung wird nicht in die
              Wartelisten-Datenbank geschrieben. Technische Infrastruktur-Logs sind davon getrennt;
              siehe Speicherfristen.
            </p>
            <h3>Sprachwahl und Website-Ressourcen</h3>
            <p>
              Wenn du Englisch oder Deutsch auswählst, speichert diese Website das Cookie
              „mondex-language“ für bis zu ein Jahr. Es enthält nur deine Sprachwahl und dient nicht
              dem Tracking. Du kannst es über deine Browsereinstellungen löschen; Englisch ist die
              Standardsprache. Schriften, Kartenbilder und Anwendungsskripte werden mit der Website
              ausgeliefert. Unser Website-Code ergänzt keine Werbe- oder Analysewerkzeuge. Die
              Karten- und Portfolio-Demos verwenden Beispieldaten, nutzen deine Kamera nicht und
              erstellen kein Konto.
            </p>
          </>
        ),
      },
      {
        id: 'account',
        title: 'Dein MonDex-Konto',
        body: (
          <>
            <p>Du kannst ein Konto auf zwei Arten anlegen.</p>
            <h3>E-Mail und Passwort</h3>
            <p>
              Dein Passwort speichern wir nur als Hash, nie im Klartext. Um deine E-Mail-Adresse zu
              bestätigen, schicken wir dir einen 6-stelligen Code, der 15 Minuten gültig ist.
            </p>
            <h3>Mit Apple oder Google anmelden</h3>
            <p>
              Wir erhalten deine Konto-Kennung von Apple oder Google und deine bestätigte
              E-Mail-Adresse. Dein Apple- oder Google-Passwort sehen wir nie. Wenn du Apples
              „E-Mail-Adresse verbergen“ nutzt, sehen wir nur die Weiterleitungsadresse, die Apple
              für dich erstellt.
            </p>
            <h3>Dein Profil (optional)</h3>
            <p>
              Wenn du möchtest, kannst du einen Anzeigenamen, eine kurze Bio (bis zu 280 Zeichen),
              ein Profilfoto, deine Anzeigewährung und deinen Standard-Kartenzustand hinterlegen.
            </p>
          </>
        ),
      },
      {
        id: 'collection',
        title: 'Deine Sammlung',
        body: (
          <>
            <p>
              Deine Sammlung wird auf unserem Server gespeichert, damit sie auf jedem Gerät da ist,
              auf dem du dich anmeldest. Dazu gehören die Karten, die du besitzt, und die Angaben,
              die du einträgst:
            </p>
            <ul>
              <li>Anzahl, Zustand und Sprache</li>
              <li>Grading-Firma, Grade und Zertifikatsnummer</li>
              <li>Kaufpreis und Kaufdatum</li>
              <li>Notizen</li>
              <li>deine echten Binder und Boxen, samt dem Fach, in dem jede Karte steckt</li>
            </ul>
            <p>
              Kaufpreise nutzen wir nur für eines: um dir deine Gewinne und Verluste zu zeigen.
              Karten zuerst. Preise danach.
            </p>
          </>
        ),
      },
      {
        id: 'scanning',
        title: 'Karten scannen und Fotos',
        body: (
          <>
            <h3>Kamera und Fotomediathek</h3>
            <p>
              Die App nutzt deine Kamera nur, während du scannst. Auf deine Fotomediathek greift sie
              nur zu, wenn du selbst ein Bild auswählst, etwa ein Kartenbild oder dein Profilfoto.
            </p>
            <h3>Eine Karte erkennen</h3>
            <p>
              Für die Online-Erkennung sendet die App das Foto an unseren Server zum Vergleich mit
              dem Kartenkatalog. Unterstützte Offline-Kamera-Scans nutzen ein zuvor geladenes
              Erkennungspaket auf deinem Gerät. Scan-Fotos werden nicht auf unserem Server
              gespeichert. Wir nutzen deine Fotos nicht, um dich zu identifizieren, und nicht, um
              KI-Modelle zu trainieren.
            </p>
            <h3>Grade</h3>
            <p>
              Die Grade-Funktion schätzt den Zustand einer Karte anhand von Fotos der Vorder- und
              Rückseite. Diese Analyse läuft vollständig auf deinem Handy, es wird nichts
              hochgeladen. Das Ergebnis ist eine Schätzung, keine professionelle Bewertung.
            </p>
          </>
        ),
      },
      {
        id: 'plus',
        title: 'MonDex Plus und Käufe',
        body: (
          <>
            <h3>Plus kaufen</h3>
            <p>
              MonDex Plus wird über den Apple App Store und Google Play verkauft. Apple bzw. Google
              wickeln Zahlung und Abrechnung als eigenständige Anbieter nach ihren eigenen
              Datenschutzerklärungen ab (<Out href={APPLE_PRIVACY}>Apple</Out>,{' '}
              <Out href={GOOGLE_PRIVACY}>Google</Out>). Deine Zahlungsdaten sehen wir nie. Vom Store
              erfahren wir, was du gekauft hast und wie es darum steht: das Produkt, den Store, wann
              es begonnen hat, wann es sich verlängert oder endet und ob es gekündigt oder erstattet
              wurde.
            </p>
            <p>
              Die Bedingungen für Plus stehen in unseren{' '}
              <Local to="/nutzungsbedingungen">Nutzungsbedingungen</Local>.
            </p>
            <h3>RevenueCat</h3>
            <p>
              Um Käufe zu prüfen und deinen Plus-Status aktuell zu halten, nutzen wir RevenueCat
              (RevenueCat, Inc., USA). Die App meldet sich bei RevenueCat mit einer anonymen
              App-Nutzer-ID an: der ID deines MonDex-Kontos, nicht deinem Namen oder deiner
              E-Mail-Adresse. Zu dieser ID erhält RevenueCat die Kaufbelege und Transaktionsdaten
              des Stores (den Apple-Kaufbeleg bzw. das Kauf-Token von Google Play) und den
              Zeitpunkt, zu dem du die App zuletzt genutzt hast. Mit jeder Anfrage erhält RevenueCat
              außerdem technische Daten: Gerätetyp, Betriebssystem und dessen Version, App-Version,
              Spracheinstellung, Währung, Store-Land und IP-Adresse. RevenueCat teilt unserem Server
              mit, wenn ein Abo beginnt, sich verlängert, endet oder erstattet wird. RevenueCat
              verarbeitet diese Daten in unserem Auftrag und nicht für Werbung. Die Übermittlung an
              RevenueCat in die USA stützt sich auf die EU-Standardvertragsklauseln. Mehr dazu in
              der <Out href={REVENUECAT_PRIVACY}>Datenschutzerklärung von RevenueCat</Out>.
            </p>
            <h3>Welcome Week</h3>
            <p>
              Deine Welcome Week beginnt mit deinem ersten erkannten Scan. Wir speichern bei deinem
              Konto, wann sie begonnen hat und wann sie endet.
            </p>
            <h3>Eine pro Gerät: Apple DeviceCheck</h3>
            <p>
              Damit jedes iPhone nur eine Welcome Week und eine Einladungsprämie erhält, nutzt die
              App Apples DeviceCheck. Apple speichert für uns zwei Bits pro Gerät: „Welcome Week
              genutzt“ und „Einladungsprämie erhalten“. Die App erzeugt auf deinem Handy ein
              kurzlebiges Token, und unser Server schickt es an Apple, um diese zwei Bits zu lesen
              oder zu setzen. Apple teilt uns nicht mit, um welches Gerät es sich handelt. Die Bits
              enthalten keine personenbezogenen Daten und identifizieren niemanden. Sie bleiben beim
              Gerät, auch wenn du MonDex neu installierst oder dein Konto löschst. Auf Android gibt
              es derzeit keine entsprechende Prüfung pro Gerät.
            </p>
          </>
        ),
      },
      {
        id: 'invitations',
        title: 'Einladungen',
        body: (
          <>
            <p>
              Wenn du jemanden einlädst, teilst du deinen persönlichen Einladungslink von deinem
              Handy aus, zum Beispiel über das Teilen-Menü. MonDex schreibt deinen Freunden keine
              E-Mails und liest deine Kontakte nicht.
            </p>
            <p>Wenn sich jemand über eine Einladung anmeldet, speichern wir:</p>
            <ul>
              <li>deinen persönlichen Einladungscode</li>
              <li>wer wen eingeladen hat, und wann</li>
              <li>
                den Stand der Einladung (offen, erfüllt, belohnt) und die gutgeschriebenen Plus-Tage
              </li>
              <li>
                für das eingeladene Konto Zähler, die zeigen, ob es wirklich genutzt wird, etwa die
                Zahl der erkannten Scans und die Tage, an denen die App geöffnet wurde
              </li>
            </ul>
            <p>
              Wir nutzen diese Angaben nur, um Prämien gutzuschreiben und Missbrauch zu verhindern,
              etwa Selbsteinladungen mit demselben Konto, Gerät oder derselben E-Mail-Adresse. Für
              das Gerät nutzen wir die DeviceCheck-Bits aus{' '}
              <a className="info-link" href="#plus">
                Abschnitt 6
              </a>
              . Wer dich eingeladen hat, sieht deine Sammlung nicht.
            </p>
          </>
        ),
      },
      {
        id: 'push',
        title: 'Preisalarme und Push-Mitteilungen',
        body: (
          <>
            <p>
              Du kannst für eine Karte einen Preisalarm setzen, und MonDex sagt dir Bescheid, wenn
              ihr Preis über dein Ziel steigt oder darunter fällt. Den Alarm speichern wir bei
              deinem Konto: Karte und Druckvariante, Zielpreis und dessen Währung.
            </p>
            <p>
              Die App fragt erst nach der Erlaubnis für Mitteilungen, wenn du einen Preisalarm
              startest. Wenn du zustimmst, erhält dein Handy ein Geräte-Token vom Apple Push
              Notification Service (auf dem iPhone) oder von Firebase Cloud Messaging (auf Android,
              ein Dienst von Google). Wir speichern dieses Token bei deinem Konto, zusammen mit der
              Plattform und der Sprache der App, damit die Mitteilung dieses Handy in deiner Sprache
              erreicht. Wird ein Alarm ausgelöst, schickt unser Server die Mitteilung über Apple
              bzw. Google, die sie an dein Handy zustellen. Sie enthält die Karte und ihren Preis.
            </p>
            <p>
              Wir löschen ein Token, wenn du dich auf diesem Handy abmeldest, wenn Apple bzw. Google
              uns mitteilen, dass es nicht mehr gültig ist, und wenn du dein Konto löschst. Du
              kannst Mitteilungen jederzeit in den Einstellungen deines Handys ausschalten.
              Preisalarme in der Beispielsammlung senden nie Mitteilungen und bleiben auf deinem
              Gerät.
            </p>
          </>
        ),
      },
      {
        id: 'on-device',
        title: 'Daten, die auf deinem Gerät bleiben',
        body: (
          <>
            <p>
              Manches liegt nur auf deinem Handy. Es wird nicht an uns gesendet, und deshalb wird es
              auch nicht zwischen deinen Geräten synchronisiert:
            </p>
            <ul>
              <li>Favoriten</li>
              <li>Listen: Wunschliste, Zum Tauschen, Zum Graden und deine eigenen Listen</li>
              <li>Binder-Designs und -Layouts</li>
              <li>Erfolge und Sterne</li>
              <li>dein Home-Layout</li>
              <li>die Einstellung „Werte ausblenden“</li>
              <li>der Aktivitätsverlauf</li>
              <li>nicht gesendete Scan-Entwürfe</li>
              <li>die Daten hinter den Widgets auf dem Home-Bildschirm</li>
            </ul>
            <p>
              Die Beispielsammlung („Vorschaumodus“) braucht kein Konto und sendet nichts an unseren
              Server.
            </p>
          </>
        ),
      },
      {
        id: 'what-we-dont-do',
        title: 'Was wir nicht tun',
        body: (
          <>
            <ul>
              <li>Keine Werbung.</li>
              <li>Kein Tracking über Apps oder Websites hinweg.</li>
              <li>Keine Analyse- oder Werbe-SDKs.</li>
              <li>Kein Verkauf und keine Vermietung deiner personenbezogenen Daten.</li>
            </ul>
            <p>
              RevenueCat (siehe{' '}
              <a className="info-link" href="#plus">
                Abschnitt 6
              </a>
              ) sagt uns nur, ob du MonDex Plus hast. Es wird nicht für Werbung oder Tracking
              genutzt.
            </p>
            <p>Die Datenschutzangaben der App gegenüber Apple sagen dasselbe: kein Tracking.</p>
          </>
        ),
      },
      {
        id: 'providers',
        title: 'Dienstleister und wo deine Daten liegen',
        body: (
          <>
            <p>
              Einige Dienstleister helfen uns, MonDex zu betreiben. Sie verarbeiten Daten in unserem
              Auftrag und für den jeweils genannten Zweck:
            </p>
            <Rows
              items={[
                [
                  'Render',
                  <>
                    App-Server und Datenbank, einschließlich der Warteliste. Region: Oregon, USA.
                  </>,
                ],
                [
                  'Titan Email',
                  'Versand von Registrierungscodes, Codes zum Zurücksetzen des Passworts und Sammlungsexporten sowie Empfang der E-Mails, die du uns schickst.',
                ],
                [
                  'Sentry',
                  'Fehlerberichte unseres Servers, damit wir Probleme finden und beheben können. Namen, E-Mail-Adressen, Passwörter, Anmelde-Tokens und IP-Adressen werden entfernt, bevor ein Bericht gesendet wird.',
                ],
                [
                  'Apple und Google',
                  'Anmeldung, nur wenn du „Mit Apple anmelden“ oder „Mit Google anmelden“ wählst.',
                ],
                [
                  'Apple App Store und Google Play',
                  'Verkauf und Abrechnung von MonDex Plus, nach ihren eigenen Bedingungen und Datenschutzerklärungen.',
                ],
                [
                  'RevenueCat',
                  <>
                    Abo-Status für MonDex Plus (siehe{' '}
                    <a className="info-link" href="#plus">
                      Abschnitt 6
                    </a>
                    ). RevenueCat, Inc., USA.
                  </>,
                ],
                [
                  'Apple Push Notification Service und Firebase Cloud Messaging',
                  <>
                    Zustellung von Preisalarm-Mitteilungen auf iPhone und Android (siehe{' '}
                    <a className="info-link" href="#push">
                      Abschnitt 8
                    </a>
                    ).
                  </>,
                ],
                [
                  'Apple DeviceCheck',
                  <>
                    Zwei Bits pro iPhone für die Welcome Week und Einladungsprämien (siehe{' '}
                    <a className="info-link" href="#plus">
                      Abschnitt 6
                    </a>
                    ).
                  </>,
                ],
                [
                  'GitHub Pages',
                  <>
                    Hosting dieser Website (siehe{' '}
                    <a className="info-link" href="#website">
                      Abschnitt 2
                    </a>
                    ).
                  </>,
                ],
              ]}
            />
            <h3>Kartendaten und Preise</h3>
            <p>
              Unser Kartenkatalog und die Preise stammen von pokemontcg.io, pokemonpricetracker.com
              und exchangerate.host. Unser Server ruft dort Kartendaten und Wechselkurse ab. Deine
              personenbezogenen Daten werden dabei nicht übermittelt.
            </p>
            <h3>Übermittlung ins Ausland</h3>
            <p>
              Einige unserer Dienstleister sitzen außerhalb der EU und der Schweiz oder verarbeiten
              Daten dort, vor allem in den USA: Render (App-Server und Datenbank), RevenueCat, Titan
              (E-Mail), Sentry (Fehlerberichte), Apple (App Store, Mitteilungen, „Mit Apple
              anmelden“), Google (Google-Anmeldung, Mitteilungen auf Android, Google Play Billing)
              und GitHub (Hosting der Website).
            </p>
            <p>
              Ist der Empfänger unter dem EU-US Data Privacy Framework (und für Daten aus der
              Schweiz unter dem Swiss-US Data Privacy Framework) zertifiziert, stützt sich die
              Übermittlung darauf. Andernfalls erfolgt sie auf Grundlage der
              EU-Standardvertragsklauseln (Durchführungsbeschluss 2021/914 der Kommission) mit den
              für die Schweiz nötigen Anpassungen, die Teil der Auftragsverarbeitungsvereinbarung
              des jeweiligen Anbieters sind.
            </p>
          </>
        ),
      },
      {
        id: 'emails',
        title: 'E-Mails, die wir senden',
        body: (
          <>
            <p>Wir schreiben dir nur, wenn es einen Grund gibt:</p>
            <ul>
              <li>ein Code zur Bestätigung deiner E-Mail-Adresse, wenn du dich registrierst</li>
              <li>ein Code, wenn du dein Passwort zurücksetzt</li>
              <li>dein Sammlungsexport, wenn du ihn anforderst</li>
            </ul>
            <p>
              Es gibt keine Marketing-E-Mails. Die einzige Ausnahme: Wenn du dich in die Warteliste
              eingetragen hast, bekommst du eine einzige E-Mail, wenn MonDex startet.
            </p>
          </>
        ),
      },
      {
        id: 'retention',
        title: 'Wie lange wir Daten aufbewahren',
        body: (
          <Rows
            items={[
              ['Konto und Sammlung', 'Bis du sie löschst.'],
              ['Registrierungscodes', 'Laufen nach 15 Minuten ab.'],
              ['Codes zum Zurücksetzen des Passworts', 'Laufen nach 30 Minuten ab.'],
              [
                'MonDex-Plus-Status',
                <>
                  Solange dein Konto besteht. Das Löschen deines MonDex-Kontos löscht deine
                  Kaufhistorie bei RevenueCat nicht; sie bleibt unter deiner anonymen App-Nutzer-ID
                  gespeichert. Schreib uns an <Mail subject="Datenanfrage" />, dann lassen wir sie
                  auch dort löschen.
                </>,
              ],
              [
                'Welcome Week und Einladungen',
                <>Solange dein Konto besteht. Löschst du dein Konto, werden sie sofort gelöscht.</>,
              ],
              ['DeviceCheck-Bits', 'Bei Apple zum Gerät gespeichert, nicht bei deinem Konto.'],
              ['Preisalarme', 'Bis du den Alarm entfernst oder dein Konto löschst.'],
              [
                'Push-Tokens',
                'Bis du dich auf diesem Handy abmeldest, Apple bzw. Google das Token als ungültig melden oder du dein Konto löschst.',
              ],
              [
                'Warteliste',
                <>
                  Siehe{' '}
                  <a className="info-link" href="#website">
                    Abschnitt 2
                  </a>
                  .
                </>,
              ],
              ['Server-Logs', '7 Tage.'],
            ]}
          />
        ),
      },
      {
        id: 'your-rights',
        title: 'Deine Rechte und Einstellungen in der App',
        body: (
          <>
            <p>Das meiste kannst du direkt in der App selbst erledigen:</p>
            <ul>
              <li>
                Deine Sammlung als CSV oder JSON exportieren oder dir eine CSV-Datei per E-Mail
                schicken lassen.
              </li>
              <li>Dein Profil jederzeit bearbeiten.</li>
              <li>
                Dein Konto deaktivieren. Das lässt sich rückgängig machen: Wenn du dich wieder
                anmeldest, ist es wieder da.
              </li>
              <li>
                Dein Konto endgültig löschen. Dabei werden deine Sammlung und deine Anmeldedaten
                entfernt. Wenn du „Mit Apple anmelden“ nutzt, widerrufen wir außerdem den Zugriff
                von MonDex bei Apple.
              </li>
              <li>
                MonDex Plus in den Einstellungen deines App-Store- oder Google-Play-Kontos kündigen.
                Das Löschen deines MonDex-Kontos kündigt kein Store-Abo.
              </li>
              <li>
                Mitteilungen in den Einstellungen deines Handys ausschalten und Preisalarme in der
                App entfernen.
              </li>
            </ul>
            <p>
              Du kannst uns auch an <Mail subject="Datenanfrage" /> schreiben, um deine Daten
              einzusehen, zu berichtigen, zu löschen oder mitzunehmen oder um der Nutzung zu
              widersprechen. Außerdem hast du das Recht, dich bei einer Datenschutzbehörde zu
              beschweren, insbesondere in dem EU-Land, in dem du lebst, oder, wenn du in der Schweiz
              lebst, beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB).
            </p>
          </>
        ),
      },
      {
        id: 'security',
        title: 'Sicherheit',
        body: (
          <>
            <p>
              Alle Verbindungen laufen über HTTPS. Passwörter werden nur als Hash gespeichert, Codes
              funktionieren nur einmal, und deine Anmelde-Tokens liegen im sicheren Speicher deines
              Handys.
            </p>
          </>
        ),
      },
      {
        id: 'children',
        title: 'Kinder',
        body: (
          <>
            <p>
              Für ein MonDex-Konto musst du mindestens 16 Jahre alt sein. Bist du jünger, brauchst
              du die Zustimmung deiner Eltern oder Erziehungsberechtigten. Wenn du glaubst, dass uns
              ein Kind unter 16 Jahren ohne diese Zustimmung personenbezogene Daten gegeben hat,
              schreib uns an <Mail subject="Datenschutz" />, dann löschen wir sie.
            </p>
          </>
        ),
      },
      {
        id: 'changes',
        title: 'Änderungen dieser Erklärung',
        body: (
          <>
            <p>
              Wenn wir diese Erklärung ändern, aktualisieren wir das Datum oben auf dieser Seite.
              Wenn eine Änderung für den Umgang mit deinen Daten wichtig ist, sagen wir dir
              zusätzlich in der App Bescheid.
            </p>
          </>
        ),
      },
    ],
  },
};

export default function PrivacyPage() {
  const { locale } = useLanguage();
  const c = copy[locale];
  const contactSection: InfoSection =
    locale === 'en'
      ? {
          id: 'contact',
          title: 'Contacting us',
          body: (
            <>
              <p>
                Contact links open your own email app. This website does not send a message until
                you choose to send it. When you email MonDex, your email address and the contents of
                your message are used to handle your enquiry. Only include the information needed to
                explain the issue; never send your password.
              </p>
              <p>
                Emails you send us are received and stored by our email provider, Titan. We don’t
                delete them after a fixed period. If you’d like us to delete your emails, just ask.
              </p>
            </>
          ),
        }
      : {
          id: 'contact',
          title: 'Kontaktaufnahme',
          body: (
            <>
              <p>
                Kontaktlinks öffnen dein eigenes E-Mail-Programm. Die Website verschickt keine
                Nachricht. Erst wenn du sie selbst absendest, erhält MonDex deine E-Mail-Adresse und
                den Inhalt zur Bearbeitung deiner Anfrage. Sende nur Angaben, die zum Verständnis
                des Anliegens nötig sind, und niemals dein Passwort.
              </p>
              <p>
                E-Mails, die du uns schickst, werden bei unserem E-Mail-Anbieter Titan empfangen und
                gespeichert. Wir löschen sie nicht nach einer festen Frist. Wenn wir deine E-Mails
                löschen sollen, sag uns einfach Bescheid.
              </p>
            </>
          ),
        };
  return (
    <>
      <InfoIntro label={c.label} title={c.title}>
        <p className="info-meta">
          <span>
            {c.updated}: <strong>{formatDate(PRIVACY_LAST_UPDATED, locale)}</strong>
          </span>
          <span>{c.framework}</span>
        </p>
        <p>{c.intro}</p>
      </InfoIntro>
      <aside className="info-summary" aria-labelledby="privacy-summary-title">
        <h2 id="privacy-summary-title">{c.summaryTitle}</h2>
        <p>{c.summary}</p>
      </aside>
      <InfoSections sections={[...c.sections, contactSection]} toc={c.toc} />
    </>
  );
}
