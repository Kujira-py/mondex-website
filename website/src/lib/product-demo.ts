import { additionalCards } from './catalogue';

// Identity comes from the bundled collector catalogue, never generated artwork.
const originalCards = [
  { id: 'bulbasaur', name: 'Bulbasaur', set: 'Pokémon 151', number: '166/165' },
  { id: 'squirtle', name: 'Squirtle', set: 'Pokémon 151', number: '170/165' },
  { id: 'pikachu', name: 'Pikachu', set: 'Pokémon 151', number: '173/165' },
  { id: 'mew', name: 'Mew ex', set: 'Pokémon 151', number: '205/165' },
  { id: 'charizard', name: 'Charizard ex', set: 'Pokémon 151', number: '199/165' },
  { id: 'venusaur', name: 'Venusaur ex', set: 'Pokémon 151', number: '198/165' },
  { id: 'blastoise', name: 'Blastoise ex', set: 'Pokémon 151', number: '200/165' },
  { id: 'eevee', name: 'Eevee', set: 'Brilliant Stars', number: 'TG11/TG30' },
  { id: 'mewtwo', name: 'Mewtwo V', set: 'Sword & Shield Promos', number: 'SWSH229' },
  { id: 'gengar', name: 'Gengar VMAX', set: 'Fusion Strike', number: '271/264' },
  { id: 'dragonite', name: 'Dragonite V', set: 'Evolving Skies', number: '192/203' },
  { id: 'umbreon', name: 'Umbreon VMAX', set: 'Evolving Skies', number: '215/203' },
];

export const discoveryCards = additionalCards.flatMap((card, i) =>
  originalCards[i] ? [card, originalCards[i]] : [card],
);

// PriceCharting ungraded English estimates, USD. Checked 2026-09-21.
// Public monthly chart buckets (Oct 2025–Sep 2026), used series in cents.
// These are source monthly observations, not invented daily samples.
const sourceHoldings = [
  {
    id: 'pikachu',
    name: 'Pikachu',
    number: '173/165',
    variant: 'Illustration Rare',
    source: 'https://www.pricecharting.com/game/pokemon-scarlet-%26-violet-151/pikachu-173',
    values: [38.5, 33.85, 37.61, 40.68, 48.33, 69.43, 71.83, 82.5, 86.75, 83.69, 82.66, 74.13],
  },
  {
    id: 'mew',
    name: 'Mew ex',
    number: '205/165',
    variant: 'Hyper Rare \u00b7 non-metal',
    source: 'https://www.pricecharting.com/game/pokemon-scarlet-%26-violet-151/mew-ex-205',
    values: [16.0, 15.0, 16.56, 16.25, 19.49, 22.91, 26.15, 30.44, 32.99, 27.99, 24.09, 24.33],
  },
  {
    id: 'charizard',
    name: 'Charizard ex',
    number: '199/165',
    variant: 'Special Illustration Rare',
    source: 'https://www.pricecharting.com/game/pokemon-scarlet-%26-violet-151/charizard-ex-199',
    values: [
      291.17, 231.5, 237.86, 245.16, 277.18, 400.0, 397.76, 410.59, 400.0, 380.05, 365.31, 350.0,
    ],
  },
];
// Rounded examples for the public demo; retain researched observations above for provenance.
export const demoHoldings = sourceHoldings.map((card) => ({
  ...card,
  values: card.values.map((value) => Math.round(value / 5) * 5),
}));
export const priceCheckedAt = '2026-09-21';
export const demoHistory = demoHoldings[0].values.map((_, i) => ({
  date: new Date(Date.UTC(2025, 9 + i, 1)),
  value: Math.round(demoHoldings.reduce((sum, card) => sum + card.values[i], 0) * 100) / 100,
}));
