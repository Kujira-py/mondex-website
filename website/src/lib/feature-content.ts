// The guide pages: one per search topic, each in English and German at its
// own URL (lib/guides.ts). Written for people searching for these things, so
// every claim must stay true to the app: no superlatives we cannot prove, no
// competitor names, prices as the home page states them.
import type { GuideId, Locale } from './guides';

type FeatureCopy = {
  /** <title> (about 60 characters) and meta description (about 155). */
  meta: { title: string; description: string };
  /** Breadcrumb and link name. */
  label: string;
  /** The page's h1. */
  title: string;
  intro: string;
  demo: string;
  /** The home page section the demo button opens. */
  anchor: string;
  sections: { title: string; paragraphs: string[]; steps?: string[] }[];
  faq: [string, string][];
};

export const featureContent: Record<GuideId, Record<Locale, FeatureCopy>> = {
  scanner: {
    en: {
      meta: {
        title: 'Pokémon Card Scanner App: Scan Cards & See Value | MonDex',
        description:
          'Scan Pokémon cards with your iPhone. MonDex recognises English and Japanese cards in about 0.3 seconds, even offline, with TCGplayer, eBay and Cardmarket prices.',
      },
      label: 'Pokémon card scanner',
      title: 'Pokémon card scanner: hold up a card, see what it is and what it’s worth.',
      intro:
        'MonDex is a Pokémon card scanner app for iPhone, with Android to follow. Hold a card in front of the camera and MonDex recognises it in about 0.3 seconds, English or Japanese. It finds the right set and printing, shows today’s prices and adds the Pokémon to your Pokédex.',
      demo: 'See the scanner',
      anchor: 'scanner',
      sections: [
        {
          title: 'How scanning a Pokémon card works',
          paragraphs: [
            'MonDex looks at the card’s artwork, not its text, so it recognises a card whatever language it is printed in. Where artwork alone is not enough, it reads the collector number at the bottom of the card. A green outline tells you the card is recognised.',
          ],
          steps: [
            'Open the scanner and choose Auto.',
            'Hold your Pokémon card in front of the camera. There is nothing to press.',
            'MonDex shows the card, its set, number and price as soon as it is sure.',
            'Pick the printing if the card exists in several (for example Holo or Reverse Holo), then add it to your collection.',
          ],
        },
        {
          title: 'One card or a whole stack: Auto and Batch',
          paragraphs: [
            'Auto recognises card after card while you hold them up, without pressing anything, which suits sorting a pile or scanning a binder page by page. Batch takes up to 100 cards in one session and lets you check each one before anything is saved.',
            'Opening packs? Scan the pulls in either mode, mark them as a pack opening and enter what the pack cost. MonDex then shows what you paid next to what came out.',
          ],
        },
        {
          title: 'English and Japanese Pokémon cards',
          paragraphs: [
            'MonDex knows more than 200 English sets, from the 1999 Base Set to the newest release, and more than 440 Japanese sets, each with its own Japanese cards and prices. When a Japanese card and its English printing share the same artwork, MonDex reads the printed text to tell them apart.',
            'A card printed in another language, such as German or French, is recognised by its artwork and saved with your copy’s language.',
          ],
        },
        {
          title: 'What is my Pokémon card worth?',
          paragraphs: [
            'Every scanned card shows its market value: the TCGplayer market price, the last eBay sale of a raw copy and of a PSA 10, and the Cardmarket price trend in euros. Prices are updated daily and shown in your currency: US dollars, euros, pounds, Canadian or Australian dollars, or yen.',
            'Set a price alert on any card and MonDex sends a notification when it rises above or falls below your target. If you would rather not see prices at all, one switch hides them everywhere.',
          ],
        },
        {
          title: 'Scanning without an internet connection',
          paragraphs: [
            'At a card show or in a basement with no signal, MonDex still scans. It downloads an offline pack while you are online, recognises cards on the phone itself and syncs them to your collection when you are back online.',
          ],
        },
        {
          title: 'Holo, Reverse Holo and special printings',
          paragraphs: [
            'Normal, Holo and Reverse Holo copies of a card share the same artwork, so a photo cannot always tell them apart. MonDex asks when it matters, and one choice can apply to every other copy of that card in the session. Special printings with a visible pattern, such as Poké Ball and Master Ball reverse holos, are recognised from the photo when you are online and the pattern clearly shows.',
          ],
        },
        {
          title: 'Tips for a clean scan',
          paragraphs: [
            'Use even light and tilt the card slightly away from bright reflections. Keep the whole card in view, with the bottom edge and its collector number visible. A plain table works better than a busy surface in the same colour as the card’s border.',
          ],
        },
      ],
      faq: [
        [
          'Is the MonDex card scanner free?',
          'MonDex is free to download, and collecting is free. Scanning is included in a free Welcome Week of MonDex Plus; after that it is part of MonDex Plus, $3.99 a month or $29.99 a year.',
        ],
        [
          'How fast does it recognise a card?',
          'Typically in about 0.3 seconds from the moment the card is in view.',
        ],
        [
          'Can it scan Japanese Pokémon cards?',
          'Yes. MonDex recognises Japanese cards and keeps them in their own Japanese sets, with their own prices.',
        ],
        [
          'Does the scanner work offline?',
          'Yes. Download the offline pack while you are online; scans made without a connection sync later.',
        ],
        [
          'Does the scanner grade my card’s condition?',
          'No. You set a copy’s condition yourself. For graded cards you can record the grading company, grade and certificate number.',
        ],
        ['Which phones does it run on?', 'MonDex is coming to iPhone first. Android follows soon.'],
      ],
    },
    de: {
      meta: {
        title: 'Pokémon Karten Scanner App: Wert sofort sehen | MonDex',
        description:
          'Pokémon-Karten mit dem iPhone scannen: MonDex erkennt englische und japanische Karten in rund 0,3 Sekunden, auch offline, mit Cardmarket-, TCGplayer- und eBay-Preisen.',
      },
      label: 'Pokémon-Karten-Scanner',
      title:
        'Pokémon-Karten scannen: Karte vors Handy halten, sehen, was sie ist und was sie wert ist.',
      intro:
        'MonDex ist eine Scanner-App für Pokémon-Karten, zuerst fürs iPhone, Android folgt. Halte eine Karte vor die Kamera und MonDex erkennt sie in rund 0,3 Sekunden, ob englisch oder japanisch. Die App findet Set und Druckvariante, zeigt den aktuellen Wert und trägt das Pokémon in deinen Pokédex ein.',
      demo: 'Den Scanner ansehen',
      anchor: 'scanner',
      sections: [
        {
          title: 'So funktioniert das Scannen einer Pokémon-Karte',
          paragraphs: [
            'MonDex erkennt die Karte an ihrer Illustration, nicht am Text. Deshalb klappt es in jeder Sprache, auch mit deutschen Karten. Reicht die Illustration nicht aus, liest MonDex die Kartennummer unten auf der Karte. Ein grüner Rahmen zeigt: Die Karte ist erkannt.',
          ],
          steps: [
            'Öffne den Scanner und wähle Auto.',
            'Halte deine Pokémon-Karte vor die Kamera. Du musst nichts drücken.',
            'MonDex zeigt Karte, Set, Nummer und Preis, sobald die Erkennung sicher ist.',
            'Wähle die Druckvariante, falls es mehrere gibt (etwa Holo oder Reverse Holo), und füge die Karte deiner Sammlung hinzu.',
          ],
        },
        {
          title: 'Eine Karte oder ein ganzer Stapel: Auto und Stapel',
          paragraphs: [
            'Auto erkennt Karte für Karte, während du sie vor die Kamera hältst, ganz ohne Knopfdruck. Ideal, um einen Stapel zu sortieren oder einen Ordner Seite für Seite zu erfassen. Im Stapel-Modus scannst du bis zu 100 Karten am Stück und prüfst jede, bevor etwas gespeichert wird.',
            'Booster geöffnet? Scanne die Pulls in einem der beiden Modi, markiere sie als Pack-Opening und trag den Packpreis ein. MonDex zeigt dir dann, was du bezahlt hast und was herausgekommen ist.',
          ],
        },
        {
          title: 'Englische, japanische und deutsche Karten',
          paragraphs: [
            'MonDex kennt über 200 englische Sets, vom Grundset 1999 bis zur neuesten Erweiterung, und über 440 japanische Sets mit eigenen japanischen Karten und Preisen. Haben eine japanische Karte und ihre englische Ausgabe dieselbe Illustration, liest MonDex den Kartentext, um sie zu unterscheiden.',
            'Deutsche Karten werden an ihrer Illustration erkannt und mit der Sprache deines Exemplars gespeichert. Kartennamen zeigt die App auf Deutsch, wo es einen deutschen Namen gibt, also Glurak-ex statt Charizard ex.',
          ],
        },
        {
          title: 'Was ist meine Pokémon-Karte wert?',
          paragraphs: [
            'Zu jeder gescannten Karte siehst du ihren Wert: den Cardmarket-Preistrend in Euro, den TCGplayer-Marktpreis und den letzten eBay-Verkauf, ungegradet und als PSA 10. Die Preise werden täglich aktualisiert und in deiner Währung angezeigt, etwa Euro, Dollar, Pfund oder Yen.',
            'Mit einem Preisalarm meldet sich MonDex, sobald eine Karte über oder unter deinen Zielpreis fällt. Wer lieber gar keine Preise sehen will, blendet sie mit einem Schalter überall aus.',
          ],
        },
        {
          title: 'Scannen ohne Internet',
          paragraphs: [
            'Auf der Börse oder im Keller ohne Empfang scannt MonDex trotzdem. Die App lädt ein Offline-Paket, solange du online bist, erkennt Karten direkt auf dem Handy und gleicht sie mit deiner Sammlung ab, sobald du wieder online bist.',
          ],
        },
        {
          title: 'Holo, Reverse Holo und Sonderdrucke',
          paragraphs: [
            'Normal, Holo und Reverse Holo teilen sich dieselbe Illustration, deshalb kann ein Foto sie nicht immer unterscheiden. MonDex fragt nach, wenn es darauf ankommt, und eine Wahl kann für alle weiteren Exemplare dieser Karte in der Sitzung gelten. Sonderdrucke mit sichtbarem Muster, etwa Poké-Ball- und Master-Ball-Reverse-Holos, erkennt MonDex am Foto, wenn du online bist und das Muster deutlich zu sehen ist.',
          ],
        },
        {
          title: 'Tipps für einen sauberen Scan',
          paragraphs: [
            'Sorge für gleichmäßiges Licht und neige die Karte leicht, wenn sie spiegelt. Halte die ganze Karte ins Bild, auch den unteren Rand mit der Kartennummer. Ein ruhiger Tisch funktioniert besser als ein unruhiger Untergrund in der Farbe des Kartenrands.',
          ],
        },
      ],
      faq: [
        [
          'Ist der Pokémon-Karten-Scanner kostenlos?',
          'MonDex lädst du kostenlos, und Sammeln ist kostenlos. Scannen ist in einer kostenlosen Willkommenswoche von MonDex Plus enthalten, danach gehört es zu MonDex Plus: 3,99 € im Monat oder 29,99 € im Jahr.',
        ],
        [
          'Wie schnell erkennt MonDex eine Karte?',
          'Typischerweise in rund 0,3 Sekunden, ab dem Moment, in dem die Karte im Bild ist.',
        ],
        [
          'Kann ich deutsche Pokémon-Karten scannen?',
          'Ja. MonDex erkennt Karten an der Illustration, die Sprache spielt keine Rolle. Gespeichert wird dein Exemplar mit seiner Sprache; das Kartenbild in der App zeigt die englische Ausgabe.',
        ],
        [
          'Erkennt der Scanner japanische Karten?',
          'Ja. Japanische Karten stehen in eigenen japanischen Sets, mit eigenen Preisen.',
        ],
        [
          'Funktioniert der Scanner offline?',
          'Ja. Lade das Offline-Paket, solange du online bist; Scans ohne Verbindung werden später abgeglichen.',
        ],
        [
          'Bewertet der Scanner den Zustand meiner Karte?',
          'Nein. Den Zustand legst du selbst fest. Für gegradete Karten kannst du Grading-Firma, Note und Zertifikatsnummer eintragen.',
        ],
      ],
    },
  },
  value: {
    en: {
      meta: {
        title: 'Pokémon Card Value: What Are My Cards Worth? | MonDex',
        description:
          'How to find out what a Pokémon card is worth: the exact card and printing, its condition, grading and language, and why TCGplayer, eBay and Cardmarket prices differ.',
      },
      label: 'Pokémon card value',
      title: 'What is my Pokémon card worth? How to find a card’s real value.',
      intro:
        'A Pokémon card’s value depends on far more than its name. The same Pokémon can be worth a few cents or hundreds of dollars depending on the set, the printing, its condition and whether it is graded. This guide explains what decides the price, and how MonDex shows it the moment you scan a card.',
      demo: 'See the prices',
      anchor: 'preise',
      sections: [
        {
          title: 'Find the exact card first',
          paragraphs: [
            'Look at the bottom of the card: the collector number (for example 4/102) and the set symbol identify it. The same Pokémon appears in dozens of sets with different artwork, rarity and prices, so the name alone is never enough, and reprints with the same artwork can be priced differently too.',
            'MonDex’s scanner does this for you: it recognises the artwork, reads the collector number where needed and shows the set, number and rarity.',
          ],
        },
        {
          title: 'Printing: Normal, Holo, Reverse Holo and 1st Edition',
          paragraphs: [
            'One card can exist in several printings, each with its own price. A Holo has a shiny artwork; a Reverse Holo shines everywhere except the artwork. Older sets have 1st Edition copies with a small stamp, which can be worth many times the Unlimited copy. Special printings, such as Poké Ball and Master Ball pattern reverse holos, have prices of their own as well.',
          ],
        },
        {
          title: 'Condition',
          paragraphs: [
            'Prices you see online usually refer to near mint copies: clean edges, sharp corners, no scratches or creases. Whitening on the edges, scratches or a bend can lower a card’s value considerably. MonDex shows near mint market prices, so for a played copy, expect less.',
          ],
        },
        {
          title: 'Graded cards and PSA 10',
          paragraphs: [
            'A graded card is sealed in a case with a grade from a grading company such as PSA, CGC or Beckett. A PSA 10, the top grade, can sell for several times the price of an ungraded copy. That is why MonDex shows the last eBay sale of a PSA 10 next to the last sale of a raw copy.',
          ],
        },
        {
          title: 'Language: English, Japanese and others',
          paragraphs: [
            'English and Japanese cards have the largest markets and prices of their own. MonDex keeps Japanese cards in their own Japanese sets, with Japanese prices. Copies in other languages, such as German or French, often trade for less than English ones; MonDex shows the English price for them as an estimate.',
          ],
        },
        {
          title: 'Why TCGplayer, eBay and Cardmarket prices differ',
          paragraphs: [
            'TCGplayer’s market price follows recent sales in the US, in dollars. Cardmarket is the main marketplace in Europe; its price trend is in euros and follows European sales. eBay shows what single copies actually sold for, graded ones included. A listing is an asking price, not a value: what a card sold for tells you more than what someone asks.',
            'MonDex shows all three side by side and converts them into your currency.',
          ],
        },
        {
          title: 'Check your cards with MonDex',
          paragraphs: [
            'Scan a card and MonDex shows its TCGplayer market price, its last eBay sales raw and as PSA 10, and its Cardmarket trend in euros. Add it to your collection and the app keeps your total up to date every day. A price alert tells you when a card reaches your target.',
          ],
        },
      ],
      faq: [
        [
          'How do I find out what my Pokémon card is worth?',
          'Identify the exact card by its set and collector number, check its printing and condition, then compare recent sold prices. MonDex scans the card and shows its TCGplayer, eBay and Cardmarket prices in one step; the condition you judge yourself.',
        ],
        [
          'Why is a PSA 10 worth so much more?',
          'A PSA 10 is a card PSA graded gem mint, its highest grade. Few copies reach it, so collectors pay a premium.',
        ],
        [
          'Are non-English Pokémon cards worth less?',
          'Often, yes: English and Japanese cards have the largest markets. There are exceptions, especially among rare older cards.',
        ],
        ['How often does MonDex update prices?', 'Every day.'],
        [
          'Does MonDex adjust the price for condition?',
          'No. MonDex shows near mint market prices. For played copies the real value is usually lower.',
        ],
      ],
    },
    de: {
      meta: {
        title: 'Pokémon Karten Wert ermitteln – auch per App | MonDex',
        description:
          'So ermittelst du den Wert deiner Pokémon-Karten: Set und Nummer, Variante, Zustand, Grading und Sprache – und warum Cardmarket, TCGplayer und eBay abweichen.',
      },
      label: 'Pokémon-Karten Wert',
      title: 'Was ist meine Pokémon-Karte wert? So ermittelst du den Wert.',
      intro:
        'Der Wert einer Pokémon-Karte hängt nicht nur vom Pokémon ab. Dasselbe Pokémon kann ein paar Cent oder mehrere hundert Euro wert sein, je nach Set, Druckvariante, Zustand und ob die Karte gegradet ist. Hier erfährst du, worauf es ankommt und wie MonDex den Wert beim Scannen sofort anzeigt.',
      demo: 'Die Preise ansehen',
      anchor: 'preise',
      sections: [
        {
          title: 'Zuerst die genaue Karte bestimmen',
          paragraphs: [
            'Schau unten auf die Karte: Die Kartennummer (zum Beispiel 4/102) und das Set-Symbol bestimmen sie eindeutig. Dasselbe Pokémon gibt es in Dutzenden Sets mit anderer Illustration, Seltenheit und anderem Preis. Der Name allein reicht also nie, und auch Neuauflagen mit gleicher Illustration können unterschiedlich viel wert sein.',
            'Der Scanner von MonDex nimmt dir das ab: Er erkennt die Illustration, liest bei Bedarf die Kartennummer und zeigt Set, Nummer und Seltenheit.',
          ],
        },
        {
          title: 'Druckvariante: Normal, Holo, Reverse Holo und 1. Edition',
          paragraphs: [
            'Eine Karte kann es in mehreren Varianten geben, jede mit eigenem Preis. Bei einer Holo glänzt die Illustration, bei einer Reverse Holo glänzt alles außer der Illustration. Ältere Sets haben Exemplare der 1. Edition mit kleinem Stempel, die ein Vielfaches der unlimitierten Auflage wert sein können. Auch Sonderdrucke wie Poké-Ball- und Master-Ball-Reverse-Holos haben eigene Preise.',
          ],
        },
        {
          title: 'Zustand',
          paragraphs: [
            'Preise im Netz beziehen sich meist auf Karten in Near Mint: saubere Kanten, scharfe Ecken, keine Kratzer oder Knicke. Weiße Kanten (Whitening), Kratzer oder ein Knick senken den Wert deutlich. Cardmarket unterscheidet Mint, Near Mint, Excellent, Good, Light Played, Played und Poor. MonDex zeigt Near-Mint-Marktpreise; für bespielte Karten solltest du weniger erwarten.',
          ],
        },
        {
          title: 'Gegradete Karten und PSA 10',
          paragraphs: [
            'Eine gegradete Karte steckt versiegelt in einem Case mit einer Note von einer Grading-Firma wie PSA, CGC oder Beckett. Eine PSA 10, die Bestnote, kann ein Vielfaches einer ungegradeten Karte kosten. Deshalb zeigt MonDex den letzten eBay-Verkauf als PSA 10 neben dem letzten Verkauf einer ungegradeten Karte.',
          ],
        },
        {
          title: 'Deutsche, englische und japanische Karten',
          paragraphs: [
            'Englische und japanische Karten haben die größten Märkte und eigene Preise. MonDex führt japanische Karten in eigenen japanischen Sets mit japanischen Preisen. Deutsche Karten werden oft günstiger gehandelt als englische, bei seltenen älteren Karten gibt es aber Ausnahmen. MonDex zeigt für deutsche Exemplare den Preis der englischen Ausgabe als Richtwert; auf Cardmarket kannst du gezielt nach deutschen Angeboten suchen.',
          ],
        },
        {
          title: 'Warum Cardmarket, TCGplayer und eBay abweichen',
          paragraphs: [
            'Cardmarket ist der wichtigste Marktplatz in Europa; der Trendpreis ist in Euro und folgt den Verkäufen dort. Der TCGplayer-Marktpreis folgt Verkäufen in den USA, in Dollar. eBay zeigt, wofür einzelne Karten tatsächlich verkauft wurden, auch gegradete. Ein Angebot ist ein Wunschpreis, kein Wert: Was eine Karte zuletzt gebracht hat, sagt mehr als das, was jemand verlangt.',
            'MonDex zeigt alle drei nebeneinander und rechnet sie in deine Währung um.',
          ],
        },
        {
          title: 'Den Wert deiner Karten mit MonDex prüfen',
          paragraphs: [
            'Scanne eine Karte und MonDex zeigt den Cardmarket-Trendpreis in Euro, den TCGplayer-Marktpreis und die letzten eBay-Verkäufe, ungegradet und als PSA 10. Füge sie deiner Sammlung hinzu und die App hält den Gesamtwert täglich aktuell. Ein Preisalarm meldet sich, sobald eine Karte deinen Zielpreis erreicht.',
          ],
        },
      ],
      faq: [
        [
          'Wie finde ich heraus, was meine Pokémon-Karte wert ist?',
          'Bestimme die genaue Karte über Set und Kartennummer, prüfe Variante und Zustand und vergleiche dann aktuelle Verkaufspreise. MonDex scannt die Karte und zeigt Cardmarket-, TCGplayer- und eBay-Preise in einem Schritt; den Zustand beurteilst du selbst.',
        ],
        [
          'Sind deutsche Pokémon-Karten weniger wert?',
          'Oft ja, weil englische und japanische Karten die größten Märkte haben. Bei seltenen älteren Karten gibt es Ausnahmen.',
        ],
        [
          'Was bedeutet der Cardmarket-Trendpreis?',
          'Der Trendpreis ist Cardmarkets Richtwert aus den jüngsten Verkäufen einer Karte, in Euro.',
        ],
        [
          'Lohnt sich Grading?',
          'Bei wertvollen Karten in sehr gutem Zustand oft, weil gegradete Exemplare höher gehandelt werden. Bei günstigen Karten übersteigen die Grading-Kosten meist den Mehrwert.',
        ],
        ['Wie oft aktualisiert MonDex die Preise?', 'Täglich.'],
      ],
    },
  },
  collection: {
    en: {
      meta: {
        title: 'Pokémon Card Collection Tracker & Pokédex App | MonDex',
        description:
          'Track your Pokémon card collection: 200+ English and 440+ Japanese sets, a Pokédex of all 1,025 Pokémon, wishlists, value in your currency and import from spreadsheets.',
      },
      label: 'Pokémon card collection tracker',
      title: 'A Pokémon card collection tracker that shows what you own and what’s missing.',
      intro:
        'MonDex keeps your whole Pokémon card collection in one place: every copy with its printing, condition and language, your progress through each set, and a Pokédex of all 1,025 Pokémon that fills as you collect. It is coming to iPhone first, with Android to follow.',
      demo: 'See the Pokédex',
      anchor: 'pokedex',
      sections: [
        {
          title: 'A Pokédex that fills as you collect',
          paragraphs: [
            'Every card you add brings its Pokémon into your Pokédex, all 1,025 of them. Each new one lights up in its place, so you always see the next gap. Collecting goals and paths, such as a Kanto Living Dex, show how close you are.',
          ],
        },
        {
          title: 'Complete your sets',
          paragraphs: [
            'MonDex covers more than 200 English sets and more than 440 Japanese sets. For every set you have started, it shows how many cards you have of the printed set and of the master set with its secret rares, and what the missing cards would cost at today’s prices.',
          ],
        },
        {
          title: 'Every copy, exactly as you own it',
          paragraphs: [
            'A card can exist as Normal, Holo, Reverse Holo, first edition or a special pattern such as a Master Ball reverse holo. MonDex keeps each printing apart, together with each copy’s condition, language and, for graded cards, the grading company, grade and certificate number.',
          ],
        },
        {
          title: 'Wishlist, trade list and more',
          paragraphs: [
            'Keep a wishlist of cards you want, a list of copies for trade, cards to send for grading, or lists of your own. Automatic lists can fill themselves by rules, for example every Charizard you own.',
          ],
        },
        {
          title: 'Your collection’s value, if you want it',
          paragraphs: [
            'See what your collection is worth in your currency and which cards moved; with MonDex Plus, also what you paid against what they are worth today. Prices come from TCGplayer, eBay and Cardmarket. One switch hides every value if you collect for the cards, not the money.',
          ],
        },
        {
          title: 'Bring your collection with you',
          paragraphs: [
            'Import a CSV export from another collection app, a MonDex backup or any spreadsheet with name, set and number. You see every card before anything is added, and nothing is guessed. Exporting your collection is always free.',
          ],
        },
      ],
      faq: [
        [
          'Is the collection tracker free?',
          'Yes. Your Pokédex, sets, lists, prices and exports are free. MonDex Plus adds scanning after the free Welcome Week, more price alerts and deeper insights.',
        ],
        [
          'Can I import my collection from another app?',
          'Yes. MonDex reads CSV exports from other collection apps and any spreadsheet with name, set and number, and shows you every card before it is added.',
        ],
        [
          'Does it track Japanese cards?',
          'Yes. Japanese cards have their own sets, cards and prices, next to the English catalogue.',
        ],
        [
          'Can I hide the value of my collection?',
          'Yes. One switch hides every price and value in the app.',
        ],
        [
          'Is my collection saved if I change phones?',
          'Yes. Your collection is stored with your account and appears on your new phone when you sign in.',
        ],
      ],
    },
    de: {
      meta: {
        title: 'Pokémon Karten Sammlung verwalten & Pokédex abhaken | MonDex',
        description:
          'Pokemon Karten Sammlung digital verwalten: über 200 englische und 440 japanische Sets, ein Pokédex zum Abhaken mit allen 1.025 Pokémon, Wunschliste und Wert in Euro.',
      },
      label: 'Pokémon-Karten-Sammlung',
      title: 'Deine Pokémon-Karten-Sammlung: sehen, was du hast und was noch fehlt.',
      intro:
        'MonDex hält deine ganze Pokémon-Karten-Sammlung an einem Ort: jedes Exemplar mit Druckvariante, Zustand und Sprache, deinen Fortschritt in jedem Set und einen Pokédex mit allen 1.025 Pokémon, der sich beim Sammeln füllt. Die App kommt zuerst aufs iPhone, Android folgt.',
      demo: 'Den Pokédex ansehen',
      anchor: 'pokedex',
      sections: [
        {
          title: 'Ein Pokédex, der sich beim Sammeln füllt',
          paragraphs: [
            'Jede Karte, die du hinzufügst, trägt ihr Pokémon in deinen Pokédex ein, alle 1.025. Jedes neue leuchtet an seinem Platz auf, so siehst du immer die nächste Lücke. Sammelziele wie ein Kanto-Living-Dex zeigen, wie nah du dran bist.',
          ],
        },
        {
          title: 'Sets vervollständigen',
          paragraphs: [
            'MonDex kennt über 200 englische und über 440 japanische Sets. Für jedes angefangene Set siehst du, wie viele Karten dir vom gedruckten Set und vom Master-Set mit Secret Rares fehlen und was die fehlenden Karten zu heutigen Preisen kosten würden.',
          ],
        },
        {
          title: 'Jedes Exemplar genau so, wie du es besitzt',
          paragraphs: [
            'Eine Karte gibt es als Normal, Holo, Reverse Holo, 1. Edition oder mit Sondermuster wie dem Master-Ball-Reverse-Holo. MonDex hält jede Variante getrennt, mit Zustand und Sprache jedes Exemplars und bei gegradeten Karten mit Grading-Firma, Note und Zertifikatsnummer.',
          ],
        },
        {
          title: 'Wunschliste, Tauschliste und mehr',
          paragraphs: [
            'Führe eine Wunschliste, eine Liste zum Tauschen, Karten fürs Grading oder eigene Listen. Automatische Listen füllen sich nach Regeln selbst, zum Beispiel mit jedem Glurak, das du besitzt.',
          ],
        },
        {
          title: 'Der Wert deiner Sammlung, wenn du willst',
          paragraphs: [
            'Sieh, was deine Sammlung wert ist, in Euro oder deiner Währung, und welche Karten sich bewegt haben; mit MonDex Plus auch, was du bezahlt hast gegenüber ihrem Wert heute. Die Preise kommen von Cardmarket, TCGplayer und eBay. Mit einem Schalter blendest du jeden Wert aus, wenn du für die Karten sammelst und nicht fürs Geld.',
          ],
        },
        {
          title: 'Deine Sammlung kommt mit',
          paragraphs: [
            'Importiere einen CSV-Export aus einer anderen Sammel-App, ein MonDex-Backup oder jede Tabelle mit Name, Set und Nummer. Du siehst jede Karte, bevor etwas hinzugefügt wird, und nichts wird geraten. Exportieren ist immer kostenlos.',
          ],
        },
      ],
      faq: [
        [
          'Ist die Sammlungsverwaltung kostenlos?',
          'Ja. Pokédex, Sets, Listen, Preise und Exporte sind kostenlos. MonDex Plus ergänzt das Scannen nach der kostenlosen Willkommenswoche, mehr Preisalarme und tiefere Einblicke.',
        ],
        [
          'Kann ich meine Sammlung aus einer anderen App übernehmen?',
          'Ja. MonDex liest CSV-Exporte anderer Sammel-Apps und jede Tabelle mit Name, Set und Nummer und zeigt dir jede Karte, bevor sie hinzugefügt wird.',
        ],
        [
          'Zeigt MonDex deutsche Kartennamen?',
          'Ja, überall dort, wo es einen deutschen Namen gibt. Die App selbst gibt es auf Deutsch und Englisch.',
        ],
        [
          'Kann ich japanische Karten sammeln?',
          'Ja. Japanische Karten haben eigene Sets, Karten und Preise, neben dem englischen Katalog.',
        ],
        [
          'Kann ich den Wert meiner Sammlung ausblenden?',
          'Ja. Ein Schalter blendet jeden Preis und Wert in der App aus.',
        ],
      ],
    },
  },
};
