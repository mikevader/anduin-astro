# ADR-0009: Build-time image optimisation

- **Status:** Open
- **Date:** 2026-08-30
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

Not decided. **What is missing is a single post with real images in it.** Every option
above is currently chosen against a corpus of zero, and A's cost (how images are
referenced in Markdown) is only measurable once the migration has produced actual
post source.

Do not close this ADR by picking A because it is the more capable option. That is
exactly the "plausible option quietly chosen" that C3 exists to prevent.

## Consequences

*(To be written when this is decided. What is already true: the requirement is now
recorded somewhere that owns it, rather than in a document being trimmed.)*

## Revisit when

The WordPress migration (Iteration 3) reports what images the six existing posts
actually carry, or the first record in `pipeline/` reaches `ready` with an image in
it — whichever comes first. If the migration finds only theme headers and no post
needs an image, close this as **B** and say so.
