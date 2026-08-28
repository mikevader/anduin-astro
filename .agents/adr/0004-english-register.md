# ADR-0004: Register of published English

- **Status:** Accepted
- **Date:** 2026-08-28
- **Question:** how far does the harness clean up the non-native English of the corpus?

## Context

The 2011-2014 corpus is English written by a German speaker, and it shows:
"Unfourtanatly", "their own date formate", "not strait forward", "the the following
snipped", and German word order in "Hopefully it took you not the two hours I have
spent until finding this undocumented fact."

Two things pull against each other. CONTEXT.md defines "professional" as *not sloppy*,
which argues for correction. But the texture is a large part of what makes the corpus
identifiable as mine — and fluent, idiomatic technical English is precisely the
register a language model defaults to. Smoothing the prose removes the strongest
available signal that a person wrote it, which is the failure mode this whole harness
exists to prevent.

## Options

### A - Fix typos, keep the rhythm

Correct misspellings and doubled words. Leave sentence rhythm, word order and
directness untouched.

### B - Fix typos and make it idiomatic

Clean native-sounding English. Easiest to read, and indistinguishable from generated
text.

### C - Change nothing

Maximum fidelity, including published misspellings. Fidelity to a typo is not a voice,
and it contradicts "not sloppy".

## Decision

**A.** Misspellings and doubled words get corrected. Sentence rhythm, word order and
directness stay as they are.

## Consequences

- Drafts will contain German-influenced word order and long coordinated sentences that
  a grammar checker flags as errors. They are not errors. The review skill
  (Iteration 2) must not "fix" them, and this is the first thing to check when a
  review pass makes a draft feel less like mine.
- The boundary between "typo" and "rhythm" is a judgement call on every sentence. When
  unsure, leave it alone and mark it (C3). Erring toward leaving it is the cheaper
  mistake.
- **Migration hits this.** Iteration 3 carries six posts over with their typos in
  them. Whether migration silently corrects published text, corrects it with a note, or
  preserves it verbatim as a historical record is a separate question this ADR does not
  answer. Do not decide it by accident while writing the migration skill.

## Revisit when

A reader says a post is hard to read, or Iteration 3 forces the question about
already-published typos.
