# ADR-0008: Astro components, and no Claude Design sync

- **Status:** Accepted
- **Date:** 2026-08-30
- **Question:** is the component library authored as Astro components or as React
  components, and does anduin.ch sync a design system to Claude Design?

## Context

`/design-sync` was attempted twice. On 2026-08-29 it could not run because no
component library existed at all. On 2026-08-30, with the library built, it still
could not run — and the second reason is architectural rather than a gap:

- The sync's `_ds_bundle.js` must expose components the design agent **mounts at
  runtime** from `window.<globalName>.*`. That requires client-mountable framework
  components.
- `.astro` files compile server-side only, into a render function that returns HTML.
  `client:*` directives apply to framework components, never to `.astro` ones. There
  is no client-side component to put in the bundle.
- Confirmed empirically rather than assumed: `astro build` emits nine HTML files, one
  stylesheet, and **zero JavaScript**.

The sync skill's escape hatch for exotic toolchains does not apply, because using it
would mean rewriting all ten components as React — and its governing rule is to ship
what was already built, never a reimplementation.

Two facts that make the alternative cheaper than it first looks, and are worth having
on record for whoever revisits this:

- **Porting is small.** The components carry no scoped `<style>` blocks — all styling
  is in the global stylesheet — so a port is `Astro.props` → a props argument,
  `<slot />` → `children`, `class:list` → a template string. Roughly an hour.
- **React would not cost visitors any JavaScript.** Astro server-renders framework
  components to static HTML unless a `client:*` directive is added.

And one that makes it more expensive than it looks: [ADR-0001](0001-framework.md)
already accepted a recurring Node toolchain tax, and named long untouched stretches as
where it lands hardest. `react` and `react-dom` compound exactly that risk.

## Options

### A - Keep `.astro`, no design-system sync

One runtime dependency. Nothing new to rot. Claude Design cannot be used to mock up
pages from the real components; design work goes through the canvas or straight to
code.

### B - Port the library to React `.tsx` with `@astrojs/react`

Unlocks the sync, and makes the components portable beyond Astro. Costs two more
dependencies on a site whose main maintenance risk is already dependency rot, and
`.tsx` is a worse fit than `.astro` for markup-heavy components — `Terrain` is twenty
SVG paths and nothing else.

## Decision

**A. The library stays in Astro, and anduin.ch does not sync a design system to
Claude Design.**

The sync's value is that a design agent can build new screens out of the real
components. The site has four page types and they are all built. Paying a permanent
dependency cost — on the exact axis ADR-0001 flagged as this site's weakest — to
speed up design work that is not queued up is the wrong trade today.

## Consequences

- **The design canvas is the specification of record.** `System.dc.html` and the page
  artboards are now the only place the design exists outside the code. That is a real
  ongoing obligation: when the components change and the canvas does not, it rots into
  a confident lie, which is the failure mode this whole harness exists to prevent.
  Updating it is part of changing a component, not a follow-up.
- **No mock-ups from real components.** New page types get designed in the canvas or
  written directly as Astro. There is no in-between.
- **The components are Astro-only.** Moving them to another framework means a rewrite,
  not a copy.
- **The toolchain surface stays at one runtime dependency**, which is the cheapest this
  decision can be kept.
- **Cheaply reversible.** Because there are no scoped styles, the port stays about an
  hour whenever the answer changes. Nothing here forecloses B.

## Revisit when

Sustained design work appears that the sync would actually accelerate: a redesign, a
second site sharing these components, or enough new page types that mocking them up in
code becomes the bottleneck. **Do not reopen merely because `/design-sync` is invoked
again** — that has happened twice, and this ADR is the answer.

## Addendum 2026-08-30 - the design record moved out of the canvas

The consequence above says the design canvas is the specification of record.
That was true for one day. Everything in the eight artboards that was not
already in the code is now written down in [design.md](../design.md) — the
provenance of both old sites, the two rejected directions and why they lost, the
tokens with their measured contrast, the type ramp, the grid, the map assets
including the river's anchoring rule, the component inventory, the page
compositions, the prohibitions, and what is still open.

**The decision in this ADR is unchanged.** What changed is where the design
lives: a markdown file next to voice.md, which is far easier to keep true than a
2.5 MB generated canvas, and which reads as an input to a design agent if the
port to React ever happens.

The `*.dc.html` artboards and `canvas.json` are therefore removable. The
published canvas at claude.ai is a separate artifact and is unaffected.
