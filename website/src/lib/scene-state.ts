export type SceneController = {
  progress: number;
  motionEnabled: boolean;
  pointer: { x: number; y: number };
  hover: number;
  selected: number;
  visible: boolean;
  invalidate: () => void;
};
export const newController = (): SceneController => ({
  progress: 0,
  motionEnabled: true,
  pointer: { x: 0, y: 0 },
  hover: -1,
  selected: -1,
  visible: true,
  invalidate: () => {},
});
export const featuredCards = [
  { id: 'rayquaza', name: 'Rayquaza VMAX', set: 'Evolving Skies · 218/203' },
  { id: 'pikachu', name: 'Pikachu', set: 'Pokémon 151 · 173/165' },
  { id: 'mew', name: 'Mew ex', set: 'Pokémon 151 · 205/165' },
  { id: 'charizard', name: 'Charizard ex', set: 'Pokémon 151 · 199/165' },
  { id: 'giratina', name: 'Giratina V', set: 'Lost Origin · 186/196' },
];
