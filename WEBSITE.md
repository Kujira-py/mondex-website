# MonDex Produktwebsite

Deutsch- und englischsprachige, responsive Produktseite im vorhandenen React/TypeScript- und Vinext-Projekt.

## Lokal starten

Voraussetzung: Node.js ab 22.13.0.

```sh
npm ci
npm run dev
```

Die Vorschau läuft standardmäßig unter http://localhost:5173. Einen bereits laufenden Server weiterverwenden, keinen zweiten auf demselben Port starten.

```sh
npm run build
npm start -- --port 5173
```

Für die zweite Variante zuvor den Entwicklungsserver beenden. Sie zeigt den gebauten Produktionsstand. Es wird nichts veröffentlicht.

## Enthaltene Funktionen

- DE/EN-Sprachschalter. `?lang=en` ist direkt teilbar und bleibt beim Wechsel auf Informationsseiten erhalten. Kein Cookie und kein LocalStorage; die Demos behalten beim Sprachwechsel ihren Zustand.
- Sticky Header, mobile Navigation, echte Abschnittslinks und Tastaturbedienung.
- Ein Smartphone mit Home-, Pokédex- und Binder-Vorschau.
- Wiederholbare Discovery-Demo. Mew erhöht Kanto von 143 auf 144, Karten von 1.284 auf 1.285 und Pokémon von 312 auf 313. Reset setzt alle gekoppelten Werte zurück.
- Drei auswählbare Binder, Öffnen/Schließen, drei Demo-Seiten, Buttons und optionales horizontales Wischen. Doppelseite auf Desktop, Einzelseite auf Mobile.
- Zugänglicher Kartenbetrachter mit Escape und Fokus-Rückgabe.
- Standard-, Holo- und Metallic-Scanreaktionen mit Abbruch bei Profilwechsel. Keine Kamera, keine Geräusche, keine Vibration.
- Cards/Sets/Binders/Lists-Demos sowie ein Portfolio-Beispiel mit ausblendbaren Werten.
- Formular mit Eingabevalidierung und ausdrücklich als Demo gekennzeichneter Rückmeldung. Keine Backend-Anbindung, keine Speicherung und keine Übermittlung von E-Mail-Adressen.
- FAQ und eigenständige Routen /kontakt, /datenschutz und /impressum.
- Rücksicht auf reduzierte Bewegung, sichtbare Inhalte auch ohne JavaScript.

## Noch vor einem öffentlichen Launch nötig

- Tatsächlicher Anmelde-Endpunkt und dazu passende Speicher-, Fehler- und Erfolgszustände. Die aktuelle Rückmeldung darf erst dann durch eine echte Anmeldung ersetzt werden.
- Endgültige Kontakt-, Betreiber- und Rechtstexte. Die drei Informationsseiten kennzeichnen dies sichtbar.
- Finale Freigabe der verwendeten Karten-/Pokémon-Assets für öffentliche Verwendung. Wiederverwendet wurden vorhandene Projektassets; Herkunft siehe public/assets/provenance.json und public/marketing/README.md.
- Bestätigte Launch-Details. Keine Downloadziele, App-Store-Badges oder Veröffentlichungstermine werden erfunden.

## Struktur

`components/marketing/` enthält die einzelnen Abschnitte. `data.ts` verwaltet Assets und konsistente Beispieldaten, `state.tsx` gemeinsamen Fortschritt und abbrechbare Übergänge. `app/globals.css` enthält Design- und Bewegungs-Tokens sowie die drei Layoutbereiche. `public/brand/orbit.svg` ist das unverändert übernommene Originalzeichen.

## Prüfung

Siehe `.impeccable/review/website/` für responsive Screenshots, Browser-Klickstrecke und Messberichte. Der Browser-Test prüft 360, 390, 768, 1024, 1280, 1440 und 1920 px, alle Demo-Zustände, Formular, FAQ, Dialogfokus, reduzierte Bewegung und Inhalte ohne JavaScript. Build-, TypeScript- und Lint-Prüfung gehören zum Abschluss.
