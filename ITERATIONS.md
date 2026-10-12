# Iterations

The harness is built in five iterations, before the site. This file owns the plan and
where it stands, and nothing else — where anything here disagrees with
[CONTEXT.md](CONTEXT.md) or an ADR, they win
([ADR-0010](.agents/adr/0010-brief-not-authoritative.md)).

It was the handoff brief that started this repo. The five sections that duplicated
CONTEXT.md, AGENTS.md and the ADRs were removed on 2026-08-30; what is left is what
nothing else owns. The plan stays checked in rather than moving to an issue tracker
([ADR-0012](.agents/adr/0012-plan-in-repo.md)).

## What the harness is for

Its jobs, in priority order:

1. Turn raw dumps — thoughts, links, terminal output, half-formed ideas — into blog posts
   that are understandable years later
2. Help build and maintain a professional site, including migrating the old one
3. Produce diagrams and images that stay maintainable

**Side goal:** understand how to build and use a harness, and be able to lift the generic
parts into future projects. That is Iteration 5, and it is the reason the harness lives
inside the website repo rather than beside it
([ADR-0011](.agents/adr/0011-harness-in-website-repo.md)).

The site itself, its audience and its vocabulary are defined in
[CONTEXT.md](CONTEXT.md), not here.

## The plan

Each iteration ships something usable. **Do not start the next one until the current
exit test passes**, and do not scaffold the ones after it — their abstractions are
guesses until the current iteration is real.

| # | Scope | Exit test | Status |
|---|-------|-----------|--------|
| 1 | Foundation: repo skeleton, CONTEXT.md, voice.md, ADR discipline | Agent drafts on a topic I already wrote about; output is recognizably mine | **passed 2026-08-28** |
| 2 | Capture → draft pipeline: grill, draft, review skills | One real dump becomes a post I would actually publish | **passed 2026-08-28** |
| 3 | Site + migration skills | One old page migrated, with a report of what could not be carried over | in progress |
| 4 | Diagrams as checked-in text (Mermaid or D2) | Cluster topology diagram rendered from source in the repo | not started |
| 5 | Extract generic skills for reuse | Generic set symlinked into a second project | not started |

## Where it stands

**Iteration 1 — passed 2026-08-28.** A draft written from a raw five-line dump, using
only CONTEXT.md and voice.md, was judged recognizably mine.

**Iteration 2 — passed 2026-08-28.** The AirPrint dump went through `/grill`, `/draft`
and `/review` and came out as a post judged "grundsätzlich passt es". The one thing
missing from it — the dump's links had been credited by name and dropped as URLs —
became [ADR-0007](.agents/adr/0007-links-survive.md) rather than a one-off fix.

**Iteration 3 — in progress.** [ADR-0001](.agents/adr/0001-framework.md) decided
**Astro** on 2026-08-29, for build-time validation that fails loudly. The component
library is built and is the site's source of truth;
[.agents/design.md](.agents/design.md) is the design record, and the canvas it replaced
has been retired. [ADR-0008](.agents/adr/0008-astro-components-no-design-sync.md) ruled
out a Claude Design sync: `.astro` files compile server-side only, so there is no
client-mountable bundle for it to consume.

The migration is prepared but not run. [ADR-0014](.agents/adr/0014-wordpress-migration.md)
records how the WordPress posts come over (live source, `/posts/<slug>/` with redirect
pages at the old paths, typos corrected with a visible note, comments left behind), and
[ADR-0009](.agents/adr/0009-build-time-image-optimisation.md) is closed on Astro's assets
pipeline. The `migrate` skill, the redirect route and the migrated-post note exist. No post
has been migrated: on 2026-10-12 `anduin.ch` was still blocked by the session's network
policy. The exit test — one old page migrated, with a report of what could not be
carried over — has not been run.

### Two things that still run exposed

Carried out of Iteration 2, unfixed:

- **The verdict flipped from `stub` to `post` on a single late answer.** Three rounds in,
  the substance gate had nothing quotable behind it. The interrogation is worth running
  to the end even when it feels dry.
- **The same session wrote and reviewed the draft.** It found six untraceable claims in
  its own text, which is better than none, and it is still the weakest link in the
  arrangement.

These are findings, not status. They are the right shape for an issue tracker and will
move there if this repo ever gets a remote — see the rejected option in
[ADR-0012](.agents/adr/0012-plan-in-repo.md).
