# Inhalte der ursprünglichen MonDex-Website

Stand: 22. September 2026. Quelle: https://github.com/Kujira-py/mondex-website,
Commit `35b9244a7458226aa5d7275d69126543bec5ba31`.
Mit den veröffentlichten Seiten https://mondextcg.com/, `/impressum/`,
`/datenschutz/` und `/de/` abgeglichen. Die Rechtstext-Platzhalter stehen
auch in der veröffentlichten Originalversion.

## Ergänzt

- Wartelisten-Einstieg auf der Startseite (`#vormerken`), in Navigation und Footer.
- Sieben FAQ zu Launch, Plattformen, Scanner, Offline-Erkennung, Varianten,
  Sammlungsimport und Website-Demos.
- Kontaktseite `/kontakt/` mit `contact@mondextcg.com` und fünf vorbereiteten
  Mail-Betreffs: Support, Datenanfragen, Datenschutz, Presse/Kooperationen, Feedback.
- Impressum `/impressum/` und Datenschutz `/datenschutz/` im neuen Design.
  Beide sind ausdrücklich als **unvollständige Prüfentwürfe** markiert.
- Drei Infoseiten zu Scanner, digitalen Bindern und Sammlungsverwaltung.
- Footer mit Produkt-, Hilfe-, Informations- und Rechtstext-Links.
- Alle Inhalte in Englisch und Deutsch, Englisch bleibt Standard.
- Eigenständige statische Seiten und Seitentitel; die Sprachwahl bleibt erhalten.

## Texte: übernommen und angepasst

| Bereich | Übernahme / Änderung |
| --- | --- |
| Kontakt | Adresse, fünf Kontaktanlässe und Passwort-Hinweis übernommen. Unbelegte Antwortzeit entfernt; keine vermeintliche Postanschrift zugesichert. |
| Warteliste | iPhone zuerst, Android in Entwicklung, kein bestätigter Termin, eine Launch-E-Mail und kein Konto übernommen. Neue Überschrift und kürzere Einleitung im Ton der neuen Seite. |
| FAQ | Vorhandene Fakten sprachlich gestrafft. Offline-Scannen als eigene Frage. Verweise auf App-Screenshots entfernt; klargestellt, dass die Website Demos und Beispielwerte zeigt. |
| Scanner-Guide | Inhalt weitgehend übernommen. Demo-Link an die neue Scanner-Sektion angepasst. |
| Binder-Guide | Beschreibung der alten Cover-/Blätter-Demo durch die aktuelle Taschen- und Sammlungsansicht ersetzt. Keine nicht mehr vorhandenen Interaktionen versprochen. |
| Sammlungs-Guide | Alte Behauptung, ein Mew-Scan ändere mehrere Website-Zähler gemeinsam, entfernt. Views und illustrative Portfolio-Werte passend zur neuen Vorschau beschrieben. |
| Impressum | Preis-/Grading- und Pokémon-Hinweise übernommen. Externe Links neutral beschrieben statt pauschalem Haftungsausschluss. Kein veralteter EU-ODR-Hinweis übernommen; zutreffende Schlichtungsangaben bleiben offen. Copyright-Jahr auf 2026 gesetzt. |
| Datenschutz | App-bezogene Inhalte aus der Quelle übernommen; keine unabhängige Prüfung des produktiven App-Backends behauptet. Website-Hosting auf OpenAI Sites angepasst, altes GitHub Pages als Ziel der Registrierung benannt. |
| Datenschutz: Sprache | Falsche Aussage „keine Cookies“ ersetzt: `mondex-language`, Sprache en/de, bis zu ein Jahr, löschbar im Browser. Lokal ausgelieferte Onest-Schrift statt Systemschrift beschrieben. |
| Datenschutz: Datentransfers | Registrierung erfolgt auf mondextcg.com, nicht im neuen Site-Frontend. Online- und unterstützte Offline-Erkennung getrennt. IP-Anfragebegrenzung von Infrastruktur-Logs unterschieden. Kontaktaufnahme per E-Mail ergänzt. |

## Offene Angaben aus der Quelle

Die Entwürfe dürfen nicht als vollständige oder rechtlich geprüfte Dokumente
verstanden werden. Es wurden keine Betreiberidentität, Anschrift, Anbieterregion,
Speicherfrist oder Altersgrenze erfunden. Benötigt werden:

- Vollständiger Betreibername/Firma, zustellfähige Postanschrift mit Land,
  verantwortliche Person; ggf. Rechtsform, Register-/UID-/USt-Angaben.
- Betreiberland und anwendbarer Rechtsrahmen; daraus ergeben sich die noch
  auszuformulierenden Rechtsgrundlagen, Aufsichtsbehörde und ggf. Schlichtungsangaben.
- Wartelisten-Löschfrist, Infrastruktur-Logfristen, E-Mail-/Kontakt-Löschfristen.
- Render-Region, bestätigter E-Mail-Anbieter, aktive Scan-Fotospeicherung und
  gegebenenfalls Speicheranbieter/Region.
- Anwendbare Vereinbarungen/Garantien für internationale Übermittlungen.
- Mindestalter bzw. Vorgehen bei Minderjährigen.
- Datum der vollständigen finalen Datenschutzerklärung.

## Vorregistrierung: technischer Stand

Bestehender Endpunkt: `https://mondex-api.onrender.com/api/v1/waitlist`.
Am 22.09.2026 nur lesend mit CORS-OPTIONS geprüft:

- `Origin: https://mondextcg.com`: HTTP 200 mit passendem Allow-Origin.
- `Origin: https://mondex-collection.bleon-cool.chatgpt.site`: HTTP 400,
  `Disallowed CORS origin`.

Daher führt der neue, gestaltete Einstieg gezielt zur funktionierenden bisherigen
Anmeldeseite `https://mondextcg.com/#vormerken` bzw. `/de/#vormerken`.
Beide Seiten lieferten HTTP 200 und enthalten den Formular-Anker.
Es gibt kein vorgetäuschtes Absenden und keine neu angelegte Warteliste.
Es wurden keine Test-Anmeldungen oder E-Mails an den Produktionsdienst gesendet.

Für ein Formular direkt in der neuen Site muss das Backend zunächst deren genaue
Origin freigeben. Im lokalen Backend ist die Liste in `backend/app/main.py`
auf `https://mondextcg.com` und `https://www.mondextcg.com` begrenzt.
Backend und Original-Repository wurden in dieser Aufgabe nicht geändert.
Danach muss auch der Registrierungsabschnitt der Datenschutzseite angepasst werden.

## Prüfung

Build/TypeScript, ESLint und lokaler Chrome-Browsercheck über
`scripts/verify-content.mjs`. Geprüft: direkte Seitenaufrufe, EN/DE inkl. Neuladen,
Seitentitel, Bildschirmbreiten 1440/842/390, lokale Anker, Kontakt-Betreffs,
Wartelisten-Ziele, FAQ per Tastatur, mobile Navigation und axe WCAG A/AA.
Kontakt und Wartelisten-Link zusätzlich ohne JavaScript geprüft.
Browserbelege liegen lokal unter `qa/content/` und werden nicht veröffentlicht.
