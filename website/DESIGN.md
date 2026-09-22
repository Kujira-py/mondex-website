# MonDex website — spatial collecting, revision 2

## Direction

Persuade / Experience. The original phone-and-screenshot design was rejected by the user. This replacement uses **no app screenshots or screenshot crops**. The real MonDex wordmark, Onest font, Orbit geometry, existing Pokémon card artworks and portraits carry the identity.

A pale lilac product studio opens the page. Large, centred typography sits above a fan of real 3D cards. An extruded Orbit is a reflective sculpture in the same scene. Mouse movement changes perspective and foil; individual cards lift towards the viewer. The visual story continues into a dark scanner studio, a rearranging collection, a sculptural portfolio and a dark Pokédex.

## Tokens

- Ink `#17141e`, paper `#f0edf5`, white `#fbfaff`.
- App night `#0d0e12`, surface `#191a21`, original lilac `#b19af9`.
- Accessible deeper lilac `#7151ba` for large type on light surfaces.
- Onest variable, locally hosted under OFL. Headings 550 weight, compact tracking; body 400–550.
- Desktop headline up to 98 px; section headings 44–76 px. Mobile hero 50–55 px, section headings 35–43 px.
- Content width 1280 px; fluid outer margins 24–80 px. Large editorial spacing rather than repeated card containers.

## Compositions compared

`qa/redesign/desktop-hero.png` and `desktop-variant-editorial.png` record two rendered alternatives. The centred composition was selected: it relates the headline to the fan; the editorial alternative leaves an unhelpful top-right void. Independent design review agreed. The variant remains inspectable at `?composition=editorial`.

## Materials and interaction

- R3F: five textured, rounded cards with thin solid edges; Orbit extruded from the original SVG paths.
- Studio area lights and physical metallic Orbit material; no external HDRI.
- Original card shader: directional pearlescent band, fine grain and pointer-dependent glare; no looping rainbow or particle field.
- Collection/feature cards: CSS perspective and original blended foil gradients. GSAP returns pointer transforms to rest.
- One visual language, different section layouts: centred hero; scanner stage and numbered sequence; full-width reorganising artworks; angled portfolio plinth; portrait index.
- Illustrations explain product capabilities. No invented app UI, market series, prices, adoption metrics or store badges.

## Responsive and accessibility

Desktop story: text and objects share a wide stage. Below 1001 px, story text sits above a centred scene. Phones show the central cards with intentional peripheral cropping, and all five cards have named HTML selection buttons. Mobile selection controls have 44 px targets and a touch-specific instruction. The binder leaves its centre fold free.

Semantic headings/navigation, skip link, roving tab keyboard support, visible focus, reduced-motion media support, manual motion toggle, static no-WebGL/no-JS card illustrations. Original artwork detail remains legible when selected, but essential product explanations are HTML.

## Reference research

See REFERENCES.md. Reused principles are scale, visual continuity, lighting, selection and direct manipulation. No proprietary competitor assets/code were copied.

## Language

English is the default. A persistent EN/DE control stays visible in the desktop and mobile header, with two 44 px buttons. The full page, accessibility names, Pokémon index names and document metadata switch together. Printed card names retain the pictured English editions. The preference is restored from a first-party cookie by the client before the interactive page is ready. The static HTML defaults to English. Language changes preserve scene and interaction state.

## Refinement — September 2026

The latest user brief explicitly permits genuine MonDex UI. The studio palette,
Onest typography and card-first composition remain. Scanner match/printing/
confirmation and Portfolio value/history/holdings are now faithful web adaptations
of `mobile/src/collector/ScanReview.js` and `PortfolioProfile.js`; no phone mock-up,
personal screenshot, camera service or live price connection is embedded.

Motion explains a card's journey. Capture isolates a card, Collect arranges a grid,
Understand pairs the cards with set progress. A selected mobile hero card comes to
the centre. Manual pause freezes the mounted scene; OS reduced motion and genuine
WebGL failure use the separate readable static composition.

Collection uses fixed 190 px layout geometry and simultaneous GSAP position,
rotation and scale interpolation, including interrupted changes. Layout, selection
and foil transforms have separate owners. The 8/9 binder completes in 800 ms and
can be replayed. The scanner waits for its first viewport arrival and then keeps
explicit, user-controlled states when scrolling back.

Exactly one new continuous feature: twelve original artworks in a DOM discovery
rail. Its speed is 30 px/s with identical duplicated groups and no seam gap.
Visibility, document visibility, keyboard focus and a pause control gate the
loop. Pointer hover and mouse clicks keep it moving. Mobile and reduced motion use native scrolling and snap instead.

Portfolio uses fixed, explicitly labelled demo values. The same three holdings
sum to every plotted point, ending at $200 ($50 + $25 + $125), from $160 (+25%).
The SVG line draws once in 1.1 s; pointer, touch and arrow keys inspect dates.
No actual user holdings, market feed or investment claim is implied.


## Motion follow-up — September 21, 2026

The supplied video adds a four-window product composition after the hero. Its
scanner, Pokédex, offline pack and binder surfaces use illustrative HTML/CSS app
views and original card assets; no private screenshots are included. Phone rims,
OLED surfaces, restrained perspective and a physical binder provide depth.
The user approved these windows and rejected circulating cards around them.
Motion now stays inside the windows: a card settles into the scan frame before
a finite scan/recognition sequence; a Pikachu card resolves into its Pokédex entry;
the last binder card settles into a pocket. Desktop hover replays the finite scan
and Pokédex sequences. Mobile uses viewport entry and the binder button. System
reduced motion renders static completed scanner/Pokédex views and instant binder
changes. There is no decorative orbit or continuous loop in this section.

The hero's HTML loading cards share the WebGL camera projection and initial poses.
A shared rig resolves the full rotated card depth extents after interpolation,
maintaining a fixed stacking order and 0.12 world-unit separation on every frame.
Selection lifts cards within their depth lane; it never changes stacking order.
The scanning hold no longer starts the collection morph prematurely.

## Selected directions — 21 September 2026

The approved 1A / 2A / 3A / 4B replaces the physical feature binder with nine translucent digital pockets and two themed, 12-second collection sequences. Cards enter their own sleeves; there are no page turns. The existing lavender feature-window surface remains.

The offline illustration now loses its connection, recognises a card locally and confirms it while the downloaded scan pack stays ready. It has no second scan beam. Pocket and offline loops use GSAP and the existing viewport/visibility/manual-pause/reduced-motion controls.

The Living Dex shows 24 matching Pokémon and printed cards. Owned examples remain coloured, missing examples remain silhouettes, and explicit selection reveals the portrait and matching card alongside the desktop grid. On phones the detail follows the grid; selecting scrolls to it, and a return control brings the selected Pokémon back into view. Ownership and values remain illustrative.

The hero keeps its chapter compositions. At each transition cards open two clear lanes around the Orbit, then rejoin the next composition. Shared continuous poses and post-interpolation physical depth separation remain authoritative. The first reveal stays below the central heading.

First paint uses a 34 KB WOFF2 subset of the existing Onest embedded in the stylesheet, plus transparent initial-frame Orbit renders generated from the real scene. No remote font dependency or flat-to-3D logo swap. Existing EN/DE copy and original brand artwork remain in use.

## Shared card stage — 22 September 2026

The user superseded the brief central Orbit reveals with a shared composition (4A), preserving the opening mark behind the card fan. After the opening, the mark moves continuously to its own smaller side position. Desktop cards retain their scan, grid and stack compositions; on phones the mark sits diagonally above the cards. In the final desktop chapter it rises to leave room for the existing collection count. The cards remain the primary subject, with full physical depth separation through interruptions and reverse scroll.

The original logo outlines and directional pale gradients remain. Extrusion increases from four to eight SVG units, with restrained bevels and lighter lavender edges. Transparent loading posters are regenerated from the actual new material. The opening positions and card sizes remain unchanged.

The story uses 330svh on desktop and 315svh on mobile, replacing 420/365svh and fixed minimum scroll lengths. Continuous moves receive most of the timeline; settled holds are shorter. Native chapter markers follow the same timing, including resize. The lower-left scroll cue now follows the visible chapter: capture, collect, understand, then feature windows.

## Orbit movement and portfolio rhythm — 22 September 2026

The shared side composition now includes a quiet 12-second loop. The complete original mark gently turns in three dimensions and rises a few pixels so its bevel and lavender edge highlights remain visible even when scrolling stops. A local frame clock freezes with Pause motion, outside the story viewport, or in a hidden document. Reduced motion keeps the static presentation. The opening fan and its matched loading poster remain still until the shared-stage transition begins.

The gap between the set row and portfolio heading now comes from two coordinated section insets, instead of three cumulative paddings: 104px on desktop/tablet and 72px on phones. The lavender fade remains, with a shorter 180px transition matched to the tighter section spacing.
