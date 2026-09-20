# Website demo assets

These WebP images are size-optimized derivatives of the existing project files in `public/assets/`. Card artwork uses 640px and 240px variants; Pokémon artwork uses 240px images. The original source records are in `public/assets/provenance.json`. No new third-party artwork was fetched for this website.

The Orbit mark is copied unchanged from `/Users/bleon/MonDex/mobile/assets/brand/orbit.svg` to `public/brand/orbit.svg`. Replace that single SVG to update the website brand mark. `public/favicon.svg` contains the same original mark as the browser icon.

Asset paths, displayed card labels and demonstration data live in `components/marketing/data.ts`. Card labels use localized Pokémon names; card artwork remains in its source language. The scan demo applies stylized lighting, not an authentic printing-specific mask. Verify public-use rights before publication; inclusion in this prototype is not evidence of a separate license grant.

Asset audit: the legacy file `card-mewtwo.png` actually depicts Comfey SWSH242. The website labels this card correctly as Curelei; the existing filename is retained for traceability.

## Current app captures

The images in `public/marketing/app/` were captured on September 20, 2026 from a fresh Release build of the local MonDex iOS project at `/Users/viganmustafa/Desktop/Code/MonDex` (branch `bug-fixing`, commit `34facc4b44a7cdf4f04c6be42502653630761ed1`, with the owner's existing staged app changes left intact). They show the app's bundled sample collection in an iPhone 17 Pro simulator running iOS 26.0.

The website uses 603×1311 WebP derivatives at quality 86. These are development-build examples, not App Store release screenshots or a guarantee of the final launch feature set. Public-use rights for the Pokémon and card imagery shown inside the app captures still need to be verified before publication.
