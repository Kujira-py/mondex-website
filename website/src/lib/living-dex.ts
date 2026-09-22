import { discoveryCards } from './product-demo';

const identities = [
  [1, 'bulbasaur', 'Bulbasaur', 'Bisasam'],
  [3, 'venusaur', 'Venusaur', 'Bisaflor'],
  [6, 'charizard', 'Charizard', 'Glurak'],
  [7, 'squirtle', 'Squirtle', 'Schiggy'],
  [9, 'blastoise', 'Blastoise', 'Turtok'],
  [25, 'pikachu', 'Pikachu', 'Pikachu'],
  [94, 'gengar', 'Gengar', 'Gengar'],
  [129, 'magikarp', 'Magikarp', 'Karpador'],
  [133, 'eevee', 'Eevee', 'Evoli'],
  [142, 'aerodactyl', 'Aerodactyl', 'Aerodactyl'],
  [149, 'dragonite', 'Dragonite', 'Dragoran'],
  [150, 'mewtwo', 'Mewtwo', 'Mewtu'],
  [151, 'mew', 'Mew', 'Mew'],
  [197, 'umbreon', 'Umbreon', 'Nachtara'],
  [245, 'suicune', 'Suicune', 'Suicune'],
  [249, 'lugia', 'Lugia', 'Lugia'],
  [257, 'blaziken', 'Blaziken', 'Lohgock'],
  [282, 'gardevoir', 'Gardevoir', 'Guardevoir'],
  [384, 'rayquaza', 'Rayquaza', 'Rayquaza'],
  [470, 'leafeon', 'Leafeon', 'Folipurba'],
  [487, 'giratina', 'Giratina', 'Giratina'],
  [493, 'arceus', 'Arceus', 'Arceus'],
  [643, 'reshiram', 'Reshiram', 'Reshiram'],
  [700, 'sylveon', 'Sylveon', 'Feelinara'],
] as const;

export const livingDex = identities.map(([id, cardId, en, de], index) => ({
  id,
  name: { en, de },
  owned: index % 3 !== 2,
  card: discoveryCards.find((card) => card.id === cardId)!,
}));
