# ADR-0009: Build-time image optimisation

- **Status:** Accepted
- **Date:** 2026-08-30, decided 2026-10-12
- **Question:** does the build optimise images, and with what?

## Context

This requirement has only ever existed in one sentence, in the handoff brief's site
list: *"statically generated, internationalized, image optimization during the
build"*. Two of those three have since been settled elsewhere — static generation by
[ADR-0001](0001-framework.md), i18n struck by [ADR-0002](0002-language.md). Image
optimisation was never picked up by anything.

[ADR-0001](0001-framework.md) already noticed the gap and named it precisely:

> **Images are near-absent** in existing posts — only theme headers. Build-time image
> optimisation is a requirement from the brief, not from the corpus.

On 2026-08-30 an architecture review found that brief sentence to be stale in its
other halves and proposed deleting it ([ADR-0010](0010-brief-not-authoritative.md)).
That deletion would have taken the only written record of this requirement with it,
silently. This ADR exists so the requirement survives its source.

Facts as they stand:

- Nothing in [`astro.config.mjs`](../../astro.config.mjs) configures images. The only
  build setting is `format: 'directory'`, and it is there for permalink mapping during
  the WordPress migration.
- The six posts on anduin.ch (2011-2014) carry theme headers and nothing else.
- No record in `pipeline/` has an image in it.
- Astro ships an assets pipeline, so the capability is available without adding a
  dependency.

## Options

### A - Astro's built-in assets pipeline

Optimisation, dimensions and format conversion at build time, and it fails loudly on a
missing file — the same property that decided [ADR-0001](0001-framework.md). The cost
is that images have to be imported rather than referenced as plain Markdown paths,
which the migration then has to emit, and which makes a post's source less portable.

### B - No optimisation

Plain `<img>` against files in `public/`. Nothing to configure, nothing to maintain,
and honest about a corpus that has no images. The bet is that image-heavy posts never
arrive; if they do, the cost lands later and on every post written in between.

### C - Decide when the first image-heavy post exists

Defer, and let a real post pick. Costs nothing now and risks the decision being made
by accident, in a hurry, by whoever writes that post.

## Decision

**A, Astro's built-in assets pipeline.** Michael chose it on 2026-10-12, when the
migration ([ADR-0014](0014-wordpress-migration.md)) made the question concrete: the post
quoted as voice.md Sample 5 carries a screenshot its text depends on, so "only theme
headers" no longer holds. No reason beyond the choice was given, and none is supplied
here.

*What was known when it was decided:* one content image, that screenshot. The full
inventory comes from the migration and is recorded per post in
`pipeline/migration/report.md`.

The text above said not to close this by picking A because it is the more capable
option. It was not closed that way: it was put to Michael as a choice, with B
recommended as the honest fit for a corpus of one image, and A was chosen.

## Consequences

- Images live in `src/assets/posts/<slug>/` and are referenced relatively from the post's
  Markdown. Astro writes optimised copies with width and height to `dist/_astro/`, and
  **the build fails on a missing image**, the same property that decided ADR-0001.
- A post's source is less portable: its image paths point into `src/assets/`, not at
  plain URLs. Moving to another generator means rewriting those paths.
- Nothing had to be configured or installed. The pipeline ships with Astro and was
  verified on 2026-10-12 against a throwaway post: a 1200×600 PNG became a WebP with
  `width="1200" height="600"` in the HTML.
- New posts with images follow the same layout. `/draft` has no rule for images yet;
  it gets one when the first record with an image reaches it.

## Revisit when

A post needs an image the pipeline cannot handle (animated, SVG with styling, very
large), or the corpus stays at one image and the pipeline turns out to cost more
in maintenance than it gives.
