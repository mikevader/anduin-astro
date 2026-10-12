# ADR-0014: Migrating the WordPress posts

- **Status:** Accepted
- **Date:** 2026-10-12
- **Question:** how do the six posts on the WordPress site come over to the Astro site —
  from where, to which URLs, with which changes, and what gets left behind?

## Context

anduin.ch runs WordPress (Twenty Seventeen) with six posts from 2011–2014
([CONTEXT.md](../../CONTEXT.md)). Iteration 3's exit test is one of them migrated, with
a report of what could not be carried over ([ITERATIONS.md](../../ITERATIONS.md)).

Three earlier decisions left questions for exactly this moment:

- [ADR-0004](0004-english-register.md) settled the register of new writing and
  explicitly did **not** settle what happens to typos in already-published text: *"Do
  not decide it by accident while writing the migration skill."*
- [ADR-0009](0009-build-time-image-optimisation.md) left image handling open until the
  migration showed what images the posts carry. At least one does: the storyboard
  screenshot in the post quoted as voice.md Sample 5, which that sample calls
  load-bearing.
- `astro.config.mjs` sets `format: 'directory'` "so old permalinks can be mapped during
  the WordPress migration", without saying how.

The source is the live site. [voice.md](../voice.md) quotes five of the posts with
their prose verbatim, but it omits code and images, so it cannot stand in for the
source.

Michael decided the four open points on 2026-10-12, choosing between options put to him.

## Options

The options as they were put, per question. The chosen one is first in each.

- **Source:** the live site's REST API, with `anduin.ch` allowed in the session's
  network policy · a WXR export committed by hand.
- **Typos:** corrected under ADR-0004 rule A, with a visible note on the post · kept
  verbatim as a historical record · corrected silently.
- **URLs:** one scheme, `/posts/<slug>/`, with a redirect page at every old path ·
  migrated posts served at their old WordPress paths.
- **Images:** ADR-0009 option A, Astro's assets pipeline · option B, plain files in
  `public/`. Recorded in ADR-0009, not here.

## Decision

- **Source.** The live site, through the WordPress REST API, falling back to the page
  HTML. The fetched HTML is kept unchanged in `pipeline/migration/<slug>.html`.
- **Text.** Prose and titles are carried over verbatim except for misspellings and
  doubled words, corrected under ADR-0004 rule A. Every correction is listed in the
  report. **The post says it was migrated**: a "Migrated" group in the post rail, which
  adds "typos corrected, wording unchanged" when there were corrections. Code is copied
  byte for byte.
- **URLs.** Every post lives at `/posts/<slug>/`, with its WordPress slug. The old
  permalink is stored in the post's frontmatter (`migrated.from`), and
  `src/pages/[...legacy].astro` builds a redirect page at that path from it: meta
  refresh, canonical link, `noindex`. The list of redirects is that field and nothing
  else. The build fails if an old path collides with a route of the new site or with
  another post's old path.
- **Comments are not carried over.** The site has no comment system. The report records
  how many each post had; no comment text, author name, e-mail or IP is stored anywhere.
- **What the report holds.** Per post: old and new URL, the correction list, what was
  left as is and why, what was not carried over, and anything for Michael to confirm,
  such as new tags. Site-wide: what of the old site is not carried over at all.
- **The procedure is the `migrate` skill**, user-invoked, one post per run.

## Consequences

- A static host cannot send a real 301, so old links get a meta refresh. Browsers follow
  it at once and search engines treat it as a permanent move, but it is not a 301. A
  host-level redirect can replace it later without touching a post, because the data is
  already in the frontmatter.
- **The old feed URL is not covered.** `/feed/` is read by feed readers, which do not
  follow an HTML refresh. Only a host-level redirect to `/rss.xml` fixes that.
- Query-string permalinks (`/?p=123`), date and category archives, and anything else that
  is not a post page get no redirect. The report lists which of them existed.
- The correction count is in the frontmatter and the list is in `pipeline/`, so the
  public post shows that it was corrected but not what was corrected. The before → after
  list exists only in the private repo.
- The migration depends on `anduin.ch` staying reachable until it is done. Once the
  domain points at the new site, the REST API is gone, and the raw HTML in `pipeline/`
  is the only copy of the source.

## Revisit when

- The site moves to a host that can redirect: replace the refresh pages with 301s,
  including `/feed/`.
- A reader or Michael finds a correction that changed meaning rather than spelling.
- A seventh post turns up that the REST API did not list.
