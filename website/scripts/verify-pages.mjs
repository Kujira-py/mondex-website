import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const paths = [
  '',
  'pokemon-tcg-scanner',
  'pokemon-card-collection-tracker',
  'kontakt',
  'datenschutz',
  'impressum',
];
for (const path of paths) {
  const html = readFileSync(`out/${path ? path + '/' : ''}index.html`, 'utf8');
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${path}: one heading`);
  assert.match(html, /<title>[^<]*MonDex[^<]*<\/title>/);
  assert(!html.includes('Registration on mondextcg.com'));
  for (const tag of html.match(/<(?:a|img|link|script)\b[^>]*>/g) || []) {
    const href = tag.match(/(?:href|src)="([^"]+)"/)?.[1];
    if (!href?.startsWith('/') || href.startsWith('//')) continue;
    const pathname = new URL(href.replaceAll('&amp;', '&'), 'https://mondextcg.com').pathname;
    const file = join('out', pathname.endsWith('/') ? pathname + 'index.html' : pathname);
    assert(existsSync(file), `${path}: missing ${file}`);
  }
  assert(existsSync(`out/de/${path ? path + '/' : ''}index.html`));
}
assert(existsSync('out/.nojekyll'));
assert.equal(readFileSync('out/CNAME', 'utf8').trim(), 'mondextcg.com');
assert(existsSync('out/404.html'));
// Invitation links: the page, and 404.html sending /i/<code> to it first thing.
const invite = readFileSync('out/i/index.html', 'utf8');
assert.equal([...invite.matchAll(/<h1\b/g)].length, 1, 'i: one heading');
assert.match(invite, /<meta name="robots" content="noindex, nofollow"/);
const notFound = readFileSync('out/404.html', 'utf8');
assert(notFound.indexOf("location.replace('/i/?'") > -1, '404.html: invitation redirect');
assert(notFound.indexOf("location.replace('/i/?'") < notFound.indexOf('<script src='), '404.html: redirect before the app');
assert(existsSync('out/sitemap.xml'));
assert(existsSync('out/robots.txt'));
assert.match(readFileSync('out/index.html', 'utf8'), /class="mx-form[^"]*"/);
console.log('PASS: 6 pages, 6 legacy German URLs, assets, internal links, waitlist form and invitation links.');
