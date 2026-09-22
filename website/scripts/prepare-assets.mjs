import sharp from 'sharp';
import { mkdir, copyFile, rm, writeFile, readFile } from 'node:fs/promises';
const out = 'public/assets';
await mkdir(out, { recursive: true });
await mkdir('public/fonts', { recursive: true });
const cards = [
  'mew',
  'charizard',
  'pikachu',
  'gengar',
  'bulbasaur',
  'squirtle',
  'eevee',
  'umbreon',
  'venusaur',
  'blastoise',
  'mewtwo',
  'dragonite',
];
for (const name of cards) {
  await sharp(`../mobile/assets/collector/card-${name}.png`)
    .resize({ width: 660 })
    .webp({ quality: 88 })
    .toFile(`${out}/card-${name}.webp`);
}
for (const id of [1, 4, 7, 25, 133, 151]) {
  await sharp(`../mobile/assets/collector/pokemon-${id}.png`)
    .resize({ width: 320 })
    .webp({ quality: 88 })
    .toFile(`${out}/pokemon-${id}.webp`);
}
await copyFile('../mobile/assets/brand/orbit.svg', `${out}/orbit.svg`);
await copyFile(
  '../mobile/assets/fonts/Onest/Onest-VariableFont_wght.ttf',
  'public/fonts/onest.ttf',
);
await copyFile('../mobile/assets/fonts/Onest/OFL.txt', 'public/fonts/OFL.txt');
// Remove only this website's previous derivatives; original user files stay untouched.
for (const name of ['home', 'dex', 'collection', 'portfolio', 'scanner', 'manaphy', 'pikachu'])
  await rm(`${out}/${name}.webp`, { force: true });
const provenance = JSON.parse(await readFile('../mobile/assets/collector/provenance.json', 'utf8'));
await writeFile(
  `${out}/provenance.json`,
  JSON.stringify(
    provenance
      .filter((p) => cards.includes(p.name) || [1, 4, 7, 25, 133, 151].includes(p.id))
      .map(({ name, id, url, kind }) => ({
        name,
        id,
        url,
        kind,
        source:
          'Existing MonDex repository asset; optimized to WebP. Artwork rights remain with respective owners.',
      })),
    null,
    2,
  ),
);
console.log(
  '12 original card artworks, 6 Pokémon portraits, Orbit and Onest prepared; all screenshot-derived assets removed.',
);
