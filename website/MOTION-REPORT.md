> Historical report. The later nine-comment revision and its loop animations are documented in [NINE-COMMENTS-REPORT.md](NINE-COMMENTS-REPORT.md).

# MonDex — motion follow-up, 21 September 2026

## Delivered

- Loading artwork and the interactive card scene now share a camera projection and initial poses. The poster is replaced only after the textured scene has rendered.
- A shared scene rig resolves complete rotated card depth extents after interpolation. A fixed stacking order and 0.12-unit gap separate every card volume, including hover, rapid selection, forward/reverse scroll and intermediate states. The scanner hold keeps its composition.
- Four product windows recreate the supplied reference's structure using illustrative HTML/CSS screens, real card artwork and the MonDex identity. The user approved the windows and rejected the initial orbit treatment. The final implementation has **no cards circulating around the windows**. Short scanner and Pokédex sequences play on entry and replay on desktop hover; the binder's last card slides into its pocket and can be reset/replayed.
- The horizontal discovery rail continues during pointer hover and mouse selection. Its explicit pause control, offscreen/document suspension and keyboard-focus pause remain. Mobile retains touch scrolling.
- English/German, system reduced motion and the static no-WebGL story remain supported. No mobile application/backend code or private screenshots were changed/included.

## Executed checks

`node scripts/verify-motion.mjs` ran in locally installed headless Chrome at 1440×900, 1280×800, 768×1024, 390×844 and 360×800. Evidence is in ignored `qa/motion-final/`.

- JavaScript requests were deliberately held before hydration. Measured loading-card bounds against the actual rendered R3F card corners: maximum differences 0.554, 0.501, 0.473, 0.396 and 0.378 pixels, respectively.
- Actual scene transforms sampled during rapid selection and complete forward/reverse story passes: **2,710 frames**, no overlapping Z intervals; minimum gap 0.12 world units (within floating-point precision).
- Scanner start/intermediate/settled states, Pokédex card resolution, binder automatic arrival and reset/place actions captured as separate viewport screenshots. Hover tilt/replay checked at desktop/tablet sizes. New window copy switched to German at all five sizes.
- Discovery rail travelled approximately 21 pixels during each 700 ms hover check at 1440, 1280 and 768 px. Mouse selection did not stop it. Explicit pause/resume and keyboard-focus pause passed.
- No horizontal document overflow at those sizes. Axe reported no violations in the new feature section. No JavaScript exceptions or browser console errors were captured.

`node scripts/verify-motion-fallbacks.mjs` checked reduced motion at desktop/mobile and unavailable WebGL at mobile. All four story chapters remained available, the feature binder control worked and no horizontal overflow occurred. Instrumented WebGL checks observed zero additional draw calls during settled, paused and offscreen intervals. Manual pause/resume retained the same Canvas.

Lint, TypeScript and the production build passed. Screenshots were visually inspected on desktop, tablet and mobile.

## Scope and limits

These were local Chromium checks with emulated mobile dimensions/touch; no physical-device or Safari/Firefox certification is implied. Continuous frame-rate benchmarking was not performed. One existing dependency warning remains: `THREE.Clock` is deprecated (R3F internals); it did not cause a captured browser error. The original loader mismatch was identified from its independent CSS and WebGL geometry; the numerical measurements above describe the corrected build.
