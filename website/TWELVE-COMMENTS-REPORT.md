# MonDex — Korrekturen zu den zwölf Browser-Anmerkungen

Stand: 21.09.2026. Änderungen ausschließlich in `mondex-web`. Das Offline-Fenster bleibt unverändert.

## Änderungen

1. Mehr Abstand zwischen Einstiegstext/CTA und Karten. Kompakte Schriftgröße für kurze Desktop-Fenster; abgestimmte Kartenpositionen für Tablet und Mobil.
2. SVG-Ladeansicht und WebGL-Logo verwenden dieselbe Anfangspose. Die Logo-Bewegung ist an den Kapitelgrenzen kontinuierlich.
3. Originale Orbit-Konturen und Farbverläufe; innerer Ring korrigiert auf Außenradius 16 / Innenradius 11,2. Originalfarben auf den Flächen, beleuchtete violette Kanten.
4. Weicher Übergang des Story-Hintergrunds in den Feature-Bereich. Die harte Fortschrittslinie am unteren Rand entfällt; die Kapitelanzeige bleibt.
5–6. Gemeinsame Scan-Sequenz setzt den Strahl unsichtbar oben zurück, bevor er eingeblendet wird. Kein wiederverwendetes sichtbares `fromTo`-Startbild am unteren Rand.
7. Zwei dauerhaft vorhandene Binder-Seiten statt Wiederverwendung derselben Fläche. Jede Seite bleibt nach dem Umblättern auf ihrem eigenen Stapel. Karten bleiben an ihrer Seite befestigt. Vor dem Schließen werden die Seiten zurückgeblättert; der nächste Durchlauf beginnt unter dem geschlossenen Deckel.
8. Beide Scanner verwenden denselben Strahl mit violettem Lichtschweif und derselben zeitlichen Abfolge.
9. Genau ein Größenbeobachter für die Collection; er reagiert nur auf Breitenänderungen. Jeder neue Layoutwechsel beendet die gesamte vorherige Timeline einschließlich ausstehender Einsteck-Schritte. Auswahl und holografischer Hover bleiben getrennt vom Layout.
10. Discovery-Hinweistext entfernt.
11. Weicher Farbverlauf vom Discovery- zum Portfolio-Bereich.
12. Externe Preislinks entfernt. Gerundete Beispielwerte: Pikachu 75 USD, Mew ex 25 USD, Charizard ex 350 USD; insgesamt 450 USD. Kennzeichnung als ungefähre Werte in EN und DE; Diagramm und Summen bleiben miteinander verknüpft.

## Ausgeführte Prüfungen

- `npm run lint`, `npm run typecheck`, `npm run build`.
- Chrome-Browserprüfung bei 1440 × 900, 842 × 837, 390 × 844 und 1280 × 720: vier Story-Kapitel, schnelle unterbrochene Tabwechsel, Abbruch während einer Binder-Einfügung, Diagramm per Tastatur, EN/DE und entfernte Links/Hinweise. Screenshots unter `qa/twelve-confirm/`.
- Vollständiger 33,5-Sekunden-Mitschnitt der berechneten Scan-Positionen: kein sichtbarer Rücksprung. Zwölf Binder-Screenshots über 36 Sekunden zeigen Öffnen, Einstecken, getrennte Seitenwechsel, Zurückblättern und Schließen. Zustände unter `qa/twelve/`; keine Videoaufnahme.
- `verify-motion.mjs`: erster Render und WebGL-Übergang, schnelle Kartenauswahl, vorwärts/rückwärts durch die Story, Hover der Discovery-Reihe, Bewegungspause, EN/DE, axe für die Feature-Fenster und horizontaler Überlauf. Fünf Größen von 360 × 800 bis 1440 × 900; keine Kartenüberschneidungen, keine axe-Verstöße im geprüften Bereich, kein Seitenüberlauf. Ladeansicht/WebGL-Abweichung maximal 0,56 Pixel.
- `verify-motion-fallbacks.mjs`: reduzierte Bewegung auf Desktop/Mobil, Ansicht ohne WebGL, stabiler Canvas bei Pause/Fortsetzung. Keine zusätzlichen WebGL-Zeichenaufrufe im ruhenden, pausierten oder außerhalb des sichtbaren Bereichs liegenden Zustand.
- `verify-motion-models.mjs`: 411.698 Seitenpunkte im vollständigen Binder-Zyklus bei 120 Abtastungen/Sekunde. Mindestabstand zur jeweils stützenden Seite 0,04 Szeneneinheiten; keine Positionssprünge an der Loop-Grenze. Dies ist eine Prüfung der Geometrie, keine physikalische Simulation.

Keine Browser-Laufzeitfehler in den ausgeführten Durchgängen. Safari und Firefox wurden nicht geprüft.
