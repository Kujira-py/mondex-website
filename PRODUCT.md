# MonDex Produktwebsite
<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Bestehendes React-/TypeScript-Projekt mit Vinext, Vite, Next-kompatiblen Routen und eigenem CSS. Die Website liegt in `app/` und `components/marketing/`. Ihre Vorschauen verwenden gemeinsamen, flüchtigen React-Zustand. Es gibt keine angebundene Anmeldung oder persönliche Sammlungsverwaltung.

## Users

Deutsch- und englischsprachige Pokémon-TCG-Sammler, die erfahren möchten, wie MonDex ihr persönliches Sammeln unterstützen könnte. Sie sollen ausgewählte Produktmomente selbst ausprobieren, die Website teilen und den Entwicklungsstatus klar erkennen können.

## Product Purpose

Öffentliche Produktwebsite für die MonDex-App in Entwicklung, verfügbar auf Deutsch und Englisch. Die Leitidee lautet „Deine Karten. Dein MonDex.“ bzw. „Your cards. Your MonDex.“ Die drei prägenden Erlebnisse sind Entdecken, Aufschlagen und Erfassen: ein Pokémon im persönlichen Pokédex entdecken, einen digitalen Binder öffnen und einen stilisierten Karteneffekt ausprobieren.

Die zuvor in diesem Webprojekt gezeigte App-Simulation wurde bewusst durch diese Landingpage ersetzt. Die eigenständige native App unter `/Users/bleon/MonDex` bleibt von diesem Website-Auftrag unverändert. MonDex wird für iPhone und Android entwickelt; unterstützte Geräte, Betriebssystemversionen, Launch-Termin und endgültiger Funktionsumfang sind noch nicht bestätigt.

## Capabilities and Constraints

Die Seite besteht aus Header, acht Hauptabschnitten und Footer. Die feste Reihenfolge lautet:

1. Hero mit umschaltbarer App-Vorschau: Home, Pokédex und Binder.
2. Persönlicher Pokédex mit wiederholbarer Discovery-Demo.
3. Digitale Binder: drei Cover, Öffnen, Blättern, Schließen und Kartenbetrachter.
4. Scanner mit Standard-, Holo- und Metallic-Reaktion.
5. Collection-Organisation mit Cards, Sets, Binders und Lists.
6. Eigenständiger, bewusst kompakter Portfolio-Einblick mit ausblendbaren Werten.
7. Launch-Formular unter `#vormerken`.
8. Sieben aufklappbare häufige Fragen unter `#fragen`.

Die Hauptaktion heißt „Zum Launch vormerken“ bzw. „Get launch updates“. Echte Abschnittslinks, mobile Navigation, Tastaturbedienung, Escape und Fokus-Rückgabe unterstützen die Nutzerreise. Die Website erhält keine eigene App-Bottom-Navigation; die Darstellung innerhalb der Smartphone-Demo ist Teil der Produktvorschau.

Alle Produktinteraktionen und Zahlen sind als Demo bzw. Beispieldaten gekennzeichnet. Es gibt keine Benutzerkonten, echte Kartenerkennung, Kamera- oder Audiofunktion, Shop-, Zahlungs- oder CMS-Anbindung. Ein Import bestehender Sammlungen ist für den Launch noch nicht bestätigt.

### Sprachen und Teilen

Ein DE/EN-Schalter bleibt im Header auf Desktop und Mobile erreichbar. Deutsch ist der Standard. Englische Seiten besitzen eigene `/en/`-Pfade und liefern bereits beim statischen Rendern englische Inhalte. Interne Links und Neuladen behalten die Sprache. Ältere `?lang=en`-Links werden im Browser zur entsprechenden englischen Seite weitergeleitet. Die Sprachwahl verwendet weder localStorage noch Cookies.

Die Übersetzungen stehen zentral in `components/marketing/en.json`; `locale.tsx` steuert den Sprachwechsel und interne Links, die statischen Seitenrouten die anfängliche Routensprache. Die drei Informationsseiten bleiben in beiden Sprachen als unvollständig gekennzeichnet. Sprache verändert weder Demo-Daten noch den Entwicklungsstatus.

Der Nutzer hat die anschließende Veröffentlichung auf Sites angefordert, um die Website einem Freund zu zeigen. Diese Dokumentation bestätigt keine erfolgte Veröffentlichung und enthält noch keine verifizierte öffentliche URL. Der veröffentlichte Stand bleibt eine Produktdemo mit den hier genannten offenen Launch-Inhalten.

### Gemeinsame Beispieldaten

Die Grundwerte sind 1.284 Karten, 312 entdeckte Pokémon, Kanto 143/151 und eine Wunschliste mit 24 Karten. Die Discovery-Demo entdeckt Mew und erhöht die ersten drei Werte gemeinsam um eins. Zurücksetzen stellt den Ausgangszustand wieder her. Die gemeinsame Besitzprojektion `ownedDemoCards` schließt Mew bis zur Entdeckung aus; Dragoran bleibt unentdeckt und außerhalb dieser Besitzprojektion. Scanner und Wunschliste dürfen ungesammelte Katalogbeispiele zeigen. Werte werden nicht zufällig erzeugt oder dauerhaft gespeichert.

### Anmeldung und Informationsseiten

Das Launch-Formular validiert eine E-Mail-Adresse ausschließlich lokal. Die Zustände sind eingabebereit, ungültig und Demo abgeschlossen. Eine gültige Eingabe führt zur Meldung „Demo abgeschlossen — deine E-Mail-Adresse wurde nicht gespeichert.“ bzw. „Demo complete — your email address was not saved.“ E-Mail-Adressen werden weder übermittelt noch gespeichert oder protokolliert. Ein echter Erfolg darf erst nach bestätigter Speicherung durch einen künftig angebundenen Endpunkt angezeigt werden.

Die Routen `/kontakt`, `/datenschutz` und `/impressum` funktionieren und kennzeichnen ihre noch zu ergänzenden Inhalte sichtbar. Endgültige Kontakt-, Betreiber- und Rechtstexte, ein tatsächlicher Anmelde-Endpunkt sowie bestätigte Launch-Angaben fehlen. Downloadlinks, App-Store-Badges, Veröffentlichungstermine, Nutzerzahlen, Bewertungen, Partnerschaften und Preise dürfen nicht erfunden werden.

## Brand Commitments

Ruhig, präzise, persönlich und hochwertig. „Die Oberfläche bleibt neutral. Karten, Pokémon und Binder liefern die Farbe.“ Violett dient wichtigen Aktionen, ausgewählten Zuständen und kleinen Markenakzenten. „Karten zuerst. Preise danach.“ Marktwerte sind eine ergänzende Perspektive, kein Anlageversprechen.

Die vom Nutzer festgelegten Texte, Tokens, Abschnittsfolge und Interaktionen sind verbindlich und haben Vorrang vor allgemeinen Stilpräferenzen. Die Website führt die Marke der App mit mehr Raum und größerer Typografie fort. Das originale Orbit-Zeichen wurde unverändert übernommen und wird zentral referenziert.

## Evidence on Hand

- Nutzerbrief: `/Users/bleon/.codex/attachments/703262e1-4206-4e46-b81f-d34ac47d84ff/pasted-text.txt`; Website-Richtung: `.impeccable/website-brief.md`.
- Aktuelle Umsetzung: `app/globals.css`, `components/marketing/MarketingSite.tsx`, `data.ts`, `state.tsx`, `locale.tsx`, `en.json`, `route-locale.ts` und die Marketing-Komponenten. Startanweisungen und offene Integrationen stehen in `WEBSITE.md`.
- Native Projektdateien unter `/private/tmp/mondex-merge-main-20260912/mobile/ios` und `/private/tmp/mondex-merge-main-20260912/mobile/android` belegen die Plattformarbeit, keine bestätigte Launch-Unterstützung bestimmter Geräte oder Versionen.
- Die Website verwendet optimierte WebP-Ableitungen vorhandener Projektgrafiken. Herkunft: `public/assets/provenance.json`; Verarbeitung: `public/marketing/README.md`. Für diese Website wurden keine neuen fremden Kartenbilder bezogen. Die öffentliche Nutzungsfreigabe der Karten-/Pokémon-Grafiken bleibt zu klären; Herkunftsdaten ersetzen keine Freigabe.
- `public/brand/orbit.svg` ist die unveränderte Kopie des vorhandenen nativen Orbit-Assets; `public/favicon.svg` enthält dasselbe Zeichen.
- Vorhandene Website-Aufnahmen und Prüfberichte liegen unter `.impeccable/review/website/`. Diese Dokumentationsaktualisierung behauptet keine zusätzlich ausgeführten Browser- oder Performance-Tests.

## SEO-Erweiterung und statisches Hosting

Drei zusätzliche zweisprachige Informationsseiten erklären Kartenscans, digitale Binder und Sammlungstracking. Sie ergänzen die bestehende Landingpage und ändern keine Demo-Daten. Die nachfolgende Veröffentlichung wurde für GitHub Pages in `Kujira-py/mondex-website` autorisiert. Alle Seiten sind statisch lesbar. Canonical- und Sprachverknüpfungen, strukturierte Daten sowie eine Sitemap teilen Suchmaschinen die Seitenstruktur mit. Details und offene Search-Console-Verifizierung stehen in `SEO.md`.
