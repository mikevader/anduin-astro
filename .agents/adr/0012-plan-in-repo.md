# ADR-0012: The iteration plan stays in the repo, not in an issue tracker

- **Status:** Accepted
- **Date:** 2026-09-27
- **Question:** where does the iteration plan live — a checked-in file, or issues?

## Context

The 2026-08-30 architecture review moved iteration status out of AGENTS.md, where it had
been churning against a document that is otherwise stable, into
[ITERATIONS.md](../../ITERATIONS.md). That raised the obvious follow-up: **would the
iterations not be better kept as issues?**

They would gain real things. State, dates and closure come for free instead of being
typed by hand. The two findings carried out of Iteration 2 are follow-ups, and follow-ups
are what trackers exist for. The objection is not weak, and this ADR exists so it is on
record as considered rather than unasked.

Three facts pull the other way:

- **There is no remote.** `git remote -v` is empty; the history is local-only. Adopting
  issues means first putting this repo on a forge, and the repo is private because
  `pipeline/` holds unredacted dumps —
  [ADR-0006](0006-pipeline-in-repo.md) calls committing them *"a one-way door with respect
  to ever making this repo public"*. That is a separate and larger decision with a
  redaction dimension, and it should not be made as a side effect of tidying documentation.
- **The plan is addressed by name from eight checked-in files.**
  [ADR-0001](0001-framework.md) (*"Diagrams arrive in Iteration 4"*),
  [ADR-0003](0003-post-done.md), [ADR-0004](0004-english-register.md) (*"Iteration 3
  carries six posts over"*), [ADR-0005](0005-interrogate-the-repo.md),
  [ADR-0007](0007-links-survive.md), [voice.md](../voice.md),
  `.claude/skills/review/SKILL.md`, and `pipeline/mailservices.md`. As issues, "Iteration
  3" resolves to nothing without network access and auth.
- **The harness's premise is that an agent's context is checked in.** AGENTS.md opens with
  "How an agent works in this repo."

And one about fit: five entries that change five times is not what a tracker earns its
keep on.

## Options

### A - A checked-in file

Resolvable offline, diffable, referenced by name from the ADRs that already depend on it.
Costs: status is hand-maintained and will go stale silently.

### B - Issues

State and dates for free, no hand-maintenance, and the churn leaves the repo entirely
rather than moving to another file in it. Costs: a forge decision that touches ADR-0006,
eight references that stop resolving, and a plan an offline agent cannot read.

### C - One file per iteration, stage in the frontmatter

The idiom `pipeline/` already uses — *"the stage is in the frontmatter, not in the
directory"*. Consistent with an established pattern here rather than importing a new one,
and too much apparatus for five entries.

### D - Split: plan in the repo, findings as issues

Puts each thing where its shape fits. Needs a remote, so it is not available today.

## Decision

**A now, D as the direction.**

The five iterations are a spine: addressed by name from eight files, changing five times
over the project's life. That is the opposite of what a tracker is good at. The findings
genuinely are issue-shaped — but they have nowhere to go until this repo has a remote, and
creating one means deciding the ADR-0006 question first.

The honest ordering, if B is ever wanted: **forge and remote first, then the move.** Not
the other way round.

## Consequences

- **Status is hand-maintained and nothing checks it.** It will drift, and the drift will
  be found by accident — the same unenforced-reading-rule weakness
  [ADR-0010](0010-brief-not-authoritative.md) admits about itself. This is the cost of A
  and it is accepted, not argued away.
- The two Iteration 2 findings stay as prose in ITERATIONS.md, marked as findings rather
  than status, so they are easy to lift out when a tracker exists.
- Eight existing references keep resolving offline. Any future move has to fix all eight,
  and that cost grows with every new ADR that names an iteration.
- This ADR does not decide whether the repo gets a remote. It only refuses to decide that
  by accident.

## Revisit when

This repo gets a remote — then D becomes available and the findings should move. Also
revisit if the plan grows past five entries or starts changing weekly; either would
invert the fit argument. If Iteration 5 splits the harness out
([ADR-0011](0011-harness-in-website-repo.md)), revisit which repo the plan belongs to.
