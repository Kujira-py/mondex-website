import type { Locale } from './messages';
export type FeaturePath =
  '/pokemon-tcg-scanner' | '/pokemon-card-collection-tracker';

type FeatureCopy = {
  label: string;
  title: string;
  intro: string;
  demo: string;
  anchor: string;
  sections: { title: string; paragraphs: string[]; steps?: string[] }[];
};

export const featureContent: Record<FeaturePath, Record<Locale, FeatureCopy>> = {
  '/pokemon-tcg-scanner': {
    en: {
      label: 'Pokémon TCG scanner',
      title: 'A Pokémon card scanner that starts your collection story.',
      intro:
        'MonDex is a Pokémon TCG scanning and collection app launching on iPhone first, with Android in development. Its scanning workflow connects a photographed card to the things collectors care about: the right printing, a place in the collection and progress in a personal Pokédex.',
      demo: 'Try the scan effect demo',
      anchor: 'scanner',
      sections: [
        {
          title: 'From a photo to a collection entry',
          paragraphs: [
            'A Pokémon’s name alone does not identify a card. The same Pokémon can appear in many sets, with different artwork and collector numbers. Checking the suggested match before saving helps keep your collection accurate.',
          ],
          steps: [
            'Photograph one card with the whole card visible and the text in focus.',
            'Review the suggested artwork, set and collector number against your card.',
            'Confirm the printing, such as normal, Holo or Reverse Holo, and add your copy to the collection.',
          ],
        },
        {
          title: 'One card, a stack or a pack opening',
          paragraphs: [
            'The current iOS build offers Snap for one card, Auto for continuous on-device recognition, Batch for several cards and Packs for keeping an opening session together. Supported camera scans can use a previously downloaded recognition pack while offline and sync saved results later.',
            'Recognition does not automatically mark a card as owned. The captured photo, suggested card and printing remain reviewable before you confirm the entry or deliberately enable automatic adding. The website demonstrates the visual scan reaction; it does not use your camera or identify a real card.',
          ],
        },
        {
          title: 'Normal, Holo and Reverse Holo are different printings',
          paragraphs: [
            'A matching catalogue image can represent more than one printing. Glare and camera angle can also hide a foil finish, so the printing should be checked separately from the card identity. Rarity and printing are separate pieces of information.',
            'MonDex’s preview uses stylised lighting on catalogue artwork. That effect illustrates how a card can feel in the app; it is not proof of a particular physical foil pattern or an authentication result.',
          ],
        },
        {
          title: 'Get a clearer card photo',
          paragraphs: [
            'Use even light, keep the card flat and move away from direct reflections. Avoid cropping the collector number or placing several cards in one shot when using a single-card scan. If the image is blurry, a new photo is more useful than accepting an uncertain suggestion.',
            'MonDex is not available as a public download yet. The launch date and final supported devices have not been confirmed. You can explore the product demos now without uploading a photo or creating an account.',
          ],
        },
      ],
    },
    de: {
      label: 'Pokémon-TCG-Scanner',
      title: 'Pokémon-Karten scannen. Deine Sammlung beginnt hier.',
      intro:
        'MonDex entsteht als Pokémon-TCG-Scanner und Sammlungs-App, die zuerst auf dem iPhone startet; Android wird entwickelt. Der Scan verbindet eine fotografierte Karte mit dem, was beim Sammeln zählt: der richtigen Variante, einem Platz in deiner Sammlung und Fortschritt im persönlichen Pokédex.',
      demo: 'Scan-Effekt ausprobieren',
      anchor: 'scanner',
      sections: [
        {
          title: 'Vom Foto zum Sammlungseintrag',
          paragraphs: [
            'Der Name eines Pokémon reicht nicht aus, um eine Karte zu bestimmen. Dasselbe Pokémon kann in vielen Sets mit unterschiedlichen Illustrationen und Kartennummern vorkommen. Prüfe deshalb den Vorschlag vor dem Speichern.',
          ],
          steps: [
            'Fotografiere eine Karte vollständig und mit scharf lesbarem Text.',
            'Vergleiche Illustration, Set und Kartennummer des Vorschlags mit deiner Karte.',
            'Bestätige die Variante, etwa Normal, Holo oder Reverse Holo, und füge dein Exemplar zur Sammlung hinzu.',
          ],
        },
        {
          title: 'Eine Karte, einen Stapel oder ein Pack Opening erfassen',
          paragraphs: [
            'Der aktuelle iOS-Build bietet Snap für eine Karte, Auto für fortlaufende Erkennung direkt auf dem Gerät, Batch für mehrere Karten und Packs für eine zusammenhängende Opening-Session. Unterstützte Kamera-Scans können mit einem zuvor geladenen Erkennungspaket offline arbeiten und gespeicherte Ergebnisse später synchronisieren.',
            'Eine Erkennung markiert eine Karte nicht automatisch als Besitz. Foto, Kartenvorschlag und Druckvariante bleiben vor dem Bestätigen prüfbar — oder du aktivierst das automatische Hinzufügen bewusst. Die Website zeigt die visuelle Scan-Reaktion; sie verwendet keine Kamera und erkennt keine echten Karten.',
          ],
        },
        {
          title: 'Normal, Holo und Reverse Holo getrennt prüfen',
          paragraphs: [
            'Ein passendes Katalogbild kann für mehrere Druckvarianten stehen. Auch Lichtreflexionen und der Kamerawinkel können eine Folie verdecken. Prüfe die Variante deshalb getrennt von der Kartenidentität. Seltenheit und Druckvariante sind unterschiedliche Angaben.',
            'Die MonDex-Vorschau verwendet stilisierte Lichteffekte auf Katalogbildern. Sie veranschaulicht die Darstellung in der App und bestätigt weder ein bestimmtes Folienmuster noch die Echtheit einer Karte.',
          ],
        },
        {
          title: 'So wird dein Kartenfoto klarer',
          paragraphs: [
            'Achte auf gleichmäßiges Licht, eine flach liegende Karte und möglichst wenige direkte Spiegelungen. Schneide die Kartennummer nicht ab und fotografiere im Einzelscan nur eine Karte. Bei Unschärfe ist ein neues Foto hilfreicher als ein unsicherer Treffer.',
            'MonDex ist noch nicht öffentlich zum Download verfügbar. Ein Launch-Termin und die endgültig unterstützten Geräte stehen noch nicht fest. Die Produktdemos kannst du bereits ohne Foto-Upload und ohne Konto ausprobieren.',
          ],
        },
      ],
    },
  },
  '/pokemon-card-collection-tracker': {
    en: {
      label: 'Pokémon collection tracker',
      title: 'Know what you own. Find what you’re missing.',
      intro:
        'A Pokémon card collection tracker brings cards, printings and collecting goals together. MonDex is being developed to connect that overview with a personal Pokédex, set progress and lists for the cards you want next.',
      demo: 'Explore the collection demo',
      anchor: 'sammlung',
      sections: [
        {
          title: 'A Pokémon, a card and a copy are different',
          paragraphs: [
            'Discovering Bulbasaur in your personal Pokédex is a species milestone. Owning two different Bulbasaur cards is a card-level detail. Having three copies of one printing is another. Keeping those counts separate makes collection progress easier to understand.',
            'The website’s collection and Pokédex previews use illustrative progress and example cards. These are not a real user’s collection or usage statistics.',
          ],
        },
        {
          title: 'Keep printings and duplicates clear',
          paragraphs: [
            'Normal, Holo and Reverse Holo copies can share a card name, artwork and set number. A collection record should still distinguish the printing you actually own. Language and condition belong to the individual copy too.',
            'Grouping copies is useful for a quick overview. Separating variants helps when you want to see whether a specific printing is missing. A card’s rarity label alone does not tell you which finish your copy has.',
          ],
        },
        {
          title: 'Choose the view for the task',
          paragraphs: [
            'The MonDex collection preview has three views, each with a different purpose.',
          ],
          steps: [
            'Cards: browse the artwork and inspect a card more closely.',
            'Sets: see how cards belong to an expansion and where collecting gaps remain.',
            'Lists: keep a wishlist, trading plans or cards to consider for grading together.',
          ],
        },
        {
          title: 'Use value as context for the collection',
          paragraphs: [
            'The portfolio preview adds a value overview that can be hidden. The website’s amounts and chart are illustrative; they are not current market prices. The right printing and condition matter before any real collection value can be meaningfully compared.',
            'MonDex is in development, and importing an existing collection has not been confirmed for launch. The website does not store personal cards or accounts. Explore the demo to see the intended workflow before deciding how you would organise your own collection.',
          ],
        },
      ],
    },
    de: {
      label: 'Pokémon-Sammlungstracker',
      title: 'Wissen, was du hast. Entdecken, was noch fehlt.',
      intro:
        'Ein Pokémon-Sammlungstracker verbindet Karten, Druckvarianten und Sammelziele. MonDex entsteht, um diesen Überblick mit einem persönlichen Pokédex, Set-Fortschritt und Listen für deine nächsten Wunschkarten zusammenzubringen.',
      demo: 'Sammlungs-Demo entdecken',
      anchor: 'sammlung',
      sections: [
        {
          title: 'Pokémon, Karte und Exemplar unterscheiden',
          paragraphs: [
            'Bisasam im persönlichen Pokédex zu entdecken ist ein Meilenstein für eine Pokémon-Art. Zwei verschiedene Bisasam-Karten zu besitzen ist eine Angabe zu deinen Karten. Drei Exemplare derselben Variante sind wiederum eine Stückzahl. Getrennte Angaben machen den Fortschritt verständlicher.',
            'Die Sammlungs- und Pokédex-Vorschau zeigen beispielhafte Fortschritte und Karten. Das sind keine echten Nutzer- oder Sammlungszahlen.',
          ],
        },
        {
          title: 'Varianten und doppelte Karten im Blick behalten',
          paragraphs: [
            'Normal, Holo und Reverse Holo können denselben Namen, dieselbe Illustration und dieselbe Set-Nummer haben. Ein Sammlungseintrag sollte trotzdem festhalten, welche Variante du tatsächlich besitzt. Sprache und Zustand gehören ebenfalls zum einzelnen Exemplar.',
            'Gruppierte Exemplare geben einen schnellen Überblick. Getrennte Varianten helfen bei der Frage, ob eine bestimmte Druckversion noch fehlt. Die Seltenheitsangabe einer Karte beschreibt allein noch nicht das Finish deines Exemplars.',
          ],
        },
        {
          title: 'Die passende Ansicht für dein Vorhaben',
          paragraphs: [
            'Die MonDex-Sammlungsvorschau bietet drei Ansichten mit unterschiedlichen Aufgaben.',
          ],
          steps: [
            'Cards: Illustrationen durchsehen und eine Karte genauer anschauen.',
            'Sets: Karten einer Erweiterung zuordnen und Sammellücken erkennen.',
            'Lists: Wunschkarten, Tauschpläne oder Karten für ein mögliches Grading zusammenhalten.',
          ],
        },
        {
          title: 'Den Wert als ergänzende Perspektive nutzen',
          paragraphs: [
            'Die Portfolio-Vorschau ergänzt eine ausblendbare Wertübersicht. Beträge und Diagramm auf der Website sind Beispiele, keine aktuellen Marktpreise. Vor einem sinnvollen Vergleich echter Sammlungswerte müssen die Druckvariante und der Zustand stimmen.',
            'MonDex ist in Entwicklung. Ein Import bestehender Sammlungen ist für den Launch noch nicht bestätigt. Die Website speichert keine persönlichen Karten oder Konten. Probiere die Demo aus und entdecke, wie du deine eigene Sammlung später organisieren würdest.',
          ],
        },
      ],
    },
  },
};
