import { mkdir, writeFile } from 'node:fs/promises';
const paths = [
  '',
  'pokemon-tcg-scanner',
  'digital-pokemon-card-binder',
  'pokemon-card-collection-tracker',
  'kontakt',
  'datenschutz',
  'impressum',
];
// Preserve German links, campaign tags and anchors from the previous website.
for (const path of paths) {
  const destination = `/${path ? path + '/' : ''}?lang=de`;
  const directory = `out/de/${path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(
    `${directory}/index.html`,
    `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MonDex</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="https://mondextcg.com/${path ? path + '/' : ''}"><meta http-equiv="refresh" content="0;url=${destination}"><script>const target=new URL(${JSON.stringify(destination)},location.origin);for(const [key,value] of new URLSearchParams(location.search)){if(key!=='lang')target.searchParams.set(key,value)}target.hash=location.hash;location.replace(target.href);</script></head><body><a href="${destination}">Weiter zu MonDex</a></body></html>`,
  );
}
await writeFile('out/.nojekyll', '');
await writeFile('out/CNAME', 'mondextcg.com\n');
