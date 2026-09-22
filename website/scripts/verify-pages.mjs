import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const paths = [
  '',
  'pokemon-tcg-scanner',
  'digital-pokemon-card-binder',
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
assert(existsSync('out/sitemap.xml'));
assert(existsSync('out/robots.txt'));
assert.match(readFileSync('out/index.html', 'utf8'), /class="waitlist-form"/);
console.log('PASS: 7 pages, 7 legacy German URLs, assets, internal links and waitlist form.');
