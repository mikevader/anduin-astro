# ADR-0006: Pipeline artifacts live in the repo

- **Status:** Accepted
- **Date:** 2026-08-28
- **Question:** where do dumps, capture records and drafts live, and what does that do
  to the redaction rules?

## Context

Until now the answer was "not here". AGENTS.md said *"Drafts produced for testing are
not repo files. They go to a scratch directory; only the verdict lands here."*
[ADR-0005](0005-interrogate-the-repo.md) leaned on that: capture records were allowed
to hold unsanitised repo findings **because** they were outside the repo.

In practice the dumps sit in a sibling directory, `anduin-blog-ideas`, and the one
capture record that exists was written there by hand. Nothing in this repo says that
directory exists, so a skill cannot find it without being told every time.

Two facts pull against each other:

- Everything in one place is the working preference, with the stage visible on the
  artifact rather than encoded in where it happens to sit.
- The raw material violates the redaction rules. `kubernetes.md` is three lines of
  `192.168.42.100`, `k8sworker-01`, `k8sworker-02`. `airprint.md` names an internal
  print server and its port. IP addresses are an unconditional "never publish" in
  [CONTEXT.md](../../CONTEXT.md).

And a third that decides it: **git history cannot be cleaned after the fact.** Removing
a file later does not remove it from the history, so committing raw dumps is a
one-way door with respect to ever making this repo public.

## Options

### A - Commit everything, sanitise at import

The grill strips redacted values as material enters the repo, replacing them with
invented example values labelled as invented. Redaction becomes a pipeline stage
rather than a review step, which is what CONTEXT.md already demands for drafts. Costs
the audit trail: ADR-0005 would have to give up capture records holding raw findings,
and the original wording of a dump is lost at the point where it is least understood.

### B - Files in the working tree, pre-publication stages gitignored

One location, no redaction exposure, and only finished posts get committed. Costs
history and backup for exactly the material that is hardest to reconstruct, and "in
the repo" becomes ergonomic rather than real.

### C - Commit everything, keep the repo private

Raw material enters unchanged, with full history. The redaction boundary moves from
the repo edge to the publication edge. Costs the option of publishing this repo
casually — that becomes a deliberate operation with work attached.

## Decision

**C.** All pipeline artifacts live in `pipeline/` in this repo and are committed
unchanged. **The repo is private, and publishing it is a separate decision that is not
made here.**

One directory, not one per stage, with the stage in frontmatter:

```yaml
---
status: dump | captured | stub | drafted | blocked | ready
---
```

The capture record is cumulative — it starts as the dump and grows through
interrogation, draft and review — so stage directories would mean moving the same file
four times. The directory is called `pipeline/` and deliberately not `content/` or
`posts/`, so that [ADR-0001](0001-framework.md) is not pre-empted by a directory name.

### Where the redaction boundary now sits

Before: the repo edge. Now: **the publication edge.**

- `pipeline/` is working notes. Dumps stay verbatim, IPs and all. Capture records may
  hold raw repo findings, exactly as ADR-0005 allows — that part of ADR-0005 survives
  unchanged, for a different reason than it was written for.
- The **draft section** of a record obeys the redaction rules in full. A redacted value
  never enters it, not even sanitised: an example value is invented and labelled as
  invented. That was already the rule and it does not move.

## Consequences

- **This is a one-way door and it was taken deliberately.** Once raw dumps are in the
  history, opening this repo requires either rewriting history or extracting
  `pipeline/` first. Neither is hard, but neither happens by accident.
- **`pipeline/` is a publication blocker.** Anyone — including a future agent — who
  proposes making this repo public has to deal with `pipeline/` first. This is the
  written record of that.
- It contradicts what was said while deciding [ADR-0005](0005-interrogate-the-repo.md),
  where publishing this repo was named as the reason not to check in a repo whitelist.
  That reasoning still holds for the whitelist, which stays a live `gh` query. It no
  longer holds for the repo as a whole.
- AGENTS.md loses the line about drafts not being repo files. It was true and is now
  false; it is replaced rather than quietly dropped.
- Skills can find their input without being told where it lives. That is the whole
  ergonomic gain, and it is real.
- CONTEXT.md still obeys its own rules, because it is the one file here that is
  written to be publishable on its own.

## Revisit when

I want to publish this repo — that is the trigger, and the work is scoped in the second
consequence above. Also revisit if `pipeline/` grows large enough that the repo becomes
unpleasant to clone, or if a dump ever arrives containing something I do not want on
my own disk in plain text.
