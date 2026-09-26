export const contactEmail = 'contact@mondextcg.com';
export const mailto = (subject?: string) =>
  `mailto:${contactEmail}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

export const siteContent = {
  en: {
    launch: {
      title: 'Your next discovery.',
      accent: 'Worth the wait.',
      body: 'MonDex is in development for iPhone and Android, launching on iPhone first. Join the waitlist and we’ll email you when it’s ready.',
      action: 'Join the waitlist',
      note: 'One launch email. No account needed. No release date announced yet.',
      privacy: 'How we use your details',
    },
    faqTitle: 'A few things you might be wondering.',
    faqIntro: 'About the app, the launch and what you can try today.',
    faq: [
      [
        'When will MonDex be available?',
        'MonDex is still in development. A release date has not been announced. Join the waitlist and we’ll let you know when the app launches.',
      ],
      [
        'Is MonDex coming to iPhone and Android?',
        'MonDex is being developed for both, with iPhone launching first. Supported devices and operating system versions are not yet final.',
      ],
      [
        'Can I scan Pokémon cards with my phone?',
        'The current iOS development build includes Snap for single cards, Auto for continuous recognition, Batch for multiple cards and Packs for an opening session. Check the suggested card, set and printing before adding a copy. The website’s scanner is an illustration and does not access your camera.',
      ],
      [
        'Can I scan without an internet connection?',
        'Supported camera scans can use a previously downloaded recognition pack while offline. Saved results can be synced later when you reconnect. Download the pack before going offline.',
      ],
      [
        'How do Holo and Reverse Holo variants work?',
        'Holo and Reverse Holo are different printings, even when they share a catalogue image. Check your copy’s finish separately from its rarity. The website’s foil effects are stylised illustrations, not verified photos of every printing.',
      ],
      [
        'Can I import my existing collection?',
        'Collection import has not been confirmed for launch. We’ll share supported formats and options once they are final.',
      ],
      [
        'Are these demos connected to my collection?',
        'No. The website uses sample cards and illustrative values, without an account or uploads. It does not save a personal collection. The app is not yet a public download; the final launch features and supported devices may change.',
      ],
    ],
    footer: {
      explore: 'Explore',
      learn: 'Learn more',
      support: 'Here to help',
      links: ['Scanner', 'Collection', 'Portfolio', 'Pokédex'],
      guides: ['Card scanning', 'Collection tracking'],
      contact: 'Contact',
      privacy: 'Privacy',
      legal: 'Legal notice',
      faq: 'Questions & answers',
      waitlist: 'Join the waitlist',
      copyright: '© 2026 MonDex',
    },
  },
  de: {
    launch: {
      title: 'Deine nächste Entdeckung.',
      accent: 'Die Vorfreude sammelt mit.',
      body: 'MonDex entsteht für iPhone und Android und startet zuerst auf dem iPhone. Trag dich in die Warteliste ein. Wir schreiben dir, sobald es so weit ist.',
      action: 'Zum Launch vormerken',
      note: 'Eine E-Mail zum Start. Kein Konto nötig. Noch kein festes Erscheinungsdatum.',
      privacy: 'So verwenden wir deine Angaben',
    },
    faqTitle: 'Was du noch wissen möchtest.',
    faqIntro: 'Zur App, zum Launch und zu dem, was du schon ausprobieren kannst.',
    faq: [
      [
        'Wann erscheint MonDex?',
        'MonDex ist noch in Entwicklung. Ein Veröffentlichungstermin steht noch nicht fest. Trag dich in die Warteliste ein. Wir schreiben dir, sobald die App startet.',
      ],
      [
        'Kommt MonDex für iPhone und Android?',
        'MonDex wird für beide Plattformen entwickelt und startet zuerst auf dem iPhone. Die unterstützten Geräte und Betriebssystemversionen stehen noch nicht endgültig fest.',
      ],
      [
        'Kann ich Pokémon-Karten mit dem Handy scannen?',
        'Der aktuelle iOS-Entwicklungsbuild bietet Snap für einzelne Karten, Auto für fortlaufende Erkennung, Batch für mehrere Karten und Packs für eine Opening-Session. Prüfe Karte, Set und Druckvariante des Vorschlags, bevor du ein Exemplar hinzufügst. Der Scanner auf dieser Website ist eine Illustration und nutzt deine Kamera nicht.',
      ],
      [
        'Kann ich auch ohne Internet scannen?',
        'Unterstützte Kamera-Scans können ein zuvor geladenes Erkennungspaket offline verwenden. Gespeicherte Ergebnisse lassen sich später synchronisieren, sobald du wieder verbunden bist. Lade das Paket herunter, bevor du offline gehst.',
      ],
      [
        'Wie funktionieren Holo- und Reverse-Holo-Varianten?',
        'Holo und Reverse Holo sind unterschiedliche Druckvarianten, auch wenn sie ein Katalogbild teilen. Prüfe das Finish deines Exemplars getrennt von der Seltenheit. Die Folieneffekte auf der Website sind stilisiert und keine verifizierten Fotos jeder Druckvariante.',
      ],
      [
        'Kann ich meine bestehende Sammlung importieren?',
        'Ein Sammlungsimport ist für den Launch noch nicht bestätigt. Sobald die unterstützten Formate und Möglichkeiten feststehen, ergänzen wir diese Information.',
      ],
      [
        'Sind die Demos mit meiner Sammlung verbunden?',
        'Nein. Die Website zeigt Beispielkarten und illustrative Werte, ohne Konto oder Uploads. Sie speichert keine persönliche Sammlung. Die App ist noch nicht öffentlich zum Download verfügbar. Der endgültige Funktionsumfang und die unterstützten Geräte können sich bis zum Launch ändern.',
      ],
    ],
    footer: {
      explore: 'Entdecken',
      learn: 'Mehr erfahren',
      support: 'Wir helfen dir',
      links: ['Scanner', 'Sammlung', 'Portfolio', 'Pokédex'],
      guides: ['Karten scannen', 'Sammlung verwalten'],
      contact: 'Kontakt',
      privacy: 'Datenschutz',
      legal: 'Impressum',
      faq: 'Fragen & Antworten',
      waitlist: 'Zum Launch vormerken',
      copyright: '© 2026 MonDex',
    },
  },
} as const;
