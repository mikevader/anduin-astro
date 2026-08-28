# ADR-0005: Interrogation covers the repo, not only me

- **Status:** Accepted
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

**B.** Ask first so the account is uncontaminated, then check the repo, then bring the
contradictions back as follow-up questions. Four things make that operational.

### The repo read is conditional, not automatic

Only when the agent judges it relevant to this post. Not every dump has a repo behind
it, and not every dump needs one — the mail service post would have been worth
publishing on the comparison and the links alone, even if no line of code had ever
changed. "No repo, not checked" is a valid, recorded outcome, not a gap.

### Public repos are determined live

`gh repo list mikevader --visibility public`, at interrogation time. **No whitelist is
checked in.** A checked-in list goes stale, and a repo I later switch to private stays
on it — a stale whitelist is precisely the redaction risk this is supposed to reduce.

### Private repos may be read; what may leave them is limited

Sanitised information from a private repo may be published when it helps the post.
Never sensitive data: IP addresses and ranges, secrets, tokens, credentials, and
everything else the redaction rules in [CONTEXT.md](../../CONTEXT.md) name. Those rules
govern here unchanged, including the standing instruction that a redacted value is
never cleaned up into the draft — an example value is invented and labelled as invented.

### Read depth

CHANGELOG and commit subjects in the relevant window. Diffs only for the commits that
actually matter. The window comes from the dump and the conversation; when it cannot be
derived, ask me for the date rather than guessing at it.

## Consequences

- Contradictions get raised, never silently resolved. The draft does not get to pick
  the version it likes better — that is C3.
- The asking half does not get shorter. Rejected approaches, how long something cost,
  and why the obvious path was refused exist only in my head; no repo records them.
- **Whether a repo is public decides only whether it may be named and linked.** It does
  not decide whether its content may be used, and it does not make its content safe:
  the redaction rules apply to public repos exactly as they do to private ones.
- The grill depends on `gh` being present and authenticated. When it is not, every repo
  is treated as private. That is the safe direction, and it degrades the post rather
  than the redaction.
- Capture records live outside this repo, alongside the dumps. They may hold raw
  findings — commit hashes, private repo names, the unsanitised version of a value —
  because they are working notes, not a public artifact. Only what reaches the draft is
  governed by the redaction rules.
- A repo check costs a round trip and often finds nothing. The mail service case says
  the one time it does find something is worth it.

## Revisit when

A repo read surfaces a contradiction I cannot resolve from memory either, and the post
has to be written without knowing which version is true. Also revisit if `gh` being
unavailable turns into the normal case rather than the exception.
