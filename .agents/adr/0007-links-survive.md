# ADR-0007: Links from the dump survive into the post

- **Status:** Accepted
- **Date:** 2026-08-28
- **Question:** what happens to the URLs in a dump when it becomes a post?

## Context

Most of the raw dumps are, by volume, link collections. `micro_video.md` is roughly ten
URLs grouped by sub-problem; `foundry.md` and `timecapsule.md` are almost nothing else.
Turning those into posts is the stated point of the whole exercise: **digest the links
into prose, without removing them.**

The first pass through the pipeline failed at exactly this. The AirPrint draft named
its three sources — nerab's role, geekonthepc, the Kyocera website — and dropped every
URL. The fourth link, labelled "maybe helpful for others" in the dump, disappeared
entirely on the grounds that it was not used. The review passed it, because
[ADR-0003](0003-post-done.md)'s hard gate says "sources credited" and they were, by
name.

Two things in the existing rules push that way:

- **voice.md rule 7** says credit sources in one flat sentence, and its corpus example
  is "This solution is copied from stack overflow." — no URL. The corpus models
  dropping the link.
- **voice.md's prohibitions** ban padding sections, "Further reading" among them.

Both are narrower than they look. Rule 7 is about *ceremony* — no gratitude, no
hedging — not about withholding the address. The padding ban is qualified: "when there
is nothing real to put in them." A list of links actually used is not padding.

This was already noticed once and deferred: the mail service capture record carries the
note *"Resource-/Link-Liste am Schluss fehlt noch. Wartet auf ein Blog-Post-Template
(Iteration 3)."* It is not a template question. A dropped link is lost information, and
it is lost at the one moment somebody knew why it mattered.

## Options

### A - Inline only

Every link sits on the phrase that credits it. Keeps voice.md rule 7 intact and keeps
the post ending where it should. Fails for links that have no prose home — the ones
kept because they might help somebody else, which is a real category in the dumps.

### B - A references section at the end

Everything in one list, close to how the dumps already look. Preserves every URL with
no judgement required, and puts a block after the ending — which is the one shape none
of the six posts in voice.md has.

### C - Inline where there is a home, a trailing list only for the rest

Both mechanisms, with inline as the default and the list as the exception. More
judgement per link, and the trailing list still costs the landing when it is needed.

## Decision

**C.**

- **A source that is used gets its URL on the phrase that credits it.** One flat
  sentence, as voice.md rule 7 says, with the address attached to it.
- **A link with no prose home may be placed inline as a dry aside**, using the dump's
  own framing for it. In the AirPrint post the "maybe helpful for others" link became
  "I did not use it, but it might help somebody else", inline, and no trailing section
  was needed at all.
- **A trailing list is the fallback, not the default**, for dumps like `micro_video.md`
  where a dozen links cannot all be worked into prose. It carries only what genuinely
  has no home.
- **No link from the dump is dropped silently.** If one is cut, the capture record says
  which and why.

## Consequences

- The ending is protected. voice.md rule 5 — stop when the problem stops — survives for
  every post that fits option A, which on the evidence is most of them.
- **Gate 3 in the review changes meaning.** "Sources credited" now requires the URL to
  survive, not only the name. The AirPrint draft passed that gate while failing this
  rule, which is how the gap was found.
- The trailing list, when it is needed, sits after the post's natural ending. That is a
  known cost and it is accepted rather than solved.
- Link rot will make some of these dead. A dead link that says where something came
  from is still worth more than no link, and this is a blog for future-me first.
- More judgement per link, and it happens while drafting, where the reason a link was
  kept is still visible in the record.

## Revisit when

A post needs so many trailing links that the list outweighs the prose — `micro_video.md`
is the first candidate and will test this. Also revisit if Iteration 3's site design
gives links a home this ADR does not anticipate.
