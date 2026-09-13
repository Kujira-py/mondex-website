"use client";
import type { ReactNode } from "react";
import { useLocale, type Locale } from "../locale";
import { Fill, InfoIntro, InfoSections, Local, Mail, Out, PRIVACY_LAST_UPDATED, Rows, formatDate, operator, type InfoSection } from "./shared";

const GITHUB_PRIVACY = "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement";

type PrivacyCopy = {
  label: string; title: string; intro: ReactNode;
  updated: string; framework: ReactNode;
  summaryTitle: string; summary: string;
  toc: string; sections: InfoSection[];
};

const copy: Record<Locale, PrivacyCopy> = {
  en: {
    label: "Privacy Policy",
    title: "Privacy Policy",
    intro: <>What the MonDex website and app collect, why we need it, where it’s kept and how you stay in control. If anything here is unclear, email us at <Mail subject="Privacy" />.</>,
    updated: "Last updated",
    framework: <>This policy is written for <Fill>[Swiss FADP / EU GDPR, confirm which applies]</Fill>.</>,
    summaryTitle: "The short version",
    summary: "No ads. No tracking. No selling your data. We collect what’s needed to run your account and recognise your cards, and a lot of the app’s data never leaves your phone.",
    toc: "On this page",
    sections: [
      { id: "responsible", title: "Who is responsible", body: <>
        <p>MonDex is run by <Fill>{operator.name}</Fill>, <Fill>{operator.address}</Fill>. We’re responsible for the personal data described on this page.</p>
        <p>You can reach us about anything in this policy at <Mail subject="Privacy" />. Our full details are in the <Local to="/impressum">Legal Notice</Local>.</p>
      </> },
      { id: "website", title: "The website and the waitlist", body: <>
        <h3>Hosting</h3>
        <p>mondextcg.com is a static website hosted on GitHub Pages. To deliver the pages to you, GitHub processes technical request data such as your IP address. How GitHub handles it is described in the <Out href={GITHUB_PRIVACY}>GitHub General Privacy Statement</Out>.</p>
        <h3>The launch waitlist</h3>
        <p>If you join the waitlist, your browser sends the following directly to the MonDex server (see <a className="info-link" href="#providers">section 8</a>):</p>
        <ul>
          <li>your email address</li>
          <li>your first name and your platform (iPhone or Android), if you give them</li>
          <li>where on the site you signed up, or the campaign name if you arrived through a campaign link</li>
          <li>your browser language, so the launch email can be in your language</li>
        </ul>
        <p>Joining the waitlist doesn’t create a MonDex account. We use these details for one thing: telling you when MonDex launches. We keep them <Fill>[until launch + N months / until you ask us to remove it]</Fill>. You can remove yourself at any time by emailing <Mail subject="Remove me from the waitlist" />.</p>
        <h3>Keeping bots out</h3>
        <p>The form contains a hidden field that people don’t see but bots tend to fill in. To limit repeated requests, our server briefly holds your IP address in memory. It is not stored.</p>
        <h3>No analytics, no cookies, no third-party resources</h3>
        <p>The website sets no cookies and uses no analytics. It doesn’t load fonts, scripts or images from other companies: everything comes from mondextcg.com, and text is shown in fonts already on your device. Apart from loading the pages from GitHub, the only data sent anywhere is the waitlist form, and only when you submit it.</p>
      </> },
      { id: "account", title: "Your MonDex account", body: <>
        <p>You can create an account in one of two ways.</p>
        <h3>Email and password</h3>
        <p>We store your password only as a hash, never in readable form. To confirm your email address, we send you a 6-digit code that’s valid for 15 minutes.</p>
        <h3>Sign in with Apple or Google</h3>
        <p>We receive your account identifier from Apple or Google and your verified email address. We never see your Apple or Google password. If you use Apple’s “Hide My Email”, we only see the relay address Apple creates for you.</p>
        <h3>Your profile (optional)</h3>
        <p>If you like, you can add a display name, a short bio (up to 280 characters), a profile photo, your display currency and your default card condition.</p>
      </> },
      { id: "collection", title: "Your collection", body: <>
        <p>Your collection is stored on our server, so it’s there on any device you sign in on. It includes the cards you own and the details you enter:</p>
        <ul>
          <li>quantity, condition and language</li>
          <li>grading company, grade and certificate number</li>
          <li>purchase price and date</li>
          <li>notes</li>
          <li>your physical binders and boxes, including which card sits in which slot</li>
        </ul>
        <p>Purchase prices are used for one thing only: showing your gains and losses. Your cards first, their price second.</p>
      </> },
      { id: "scanning", title: "Card scanning and photos", body: <>
        <h3>Camera and photo library</h3>
        <p>The app uses your camera only while you scan. It uses your photo library only when you choose a picture yourself, such as a card image or your profile photo.</p>
        <h3>Recognising a card</h3>
        <p>To identify a card, the app sends the photo to our server, where it’s compared with our card catalogue. We don’t use your photos to identify you, and we don’t use them to train AI models.</p>
        <h3>Saved scan photos</h3>
        <p><Fill>[If image storage is turned on in production:]</Fill> When you save a scanned card, its scan photo may be kept with that card. Photos you discard are deleted. Deleting a card deletes its photo, and deleting your account deletes all of your scan photos.</p>
        <h3>Grade</h3>
        <p>The Grade feature estimates a card’s condition from photos of its front and back. That analysis happens entirely on your phone, and nothing is uploaded. It’s an estimate, not a professional grade.</p>
      </> },
      { id: "on-device", title: "Data that stays on your device", body: <>
        <p>Some things live only on your phone. They aren’t sent to us, which also means they don’t sync between your devices:</p>
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
        <p>The sample collection (“preview mode”) needs no account and sends nothing to our server.</p>
      </> },
      { id: "what-we-dont-do", title: "What we don’t do", body: <>
        <ul>
          <li>No advertising.</li>
          <li>No tracking across apps or websites.</li>
          <li>No analytics or advertising SDKs.</li>
          <li>No selling or renting of your personal data.</li>
        </ul>
        <p>The app’s privacy declaration to Apple says the same: no tracking.</p>
      </> },
      { id: "providers", title: "Service providers and where data goes", body: <>
        <p>A few service providers help us run MonDex. They handle data on our behalf, for the purpose listed:</p>
        <Rows items={[
          ["Render", <>App server and database, including the waitlist. Region: <Fill>[Region: e.g. Frankfurt, EU / Oregon, US]</Fill></>],
          [<Fill key="storage">[S3-compatible storage provider + region]</Fill>, "Scan photos, if photo storage is turned on."],
          [<>Titan Email <Fill>[Confirm provider]</Fill></>, "Sending sign-up codes, password-reset codes and collection exports."],
          ["Apple and Google", "Sign-in, only if you choose Sign in with Apple or Google."],
          ["GitHub", <>Hosting this website (see <a className="info-link" href="#website">section 2</a>).</>],
        ]} />
        <h3>Card data and prices</h3>
        <p>Our card catalogue and prices come from pokemontcg.io, pokemonpricetracker.com and exchangerate.host. Our server requests card data and exchange rates from them. None of your personal data is sent to them.</p>
        <h3>International transfers</h3>
        <p><Fill>[describe safeguards, e.g. Standard Contractual Clauses, if any provider is outside Switzerland/EU]</Fill></p>
      </> },
      { id: "emails", title: "Emails we send", body: <>
        <p>We only email you when there’s a reason to:</p>
        <ul>
          <li>a code to confirm your email address when you sign up</li>
          <li>a code when you reset your password</li>
          <li>your collection export, when you ask for one</li>
        </ul>
        <p>There are no marketing emails. The one exception: if you joined the waitlist, you’ll get a single email when MonDex launches.</p>
      </> },
      { id: "retention", title: "How long we keep data", body: <Rows items={[
        ["Account and collection", "Until you delete them."],
        ["Sign-up codes", "Expire after 15 minutes."],
        ["Password-reset codes", "Expire after 30 minutes."],
        ["Waitlist", <>See <a className="info-link" href="#website">section 2</a>.</>],
        ["Server logs", <Fill key="logs">[N days]</Fill>],
      ]} /> },
      { id: "your-rights", title: "Your rights and controls in the app", body: <>
        <p>You can do most of this yourself, right in the app:</p>
        <ul>
          <li>Export your collection as CSV or JSON, or have a CSV emailed to you.</li>
          <li>Edit your profile at any time.</li>
          <li>Deactivate your account. This is reversible: signing in again restores it.</li>
          <li>Delete your account permanently. This removes your collection, your scan photos and your sign-in data. If you use Sign in with Apple, we also revoke MonDex’s access with Apple.</li>
        </ul>
        <p>You can also email us at <Mail subject="Data request" /> to access, correct, delete or port your data, or to object to how we use it. And you have the right to complain to <Fill>[FDPIC (Switzerland) / your local EU data protection authority]</Fill>.</p>
      </> },
      { id: "security", title: "Security", body: <>
        <p>All connections use HTTPS. Passwords are stored only as hashes, codes work only once, and your sign-in tokens are kept in your phone’s secure storage.</p>
      </> },
      { id: "children", title: "Children", body: <>
        <p><Fill>[Minimum age, e.g. 16, or younger with parental consent. Decide this: Pokémon has many young fans.]</Fill></p>
      </> },
      { id: "changes", title: "Changes to this policy", body: <>
        <p>When we change this policy, we’ll update the date at the top of this page. If a change matters for how we handle your data, we’ll also tell you in the app.</p>
      </> },
    ],
  },
  de: {
    label: "Datenschutz",
    title: "Datenschutzerklärung",
    intro: <>Was die MonDex-Website und -App erfassen, wofür wir es brauchen, wo es gespeichert wird und wie du die Kontrolle behältst. Wenn etwas unklar ist, schreib uns an <Mail subject="Datenschutz" />.</>,
    updated: "Zuletzt aktualisiert",
    framework: <>Diese Erklärung richtet sich nach <Fill>[Schweizer DSG / EU-DSGVO, bitte bestätigen]</Fill>.</>,
    summaryTitle: "Kurz gesagt",
    summary: "Keine Werbung. Kein Tracking. Kein Verkauf deiner Daten. Wir erfassen, was nötig ist, um dein Konto zu betreiben und deine Karten zu erkennen, und viele Daten der App verlassen dein Handy nie.",
    toc: "Auf dieser Seite",
    sections: [
      { id: "responsible", title: "Wer verantwortlich ist", body: <>
        <p>MonDex wird betrieben von <Fill>{operator.name}</Fill>, <Fill>{operator.address}</Fill>. Wir sind für die auf dieser Seite beschriebenen personenbezogenen Daten verantwortlich.</p>
        <p>Bei allen Fragen zu dieser Erklärung erreichst du uns unter <Mail subject="Datenschutz" />. Alle Angaben zu uns findest du im <Local to="/impressum">Impressum</Local>.</p>
      </> },
      { id: "website", title: "Website und Warteliste", body: <>
        <h3>Hosting</h3>
        <p>mondextcg.com ist eine statische Website, die bei GitHub Pages gehostet wird. Um dir die Seiten auszuliefern, verarbeitet GitHub technische Anfragedaten wie deine IP-Adresse. Wie GitHub damit umgeht, steht im <Out href={GITHUB_PRIVACY}>GitHub General Privacy Statement</Out> (auf Englisch).</p>
        <h3>Die Launch-Warteliste</h3>
        <p>Wenn du dich in die Warteliste einträgst, sendet dein Browser Folgendes direkt an den MonDex-Server (siehe <a className="info-link" href="#providers">Abschnitt 8</a>):</p>
        <ul>
          <li>deine E-Mail-Adresse</li>
          <li>deinen Vornamen und deine Plattform (iPhone oder Android), falls du sie angibst</li>
          <li>an welcher Stelle der Website du dich eingetragen hast, oder den Kampagnennamen, wenn du über einen Kampagnenlink gekommen bist</li>
          <li>die Sprache deines Browsers, damit die Launch-E-Mail in deiner Sprache kommt</li>
        </ul>
        <p>Mit dem Eintrag in die Warteliste wird kein MonDex-Konto angelegt. Wir nutzen diese Angaben für genau eine Sache: dir Bescheid zu geben, wenn MonDex startet. Wir bewahren sie <Fill>[bis zum Launch + N Monate / bis du uns bittest, sie zu löschen]</Fill> auf. Du kannst dich jederzeit austragen lassen, indem du an <Mail subject="Bitte von der Warteliste entfernen" /> schreibst.</p>
        <h3>Schutz vor Bots</h3>
        <p>Das Formular enthält ein verstecktes Feld, das Menschen nicht sehen, Bots aber gern ausfüllen. Um wiederholte Anfragen zu begrenzen, hält unser Server deine IP-Adresse kurz im Arbeitsspeicher. Sie wird nicht gespeichert.</p>
        <h3>Keine Analyse, keine Cookies, keine Drittanbieter</h3>
        <p>Die Website setzt keine Cookies und nutzt keine Analysewerkzeuge. Sie lädt keine Schriften, Skripte oder Bilder von anderen Unternehmen: Alles kommt von mondextcg.com, und Texte werden in Schriften angezeigt, die bereits auf deinem Gerät sind. Abgesehen vom Laden der Seiten bei GitHub werden Daten nur über das Wartelisten-Formular gesendet, und nur wenn du es abschickst.</p>
      </> },
      { id: "account", title: "Dein MonDex-Konto", body: <>
        <p>Du kannst ein Konto auf zwei Arten anlegen.</p>
        <h3>E-Mail und Passwort</h3>
        <p>Dein Passwort speichern wir nur als Hash, nie im Klartext. Um deine E-Mail-Adresse zu bestätigen, schicken wir dir einen 6-stelligen Code, der 15 Minuten gültig ist.</p>
        <h3>Mit Apple oder Google anmelden</h3>
        <p>Wir erhalten deine Konto-Kennung von Apple oder Google und deine bestätigte E-Mail-Adresse. Dein Apple- oder Google-Passwort sehen wir nie. Wenn du Apples „E-Mail-Adresse verbergen“ nutzt, sehen wir nur die Weiterleitungsadresse, die Apple für dich erstellt.</p>
        <h3>Dein Profil (optional)</h3>
        <p>Wenn du möchtest, kannst du einen Anzeigenamen, eine kurze Bio (bis zu 280 Zeichen), ein Profilfoto, deine Anzeigewährung und deinen Standard-Kartenzustand hinterlegen.</p>
      </> },
      { id: "collection", title: "Deine Sammlung", body: <>
        <p>Deine Sammlung wird auf unserem Server gespeichert, damit sie auf jedem Gerät da ist, auf dem du dich anmeldest. Dazu gehören die Karten, die du besitzt, und die Angaben, die du einträgst:</p>
        <ul>
          <li>Anzahl, Zustand und Sprache</li>
          <li>Grading-Firma, Grade und Zertifikatsnummer</li>
          <li>Kaufpreis und Kaufdatum</li>
          <li>Notizen</li>
          <li>deine echten Binder und Boxen, samt dem Fach, in dem jede Karte steckt</li>
        </ul>
        <p>Kaufpreise nutzen wir nur für eines: um dir deine Gewinne und Verluste zu zeigen. Karten zuerst. Preise danach.</p>
      </> },
      { id: "scanning", title: "Karten scannen und Fotos", body: <>
        <h3>Kamera und Fotomediathek</h3>
        <p>Die App nutzt deine Kamera nur, während du scannst. Auf deine Fotomediathek greift sie nur zu, wenn du selbst ein Bild auswählst, etwa ein Kartenbild oder dein Profilfoto.</p>
        <h3>Eine Karte erkennen</h3>
        <p>Um eine Karte zu erkennen, sendet die App das Foto an unseren Server, wo es mit unserem Kartenkatalog verglichen wird. Wir nutzen deine Fotos nicht, um dich zu identifizieren, und nicht, um KI-Modelle zu trainieren.</p>
        <h3>Gespeicherte Scan-Fotos</h3>
        <p><Fill>[Falls die Bildspeicherung im Produktivbetrieb aktiviert ist:]</Fill> Wenn du eine gescannte Karte speicherst, kann ihr Scan-Foto zusammen mit der Karte aufbewahrt werden. Fotos, die du verwirfst, werden gelöscht. Löschst du eine Karte, wird ihr Foto gelöscht, und löschst du dein Konto, werden alle deine Scan-Fotos gelöscht.</p>
        <h3>Grade</h3>
        <p>Die Grade-Funktion schätzt den Zustand einer Karte anhand von Fotos der Vorder- und Rückseite. Diese Analyse läuft vollständig auf deinem Handy, es wird nichts hochgeladen. Das Ergebnis ist eine Schätzung, keine professionelle Bewertung.</p>
      </> },
      { id: "on-device", title: "Daten, die auf deinem Gerät bleiben", body: <>
        <p>Manches liegt nur auf deinem Handy. Es wird nicht an uns gesendet, und deshalb wird es auch nicht zwischen deinen Geräten synchronisiert:</p>
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
        <p>Die Beispielsammlung („Vorschaumodus“) braucht kein Konto und sendet nichts an unseren Server.</p>
      </> },
      { id: "what-we-dont-do", title: "Was wir nicht tun", body: <>
        <ul>
          <li>Keine Werbung.</li>
          <li>Kein Tracking über Apps oder Websites hinweg.</li>
          <li>Keine Analyse- oder Werbe-SDKs.</li>
          <li>Kein Verkauf und keine Vermietung deiner personenbezogenen Daten.</li>
        </ul>
        <p>Die Datenschutzangaben der App gegenüber Apple sagen dasselbe: kein Tracking.</p>
      </> },
      { id: "providers", title: "Dienstleister und wo deine Daten liegen", body: <>
        <p>Einige Dienstleister helfen uns, MonDex zu betreiben. Sie verarbeiten Daten in unserem Auftrag und für den jeweils genannten Zweck:</p>
        <Rows items={[
          ["Render", <>App-Server und Datenbank, einschließlich der Warteliste. Region: <Fill>[Region: z. B. Frankfurt, EU / Oregon, USA]</Fill></>],
          [<Fill key="storage">[S3-kompatibler Speicheranbieter + Region]</Fill>, "Scan-Fotos, falls die Fotospeicherung aktiviert ist."],
          [<>Titan Email <Fill>[Anbieter bestätigen]</Fill></>, "Versand von Registrierungscodes, Codes zum Zurücksetzen des Passworts und Sammlungsexporten."],
          ["Apple und Google", "Anmeldung, nur wenn du „Mit Apple anmelden“ oder „Mit Google anmelden“ wählst."],
          ["GitHub", <>Hosting dieser Website (siehe <a className="info-link" href="#website">Abschnitt 2</a>).</>],
        ]} />
        <h3>Kartendaten und Preise</h3>
        <p>Unser Kartenkatalog und die Preise stammen von pokemontcg.io, pokemonpricetracker.com und exchangerate.host. Unser Server ruft dort Kartendaten und Wechselkurse ab. Deine personenbezogenen Daten werden dabei nicht übermittelt.</p>
        <h3>Übermittlung ins Ausland</h3>
        <p><Fill>[Garantien beschreiben, z. B. Standardvertragsklauseln, falls ein Anbieter außerhalb der Schweiz/EU sitzt]</Fill></p>
      </> },
      { id: "emails", title: "E-Mails, die wir senden", body: <>
        <p>Wir schreiben dir nur, wenn es einen Grund gibt:</p>
        <ul>
          <li>ein Code zur Bestätigung deiner E-Mail-Adresse, wenn du dich registrierst</li>
          <li>ein Code, wenn du dein Passwort zurücksetzt</li>
          <li>dein Sammlungsexport, wenn du ihn anforderst</li>
        </ul>
        <p>Es gibt keine Marketing-E-Mails. Die einzige Ausnahme: Wenn du dich in die Warteliste eingetragen hast, bekommst du eine einzige E-Mail, wenn MonDex startet.</p>
      </> },
      { id: "retention", title: "Wie lange wir Daten aufbewahren", body: <Rows items={[
        ["Konto und Sammlung", "Bis du sie löschst."],
        ["Registrierungscodes", "Laufen nach 15 Minuten ab."],
        ["Codes zum Zurücksetzen des Passworts", "Laufen nach 30 Minuten ab."],
        ["Warteliste", <>Siehe <a className="info-link" href="#website">Abschnitt 2</a>.</>],
        ["Server-Logs", <Fill key="logs">[N Tage]</Fill>],
      ]} /> },
      { id: "your-rights", title: "Deine Rechte und Einstellungen in der App", body: <>
        <p>Das meiste kannst du direkt in der App selbst erledigen:</p>
        <ul>
          <li>Deine Sammlung als CSV oder JSON exportieren oder dir eine CSV-Datei per E-Mail schicken lassen.</li>
          <li>Dein Profil jederzeit bearbeiten.</li>
          <li>Dein Konto deaktivieren. Das lässt sich rückgängig machen: Wenn du dich wieder anmeldest, ist es wieder da.</li>
          <li>Dein Konto endgültig löschen. Dabei werden deine Sammlung, deine Scan-Fotos und deine Anmeldedaten entfernt. Wenn du „Mit Apple anmelden“ nutzt, widerrufen wir außerdem den Zugriff von MonDex bei Apple.</li>
        </ul>
        <p>Du kannst uns auch an <Mail subject="Datenanfrage" /> schreiben, um deine Daten einzusehen, zu berichtigen, zu löschen oder mitzunehmen oder um der Nutzung zu widersprechen. Außerdem hast du das Recht, dich bei <Fill>[EDÖB (Schweiz) / deiner zuständigen EU-Datenschutzbehörde]</Fill> zu beschweren.</p>
      </> },
      { id: "security", title: "Sicherheit", body: <>
        <p>Alle Verbindungen laufen über HTTPS. Passwörter werden nur als Hash gespeichert, Codes funktionieren nur einmal, und deine Anmelde-Tokens liegen im sicheren Speicher deines Handys.</p>
      </> },
      { id: "children", title: "Kinder", body: <>
        <p><Fill>[Mindestalter, z. B. 16 oder jünger mit Zustimmung der Eltern. Bitte entscheiden: Pokémon hat viele junge Fans.]</Fill></p>
      </> },
      { id: "changes", title: "Änderungen dieser Erklärung", body: <>
        <p>Wenn wir diese Erklärung ändern, aktualisieren wir das Datum oben auf dieser Seite. Wenn eine Änderung für den Umgang mit deinen Daten wichtig ist, sagen wir dir zusätzlich in der App Bescheid.</p>
      </> },
    ],
  },
};

export default function PrivacyPage() {
  const { locale } = useLocale();
  const c = copy[locale];
  return <>
    <InfoIntro label={c.label} title={c.title}>
      <p className="info-meta"><span>{c.updated}: <strong>{formatDate(PRIVACY_LAST_UPDATED, locale)}</strong></span><span>{c.framework}</span></p>
      <p>{c.intro}</p>
    </InfoIntro>
    <aside className="info-summary" aria-labelledby="privacy-summary-title">
      <h2 id="privacy-summary-title">{c.summaryTitle}</h2>
      <p>{c.summary}</p>
    </aside>
    <InfoSections sections={c.sections} toc={c.toc} />
  </>;
}
