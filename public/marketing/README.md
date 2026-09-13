# Website demo assets

These WebP images are size-optimized derivatives of the existing project files in `public/assets/`. Card artwork uses 640px and 240px variants; Pokémon artwork uses 240px images. The original source records are in `public/assets/provenance.json`. No new third-party artwork was fetched for this website.

The Orbit mark is copied unchanged from `/Users/bleon/MonDex/mobile/assets/brand/orbit.svg` to `public/brand/orbit.svg`. Replace that single SVG to update the website brand mark. `public/favicon.svg` contains the same original mark as the browser icon.

Asset paths, displayed card labels and demonstration data live in `components/marketing/data.ts`. Card labels use localized Pokémon names; card artwork remains in its source language. The scan demo applies stylized lighting, not an authentic printing-specific mask. Verify public-use rights before publication; inclusion in this prototype is not evidence of a separate license grant.

Asset audit: the legacy file `card-mewtwo.png` actually depicts Comfey SWSH242. The website labels this card correctly as Curelei; the existing filename is retained for traceability.
