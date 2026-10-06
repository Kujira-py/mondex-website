# MonDex website

The current MonDex marketing website at https://mondextcg.com, published using GitHub Pages.
Next.js static export and React, with no animation library: every scene moves on the
compositor (transform and opacity), driven by one scroll loop in `src/home/motion.ts`.
English is the default, with a German language switch.

## Home page

- `src/home/Home.tsx` composes the chapters; `Scenes.tsx` holds them, `Device.tsx` draws the
  iPhone and the MonDex screens in HTML (no screenshots), `copy.ts` holds every word.
- Scroll-linked parts read `--p` from their `[data-scene]`; loops run only while on screen;
  with Reduce Motion the page is still and complete (`motionScript.ts` decides before paint).
- `src/lib/launch.ts` switches every call to action from the launch list to the App Store.
- Smoothness check: `npm run build:pages`, serve `out/`, then `npm run qa:scroll -- http://127.0.0.1:<port>/ 4`
- Set logos (catalogue section): `node scripts/prepare-sets.mjs` fetches the chosen English and Japanese logos and the set counts from MonDex's API into `public/assets/sets/` and `src/home/sets.ts`
  (CPU throttled 4x, reports frames over 20 ms).

## Develop and publish

Use Node 22 or later. Run `npm ci`, then `npm run dev`.
Before publishing: `npm run lint`, `npm run build:pages`, `npm run verify:pages`.
Pushes to `main` build this directory and deploy `website/out/` using the repository’s root `.github/workflows/pages.yml`.
The existing custom domain is preserved. Previous `/de/` links redirect to the matching page in German.

## Waitlist

The form submits directly to `https://mondex-api.onrender.com/api/v1/waitlist`.
It sends an email address, optional first name and phone platform, selected website language,
a campaign tag (otherwise `website-launch`) and the existing honeypot field.
No account or API secret is required. The backend must allow the production domain through CORS.
Pending, confirmation, invalid input, rate-limit, timeout and connection errors are handled in both languages.
Do not submit real test addresses without the owner's authorization.

The legal and privacy pages retain the marked operator and retention placeholders from the source
material until the owner supplies those facts.

## Search (SEO)

- **Pages in both languages:** the home page (`/`, `/de/`) and three guides, each with a German URL of its own: `/pokemon-tcg-scanner/` ↔ `/de/pokemon-karten-scanner/`, `/pokemon-card-value/` ↔ `/de/pokemon-karten-wert/`, `/pokemon-card-collection-tracker/` ↔ `/de/pokemon-karten-sammlung/` (`src/lib/guides.ts`). They link each other with hreflang (`de`, `en`, `x-default`), in the page head and the sitemap. On these pages the URL decides the language; contact and legal pages exist once and switch in place.
- **Guides** (`src/lib/feature-content.ts`): title (~60 characters), description (~155), h1, sections and FAQ per language. Value searches are far larger than scanner searches (DE "pokemon karten wert" ~70× "pokemon karten scanner", Google Trends, Oct 2026), hence the value guide.
- **Structured data** (`src/lib/structured-data.ts`): Organization, WebSite, MobileApplication (free download and both Plus prices as shown on the page), FAQPage on the home page; WebPage + BreadcrumbList + FAQPage on guides. Only facts the page shows; no ratings until the App Store has real ones.
- `lang="de"` is written into German pages by `scripts/prepare-pages.mjs` (the root layout renders `en`); old German URLs redirect to their German page.
- Link previews: `public/og.jpg`, `public/og-de.jpg` (`node scripts/make-og.mjs` with a static server on `out/`).
- After each deploy the workflow sends the sitemap's URLs to IndexNow (Bing, and the AI search tools built on it). Google reads the sitemap through Search Console.
- No superlatives we cannot prove (German UWG) and no competitor names.
