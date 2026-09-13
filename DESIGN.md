---
name: MonDex Produktwebsite
description: Ruhige, persönliche Sammlerwelt mit neutraler Oberfläche und farbigen Karten, Pokémon und Bindern.
colors:
  background: "#0B0B0F"
  surface: "#141419"
  surface-secondary: "#1C1C22"
  text: "#F5F5F7"
  muted: "#96969E"
  accent: "#7657FF"
  accent-light: "#A99BFF"
  line: "rgba(255,255,255,.07)"
typography:
  display:
    fontFamily: '-apple-system, BlinkMacSystemFont, Inter, "Helvetica Neue", sans-serif'
    fontSize: "clamp(56px,5vw,72px)"
    fontWeight: 550
    lineHeight: 1.07
    letterSpacing: "-.035em"
  headline:
    fontFamily: '-apple-system, BlinkMacSystemFont, Inter, "Helvetica Neue", sans-serif'
    fontSize: "clamp(40px,3.65vw,52px)"
    fontWeight: 550
    lineHeight: 1.12
    letterSpacing: "-.035em"
  intro:
    fontFamily: '-apple-system, BlinkMacSystemFont, Inter, "Helvetica Neue", sans-serif'
    fontSize: "18px"
    lineHeight: 1.65
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, Inter, "Helvetica Neue", sans-serif'
    fontSize: "16px"
    lineHeight: 1.6
  label:
    fontFamily: '-apple-system, BlinkMacSystemFont, Inter, "Helvetica Neue", sans-serif'
    fontSize: "12px"
    lineHeight: 1.6
  button:
    fontFamily: '-apple-system, BlinkMacSystemFont, Inter, "Helvetica Neue", sans-serif'
    fontSize: "14px"
    fontWeight: 550
    lineHeight: 1.4
rounded:
  small: "8px"
  button: "12px"
  panel: "18px"
  artwork: "5px"
  phone: "46px"
  language-switch: "9px"
  language-option: "6px"
spacing:
  small: "8px"
  medium: "16px"
  large: "24px"
  gutter-mobile: "20px"
  gutter-wide: "32px"
  section-desktop: "130px"
  section-tablet: "95px"
  section-mobile: "72px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#fff"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "13px 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#6848ee"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "13px 22px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-secondary}"
  demo-tabs:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.button}"
    padding: "4px"
  demo-tab:
    textColor: "{colors.muted}"
    rounded: "{rounded.small}"
    padding: "9px 18px"
    height: "40px"
  demo-tab-selected:
    backgroundColor: "#2b2a33"
    textColor: "{colors.text}"
  email-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.button}"
    padding: "0 45px 0 15px"
    height: "52px"
    width: "100%"
  collection-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "32px 38px 24px"
  card-artwork:
    rounded: "{rounded.artwork}"
    width: "100%"
  phone:
    rounded: "{rounded.phone}"
    width: "320px"
    height: "608px"
  language-switch:
    backgroundColor: "transparent"
    rounded: "{rounded.language-switch}"
    padding: "3px"
  language-option:
    textColor: "{colors.muted}"
    rounded: "{rounded.language-option}"
    padding: "0 5px"
    height: "32px"
    width: "32px"
  language-option-selected:
    backgroundColor: "{colors.surface-secondary}"
    textColor: "{colors.text}"
---

# Design System: MonDex Produktwebsite

## Overview

**Creative North Star: "Deine Karten. Dein MonDex."**

MonDex wirkt ruhig, präzise, persönlich und hochwertig. Die Oberfläche gibt dem Sammeln Raum; Karten, Pokémon und Binder bestimmen die Farbe. Die öffentliche Website übernimmt die visuelle Verwandtschaft der App mit größerer Typografie und großzügigerem Abstand, auf Deutsch und Englisch.

Das System folgt dem ausdrücklich festgelegten Nutzerbrief. Seine Farben, Radien, Schriftfamilie und Materialwirkung sind verbindlich. Dunkle Flächen bleiben neutral; physische Tiefe gehört zu den dargestellten Sammlerobjekten. Das originale Orbit-Zeichen wird unverändert verwendet. Die konkrete Abschnittsdramaturgie und der Oberflächenmodus stehen in `.impeccable/website-brief.md`.

**Key Characteristics:**

- Neutrale dunkle Bühne, farbige Sammlerobjekte.
- Zurückhaltendes Violett für Aktionen und Auswahl.
- Systemtypografie mit ruhigen, großen Überschriften.
- Präzise Bewegung bei bewusst ausgelösten Zustandswechseln.
- Sichtbar gekennzeichnete Produktdemos und Beispieldaten.

## Colors

Die Farbwerte im Frontmatter entsprechen den zentralen Variablen in `app/globals.css`; die Schreibweise der bestehenden CSS-Werte bleibt erhalten. Die Tonstreifen im Sidecar sind synthetische Vorschauhilfen und erweitern nicht die implementierte Palette.

### Primary

- **MonDex-Violett** (`accent`) trägt Hauptaktionen und kleine Markenakzente.
- **Helles MonDex-Violett** (`accent-light`) kennzeichnet Fokus, Fortschritt, dezente Statuspunkte und aktive Details.

### Neutral

- **Seitenschwarz** (`background`) bildet die Seitenfläche und den deckenden Header.
- **Erhöhtes Anthrazit** (`surface`) hält Tabs, Formulare und ausgewählte Vorschauflächen zusammen.
- **Sekundäres Anthrazit** (`surface-secondary`) unterstützt Hover- und Kontrollzustände.
- **Helles Schriftweiß** (`text`) dient Überschriften und primären Inhalten.
- **Gedämpftes Schriftgrau** (`muted`) dient Erklärungen, Metadaten und Demo-Hinweisen.
- **Feine weiße Trennlinie** (`line`) trennt Inhalte ohne zusätzliche Container.

**The Neutral Surface Rule.** Die Oberfläche bleibt neutral. Karten, Pokémon und Binder liefern die Farbe.

Das Violett wird nicht zu einer allgemeinen Hintergrundfarbe. Primärbutton-Hover, Tab-Auswahlfläche und Formularfehlerfarben bleiben Komponentenwerte, keine zusätzlichen Markenpaletten.

## Typography

Display, Fließtext und Bedienelemente teilen die Systemschrift aus dem Frontmatter. Es wird keine zusätzliche Schrift geladen. Die Hierarchie entsteht aus Größe, Medium-/Semibold-Gewichten und gezielten Abständen.

- **Display:** skalierende Desktop-Größe aus dem Frontmatter; auf Tablet (52px), auf Mobile (42px), bis (380px) Breite (40px).
- **Headline:** auf Tablet grundsätzlich (39px), auf Mobile (34px). Portfolio, FAQ und Launch verwenden bewusst kleinere, komponentenspezifische Größen.
- **Einleitung:** meist (18px); Hero (19px), auf Mobile (17px). Abschnittserklärungen wechseln auf Mobile zu (16px).
- **Body:** gemeinsame Schrift mit entspannter Zeilenhöhe. Informationsseiten begrenzen längeren Text auf (680px).
- **Label:** Haupt-Demo-Hinweise verwenden (12px). Kleinere Metadaten in App-Ausschnitten und mobilen Vorschauen sind keine Vorlage für regulären Website-Fließtext.

Abschnittseinleitungen sind gewöhnlich auf (450px) begrenzt. Überschriften stehen in echtem HTML-Text. Großbuchstaben und weite Laufweite des kleinen Hero-Labels sind eine gezielte Ausnahme zur normalen Schreibweise.

Deutsch und Englisch verwenden dieselbe Schrift und Hierarchie. Die Übersetzungen behalten lesbare Zeilenumbrüche, vollständig sichtbare Aktionen und ausdrückliche Demo-Hinweise. Die knappen Sprachkürzel DE und EN besitzen zugängliche Namen „Deutsch“ und „English“.

## Layout

Der zentrierte Inhaltsbereich ist maximal (1200px) breit und nutzt außerhalb von Mobile (32px) Seitenabstand. Unter (768px) gelten (20px). Die Bereiche sind Mobile unter (768px), Tablet von (768px) bis (1023px), Desktop ab (1024px). Kleine Anpassungen existieren zusätzlich bei (380px), (1100px) und (1600px).

Große Abschnitte nutzen den im Frontmatter dokumentierten vertikalen Abstand. Desktop stellt Text und Demo nebeneinander; Mobile ordnet Überschrift, Erklärung, Aktion und Demo untereinander. Die meisten Abschnitte stehen direkt auf der Seitenfläche. Portfolio bleibt kleiner; das Launch-Formular ist maximal (460px) breit.

Der Header ist auf Desktop/Tablet (72px), auf Mobile (64px) hoch. Ankerscrollen reserviert (96px) bzw. (88px). Die Seite scrollt normal, ohne erzwungene Bildschirmhöhen oder Scroll-Hijacking.

Das Smartphone steht gerade. Auf Tablet/Mobile ist es (300px) breit; auf Mobile maximal so breit wie der verfügbare Raum und (585px) hoch. Die Binderbühne reserviert (650px), auf Mobile (520px). Desktop zeigt eine Doppelseite, Mobile eine Seite mit neun Taschen. Geschlossene und geöffnete Binderpositionen leiten sich aus gemeinsamen Größen und Versätzen ab, damit das animierte Cover zur ausgewählten Galerieform passt. Collection-Tabs behalten je nach Layout eine feste Inhaltshöhe, damit Wechsel nachfolgende Abschnitte nicht verschieben.

## Elevation & Depth

Flächentöne und feine Linien strukturieren die Website. Schatten geben Smartphone und Binder räumliche Plausibilität. Sie machen nicht jede Inhaltsgruppe zu einer schwebenden Karte.

### Shadow Vocabulary

- **Smartphone:** `0 32px 65px -30px #000b, inset 0 0 0 1px #ffffff0b`.
- **Binder-Cover:** `9px 12px 3px -8px #0c0c0f, 0 30px 35px -18px #000a`.
- **Geöffneter Binder:** `filter: drop-shadow(0 24px 18px #0005)`.

**The Object Depth Rule.** Materialverläufe, Taschenreflexionen und Schatten erklären Binder und Karten; sie werden nicht als Seitendekoration vergrößert.

Bewegung erklärt Zustände. Gemeinsames Easing: `cubic-bezier(.22,1,.36,1)`. Hover/Druck (140ms), Sprachauswahl (160ms), Tabs und FAQ (200ms), mobiles Menü (220ms), Binder öffnen/schließen (600ms), Seitenblätter (400ms), Discovery (760ms). Scannerprofile dauern insgesamt Standard (240ms), Holo (440ms), Metallic (900ms). Der Hero erscheint einmal in (350ms)/(400ms) mit geringer Verschiebung.

Reduzierte Bewegung entfernt räumliche Effekte und lange Lichtfahrten; Zustände bleiben zugänglich. Übergänge werden außerhalb des sichtbaren Bereichs abgeschlossen und bei Profilwechsel abgebrochen. Es gibt keine dauerhaften Render-Schleifen, automatisch schwebenden Objekte oder animierten Hintergrundkulissen.

## Shapes

Kleine Bedienelemente, Buttons und größere Vorschauflächen verwenden die drei verbindlichen Grundradien aus dem Frontmatter. Karten behalten ihr reserviertes Verhältnis (733/1024) und kleine Artwork-Ecken. Smartphone und physische Binderobjekte haben ihrer Form entsprechende Ausnahmen.

Binder-Cover besitzen asymmetrische Ecken (7px 16px 16px 7px), einen schmalen Rücken und subtile Randlinien. Ein geschlossenes Cover hat das Seitenverhältnis (0.73), der geöffnete Binder (1.46). Cover-Beschriftung und Orbit skalieren relativ zur Coverbreite; die geschlossene Animationspose entspricht der ausgewählten Galerieform einschließlich Druckgröße. Taschen sind eng eingefasst und leicht reflektierend. Listen bleiben klare Zeilen mit Kartenvorschauen; sie übernehmen keine Binder-Cover oder bunten Ordnerformen.

## Components

### Buttons and fields

Primäraktionen sind einfarbig violett, mindestens (48px) hoch und nutzen die Button-Tokens. Sekundärbuttons besitzen eine feine Umrandung; Textaktionen sind leichter gewichtet und mindestens (44px) hoch. Druck verkleinert einen Button kurz auf (0.98). Icon-Buttons besitzen eine tatsächliche Fläche von (44×44px).

Fokus: sichtbare Linie im hellen Akzent (2px) mit Abstand (5px). Das E-Mail-Feld hat ein sichtbares Label, eigene Kontur und Höhe (52px). Ungültige Eingaben erhalten Kontur und erklärenden Text. Die Demo-Rückmeldung bleibt als solche formuliert.

### Navigation and tabs

Der deckende Sticky Header erhält nach dem Scrollen eine feine Trennlinie. Die mobile Navigation öffnet kompakt darunter, schließt bei Linkauswahl oder Escape und gibt den Fokus sinnvoll zurück. Die App-Navigation innerhalb des Smartphones bleibt eine visuelle Produktdarstellung.

DE und EN stehen als kompakte, fein umrandete Gruppe dauerhaft im Header. Die ausgewählte Sprache verwendet die sekundäre neutrale Fläche, hellen Text und `aria-pressed`; Fokus bleibt deutlich sichtbar. Der Schalter passt auch neben Logo und Menübutton auf Mobile. Beide Sprachen teilen alle visuellen Tokens. Englische Links behalten `?lang=en`, einschließlich der Informationsseiten; die Sprachwahl verwendet keine lokale Speicherung.

Tabs bilden eine kompakte neutrale Gruppe. Eine hellere Auswahlfläche und hellerer Text zeigen den aktiven Zustand. Home/Pokédex/Binder, Standard/Holo/Metallic und Cards/Sets/Binders/Lists steuern jeweils ihre eigene Demo. Fokus, Auswahl und zugehörige Panels werden semantisch ausgewiesen.

### Artwork, discovery and binders

Artwork erhält reservierte Abmessungen. Die Smartphone-Demo bildet bewusst Ausschnitte ab. Discovery löst eine Silhouette in das farbige Pokémon auf; gemeinsamer Zustand hält die sichtbare Sammlung konsistent.

Drei Binder-Cover zeigen gedämpfte Materialfarben. Das Cover schwenkt um seine linke Kante und behält Vorder- und Rückseite. Beim Blättern dreht sich ein einzelnes Seitenblatt mit Vorder-/Rückseite und vorübergehendem Schatten um den Rücken; die ruhende Doppelseite bleibt stabil. Die Drehrichtung folgt Vorwärts/Rückwärts. Auswahl, Öffnen, Blättern und Schließen haben klare, gegen wiederholte Eingaben geschützte Zustände. Reduzierte Bewegung ersetzt das räumliche Seitenblatt durch den resultierenden Zustand. Blättern besitzt sichtbare Buttons; Wischen ist ergänzend. Der native Karten-Dialog unterstützt Escape und Fokus-Rückgabe.

### Scan reactions, portfolio and FAQ

Scannerreaktionen starten nur nach ausdrücklicher Aktion. Standard bestätigt kurz, Holo nutzt eine begrenzte Lichtfahrt, Metallic eine längere Materialreaktion. Alle sind stilisierte Effekte auf Katalogbildern; sie behaupten keine authentische Nachbildung eines Druck-Finishs.

Portfolio verwendet eine kleine Sparkline und benannte Beispielwerte. „Werte ausblenden“ entfernt monetäre Angaben tatsächlich. FAQ-Einträge bleiben vier ruhige, durch Linien getrennte Zeilen mit echten Buttons und korrektem geöffnetem Zustand.

## Do's and Don'ts

### Do:

- **Do** preserve the user's pinned palette, copy, original Orbit mark and component character.
- **Do** let cards, Pokémon and binders supply the color on neutral surfaces.
- **Do** keep visible focus, keyboard controls, reduced-motion alternatives and explicit demo labels.
- **Do** reserve artwork and demo dimensions so state changes retain a stable page rhythm.
- **Do** keep financial information visually secondary to the collection.

### Don't:

- **Don't** add decorative fonts, large violet gradients, glow clouds, particles or unnecessary glass effects.
- **Don't** turn every section into a rounded card or add a website bottom navigation.
- **Don't** introduce floating phone groups, scroll-hijacking or permanent decorative animation.
- **Don't** present stylized lighting as authentic card finish or sample values as live product data.
- **Don't** invent launch dates, downloads, testimonials, legal information or a successful stored signup.
