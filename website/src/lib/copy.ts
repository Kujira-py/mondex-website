// Original German copy and illustrative collection data. Card names match the pictured editions.

export const chapters = [
  {
    label: 'Deine Pokémon-Sammlung. Mit MonDex.',
    title: 'So fühlt sich',
    accent: 'Sammeln an.',
    body: 'Scannen, ordnen, vervollständigen. Für die Freude am Sammeln.',
    link: 'App entdecken',
    href: '#reise',
  },
  {
    label: '01 / Erfassen',
    title: 'Ein neuer Fund.',
    accent: 'Ein guter Anfang.',
    body: 'Erfasse deine Karte. Prüfe den Treffer. Und mach aus einem Fund einen Teil deiner Sammlung.',
    link: 'Den Scanner entdecken',
    href: '#scanner',
  },
  {
    label: '02 / Sammeln',
    title: 'Deine Karten.',
    accent: 'Deine Ordnung.',
    body: 'Einzelne Lieblingsstücke, ganze Sets und persönliche Binder. Alles findet seinen Platz.',
    link: 'Sammlung gestalten',
    href: '#sammlung',
  },
  {
    label: '03 / Verstehen',
    title: 'Mehr sehen.',
    accent: 'Weiter sammeln.',
    body: 'Behalte deine Karten, ihre Marktwerte und deine nächsten Sammelziele im Blick.',
    link: 'Portfolio kennenlernen',
    href: '#portfolio',
  },
];

export const collectionModes = [
  {
    label: 'Karten',
    title: 'Jedes Lieblingsstück. Wiedergefunden.',
    body: 'Durchsuche deine Karten und behalte Varianten und Duplikate im Blick.',
    detail: 'Deine Karten im Mittelpunkt.',
  },
  {
    label: 'Sets',
    title: 'Aus einzelnen Funden wird ein Ganzes.',
    body: 'Sieh deine Karten im Zusammenhang eines Sets. Und entdecke, was noch fehlt.',
    detail: 'Zum Beispiel: Pokémon 151.',
  },
  {
    label: 'Binder',
    title: 'Eine Sammlung mit deiner Handschrift.',
    body: 'Ordne deine Karten in persönlichen Bindern – nach Lieblings-Pokémon, Illustrationen oder deiner eigenen Idee.',
    detail: 'Dein Platz für besondere Karten.',
  },
  {
    label: 'Listen',
    title: 'Schon im Kopf. Bald in der Sammlung.',
    body: 'Halte fest, was du als Nächstes sammeln möchtest. Mit Listen für deine eigenen Ziele.',
    detail: 'Ein Wunsch nach dem anderen.',
  },
];

export const galleryCards = [
  { id: 'bulbasaur', name: 'Bulbasaur', number: '166/165' },
  { id: 'squirtle', name: 'Squirtle', number: '170/165' },
  { id: 'pikachu', name: 'Pikachu', number: '173/165' },
  { id: 'mew', name: 'Mew ex', number: '205/165' },
  { id: 'charizard', name: 'Charizard ex', number: '199/165' },
  { id: 'venusaur', name: 'Venusaur ex', number: '198/165' },
];

export const dexPokemon = [
  { id: 1, name: { en: 'Bulbasaur', de: 'Bisasam' }, owned: true },
  { id: 4, name: { en: 'Charmander', de: 'Glumanda' }, owned: true },
  { id: 7, name: { en: 'Squirtle', de: 'Schiggy' }, owned: true },
  { id: 25, name: { en: 'Pikachu', de: 'Pikachu' }, owned: true },
  { id: 133, name: { en: 'Eevee', de: 'Evoli' }, owned: false },
  { id: 151, name: { en: 'Mew', de: 'Mew' }, owned: false },
];
