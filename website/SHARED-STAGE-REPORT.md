# Shared card stage and next-step navigation

The opening still places the logo behind the original card fan. Subsequent chapters give the brighter, thicker logo a smaller free area beside the cards, diagonally above them on mobile. Repeated central logo reveals are removed. Scan, grid and stack motion remain, with shorter idle scroll intervals and a reduced overall story height.

The scroll cue advances from the currently visible chapter and exits to the feature windows after Understand. Chapter markers, text visibility and the cue use the same timeline.

Executed against the final local static build:

- Lint, TypeScript and production build succeeded.
- `scripts/verify-shared-stage.mjs`: Chromium at 1440×900, 1280×800, 1001×900, 842×837, 390×844 and 360×800. Cold-load headline bounds and font match the hydrated page. Native chapter navigation selects the correct chapter, including after resizing. Forward, backward and interrupted scroll samples cover 2,759 rendered frames with no intersecting card volumes (minimum gap 0.12 world units). All settled chapter compositions have positive card-to-logo clearance. No horizontal page overflow or browser errors. Reduced-motion mode has four static chapters without the WebGL canvas.
- Screenshots of the opening and all three subsequent chapters were captured per viewport. Desktop and mobile compositions were visually inspected. The initial logo posters were regenerated from the actual geometry and material.
- `scripts/verify-scroll-cue.mjs`: at 1440×900, 842×837 and 390×844, four successive cue clicks advance through all chapters and land on the feature windows. Scrolling back restores the first destination. After switching to German, keyboard Enter advances to Capture and updates the next destination. No page errors.

Evidence is in the ignored `qa/shared-stage/` directory. Testing used desktop Chromium with viewport emulation, not physical iPhone or Safari. Unrelated feature loops and portfolio interactions were not retested in this change.

## Follow-up: continuous Orbit and tighter portfolio spacing

Added a 12-second 3D tilt/roll and small upward float, gated by the existing shared-stage transition. The opening geometry and loading poster remain unchanged. The phase clock stops with manual pause, when offscreen, and when the document is hidden; the existing reduced-motion presentation stays static. The set-to-portfolio spacing is now 104px on desktop/tablet and 72px on phones.

Executed `npm run lint`, `npm run typecheck`, `npm run build`, and `scripts/verify-orbit-loop.mjs`. The browser test covers 1440×900, 842×837 and 390×844, sampling more than one complete 12-second loop in each of Capture, Collect and Understand. All samples keep the complete logo clear of the cards and within the viewport; sampled yaw spans about 30 degrees per cycle. The untouched opening settles without continuous WebGL redraws. Manual pause freezes the pose and redraw count; resume restarts movement; leaving the story stops rendering. Portfolio gaps match the intended 104/72px. No browser errors or horizontal overflow. Reduced motion renders the static chapters without a WebGL canvas. Desktop and mobile screenshots were inspected; evidence is under ignored `qa/orbit-loop/`.

Document-hidden handling was verified in source, not by switching a physical browser tab. Tests use Chromium viewport emulation, not a physical mobile device.
