# ADR-0013: The terrain is contoured from a composed height field

- **Status:** Accepted
- **Date:** 2026-10-11
- **Question:** are the contour lines behind the masthead and the footer drawn by
  hand, or generated?

## Context

On 2026-10-11 Michael's verdict on the terrain was that it did not look like a map.
The requirement, in Michael's words: it is fine if the cities or the landscape are not
recognised, but it must be clear at first sight that this is a map and that it has a
river. The place stays the narrow stretch of the Anduin between Minas Tirith and
Minas Morgul.

The hand-drawn version failed that in four specific ways, all visible in a
screenshot:

- **The landforms did not share a surface.** Hills were sets of concentric ellipses,
  the plain was three parallel strokes that started and stopped in open ground, the
  valley was two chevrons hanging in the air. Each read as a separate ornament — tree
  rings, not terrain.
- **The river ignored the ground.** No contour crossed it. On a map, every contour
  that reaches a river turns upstream and crosses it in a V; that V is the single
  strongest cue that a line is water in a valley. The footer was worse: the river ran
  straight over horizontal lines without disturbing them.
- **The art stopped at 1280px.** Both SVGs had a fixed width, so any wider window
  showed the drawing end mid-band.
- **No index contours.** Every line had the same weight and the same 9–11.5% opacity.

Fixing these by hand means keeping a few dozen lines mutually consistent — nested,
never crossing, V'd at every crossing — and doing it again for the narrow variant,
which design.md §10 already listed as an open problem ("redrawn per breakpoint by
hand rather than derived").

## Options

### A - Redraw by hand, better

Full control over every line, and the smallest possible output. But consistency is
then a matter of care rather than construction, across two breakpoints and two
terrains, and every later change to the composition is a redraw. The first version
already showed where that ends.

### B - Trace real elevation data, or Tolkien's map

A real DEM would give real-looking contours for free. But the place is fictional, so
any DEM is somewhere else pretending; and tracing Tolkien's map artwork was ruled out
in design.md from the start. Both also give up the composition: the massif, the
river, the range and the vale exactly where the layout needs them.

### C - Compose a height field from landforms, contour it at build time

Landforms are written as a handful of parameters — a ridge line with heights and
falloff widths, a river course with a falling water level, a stream that cuts a vale
— and summed into one height field. Marching squares traces it at a fixed interval.
Consistency is by construction: every line is a level of the same surface, so lines
nest and never cross, and every contour that reaches the river crosses it in a V
because the water level falls along the course while the banks rise. The narrow
variant is the same world at a smaller scale. Placement stays hand-composed, so this
is still drawn, not traced.

Costs: roughly 400 lines of TypeScript, about half a second of build time, and
output far larger than twenty hand-drawn paths.

## Decision

**C.** The landforms are in `src/lib/terrain.ts`, the contouring in
`src/lib/contour.ts`, both run at build time only. The page river's meander moved to
`src/lib/meander.ts` so the footer terrain can cut its contours exactly where the
footer river is drawn.

The lines are served as four standalone SVG files from
`src/pages/terrain/[name].svg.ts` and pulled into the page with `<use>`. Inlined,
they would have taken every page from 14 KB to 70 KB; as files they are fetched once
and cached. Colour, weight and opacity are set on the `<use>`, so the tokens stay in
CSS. Each URL carries a hash of its contents, so a changed map is a new URL.

## Consequences

- A change to the terrain is a change to parameters, judged by building and looking.
  Nobody edits a path by hand any more, and nobody should.
- Two layout values are **mirrored** into `terrain.ts`, because build-time art cannot
  read CSS: `RIVER_LEFT` (from `--river-left`) and `FOOTER_OFFSET` (the height of the
  footer above its terrain, measured from the built page: 188px wide, 212px narrow).
  If either changes without the other, the masthead river exits off the article
  river's axis, or the footer V's drift off the footer river. The drift is visible,
  not silent — but only to someone looking.
- The noise is seeded, so a build reproduces the same lines byte for byte. Changing a
  seed changes the whole map.
- Same-origin `<use>` of an external SVG must keep working in every browser the site
  supports, and the host must serve `.svg` as `image/svg+xml`.
- Page HTML grows by about 2.5 KB for the inline rivers; the four terrain files are
  54 KB, 22 KB gzipped, once per visitor.

## Revisit when

- The footer's content changes height — re-measure `FOOTER_OFFSET`, or derive it.
- Michael wants the place itself recognisable (the city on its spur, the vale's
  fortress). That is more landform detail, not a different approach.
- Build time becomes noticeable, or the 720–1280 tablet layout is designed and wants
  its own terrain window.
