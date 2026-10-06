import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const paths = [
  '',
  'pokemon-tcg-scanner',
  'pokemon-card-collection-tracker',
  'pokemon-card-value',
  'de/pokemon-karten-scanner',
  'de/pokemon-karten-wert',
  'de/pokemon-karten-sammlung',
  'kontakt',
  'datenschutz',
  'impressum',
  'nutzungsbedingungen',
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
  // Old German URLs still lead somewhere (English pages only: German ones are /de/ already).
  if (!path.startsWith('de/') && path !== 'pokemon-card-value')
    assert(existsSync(`out/de/${path ? path + '/' : ''}index.html`));
}
// Search: German pages say they are German before any script runs, every page
// pair links both languages, and each indexable page describes itself (JSON-LD).
const pairs = [
  ['', 'de/'],
  ['pokemon-tcg-scanner/', 'de/pokemon-karten-scanner/'],
  ['pokemon-card-value/', 'de/pokemon-karten-wert/'],
  ['pokemon-card-collection-tracker/', 'de/pokemon-karten-sammlung/'],
];
for (const [en, de] of pairs) {
  for (const [path, lang] of [
    [en, 'en'],
    [de, 'de'],
  ]) {
    const html = readFileSync(`out/${path}index.html`, 'utf8');
    assert.match(html, new RegExp(`<html lang="${lang}"`), `${path}: lang ${lang}`);
    assert.match(
      html,
      new RegExp(`<link rel="canonical" href="https://mondextcg.com/${path}"`),
      `${path}: canonical`,
    );
    assert.match(
      html,
      new RegExp(`hrefLang="en" href="https://mondextcg.com/${en}"`, 'i'),
      `${path}: hreflang en`,
    );
    assert.match(
      html,
      new RegExp(`hrefLang="de" href="https://mondextcg.com/${de}"`, 'i'),
      `${path}: hreflang de`,
    );
    assert.match(html, /hrefLang="x-default"/i, `${path}: x-default`);
    assert.match(html, /<meta name="description" content="[^"]{80,}"/, `${path}: description`);
    assert.match(html, /property="og:image"/, `${path}: link preview`);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)];
    assert(blocks.length, `${path}: JSON-LD`);
    for (const [, json] of blocks) JSON.parse(json);
    assert.equal([...html.matchAll(/<title>/g)].length, 1, `${path}: one title`);
  }
}
const sitemap = readFileSync('out/sitemap.xml', 'utf8');
for (const [en, de] of pairs) {
  assert(sitemap.includes(`<loc>https://mondextcg.com/${en}</loc>`), `sitemap: /${en}`);
  assert(sitemap.includes(`<loc>https://mondextcg.com/${de}</loc>`), `sitemap: /${de}`);
}
assert.match(sitemap, /xhtml:link/, 'sitemap: language alternates');
assert(existsSync('out/.nojekyll'));
assert.equal(readFileSync('out/CNAME', 'utf8').trim(), 'mondextcg.com');
assert(existsSync('out/404.html'));
// Invitation links: the page, and 404.html sending /i/<code> to it first thing.
const invite = readFileSync('out/i/index.html', 'utf8');
assert.equal([...invite.matchAll(/<h1\b/g)].length, 1, 'i: one heading');
assert.match(invite, /<meta name="robots" content="noindex, nofollow"/);
const notFound = readFileSync('out/404.html', 'utf8');
assert(notFound.indexOf("location.replace('/i/?'") > -1, '404.html: invitation redirect');
assert(
  notFound.indexOf("location.replace('/i/?'") < notFound.indexOf('<script src='),
  '404.html: redirect before the app',
);
assert(existsSync('out/sitemap.xml'));
assert(existsSync('out/robots.txt'));
assert.match(readFileSync('out/index.html', 'utf8'), /class="mx-form[^"]*"/);
const german = readFileSync('out/de/index.html', 'utf8');
assert.match(german, /<title>MonDex: Pokémon Karten Scanner, Wert &amp; Pokédex-App<\/title>/);
assert.match(german, /Vervollständige/);
for (const html of [readFileSync('out/index.html', 'utf8'), german]) {
  assert.match(html, /hreflang="de" href="https:\/\/mondextcg.com\/de\/"/i);
  assert.match(html, /hreflang="en" href="https:\/\/mondextcg.com\/"/i);
  assert.match(html, /property="og:image"/);
}
console.log(
  'PASS: 11 pages (4 German), legacy German URLs, assets, internal links, hreflang pairs, JSON-LD, sitemap, waitlist form and invitation links.',
);
