# ADR-0010: The handoff brief is not authoritative

- **Status:** Accepted
- **Date:** 2026-08-30
- **Question:** when two documents in this repo contradict each other, which one wins?

## Context

An architecture review on 2026-08-30 walked
[HARNESS-HANDOFF.md](../../HARNESS-HANDOFF.md) against the documents written after it,
and found two statements that were not merely old but wrong:

- The site list still required the site to be **internationalized**.
  [ADR-0002](0002-language.md) settled on English-only posts and recorded that "i18n
  stops being a framework selection criterion".
- The audience paragraph still said **"assume Kubernetes/self-hosting literacy"**.
  [CONTEXT.md](../../CONTEXT.md) replaced that with a per-post rule: "the literacy
  assumption is per post, not global — do not explain what a segue is in an iOS post."

Both were found by accident, while looking for something else. Neither had a mechanism
that would have caught them.

The brief is a seed document. It was written before CONTEXT.md, voice.md, design.md and
every ADR existed, and it was correct when written — it is the thing those documents
grew out of. What made it dangerous is that [AGENTS.md](../../AGENTS.md) pointed every
agent at it as *"the reasoning behind all of this"*, which gave text from before the
decisions the same standing as the decisions.

That is this harness's own stated failure mode, turned on its documentation: fluent,
plausible, and indistinguishable from current. [design.md](../design.md) already names
it for the visual side — *"a design document that has drifted from the code is worse
than none — it is a confident lie"* — and the same sentence holds here.

## Options

### A - Keep the brief current

Edit it whenever a decision lands, so it never goes stale. Honest, and it fails in
practice: it is a second write on every decision and a fourth place to forget. It also
cuts against the grain of C4, which keeps records as they were rather than editing them
into agreement with the present.

### B - Precedence by ownership, brief demoted to historical record

Each subject has exactly one owner; a document that does not own a subject cannot win a
conflict about it. Stale statements in the brief are deleted or moved to their owner
rather than corrected in place. Costs one rule to remember.

### C - Delete the brief entirely

Considered in the same review, as its candidate 5, and rejected there: the iteration
plan has no other home, [ADR-0001](0001-framework.md) cites the brief for *"the site
lives in this repo"*, and folding the plan into AGENTS.md re-merges two things that
change at different rates.

## Decision

**B.** Ownership, not rank:

| Subject | Owner |
|---|---|
| A decision and its reasoning | the ADR that decided it |
| Subject matter, audience, homelab facts, redaction | [CONTEXT.md](../../CONTEXT.md) |
| How I write | [voice.md](../voice.md) |
| How the site looks | [design.md](../design.md) |
| How an agent works here | [AGENTS.md](../../AGENTS.md) |
| The iteration plan | [HARNESS-HANDOFF.md](../../HARNESS-HANDOFF.md) |

Where two disagree, the owner of that subject wins. **HARNESS-HANDOFF.md owns only the
plan and loses every other conflict.**

Applied on 2026-08-30: the brief's site requirement list, its audience paragraph, and
its two opening lines instructing an agent to "work through Iteration 1 only" were
deleted. Its harness jobs and side goal stayed — nothing else owns them, and
[CONTEXT.md](../../CONTEXT.md) cites the jobs list for what "professional" means.

## Consequences

- **A requirement that lives only in the brief is destroyed by trimming it.** One was
  found in this pass — build-time image optimisation, now [ADR-0009](0009-build-time-image-optimisation.md).
  The sections still standing (§2 constraints, §3 decisions, §5 Iteration 1, §6
  working agreements, §7 bootstrap prompt) have not been checked value by value, and
  the review that proposed removing them did not do that check either. Whoever removes
  them owes that pass first.
- **The brief keeps aging, deliberately.** It is not maintained against the present,
  so anything read out of it has to be checked against its owner. That is the trade:
  one rule instead of a maintenance obligation on every decision.
- This does not make the brief safe to ignore. It owns the plan, and the plan is
  referenced by name — "Iteration 3", "Iteration 4" — from ADRs, skills and records
  across the repo.
- The rule is stated in AGENTS.md, where it is read, and argued here. It costs one
  paragraph at the top of the file every agent already reads.
- **Nothing enforces this.** It is a reading rule, not a gate; the next contradiction
  will also be found by accident. Making it mechanical was not attempted.

## Revisit when

The brief is reduced to the iteration plan and nothing else — the review's candidate 1.
If nothing but the plan remains, there is no subject left for it to lose a conflict
about, and this ADR collapses into a line in AGENTS.md saying where the plan lives.
Also revisit if a second document starts drifting the same way: then the problem is not
the brief, and the rule is aimed at the wrong thing.
