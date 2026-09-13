# MonDex search and publishing setup

Production: https://mondextcg.com/
German: https://mondextcg.com/de/
Sitemap: https://mondextcg.com/sitemap.xml

## Search content

The homepage introduces the Pokémon TCG scanning and collection app. Three focused feature pages answer different collector questions, each in German and English:

- `/pokemon-tcg-scanner/`: photo capture, reviewing a match, batch/opening workflows, printing and photo quality.
- `/digital-pokemon-card-binder/`: album organisation, the interactive binder demo and physical/digital distinctions.
- `/pokemon-card-collection-tracker/`: species/cards/copies, variants, collection views and the limits of demo prices.

The site describes an app in development. Do not add unsupported download links, rankings, testimonials, accuracy claims, review counts or live prices.

## Implementation

- All 14 language/page combinations are pre-rendered as HTML with correct language tags. No login or JavaScript is required to read the product information.
- Each page has a unique title, description, canonical URL and reciprocal `de`, `en`, `x-default` alternate links. English is the default at unprefixed URLs (also `x-default`); German has `/de/` URLs. Legacy `/en/` pages are still exported with canonicals pointing at the unprefixed English URLs, and they and old `?lang=en` links are rewritten to those URLs in the browser.
- Language links remain usable without JavaScript. With JavaScript, switching languages preserves the current demo state and synchronises the page metadata and structured data.
- Open Graph and Twitter preview metadata use local 1200×630 PNGs in both languages.
- JSON-LD describes the website, page, app in development and breadcrumbs. It does not invent offers or ratings. No enhanced Google result is promised.
- The sitemap includes the 8 indexable home/feature URLs. The unfinished contact, privacy and legal pages use `noindex, follow` until real content is supplied.
- Internal links connect each feature page to its demo, related features and the homepage. Existing lightweight images, dimensions, lazy loading and reduced-motion behaviour remain.
- The site is served from the root of the custom domain `mondextcg.com`, so `robots.txt` and `sitemap.xml` are the host-root files crawlers read. The project does not block indexing.

## Publish

`npm ci`, then `npm run build:pages` and `npm run verify:pages`.

The Pages build uses the installed Next.js static exporter and writes `out/`. The preview/Sites workflow can still use Vinext. Deployment defaults are set in `scripts/build-pages.mjs`; `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BASE_PATH` can override the production address and path prefix. The defaults target the custom domain `https://mondextcg.com` with no prefix; a build for `kujira-py.github.io/mondex-website/` would need `NEXT_PUBLIC_BASE_PATH=/mondex-website` and a matching site URL, otherwise styles, scripts and images 404.

Push the website source to `main` in `Kujira-py/mondex-website`. The GitHub Actions workflow builds, verifies and publishes only `out/`. A failing build or SEO verification prevents deployment. `.nojekyll` preserves Next.js static assets. Deep pages have their own `index.html`, and missing URLs use a real 404 page rather than an SPA redirect.

## Search Console: owner follow-up

1. Add the property `https://mondextcg.com/` (or a Domain property for `mondextcg.com`) in Google Search Console.
2. Verify ownership with Google's HTML verification file in `public/`, then publish it. This requires the owner's Google account; it was not performed as part of the code changes.
3. Submit `sitemap.xml` for that property and inspect the German and English homepages.
4. Monitor indexing, search queries, impressions and clicks. Refine content using actual collector questions and search data.

No sitemap submission, indexing or ranking claim is implied by a successful deployment. Google decides when to crawl and whether to index. Rankings also depend on competition, product credibility, useful content and links from relevant sites. Prefer one canonical production domain; the previously shared Sites copy is not the new canonical destination.

References checked for this implementation:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
