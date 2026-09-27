# ADR-0011: The harness lives inside the website repo

- **Status:** Accepted
- **Date:** recorded 2026-09-27, decided before this repo had ADRs
- **Question:** does the harness live in the website repo or beside it?

## Context

This was decided in the handoff brief, under *Decisions — Made*: **"Harness lives inside
the website repo for now; generic parts get extracted in Iteration 5."** It predates ADR
discipline, so it never got a record, and the brief was the only place it existed.

[ADR-0001](0001-framework.md) already leans on it — *"The site lives in this repo, per
the handoff brief and [ADR-0006](0006-pipeline-in-repo.md)"* — so a decision the
framework choice rests on had no reasoning attached anywhere.

The value-by-value pass owed by [ADR-0010](0010-brief-not-authoritative.md) before
trimming the brief found this line, and found that ADR-0006 does not cover it: ADR-0006
decides where *pipeline artifacts* live, not where the harness lives. Without this ADR
the decision would have been deleted with the section that held it — the second time in
one pass, after build-time image optimisation
([ADR-0009](0009-build-time-image-optimisation.md)).

Facts as they stand:

- The harness is AGENTS.md, CONTEXT.md, [voice.md](../voice.md),
  [design.md](../design.md), `.agents/adr/`, `.claude/skills/` and `pipeline/`. None of
  it is site code.
- `pipeline/` holds unredacted dumps, which is why this repo is private (ADR-0006).
- Iteration 5's exit test is "generic set symlinked into a second project", so the split
  is already planned rather than hypothetical.
- There is no remote. The repo is local-only.

## Options

### A - Harness inside the website repo

One clone, one history, one working tree. A skill can read the site's source, its content
collections and the raw dumps without being told where to look — which is what made
[ADR-0005](0005-interrogate-the-repo.md) possible at all. Costs: the harness inherits the
repo's privacy constraint, and a later extraction is a history split rather than a move.

### B - Harness in its own repo, site beside it

Clean separation, and the harness could be public while the site repo stays private.
Costs: two clones, cross-repo references, and a skill that wants to read the site now
needs a path outside its own tree — exactly what ADR-0006 removed when it moved the dumps
in.

### C - Harness as a git submodule

Both at once on paper. In practice it adds a synchronisation step to every change
spanning both, for a project worked on by one person in single sessions.

## Decision

**A, for now** — provisional on purpose, with Iteration 5 as the planned exit.

The deciding reason is the one ADR-0006 reached independently for dumps: everything in
one place, with the stage visible on the artifact rather than in which repo it happens to
sit. A skill that has to look outside its own working tree is a skill that has to be told
where to look every time.

"For now" is load-bearing. Iteration 5's exit test is a **symlink** into a second
project, and that is the point: it tests extraction without committing to a repo split.

## Consequences

- **The harness inherits a privacy constraint it did not cause.** `pipeline/` is what
  keeps this repo private; the harness is private with it, even though nothing in it is
  sensitive. That is a real cost of A and it is being paid now, not deferred.
- **Extraction is a history split, not a move.** By Iteration 5 the harness will have
  months of history interleaved with site commits. The symlink test side-steps that; a
  real split does not.
- A skill can reach site source, content and dumps in one tree. ADR-0005 depends on it.
- **Iteration 5 may conclude the split is not worth it.** That is an allowed outcome.
  This ADR does not promise extraction, only that the question gets asked with a real
  test behind it.

## Revisit when

Iteration 5 runs — or earlier, if the harness is wanted in a second project before then;
the symlink test is cheap and can be run out of order. Also revisit if this repo gets a
remote and the inherited privacy constraint starts costing something concrete, such as
wanting the skills public.
