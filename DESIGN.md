# MonDex design system

## Direction
Operate mode. A quiet collector's archive with the feel of a premium iPhone app. Artwork provides the color; dark neutral surfaces and restrained violet guide actions. The user supplied a precise visual and interaction brief, which governs the design.

## Tokens
Background #0d0e12; raised surface #191a21; secondary #21222b; foreground #f4f3f5; secondary text #9c9da9; accent #9581ef; action #9981e9; success #89c79d; divider #ffffff0e. System Apple/Inter/Helvetica sans. Main screen title 29px, collection total 42px, section 20px, card titles 13–14px, metadata 10–12px per supplied brief. App maximum width 430px; mobile padding 20px; desktop padding 24px. Four-pixel spacing foundation. Cards 6–9px radius, controls 7–11px, main goal 16px.

## Layout
Persistent five-item navigation. Mobile view fills screen; desktop centers the same app, no dashboard transformation. Cards appear directly on the screen without outer containers. First viewport exposes collection summary, ongoing path, quick actions and recent card art.

## Motion
Ease cubic-bezier(.22,1,.36,1). Press 160ms, root/detail push 300ms, sheets 400ms, scan result 450ms, recognition 1150ms. Card detail has limited pointer tilt and a single holo sweep. Dex discovery resolves silhouette to artwork. Portfolio line draws after period changes. Binder turns on a left origin. Reduced-motion disables animation and tilt.

## Components and state
Reusable CardArtwork, CardGrid, PokemonGrid, Segments, Picker, Chart, Goal and headings. Bundled Radix/Shadcn tabs, sheets, dialog, selects, switch, progress, and sonner. Client hash routing, back navigation, persistent local mock collection and preferences. Scan and grading explicitly simulated; no camera permissions. Market values explicitly samples.
