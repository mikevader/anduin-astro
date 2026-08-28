# ADR-0003: Definition of done for a post

- **Status:** Accepted
- **Date:** 2026-08-28
- **Question:** what has to be true before a post is publishable?

## Context

The review skill (Iteration 2) has nothing to check against until this exists. It is
also the only thing that gives C2 teeth: "this dump is not enough" is unfalsifiable
without a written bar.

Two things had to be settled that the first draft of this ADR did not see.

**The candidate criterion "the failure path is in the post" is too narrow.** It holds
for every sample in [voice.md](../voice.md), but those are all one post shape. Two of
the raw dumps are not: an AirPrint build log with no bug in it, and a mail service
evaluation whose value is the comparison, not a fix. Making the failure path mandatory
would rule those out permanently.

**The floor is lower than "a fact not in the documentation".** The goal of a post is
not always an insight. An overview I assembled for myself counts, and so does an idea
I worked through. What does not count is a list of links I have not used.

The calibration that settled it, against the actual dumps in `anduin-blog-ideas`:

- `crosspost-jekyll-medium.md` → post. Three alternatives read and dismissed, one
  plugin picked knowing it is abandoned, and the finding that
  `medium_crossposted.yml` has to survive the GitHub Actions run.
- `micro_video.md` → post. This is the instructive one. On the surface it is a link
  dump with two empty headings, but the links are grouped by sub-problem — bitrate,
  Pi cam under Ubuntu, RTSP, making v4l settings stick — and that decomposition is the
  work. There is also an Ansible task template that was actually written.
- `foundry.md`, `timecapsule.md` → stub as they stand. Four links and "Not yet
  implemented". No own judgement anywhere in them.

`micro_video.md` is why the stub call cannot be made from the dump. Its value is not
visible on the page; only the interrogation gets at it.

## Options

### A - A checklist per post shape

Separate criteria for debugging story, walkthrough and evaluation. Matches the
material honestly, but the review skill has to classify the post before it can check
it, and a misclassification silently applies the wrong bar. voice.md also only
describes one shape, so two of the three checklists would be invented rather than
derived.

### B - One form-independent substance gate, plus a hard/soft split

A single gate phrased so that it fits every shape, and criteria sorted by whether they
block or only get reported. Nothing has to be classified. The gate is broader, so it
catches less on its own — it depends on the interrogation having been real.

## Decision

**B.**

### The substance gate

> The post contains what only I know: the failure path, **or** the rejected option
> with its reason, **or** the criterion that decided it.

At least one of the three. Debugging stories satisfy it with the first, the AirPrint
role with the second (the existing Ansible role was "not entirly satisfing", so it was
copied and modified), the mail service evaluation with the third (the free tier has to
stay free). Post shapes are not a concept in this harness.

### The floor for C2

> A post needs own work — something tried, compared, rejected or decided. A link
> collection without my own judgement is a stub.

**The stub call is made after the interrogation, never from the dump alone.** A dump
that looks empty may not be, and that is the normal case rather than the exception.

### Hard gates - the review blocks on these

- **No unresolved C3 markers.**
- **Redaction rules pass** ([CONTEXT.md](../../CONTEXT.md)).
- **Sources credited**, in one flat sentence, wherever something came from elsewhere.

### Soft - reported, does not block

- Numbers, versions and error messages traceable to the dump, the interrogation or a
  cited source.
- Exact versions named for anything version-sensitive.
- Open questions stated rather than hidden.

### Struck

**Cost is not a done criterion, and it is not an interrogation axis either.** The
review does not ask whether the post says what it cost, and the grill does not ask for
it at all — reaffirmed emphatically on 2026-08-28, after a grill run asked anyway. Rule 3 in voice.md still governs how cost is written *when it is there* —
never invented, never dropped just because it was not measured — but its absence does
not hold up a post.

### Who decides

The review skill may block, and only on the three hard gates. Everything soft is
reported and does not stop anything. **The block is a veto against the agent
proceeding on its own, not against me.** I can override any block and any stub verdict;
the override is recorded in the capture record with the reason, so the next pass can
see that the gate was overruled rather than met.

### Out of scope

Site-level requirements — frontmatter fields, tag vocabulary, slugs, titles — are not
in this ADR. They cannot be, while [ADR-0001](0001-framework.md) is open. They belong
to Iteration 3, and this ADR does not pre-empt them.

## Consequences

- The review skill can be written. It has three things it may block on and it may not
  invent a fourth.
- **Every dump gets interrogated, including the ones that end as stubs.** That is the
  price of the `micro_video.md` finding, and it is paid on every dump.
- Only two of the three hard gates are close to mechanical. Redaction is a judgement
  call applied per value against the governing test in CONTEXT.md; it is a hard gate
  that cannot be reduced to a pattern match, and treating it as one would be worse
  than useless.
- The substance gate is broad enough that a lazy interrogation still passes it. It is
  a floor against generic text, not a substitute for C1.
- Striking cost creates a documented tension with voice.md rule 3. It is deliberate:
  voice.md says how to write the cost, this ADR says the post does not wait for it.
- "Own work" stays a judgement call. The agent proposes post or stub and names what is
  missing; the call is mine.

## Revisit when

I want to publish an opinion piece. The substance gate as written probably refuses one
— an opinion piece often has no failure path, no rejected option and no deciding
criterion — and the anti-sample in voice.md is evidence that refusing may be correct.
Also revisit if I find myself overriding the same block more than twice: then the gate
is wrong, not the draft.
