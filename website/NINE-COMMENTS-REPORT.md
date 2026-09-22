# MonDex — Design revision, 21 September 2026

## Scope

1. Orbit material now uses saturated MonDex violet/lilac with restrained specular highlights. Hero geometry and depth safety are unchanged.
2. Scanner phone: four different cards cycle through arrival, a descending violet scan trail, recognition and departure (32 seconds total). GSAP.
3. Pokédex phone: 24 Pokémon across generations 1–9 in a seamless 85-second CSS loop.
4. Offline window: unchanged, following the user’s explicit reply.
5. Binder: actual Three.js geometry for the cover, rings, two-sided curved sleeve pages and inserted cards; 26-second cycle. Static open-binder fallback without WebGL; reduced motion shows an open spread.
6. Collection detail: selected artwork, set, card number and illustrator, plus working set/binder shortcuts. Reduced unnecessary vertical space.
7. Opposite-direction set strip: all 174 entries in the bundled MonDex catalogue (snapshot 2026-09-11). 139 distinct logo images, since some subsets/promos share logos. No claim that the catalogue covers every set ever printed.
8. Portfolio uses exact English card variants, PriceCharting’s ungraded USD estimates and monthly source series, checked 2026-09-21.
9. Pointer, touch and keyboard chart selection updates the prominent value, month and change above the chart.

18 additional real card artworks and 24 additional official-art Pokémon portraits. Public-source provenance is recorded in public/assets/catalogue-provenance.json. No private app screenshots or user collection data.

## Pricing basis

| English Pokémon 151 card | Ungraded estimate (USD) | Source |
|---|---:|---|
| Pikachu 173/165, Illustration Rare | $74.13 | [PriceCharting](https://www.pricecharting.com/game/pokemon-scarlet-%26-violet-151/pikachu-173) |
| Mew ex 205/165, Hyper Rare, printed card (not metal) | $24.33 | [PriceCharting](https://www.pricecharting.com/game/pokemon-scarlet-%26-violet-151/mew-ex-205) |
| Charizard ex 199/165, Special Illustration Rare | $350.00 | [PriceCharting](https://www.pricecharting.com/game/pokemon-scarlet-%26-violet-151/charizard-ex-199) |
| One of each | **$448.46** | Sum of the three source estimates |

Historical series: the public `VGPC.chart_data.used` monthly buckets, cents converted to dollars, October 2025–September 2026. Dates are displayed as months; no fabricated daily prices or interpolated observations. Series are summed for one of each card. The September observation matches the current displayed estimate. These are dated source estimates, not a live feed or a price for a guaranteed condition.

## Executed checks

- `npm run lint`, `npm run typecheck`, `npm run build`.
- `scripts/verify-nine.mjs`: Chrome desktop 1440×900, tablet 842×837, mobile 390×844 and 360×800. Four scanner identities observed over a complete cycle; moving Pokédex, rail hover, reverse set motion, collection shortcut, chart pointer/keyboard/touch, EN/DE and viewport overflow checked. No page/console errors. Initial set-year contrast issue was fixed afterward.
- `scripts/verify-motion.mjs`: cold HTML/WebGL bounds, rapid card selection and forward/reverse story motion at 1440×900, 1280×800, 768×1024, 390×844 and 360×800. Maximum initial bound difference 0.554 px; zero depth intersections in 2,707 sampled frames.
- `scripts/verify-motion-fallbacks.mjs`: reduced-motion desktop/mobile, simulated missing WebGL, zero idle/paused/offscreen GPU draw calls, same hero canvas retained across pause/resume.
- `scripts/verify-nine-final.mjs`: complete binder cycle captured in ten states; corrected contrast checked with axe on desktop/mobile (zero findings); feature pause and mobile set pause verified, zero page/console errors.
- Numbered screenshots and raw local reports are in ignored qa/nine and qa/motion-final.

No physical iOS/Android devices, Safari or Firefox were tested.
