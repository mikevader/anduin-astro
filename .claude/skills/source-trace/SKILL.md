---
name: source-trace
description: Decide whether a claim is traceable to an admissible source, and mark it when it is not. Use whenever writing or checking a sentence containing a version number, a duration, a date, an error message, a command, a file path, or a causal claim about why something broke.
user-invocable: false
---

# source-trace

This is C3 in [AGENTS.md](../../../AGENTS.md), turned into a procedure. It runs in two
directions: forward while drafting, backward while reviewing.

## Admissible sources

A claim in a draft may rest on exactly four things:

1. **The raw dump**, as written.
2. **The interrogation** — Michael's verbatim answers in the capture record.
3. **[CONTEXT.md](../../../CONTEXT.md).** Facts stated there are used without hedging.
4. **A cited external source**, credited in the text.

## Not admissible

- What you know about the tool. You may know Mailtrap's API perfectly. That does not
  make a claim about *Michael's* setup traceable.
- Plausibility. "It was probably a caching issue" is invention with a hedge on it.
- The sentence around it. A version number is not sourced by the fact that the
  paragraph reads better with one.
- A repo finding that Michael has not confirmed. Per
  [ADR-0005](../../../.agents/adr/0005-interrogate-the-repo.md) a contradiction between
  the repo and his account comes back as a question. It does not become a fact by being
  better evidence.

## Forward: while drafting

For each claim, name its source silently before writing it. If you cannot name one,
you have two options and smoothing is not among them:

- **Cut it.** Usually right. The sentence was decoration.
- **Mark it**, if the draft genuinely needs it:

```
[ASSUMPTION: k3s 1.35.5 — not in the dump or the interrogation, taken from CONTEXT.md's
homelab facts; confirm this is the version that was actually running]
```

The marker sits **inline, where the claim sits.** Not collected at the bottom, not in
a comment, not in the frontmatter. It has to be impossible to read the sentence without
reading the doubt attached to it.

Say what is missing and where it would come from. `[ASSUMPTION: unsure]` is not a
marker, it is a shrug.

## High-risk categories

These are where invention actually happens, because they are the details that make
prose feel specific:

| Category | The failure |
|---|---|
| Version numbers | A real-looking version nobody stated |
| Durations | "about two hours" when he said "relativ lange" |
| Dates | Rounding "mid-May" into a specific day |
| Error messages | Reconstructing what the tool "would have" printed |
| Commands and flags | A flag that makes the snippet work but was never run |
| Causal claims | "because X" where he only said X and the failure both happened |

The last row is the dangerous one. Two facts next to each other are not a cause.

## The translation trap

Per [ADR-0002](../../../.agents/adr/0002-language.md), every answer crosses German into
English before it reaches the draft, and **rephrasing and inventing look identical in
the output.**

- Translating close is sourcing. "hat mich relativ lange gekostet" → "it took me
  relatively long."
- Adding specificity is inventing. "hat mich relativ lange gekostet" → "it cost me most
  of an afternoon" is a fabrication, and a fluent one.
- When the German is ambiguous, do not pick. Mark it, or ask.

Worked example from the corpus: Michael said *"Jup hat mich relativ lange gekostet aber
in Zahlen weiss ich dies nicht mehr."* The published draft says *"that is why it took me
relatively long."* No number appeared. That is the standard.

## Backward: while reviewing

Reviewing is not "check the markers are gone". Two passes:

1. **Marked and unresolved.** Grep for `[ASSUMPTION:`. Every hit is a hard gate failure
   per [ADR-0003](../../../.agents/adr/0003-post-done.md) — resolved or cut, never
   smoothed away.
2. **Unmarked and untraceable.** Walk the draft claim by claim and find the source for
   each in the record. Claims with no source and no marker are the dangerous class,
   because nothing about them looks wrong. They read *better* than the sourced ones —
   that is the failure signature in
   [voice.md](../../../.agents/voice.md), and it is why fluency is a warning sign here
   rather than a result.

Under ADR-0003 the second pass is **reported, not blocked** — traceability is a soft
criterion. Report it loudly anyway; it is usually the most valuable thing the review
produces.
