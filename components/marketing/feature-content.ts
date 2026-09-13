import type { Locale } from "./locale";
import type { FeaturePath } from "./seo";

type FeatureCopy = {
  label: string;
  title: string;
  intro: string;
  demo: string;
  anchor: string;
  sections: { title: string; paragraphs: string[]; steps?: string[] }[];
};

export const featureContent: Record<FeaturePath, Record<Locale, FeatureCopy>> = {
  "/pokemon-tcg-scanner": {
    en: {
      label: "Pokémon TCG scanner",
      title: "A Pokémon card scanner that starts your collection story.",
      intro: "MonDex is a Pokémon TCG scanning and collection app in development for iPhone and Android. Its scanning workflow connects a photographed card to the things collectors care about: the right printing, a place in the collection and progress in a personal Pokédex.",
      demo: "Try the scan effect demo", anchor: "scannen",
      sections: [
        { title: "From a photo to a collection entry", paragraphs: ["A Pokémon’s name alone does not identify a card. The same Pokémon can appear in many sets, with different artwork and collector numbers. Checking the suggested match before saving helps keep your collection accurate."], steps: ["Photograph one card with the whole card visible and the text in focus.", "Review the suggested artwork, set and collector number against your card.", "Confirm the printing, such as normal, Holo or Reverse Holo, and add your copy to the collection."] },
        { title: "Single scans or a stack of cards", paragraphs: ["The app’s Single mode is for checking one card at a time. Batch scanning is designed for a stack: capture multiple cards and review the results together. Opening mode keeps the cards from a pack-opening session together.", "A useful review step should show the captured photo alongside the suggested card. That makes it easier to catch a wrong match before it becomes a collection entry. The website demonstrates the visual scan reaction; it does not use your camera or identify a real card."] },
        { title: "Normal, Holo and Reverse Holo are different printings", paragraphs: ["A matching catalogue image can represent more than one printing. Glare and camera angle can also hide a foil finish, so the printing should be checked separately from the card identity. Rarity and printing are separate pieces of information.", "MonDex’s preview uses stylised lighting on catalogue artwork. That effect illustrates how a card can feel in the app; it is not proof of a particular physical foil pattern or an authentication result."] },
        { title: "Get a clearer card photo", paragraphs: ["Use even light, keep the card flat and move away from direct reflections. Avoid cropping the collector number or placing several cards in one shot when using a single-card scan. If the image is blurry, a new photo is more useful than accepting an uncertain suggestion.", "MonDex is not available as a public download yet. The launch date and final supported devices have not been confirmed. You can explore the product demos now without uploading a photo or creating an account."] },
      ],
    },
    de: {
      label: "Pokémon-TCG-Scanner",
      title: "Pokémon-Karten scannen. Deine Sammlung beginnt hier.",
      intro: "MonDex entsteht als Pokémon-TCG-Scanner und Sammlungs-App für iPhone und Android. Der Scan verbindet eine fotografierte Karte mit dem, was beim Sammeln zählt: der richtigen Variante, einem Platz in deiner Sammlung und Fortschritt im persönlichen Pokédex.",
      demo: "Scan-Effekt ausprobieren", anchor: "scannen",
      sections: [
        { title: "Vom Foto zum Sammlungseintrag", paragraphs: ["Der Name eines Pokémon reicht nicht aus, um eine Karte zu bestimmen. Dasselbe Pokémon kann in vielen Sets mit unterschiedlichen Illustrationen und Kartennummern vorkommen. Prüfe deshalb den Vorschlag vor dem Speichern."], steps: ["Fotografiere eine Karte vollständig und mit scharf lesbarem Text.", "Vergleiche Illustration, Set und Kartennummer des Vorschlags mit deiner Karte.", "Bestätige die Variante, etwa Normal, Holo oder Reverse Holo, und füge dein Exemplar zur Sammlung hinzu."] },
        { title: "Eine Karte oder einen ganzen Stapel erfassen", paragraphs: ["Der Single-Modus der App ist für einzelne Karten gedacht. Beim Batch-Scan fotografierst du mehrere Karten nacheinander und prüfst die Ergebnisse gemeinsam. Der Opening-Modus hält die Karten einer Pack-Opening-Session zusammen.", "Ein hilfreicher Prüfschritt zeigt das aufgenommene Foto neben dem Kartenvorschlag. So lässt sich eine falsche Zuordnung vor dem Speichern erkennen. Die Website zeigt die visuelle Scan-Reaktion; sie verwendet keine Kamera und erkennt keine echten Karten."] },
        { title: "Normal, Holo und Reverse Holo getrennt prüfen", paragraphs: ["Ein passendes Katalogbild kann für mehrere Druckvarianten stehen. Auch Lichtreflexionen und der Kamerawinkel können eine Folie verdecken. Prüfe die Variante deshalb getrennt von der Kartenidentität. Seltenheit und Druckvariante sind unterschiedliche Angaben.", "Die MonDex-Vorschau verwendet stilisierte Lichteffekte auf Katalogbildern. Sie veranschaulicht die Darstellung in der App und bestätigt weder ein bestimmtes Folienmuster noch die Echtheit einer Karte."] },
        { title: "So wird dein Kartenfoto klarer", paragraphs: ["Achte auf gleichmäßiges Licht, eine flach liegende Karte und möglichst wenige direkte Spiegelungen. Schneide die Kartennummer nicht ab und fotografiere im Einzelscan nur eine Karte. Bei Unschärfe ist ein neues Foto hilfreicher als ein unsicherer Treffer.", "MonDex ist noch nicht öffentlich zum Download verfügbar. Ein Launch-Termin und die endgültig unterstützten Geräte stehen noch nicht fest. Die Produktdemos kannst du bereits ohne Foto-Upload und ohne Konto ausprobieren."] },
      ],
    },
  },
  "/digital-pokemon-card-binder": {
    en: {
      label: "Digital Pokémon binders", title: "A digital binder for the Pokémon cards you want to keep close.",
      intro: "A digital Pokémon card binder gives your collection a layout of its own. MonDex’s binder experience is built around choosing a cover, arranging cards in pockets and turning pages to enjoy the collection as an album.",
      demo: "Open the binder demo", anchor: "binder",
      sections: [
        { title: "An album with a purpose", paragraphs: ["Start with a reason for the binder. A favourites album can put your most-loved illustrations together. A Kanto binder can follow Pokédex order. A set album can make the empty spaces part of a collecting goal.", "These are different ways to look at a collection. A binder is its presentation; the collection entry records which card and printing you own. Keeping those roles separate helps you rearrange an album without losing track of your copies."] },
        { title: "Try the binder before the app launches", paragraphs: ["The website has three example covers: Signature, Kanto and Favorites. Select one, open it and use the page controls to browse. Select a card to see its artwork more closely, then close the viewer to return to the binder.", "On a wider screen the demo opens as a two-page spread. On a phone it shows a single page with nine pockets. The cards remain flat while the page turns. All cards and positions in this preview are example data."] },
        { title: "Build a layout around how you collect", paragraphs: ["A small rule can make a binder easier to maintain. Put an evolution line together, leave a space for a missing card or group illustrations from one set. A dedicated Holo or Reverse Holo album can also make sense when printings are part of your collecting goal."], steps: ["Choose a theme, such as favourites, a region or one expansion.", "Decide whether the order follows Pokédex numbers, set numbers or your own visual arrangement.", "Use a wishlist for the missing cards you want to look for next."] },
        { title: "A digital album alongside your physical one", paragraphs: ["A digital binder helps you browse and plan. It does not replace the sleeves or storage you use for physical cards, and the on-screen foil effect is only a simulation.", "MonDex is in development for iPhone and Android. The interactive website is a product preview, not a place to save your own binder yet. You can try the opening, page-turning and card-viewing interactions without signing in."] },
      ],
    },
    de: {
      label: "Digitale Pokémon-Binder", title: "Ein digitaler Binder für Karten, die dir etwas bedeuten.",
      intro: "Ein digitaler Pokémon-Karten-Binder gibt deiner Sammlung eine eigene Anordnung. Bei MonDex wählst du ein Cover, ordnest Karten in Taschen an und blätterst durch die Sammlung wie durch ein Album.",
      demo: "Binder-Demo öffnen", anchor: "binder",
      sections: [
        { title: "Ein Album mit einem Ziel", paragraphs: ["Beginne mit einer Idee für den Binder. Ein Favoriten-Album vereint deine liebsten Illustrationen. Ein Kanto-Binder kann dem Pokédex folgen. Ein Set-Album macht freie Plätze zu einem sichtbaren Sammelziel.", "Das sind verschiedene Ansichten deiner Sammlung. Der Binder gestaltet die Präsentation; der Sammlungseintrag hält fest, welche Karte und Variante du besitzt. Diese Trennung hilft, beim Umordnen den Überblick über deine Exemplare zu behalten."] },
        { title: "Den Binder vor dem App-Launch ausprobieren", paragraphs: ["Die Website zeigt drei Beispielcover: Signature, Kanto und Favorites. Wähle eines aus, öffne es und blättere mit den Seiten-Steuerelementen. Eine ausgewählte Karte lässt sich größer ansehen. Nach dem Schließen bist du wieder im Binder.", "Auf größeren Bildschirmen öffnet sich die Demo als Doppelseite, auf dem Handy als einzelne Seite mit neun Taschen. Die Karten bleiben beim Umblättern flach. Alle Karten und Positionen dieser Vorschau sind Beispieldaten."] },
        { title: "So ordnen, wie du sammelst", paragraphs: ["Eine einfache Regel erleichtert die Pflege des Albums: Entwicklungsreihen zusammenstellen, Plätze für fehlende Karten freilassen oder Illustrationen eines Sets gruppieren. Auch ein Holo- oder Reverse-Holo-Album kann sinnvoll sein, wenn Druckvarianten zu deinem Sammelziel gehören."], steps: ["Wähle ein Thema, etwa Favoriten, eine Region oder eine Erweiterung.", "Entscheide dich für Pokédex-Nummern, Set-Nummern oder eine eigene Bildanordnung.", "Halte die fehlenden Karten für deine nächste Suche in einer Wunschliste fest."] },
        { title: "Ein digitales Album neben deinem echten", paragraphs: ["Ein digitaler Binder unterstützt dich beim Anschauen und Planen. Er ersetzt keine Schutzhüllen oder die Aufbewahrung echter Karten. Der Folieneffekt auf dem Bildschirm ist eine Simulation.", "MonDex wird für iPhone und Android entwickelt. Die Website ist eine Produktvorschau, in der sich noch kein eigener Binder dauerhaft speichern lässt. Öffnen, Umblättern und Kartenansicht kannst du ohne Anmeldung ausprobieren."] },
      ],
    },
  },
  "/pokemon-card-collection-tracker": {
    en: {
      label: "Pokémon collection tracker", title: "Know what you own. Find what you’re missing.",
      intro: "A Pokémon card collection tracker brings cards, printings and collecting goals together. MonDex is being developed to connect that overview with a personal Pokédex, digital binders and lists for the cards you want next.",
      demo: "Explore the collection demo", anchor: "sammlung",
      sections: [
        { title: "A Pokémon, a card and a copy are different", paragraphs: ["Discovering Bulbasaur in your personal Pokédex is a species milestone. Owning two different Bulbasaur cards is a card-level detail. Having three copies of one printing is another. Keeping those counts separate makes collection progress easier to understand.", "In the MonDex website demo, discovering Mew updates the card count, discovered Pokémon count and Kanto progress together. The numbers are linked example data; they are not a real user’s collection or usage statistics."] },
        { title: "Keep printings and duplicates clear", paragraphs: ["Normal, Holo and Reverse Holo copies can share a card name, artwork and set number. A collection record should still distinguish the printing you actually own. Language and condition belong to the individual copy too.", "Grouping copies is useful for a quick overview. Separating variants helps when you want to see whether a specific printing is missing. A card’s rarity label alone does not tell you which finish your copy has."] },
        { title: "Choose the view for the task", paragraphs: ["The MonDex collection preview has four views, each with a different purpose."], steps: ["Cards: browse the artwork and inspect a card more closely.", "Sets: see how cards belong to an expansion and where collecting gaps remain.", "Binders: browse a deliberately arranged album.", "Lists: keep a wishlist, trading plans or cards to consider for grading together."] },
        { title: "Use value as context for the collection", paragraphs: ["The portfolio preview adds a value overview that can be hidden. The website’s amounts and chart are illustrative; they are not current market prices. The right printing and condition matter before any real collection value can be meaningfully compared.", "MonDex is in development, and importing an existing collection has not been confirmed for launch. The website does not store personal cards or accounts. Explore the demo to see the intended workflow before deciding how you would organise your own collection."] },
      ],
    },
    de: {
      label: "Pokémon-Sammlungstracker", title: "Wissen, was du hast. Entdecken, was noch fehlt.",
      intro: "Ein Pokémon-Sammlungstracker verbindet Karten, Druckvarianten und Sammelziele. MonDex entsteht, um diesen Überblick mit einem persönlichen Pokédex, digitalen Bindern und Listen für deine nächsten Wunschkarten zusammenzubringen.",
      demo: "Sammlungs-Demo entdecken", anchor: "sammlung",
      sections: [
        { title: "Pokémon, Karte und Exemplar unterscheiden", paragraphs: ["Bisasam im persönlichen Pokédex zu entdecken ist ein Meilenstein für eine Pokémon-Art. Zwei verschiedene Bisasam-Karten zu besitzen ist eine Angabe zu deinen Karten. Drei Exemplare derselben Variante sind wiederum eine Stückzahl. Getrennte Angaben machen den Fortschritt verständlicher.", "In der Website-Demo erhöht die Entdeckung von Mew gemeinsam die Kartenanzahl, die Zahl entdeckter Pokémon und den Kanto-Fortschritt. Das sind verknüpfte Beispieldaten und keine echten Nutzer- oder Sammlungszahlen."] },
        { title: "Varianten und doppelte Karten im Blick behalten", paragraphs: ["Normal, Holo und Reverse Holo können denselben Namen, dieselbe Illustration und dieselbe Set-Nummer haben. Ein Sammlungseintrag sollte trotzdem festhalten, welche Variante du tatsächlich besitzt. Sprache und Zustand gehören ebenfalls zum einzelnen Exemplar.", "Gruppierte Exemplare geben einen schnellen Überblick. Getrennte Varianten helfen bei der Frage, ob eine bestimmte Druckversion noch fehlt. Die Seltenheitsangabe einer Karte beschreibt allein noch nicht das Finish deines Exemplars."] },
        { title: "Die passende Ansicht für dein Vorhaben", paragraphs: ["Die MonDex-Sammlungsvorschau bietet vier Ansichten mit unterschiedlichen Aufgaben."], steps: ["Cards: Illustrationen durchsehen und eine Karte genauer anschauen.", "Sets: Karten einer Erweiterung zuordnen und Sammellücken erkennen.", "Binders: ein bewusst angeordnetes Album durchblättern.", "Lists: Wunschkarten, Tauschpläne oder Karten für ein mögliches Grading zusammenhalten."] },
        { title: "Den Wert als ergänzende Perspektive nutzen", paragraphs: ["Die Portfolio-Vorschau ergänzt eine ausblendbare Wertübersicht. Beträge und Diagramm auf der Website sind Beispiele, keine aktuellen Marktpreise. Vor einem sinnvollen Vergleich echter Sammlungswerte müssen die Druckvariante und der Zustand stimmen.", "MonDex ist in Entwicklung. Ein Import bestehender Sammlungen ist für den Launch noch nicht bestätigt. Die Website speichert keine persönlichen Karten oder Konten. Probiere die Demo aus und entdecke, wie du deine eigene Sammlung später organisieren würdest."] },
      ],
    },
  },
};
