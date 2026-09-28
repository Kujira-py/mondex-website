import { mkdir, readFile, writeFile } from 'node:fs/promises';
const paths = [
  '',
  'pokemon-tcg-scanner',
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
// Invitation links (mondextcg.com/i/<code>, shared from the app) are not
// files, so GitHub Pages answers them with 404.html. Its first script sends
// them to the invitation page before anything is drawn: /i/?code=<code>.
const inviteRedirect = String.raw`<script>(function(){var m=location.pathname.match(/^\/(de\/)?i\/([^/]+)\/?$/);if(!m)return;var q=new URLSearchParams(location.search);q.set('code',decodeURIComponent(m[2]));if(m[1])q.set('lang','de');location.replace('/i/?'+q.toString()+location.hash)})()</script>`;
const notFound = await readFile('out/404.html', 'utf8');
if (!notFound.includes('/i/?')) {
  const withRedirect = notFound.replace(/<head[^>]*>/, (head) => head + inviteRedirect);
  if (withRedirect === notFound) throw new Error('404.html has no <head> for the invitation redirect');
  await writeFile('out/404.html', withRedirect);
}
await writeFile('out/.nojekyll', '');
await writeFile('out/CNAME', 'mondextcg.com\n');
