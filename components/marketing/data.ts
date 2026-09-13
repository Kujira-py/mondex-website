import { assetPath } from "./seo";
export const assets = {
  orbit: assetPath("/brand/orbit.svg"),
  pokemon: (id: number) => assetPath(`/marketing/pokemon-${id}.webp`),
  card: (id: string, small = false) => assetPath(`/marketing/card-${id}${small ? "-small" : ""}.webp`),
};
export type DemoCard = { id: string; name: string; number: string; set: string };
export const demoCards: DemoCard[] = [
  { id: "bulbasaur", name: "Bisasam", number: "166/165", set: "151" },
  { id: "charizard", name: "Glurak ex", number: "199/165", set: "151" },
  { id: "squirtle", name: "Schiggy", number: "170/165", set: "151" },
  { id: "pikachu", name: "Pikachu", number: "173/165", set: "151" },
  { id: "mew", name: "Mew ex", number: "205/165", set: "151" },
  { id: "venusaur", name: "Bisaflor ex", number: "198/165", set: "151" },
  { id: "eevee", name: "Evoli", number: "TG11/TG30", set: "Brilliant Stars" },
  { id: "umbreon", name: "Nachtara VMAX", number: "215/203", set: "Evolving Skies" },
  { id: "blastoise", name: "Turtok ex", number: "200/165", set: "151" },
  { id: "gengar", name: "Gengar VMAX", number: "271/264", set: "Fusion Strike" },
  { id: "dragonite", name: "Dragoran V", number: "192/203", set: "Evolving Skies" },
  { id: "mewtwo", name: "Curelei", number: "SWSH242", set: "Sword & Shield Promos" },
];
// One owned-card projection for all collection and binder views. Scanner and
// wishlist may also show catalogue examples which have not been collected yet.
export const ownedDemoCards = (discovered: boolean) => demoCards.filter(card => card.id !== "dragonite" && (card.id !== "mew" || discovered));
export const demoPokemon = [
  { id: 1, name: "Bisasam", found: true }, { id: 4, name: "Glumanda", found: true },
  { id: 7, name: "Schiggy", found: true }, { id: 25, name: "Pikachu", found: true },
  { id: 133, name: "Evoli", found: true }, { id: 94, name: "Gengar", found: true },
  { id: 149, name: "Dragoran", found: false }, { id: 150, name: "Mewtu", found: false },
  { id: 151, name: "Mew", found: false },
];
export const baseStats = { cards: 1284, pokemon: 312, kanto: 143, total: 151, wishlist: 24 };
export const motion = { tabs: 200, discovery: 760, binder: 600, page: 400, standard: 240, holo: 440, metallic: 900 };
export const binders = [
  { id: "signature", name: "Signature", detail: "Deine Handschrift.", cover: "SIGNATURE" },
  { id: "kanto", name: "Kanto", detail: "Wo alles begann.", cover: "KANTO" },
  { id: "favorites", name: "Favorites", detail: "Die bleiben bei dir.", cover: "FAVORITES" },
] as const;
export const faqs = [
  {"question": "Kann ich mit MonDex Pokémon-Karten auf dem Handy scannen?", "answer": "MonDex wird als Scan- und Sammlungs-App für iPhone und Android entwickelt. Der Ablauf verbindet ein Kartenfoto mit einem prüfbaren Kartenvorschlag. Auf dieser Website kannst du nur die Scan-Effekt-Demo ausprobieren; echte Kameraaufnahmen und Kartenerkennung sind hier nicht verfügbar."},
  {"question": "Was ist der Unterschied zwischen einem Kartenscanner und einem Sammlungstracker?", "answer": "Ein Kartenscanner hilft dabei, eine fotografierte Karte zuzuordnen. Ein Sammlungstracker hält fest, welche Karten, Varianten und Exemplare du besitzt und was noch fehlt. MonDex verbindet diese Aufgaben mit einem persönlichen Pokédex und digitalen Bindern."},
  {"question": "Wie unterscheiden sich Holo und Reverse Holo in der Sammlung?", "answer": "Holo und Reverse Holo sind unterschiedliche Druckvarianten, auch wenn sie sich ein Katalogbild teilen. Prüfe deshalb die Variante deines Exemplars getrennt von der Seltenheit. Die Website zeigt stilisierte Folieneffekte, keine verifizierten Fotos jeder Druckvariante."},
  { question: "Wann erscheint MonDex?", answer: "MonDex ist in Entwicklung. Ein Veröffentlichungstermin steht noch nicht fest. Die Launch-Anmeldung auf dieser Website ist derzeit eine Demo und speichert keine E-Mail-Adressen." },
  { question: "Für welche Plattformen ist MonDex geplant?", answer: "MonDex wird für iPhone und Android entwickelt. Welche Geräte und Betriebssystemversionen zum Launch unterstützt werden, steht noch nicht endgültig fest." },
  { question: "Kann ich meine bestehende Sammlung importieren?", answer: "Ein Import deiner bestehenden Sammlung ist für den Launch noch nicht bestätigt. Sobald die unterstützten Formate und Möglichkeiten feststehen, ergänzen wir diese Information." },
  { question: "Sind die gezeigten Funktionen bereits verfügbar?", answer: "Die App befindet sich noch in Entwicklung. Hier kannst du ausgewählte Produktmomente mit Beispieldaten ausprobieren. Die Website erkennt keine echten Karten und verwaltet keine persönliche Sammlung. Funktionen und Darstellung können sich bis zum Launch ändern." },
];
