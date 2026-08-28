# ADR-0005: Interrogation covers the repo, not only me

- **Status:** Open — proposed during Iteration 1, needs your call before Iteration 2
- **Date:** 2026-08-28
- **Question:** does the interrogation step read the source repos, or only ask me?

## Context

During the Iteration 1 exit test the dump contained one sentence about the actual
problem: "Hatte einzig Probleme bei der Produktivsetzung mit der Config." Asked about
it, I explained one bug: the config always set the `InboxId`, and with sandbox off no
inbox may be set, not even to nil.

The repo said something else. The `heinzelmann` CHANGELOG and git history showed **two**
fixes, both on 11 August 2026:

- `97513e7` omit `inbox_id` from mailtrap_settings when `MAILTRAP_INBOX_ID` is unset
- `33cbba2` cast `MAILTRAP_SANDBOX` to a boolean, because environment variables are
  strings and the string `"false"` is truthy in Ruby

The second fix was not in the account I gave, and it is the more interesting bug. Asked
about it directly, I confirmed it: "Du hast recht, der Echte Fehler war string vs
boolean." The `inbox_id` was my first hypothesis and it did not fix anything. Without
the repo check, the draft would have published the wrong cause as a fact — with my own
confirmation behind it, because that is what I remembered.

Memory compresses, and it compresses toward whichever explanation was found last.
Commit history does not compress. The gap between the two is exactly the material C1
exists to extract.

## Options

### A - Ask only

Cheapest, and inherits whatever my memory dropped. The exit test shows what that costs.

### B - Ask first, then read the repo, then come back with the mismatches

One extra step. The mismatch itself turns out to be the highest-value question
available — it is the only one I cannot answer from memory alone.

### C - Read the repo first, then ask

Risks anchoring every question to what the code shows. The rejected approaches were
never committed, so they would be the first thing to fall out of the conversation.

## Decision

Proposed: **B**. Ask first so the account is uncontaminated, then check CHANGELOG and
the commits around the relevant dates, then bring the contradictions back as follow-up
questions.

## Consequences

- The grill skill needs repo access and a way to be pointed at the right repo and
  the right time window. Not every post has one behind it.
- Contradictions get raised, never silently resolved. The draft does not get to pick
  the version it likes better — that is C3.
- The asking half does not get shorter. Rejected approaches, how long something cost,
  and why the obvious path was refused exist only in my head; no repo records them.
- CHANGELOG plus commit subjects in the relevant window is the cheap, high-yield read.
  A full diff is rarely needed, and only for the commits that actually matter.

## Revisit when

Building the grill skill in Iteration 2.
