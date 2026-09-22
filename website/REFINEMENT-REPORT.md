# MonDex – Abschluss der Produkt- und Motion-Verfeinerung

Stand: 21. September 2026. Die bestehende Website wurde verfeinert, nicht neu gestaltet.
Die mobile App und das Backend wurden nicht verändert. Englisch bleibt Standard;
Deutsch ist direkt umschaltbar und die Auswahl bleibt nach einem Reload erhalten.

## Ergebnis

- **Hero:** Gengar, Umbreon und die übrigen Karten werden auf Mobile vollständig
  zentriert; die Nachbarn treten zurück. Desktop behält die räumliche Komposition.
- **Pause/Resume:** getrennte Zustände für Benutzerpause, reduzierte Bewegung,
  WebGL-Verfügbarkeit und echten Fehler. Pause behält den Canvas und stoppt die
  Bewegung. Wiederholtes Fortsetzen benötigt keinen Reload. Ein tatsächlicher
  Kontextverlust führt zur lesbaren statischen Ansicht.
- **Collection:** Größe, Position und Rotation bewegen sich gemeinsam. Dafür
  interpoliert GSAP feste Geometrie; es gibt keinen vorherigen CSS-Breitenwechsel.
  Stabile Karten-IDs, getrennte Layout-, Auswahl- und Holo-Ebenen. Auch unterbrochene
  Übergänge setzen an der aktuellen Position an. Alle zwölf gerichteten Wechsel
  zwischen den vier Modi wurden im Browser ausgeführt.
- **Scanner:** Karte im Rahmen → Mew-ex-Treffer mit Set, Nummer und Holo-Druck →
  ausdrückliche Bestätigung → derselbe Kartenträger landet in der Sammlung.
  Die Ergebnisdarstellung folgt der vorhandenen App-Komponente `ScanReview.js`.
  Der erste Scan beginnt beim Eintritt in den sichtbaren Bereich. Rückwärtsscrollen
  bewahrt den ausgewählten, definierten Zustand. Auf Mobile stehen die drei
  Schritte kompakt direkt unter der Szene, damit das Ergebnis sichtbar bleibt.
- **Portfolio:** Darstellung nach der echten App-Komponente `PortfolioProfile.js`
  mit Sammlungswert, Veränderung, Zeitraum, Verlauf und drei Positionen. SVG-Linie
  zeichnet sich einmal in 1,1 Sekunden. Maus, Touch-Drag und Pfeiltasten wählen
  Datenpunkte; Datum und Wert sind ablesbar. Alle Werte sind als Demo markiert.
  Die drei Positionen ergeben jeden Chartpunkt: zuletzt $50 + $25 + $125 = $200;
  Start $160, Veränderung +$40 / +25 %. Keine Live-Daten und keine privaten Bestände.
- **Neue große Animation:** eine Discovery Rail mit zwölf vorhandenen echten
  Kartenmotiven. Ruhige Bewegung mit 30 px/s, nahtlose identische Gruppen,
  Hover-/Fokus-Pause, dezenter Tilt bis 4,5°, eigene Pausetaste. Mobile und reduzierte
  Bewegung nutzen natives horizontales Scrollen mit Snap statt Autoplay.
- **Binder:** bestehender Tab mit 8/9 Plätzen, einer Karte außerhalb und Add/Replay.
  Die Karte hebt sich an, landet in rund 0,8 Sekunden im freien Slot, dann folgt 9/9.
  Keine zusätzliche Sektion und kein Konfetti.
- **Scrollstory/Pokédex:** Capture fokussiert eine Karte, Collect bildet ein Raster,
  Understand ergänzt Set-Fortschritt. Der Gesamtumfang von 151 ist einschließlich
  Secret Rares mit 207 Karten aus dem vorhandenen Set-Katalog belegt. Das Orbit
  tritt im letzten Kapitel zurück und lässt die Informationen frei. Silhouetten
  lösen sich mit einem kurzen, zurückhaltenden Lichtakzent auf.
- **Abschluss:** Coming soon plus funktionierender Einstieg in die Sammlungsdemo.
  Keine erfundenen Store-Buttons, QR-Codes, Bewertungen oder Nutzerzahlen.

## Tatsächlich ausgeführte Prüfungen

Chrome auf macOS, Produktionsausgabe über lokalen HTTP-Server. Mobile bedeutet
Touch-/Viewport-Emulation, keinen Test auf einem physischen iPhone oder Safari.

| Größe      | Funktionsprüfung | Abschlussprüfung | EN/DE     |
| ---------- | ---------------- | ---------------- | --------- |
| 1440 × 900 | bestanden        | bestanden        | bestanden |
| 1280 × 800 | bestanden        | bestanden        | bestanden |
| 768 × 1024 | bestanden        | bestanden        | bestanden |
| 390 × 844  | bestanden        | bestanden        | bestanden |
| 360 × 800  | bestanden        | bestanden        | bestanden |

Geprüft wurden alle Hero-Auswahlen, wiederholtes Pause/Resume ohne Canvas-Wechsel,
schnelle Collection-Wechsel, Binder-Completion/Reset je zweimal, die drei Scanner-
Zustände einschließlich Bestätigungsbutton und Rückwärtsscrollen, Rail-Pause,
Tastaturfokus bis zur letzten Karte, native Wischgesten, Chart-Hover/Touch-Drag/
Pfeiltasten, Pokédex-Filter und Reveal, mobile Navigation und das echte CTA-Ankerziel.

Die Rail lief in der ersten Runde **84,9 Sekunden** in Echtzeit über einen
vollständigen Umlauf. Der nachfolgend korrigierte Fokusabstand wurde zusätzlich
über seinen realen Schleifenübergang geprüft. Anfang, Zwischenzustand und Ende von
Scanner, Binder und Chart sowie Kapitel vorwärts/rückwärts sind dokumentiert.

Separat ausgeführt: reduzierte Bewegung, künstlich nicht verfügbarer WebGL-Kontext,
ein gezielt ausgelöster echter Kontextverlust und deaktiviertes JavaScript. In allen
Fällen blieben die vier Produktkapitel lesbar. Der ausgelöste Test-Kontextverlust ist
von normalen Seitenaufrufen und manueller Pause getrennt protokolliert.

`npm run build` (Sites-Buildhelfer), `npm run typecheck`, `npm run lint`, die neue
Browsermatrix und die bestehende Sprach-Regressionssuite sind erfolgreich. Die
automatische WCAG-AA-Prüfung meldete nach der Kontrastkorrektur keine Verstöße in
allen fünf Größen; die Sprachsuite prüfte zusätzlich EN/DE auf Desktop und Mobile.
Dies ersetzt keine vollständige manuelle Barrierefreiheits-Zertifizierung.

## Performance und Grenzen

**Beobachtet:** keine JavaScript-/React-Fehler, HTTP-Fehler oder unerwarteten
WebGL-Kontextverluste in der Funktionsmatrix. Keine GSAP-Warnungen. Kein horizontaler
Dokumentüberlauf. Seitlich auslaufende Nachbarkarten/Carousel-Elemente sind bewusst
innerhalb ihrer Masken; ausgewählte mobile Hero-Karten bleiben vollständig sichtbar.

Instrumentierte WebGL-Zeichenaufrufe: **0 zusätzliche Aufrufe** während der
Pausenproben, nach Beruhigung des Heros und bei außerhalb des Viewports liegendem
Canvas. Die Rail wird durch Sichtbarkeit, Dokumentstatus, Fokus und Pause gesteuert.
Es bleibt genau ein WebGL-Canvas mit Demand-Rendering und auf 1,5 begrenztem DPR.
Neue Bilder sind WebP; Portfolio ist SVG und die Rail DOM. Keine React-State-Updates
in einer laufenden Render-Schleife.

In der ersten vollständigen Browserrunde lag die gemessene Layoutverschiebung
(CLS) je Größe zwischen **0,0006 und 0,0016**. Je Seitenaufruf wurde eine Long Task
von **57–61 ms** protokolliert. Daraus wird weder Geräte-FPS noch eine Performance-
Garantie für echte Mobilgeräte abgeleitet. Es wurde kein vollständiges CPU-Profil
zur Zuordnung dieser kurzen Tasks erstellt.

**Behoben:** Kontextverlust durch Benutzerpause; versetzte Größenwechsel; verdeckte
achte Binder-Karte; exakte Landeposition der Scanner-Karte; überstarker Rail-Glanz;
zu lange mobile Scanner-Bedienung; Logo-Kontrast auf dem transparenten Header;
angeschnittener Tastaturfokus am Rail-Rand; Orbit hinter der mobilen Statistik.

**Verbleibend:** Die bestehende R3F-/Three-Kombination erzeugt beim Start die Warnung
`THREE.Clock ... deprecated ... THREE.Timer`. Die Quelle ist R3Fs interne
Clock-Instanz; sie wurde nicht durch Konsolenfilter versteckt oder durch Änderungen
an installierten Bibliotheken kaschiert. Keine beobachtete Funktionsstörung dadurch.
Ein Test auf echten Mobilgeräten/Safari bleibt offen.

## Fehlende freigegebene Inhalte

Im geprüften Projekt liegen keine bestätigten Store-/TestFlight-Links und keine
freigegebenen Reviews vor. Diese Inhalte wurden ausgelassen. Firmen-/Kontaktangaben
für veröffentlichungsspezifische Rechtstexte fehlen weiterhin; es wurden keine
erfundenen Angaben eingesetzt.

## Belege

- [Screenshot-Galerie der Abschlussprüfung](qa/refinement-final/index.html)
- [Abschlussprüfung, Zustände und Geometrie](qa/refinement-final/report.json)
- [Letzte gezielte Korrekturprüfung](qa/refinement-final/touchup.json)
- [Erste Matrix inklusive Echtzeit-Loop und Performance](qa/refinement/report.json)
- [Sprachprüfung und Persistenz](qa/languages/verification.json)

Reproduzierbare Browserprüfungen stehen unter `scripts/verify-refinement*.mjs`.
Die Bibliothekszuordnung ist direkt im Quellcode nachvollziehbar: R3F/Three für die
bestehende Bühne, GSAP/ScrollTrigger für Kapitel und SVG-Aufbau, GSAP für Collection,
Scanner und Rail, CSS für Holo/Focus/Reveal. Referenz zur untersuchten FLIP-Alternative:
[offizielle GSAP-Dokumentation](https://gsap.com/docs/v3/Plugins/Flip/).
