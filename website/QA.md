# MonDex website — final QA, revision 2

Checked locally on 21 September 2026 (Europe/Berlin). This report applies to the card-based redesign, not the rejected screenshot-based first draft.

## Build and source checks

Passed `npm run lint`, `npm run typecheck`, and `npm run build` after the final source changes. The original redesign generated a static home route; language preference support now server-renders the route per request. Prettier 3.9.8 formatted source and scripts. npm installation audit reported 0 vulnerabilities at install time.

Confirmed that the runtime source/public assets contain no supplied app screenshots, screenshot crops, phone component or references to the old screen textures. The original app, backend and user-provided PNGs are unchanged. Root git status shows only the new `mondex-web/` directory.

## Browser and visual coverage

Local Google Chrome 153.0.8010.53 via Playwright, desktop DPR 1. Rendered and inspected:

| Viewport   | Hero and all story states | Horizontal page overflow | Page/asset errors |
| ---------- | ------------------------- | ------------------------ | ----------------- |
| 1440 × 900 | Passed                    | None                     | None              |
| 1280 × 800 | Passed                    | None                     | None              |
| 768 × 1024 | Passed                    | None                     | None              |
| 390 × 844  | Passed                    | None                     | None              |
| 360 × 800  | Passed                    | None                     | None              |

Desktop/mobile complete feature sections and all four collection layouts were captured. Initial visual findings fixed: CTA/card overlap; overly dark and dominant Orbit; tablet story clipping; mobile desktop-only pointer instruction; small card selectors; cards crossing the binder fold; missing space around a hidden line break. The centred hero beat the editorial variant in both local and independent design review.

Static fallback review caught and fixed horizontal overflow and a no-JavaScript mobile heading overlap. Final fallback captures show all four chapters, no Canvas and no horizontal overflow. Screenshots are under `qa/redesign-final/`; `corrections.json` records targeted final regression.

## Interaction and accessibility

- Real Canvas pointer hit tests, hover lift, selected-card focus, click and named HTML selectors.
- CSS foil responds to pointer position, and returns to rest. Five reusable GSAP quickTo tweens avoid creating a tween on every pointer move.
- Scanner capture/review/save illustration controls.
- Collection tabs: arrows, Home/End, roving tabIndex, selected state and labelled panel; card selection updates its metadata.
- Portfolio accordion; Pokédex filtering and silhouette reveal.
- Mobile menu, Escape focus return, nav-link and header-CTA closure.
- Forward/reverse scroll (independent review); rapid direction changes, live desktop-to-mobile resize and native wheel reversal additionally passed in `qa/redesign-final/stress.json`.
- All 19 internal link instances resolve to existing anchors.
- Manual motion toggle, initial/runtime reduced motion, missing WebGL and no-JavaScript readable narrative.
- Final axe WCAG 2 A/AA and 2.1 AA pass on desktop and mobile: **0 reported violations**. Earlier contrast findings on tabs, portfolio copy and footer were corrected. Automated axe does not certify every aspect of accessibility.

## Motion measurement and recording

`qa/redesign-final/performance.json` and `motion-trace.json` describe the recorded production sequence. Local unthrottled desktop Chrome, 1440 × 900, DPR 1:

- 14.30 seconds measured forward/reverse scrolling, 579 rAF interval samples.
- Median interval 16.7 ms; p95 16.8 ms; 0 sampled intervals over 34 ms.
- 0 main-thread long tasks during that measured motion segment. The initial load recorded one 57 ms task. The separate review observed an initial 96 ms task and a 90 ms Canvas-remount task.
- No observed layout shifts in the recording sample.
- Approximately 460 KB JavaScript transferred; roughly 1.36 MB total observed resource transfer in the recording sample. Cache state/local delivery affect these values.
- Independent WebGL instrumentation: **0 additional draw calls** over 1.8 seconds idle, 1.7 seconds after pointer settling, and 1.8 seconds offscreen.

The 19.17-second H.264 recording (`mondex-motion.mp4`, 1440 × 900, 60 fps container, approximately 5 MB) includes hover and the forward/reverse sequence. CDP captured browser frames and timestamps; ffmpeg encoded them. Container frame rate and rAF intervals do not establish physical-device FPS.

## Independent reviews

Design review checked actual captures and live selection. Performance review inspected live R3F state, wrapped WebGL draw calls, tested reverse states, keyboard navigation and reduced motion. See `qa/review-v2-performance.md` and `qa/review-v2-final.json`.

## Boundaries

No physical iPhone was available through the attempted CoreDevice connection; mobile results are browser emulation. Safari/iOS GPU behaviour, background-tab power consumption, low-end hardware and throttled-network delivery were not measured. R3F's current Three integration emits a THREE.Clock deprecation warning, with no observed rendering failure. The direct deprecated SVG shape helper was replaced with its current equivalent.

The site runs locally. The subsequent colleague-preview request authorizes a temporary public tunnel; this is not a permanent hosted deployment. Store URLs, legal contact data and public-use rights for Pokémon artwork remain publication inputs (PRODUCT-FACTS.md).

## Reproduce

Start the production server on port 3101, then run `npm run qa:browser`, `npm run qa:corrections`, and optionally `npm run qa:record`.

Encode the recording after capture:

```sh
ffmpeg -f concat -safe 0 -i qa/redesign-final/frames/concat.txt -r 60 -fps_mode cfr -c:v libx264 -crf 21 -pix_fmt yuv420p -movflags +faststart qa/redesign-final/mondex-motion.mp4
```

## English default and German switching — 21 September 2026

`npm run qa:language` passed against the updated production server. Evidence: `qa/languages/verification.json` and English/German screenshots.

- Fresh visits start in English even with a German browser locale. German and English preferences both survive reload; server-rendered HTML honours the preference before JavaScript. Invalid preference values safely use English.
- Complete product copy, navigation, document title/description, accessibility labels and Pokémon index names switch together. Card edition names stay faithful to the pictured cards.
- All five viewport sizes above were checked in both languages: no horizontal overflow, 44 × 44 px language controls.
- Live switching retains scroll position, the existing WebGL canvas, selected 3D card, collection tab, scanner step, portfolio panel, Pokédex filter and revealed Pokémon. Mobile navigation works across a language change.
- axe in English and German at desktop and mobile sizes: 0 reported violations. No browser or asset errors.
- Build, TypeScript and ESLint passed. The earlier German browser regression script now explicitly seeds the German preference; the motion recording remains evidence of the earlier German redesign and was not re-recorded for this copy change.

Public colleague preview verified via its HTTPS address: HTTP 200, full 3D scene ready, EN/DE switching and reload persistence passed, no browser or asset errors. See `qa/languages/public-preview.json`; operational details are in `PREVIEW.md`.

## Sites migration — 21 September 2026

The temporary public tunnel was stopped at the user's request. The same page now exports to static assets for Sites. The browser restores the saved language preference; without JavaScript the static fallback is English. This supersedes the earlier per-request server-rendering description. Build and the EN/DE browser checks passed against the actual static export, including reload persistence, retained scene/interaction state, five viewport widths, and axe in both languages.
