import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://kujira-py.github.io/mondex-website").replace(/\/$/, "");
const base = new URL(origin).pathname.replace(/\/$/, "");
const decode = value => value.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
const attr = (tag, name) => decode(tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1] || "");
const htmlPath = url => {
  const relative = decodeURIComponent(url.pathname.slice(base.length));
  return join("out", relative.endsWith("/") ? `${relative}index.html` : relative);
};
const paths = ["/", "/pokemon-tcg-scanner/", "/digital-pokemon-card-binder/", "/pokemon-card-collection-tracker/", "/kontakt/", "/datenschutz/", "/impressum/"];
const titles = new Set();
let pages = 0;
for (const locale of ["de", "en"]) for (const path of paths) {
  const url = new URL(`${origin}${locale === "en" ? "/en" : ""}${path}`);
  const html = readFileSync(htmlPath(url), "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`), `${url}: static HTML language`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${url}: one H1`);
  const title = head.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title && title.includes("MonDex"), `${url}: descriptive title`);
  assert(!titles.has(title), `${url}: unique title`); titles.add(title);
  const tags = head.match(/<(?:meta|link)\b[^>]*>/g) || [];
  const meta = (key, field = "name") => attr(tags.find(t => attr(t, field) === key) || "", "content");
  const canonical = attr(tags.find(t => attr(t, "rel") === "canonical") || "", "href");
  assert.equal(canonical, url.href, `${url}: canonical`);
  for (const lang of ["de", "en", "x-default"]) {
    assert.equal(attr(tags.find(t => attr(t, "hreflang") === lang) || "", "href"), `${origin}${lang === "en" ? "/en" : ""}${path}`, `${url}: alternate ${lang}`);
  }
  assert(meta("description").length > 70, `${url}: description`);
  const indexable = !["/kontakt/", "/datenschutz/", "/impressum/"].includes(path);
  assert.equal(meta("robots").includes("noindex"), !indexable, `${url}: indexing policy`);
  assert.equal(meta("og:url", "property"), url.href);
  assert.equal(meta("og:title", "property"), decode(title));
  assert.equal(meta("twitter:card"), "summary_large_image");
  const og = new URL(meta("og:image", "property"));
  assert(existsSync(htmlPath(og)), `${url}: social image exists`);
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  assert(json, `${url}: structured data rendered without JavaScript`);
  const graph = JSON.parse(json)["@graph"];
  assert(graph.find(item => item["@type"] === "WebPage" && item.url === url.href));
  assert(graph.find(item => item["@type"] === "SoftwareApplication" && item.creativeWorkStatus === "In development"));
  assert(!json.includes('"aggregateRating"') && !json.includes('"offers"'), "No invented ratings or pricing");
  for (const tag of html.match(/<(?:a|img|link|script)\b[^>]*>/g) || []) {
    const href = attr(tag, "href") || attr(tag, "src");
    if (!href || href.startsWith("data:") || href.startsWith("mailto:")) continue;
    const target = new URL(href, url);
    if (target.origin !== url.origin) continue;
    assert(target.pathname.startsWith(base + "/"), `${url}: correct project base for ${href}`);
    assert(existsSync(htmlPath(target)), `${url}: local target exists: ${href}`);
  }
  pages++;
}
const sitemap = readFileSync("out/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]));
assert.equal(urls.length, 8, "Home and three feature pages in both languages");
assert.equal(new Set(urls).size, 8);
assert(urls.every(url => url.startsWith(origin + "/") && existsSync(htmlPath(new URL(url)))));
assert(!sitemap.includes("localhost") && !sitemap.includes("kontakt"));
assert(existsSync("out/.nojekyll"));
assert.match(readFileSync("out/404.html", "utf8"), /noindex/);
console.log(`PASS: ${pages} pre-rendered pages, 8 sitemap URLs, localized metadata, structured data and internal assets/links.`);
