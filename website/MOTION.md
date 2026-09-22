# MonDex motion — revision 2

## Ownership

GSAP ScrollTrigger drives only `SceneController.progress` (0–3) and HTML chapter opacity/translation. R3F samples card poses and exclusively writes mesh transforms. Hover/selection offsets are added to those sampled poses and exponentially damped. There is no React state update per frame. CSS feature-card layout belongs to the outer wrapper; pointer tilt belongs to the inner face.

## Main sequence

Native page scrolling, CSS sticky viewport; no scroll-jacking. Desktop story 420 svh; mobile 365 svh. Timeline duration is a normalised 10 units, scrub 0.55 seconds.

| Range     | Composition                                                           | Purpose                                                               |
| --------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 0–1.1     | Five-card fan, centred headline, reflective Orbit                     | Product identity; direct pointer interaction and named card selection |
| 1.1–2.75  | Same central Mew card moves into scanner brackets, other cards recede | Physical card enters capture stage                                    |
| 2.75–4    | Scan line crosses the card; text explains review and confirmation     | Describe the workflow without a speed claim                           |
| 4–5.55    | Cards form a compact, angled collection                               | The same card joins an organised group                                |
| 5.55–6.65 | Hold                                                                  | Reading interval                                                      |
| 6.65–8.15 | Cards spread in depth around the Orbit                                | Wider overview of collection and goals                                |
| 8.15–10   | Hold and native transition to feature sections                        | Stable reading and exit                                               |

Every state reverses through the same progress function. Fast scroll direction changes do not enqueue animations. Only the visible chapter is interactive; other chapters are inert. Section links remain real anchors.

## Direct manipulation

Mouse movement drives camera-relative parallax, selected-card tilt and foil direction. Hover lifts a card towards the viewer; click or a named HTML selector retains selection. Select again to return it to the fan. Touch uses the same explicit selection. Damping uses a frame-rate-independent exponential with a 40 ms delta cap. Rendering settles when differences fall below tolerance.

Feature cards tilt over 320 ms and return over 650 ms. Collection layouts rearrange over 800 ms using a decelerating curve. Scanner controls change the illustrated capture/review/save step. The scan line runs only on a step change. Portfolio accordion selection also rearranges its two artworks. Pokédex filters and selection reveal illustrative progress states.

## Fallback and performance

- R3F `frameloop="demand"`, DPR capped at 1.5, environment rendered once at 128 px. No post-processing, continuous idle loop, remote models or HDRI.
- IntersectionObserver suppresses input/scroll invalidation offscreen; hidden documents are not deliberately animated.
- The initial HTML poster is available before the deferred scene loads. All screenshots and derivatives from the old website were removed from public assets.
- Reduced motion and missing WebGL show static card compositions with all four readable chapters. Runtime preference changes clean up ScrollTrigger and release inert panels. A manual motion switch is provided.
- CSS reduced-motion rule disables tilt and layout transitions. No-JS retains content, cards and anchors, with interactive-only filters hidden.

Actual measurements and browser limitations are recorded in QA.md; these design settings alone do not assert any device frame rate.
