import sharp from 'sharp';
import { access, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const ids = [3, 6, 9, 129, 142, 149, 150, 197, 245, 257, 487, 493, 643];
const entries = [];
for (const id of ids) {
  const local = `../mobile/assets/collector/pokemon-${id}.png`;
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  let input, source;
  try {
    await access(local);
    input = await readFile(local);
    source = 'Existing MonDex public collector artwork';
  } catch {
    const response = await fetch(url);
    if (!response.ok) throw Error(`${id}: ${response.status}`);
    input = Buffer.from(await response.arrayBuffer());
    source = 'Official artwork mirrored by PokeAPI';
  }
  const output = await sharp(input)
    .resize(320, 320, { fit: 'inside' })
    .webp({ quality: 88 })
    .toBuffer();
  await writeFile(`public/assets/pokemon-${id}.webp`, output);
  entries.push({
    id,
    source,
    sourceUrl: url,
    filename: `pokemon-${id}.webp`,
    sha256: createHash('sha256').update(output).digest('hex'),
  });
}
await writeFile(
  'public/assets/living-dex-provenance.json',
  JSON.stringify(entries, null, 2) + '\n',
);
console.log(`Prepared ${entries.length} matching portraits.`);
