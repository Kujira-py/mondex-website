# Selected MonDex directions and initial-load correction

Implemented 1A (digital pockets), 2A (offline recognition), 3A (24-item Living Dex), and 4B (brief unobstructed Orbit between chapters). Existing feature-window surfaces, card identities, language switch and remaining sections are preserved.

Observed before the load fix: a cold load with delayed font/JavaScript showed the fallback font and a flat Orbit SVG before switching to Onest and the bevelled WebGL Orbit. The new first paint uses the original font subset in CSS and first-frame transparent renders of the real 3D material. Default English headline geometry was identical before and after hydration at 1440×900, 842×837 and 390×844. Initial card projection error was below 0.56 px across five sizes.

Executed:
- `npm run lint`, `npm run typecheck`, `npm run build`.
- `node scripts/verify-selected-directions.mjs`: 1440×900, 842×837, 390×844; all three Orbit reveals clear every projected card; pocket loop sampled across both themes and wrap; feature pause; 24 Pokémon; 16 discovered / 8 missing filters; matching portraits/cards; English/German; keyboard selection; reduced-motion static presentations; no browser errors or horizontal overflow. Living Dex axe: no violations.
- `node scripts/verify-motion.mjs`: 1440×900, 1280×800, 768×1024, 390×844, 360×800; forward/reverse/interrupted scroll, card hover/selection, collision sampling, load poster matching, feature accessibility, rail hover/pause, German. No intersecting card volumes; minimum depth gap 0.12 world units; no feature axe violations.
- Focused final 842/390 check covers the pocket-caption inset and phone detail/return navigation. Screenshots are under the ignored `qa/selected-directions/` directory.

Limits: automated Chromium viewport emulation, not physical iPhone/Safari testing. Offline recognition and collection ownership are illustrative marketing animations; no real camera, user collection, or account data is accessed. The older physical-binder reports describe historical versions and are not evidence for the new pocket illustration.
