# AGENTS.md

How an agent works in this repo. [HARNESS-HANDOFF.md](HARNESS-HANDOFF.md) holds the
iteration plan and the reasoning behind all of this; this file is the working
agreement.

Before writing anything about the subject matter, read [CONTEXT.md](CONTEXT.md).
Before writing any prose that will be published, read
[.agents/voice.md](.agents/voice.md).

## What this repo is

The site (anduin.ch — blog with tags and search, plus a projects page) and the harness
that produces it. The harness is being built first, deliberately.

**Iteration 1 of 5 (foundation) is complete.** The exit test passed on 2026-08-28: a
draft written from a raw five-line dump, using only CONTEXT.md and voice.md, was judged
recognizably mine.

**Iteration 2 (capture to draft) is complete.** The exit test passed on 2026-08-28: the
AirPrint dump went through `/grill`, `/draft` and `/review` and came out as a post
judged "grundsätzlich passt es". The one thing missing from it — the dump's links had
been credited by name and dropped as URLs — became
[ADR-0007](.agents/adr/0007-links-survive.md) rather than a one-off fix.

Two things that run exposed, worth carrying into Iteration 3:

- **The verdict flipped from `stub` to `post` on a single late answer.** Three rounds in,
  the substance gate had nothing quotable behind it. The interrogation is worth running
  to the end even when it feels dry.
- **The same session wrote and reviewed the draft.** It found six untraceable claims in
  its own text, which is better than none, and it is still the weakest link in the
  arrangement.

Do not scaffold Iterations 4-5; their abstractions are still guesses.
**Iteration 3 (site) has started.** [ADR-0001](.agents/adr/0001-framework.md) was
decided on 2026-08-29: **Astro**, chosen for build-time validation that fails loudly.
The design is settled and drawn; its specification is the design-system sheet in the
canvas. The component library is the site's source of truth — the website and any
Claude Design sync are both built from it, in that order.

## Working language

| What | Language |
|---|---|
| Conversation with me, including interrogation | **German** |
| Everything checked in: this file, CONTEXT.md, voice.md, ADRs, skills, commit messages | **English** |
| Published posts | **English** |

See [ADR-0002](.agents/adr/0002-language.md), including the trap that the
German-to-English step introduces.

## Constraints

These exist because of one specific failure mode: a sparse dump plus a capable model
produces fluent, plausible, generic text, and future-me cannot tell which parts were
actually known and which were filled in. That is worse than no post.

### C1 - Interrogate before drafting

The primary job is not writing, it is interrogation. Extract what only I know: what I
tried first, what broke, which version, why I rejected the obvious approach, how long
it cost me. Drafting starts after that, never before. A draft produced without
interrogation violates C1 even when it reads well — especially when it reads well.

### C2 - Refusing to write is a valid outcome

"This dump is not enough" and filing it as a stub is an expected result, not a
failure. Name what is missing, so the next pass knows what to ask. Without a real
exit, an agent always produces something.

### C3 - Assumptions are marked, not smoothed

Anything not traceable to the dump, to CONTEXT.md, or to a cited source gets flagged
inline where it sits, not collected in a footnote. Never resolve an uncertainty by
quietly picking the plausible option. Markers are resolved or cut before publishing —
never silently smoothed away.

### C4 - Decisions get ADRs

Every non-obvious choice is recorded with its reasoning, so it does not get
re-litigated in six months. ADRs live in [.agents/adr/](.agents/adr/), numbered,
following [template.md](.agents/adr/template.md). Opening an ADR with status **Open**
before it is decided is the normal path, not an exception. Superseded ADRs get marked
as superseded; they are never deleted or edited into agreement with the present.

## Redaction

The hard rules are in [CONTEXT.md](CONTEXT.md). They are not negotiable, and they are
not a final review step — a redacted value must never enter a draft in the first
place. The procedure for applying them to one value is the `redaction-check` skill.

Since [ADR-0006](.agents/adr/0006-pipeline-in-repo.md) the boundary is **publication,
not the repo.** `pipeline/` holds raw dumps and raw repo findings unchanged; the draft
section of a record is where the rules apply in full. **This repo is private, and
`pipeline/` is the reason.** Opening it is not a casual operation — see ADR-0006.

## Skills

- One directory per skill, one `SKILL.md` in it, YAML frontmatter with `name` and
  `description`. Referenced scripts live beside it.
- Small and single-purpose. A skill that does two things is two skills.
- **User-invoked** skills orchestrate, and are only reachable when I type them.
  Frontmatter: `disable-model-invocation: true`.
- **Model-invoked** skills hold reusable discipline, and can be reached for
  automatically. Frontmatter: `user-invocable: false`.
- A user-invoked skill may call model-invoked skills. It may never call another
  user-invoked skill — which the two frontmatter flags now enforce rather than merely
  request.

### The pipeline

| Skill | Kind | Input → output | Refuses when |
|---|---|---|---|
| `grill` | user | dump → capture record, verdict `post` or `stub` | never; a `stub` verdict is its own valid outcome |
| `draft` | user | capture record → draft | no record, thin record, paraphrased answers, `stub` verdict, or the substance gate cannot be met by quotation |
| `review` | user | draft → verdict `ready` or `blocked` | — blocks only on the three hard gates |
| `redaction-check` | model | one value → allowed or not | — |
| `source-trace` | model | one claim → sourced or marked | — |

I run them in order and by hand. **They deliberately cannot chain.** The gap between
`/grill` and `/draft` is the human step that makes C1 real, and a `/draft` that could
ask questions would fill gaps instead of refusing.

## Layout

```
AGENTS.md            # this file
CLAUDE.md            # symlink -> AGENTS.md
CONTEXT.md           # vocabulary, audience, homelab facts, redaction rules
HARNESS-HANDOFF.md   # iteration plan and rationale
.agents/
  voice.md           # samples and prohibitions
  adr/               # template.md, 0001-* .. 0007-*
.claude/
  skills/            # grill, draft, review, redaction-check, source-trace
pipeline/            # dumps, capture records, drafts - one file per topic
```

### pipeline/

One file per topic, cumulative: it starts as a dump and grows through interrogation,
draft and review. The stage is in the frontmatter, not in the directory
([ADR-0006](.agents/adr/0006-pipeline-in-repo.md)).

```yaml
status: dump | captured | stub | drafted | blocked | ready
```

| Status | Means |
|---|---|
| `dump` | raw, not interrogated |
| `captured` | grilled, verdict `post` |
| `stub` | grilled or drafted and refused; what is missing is written down |
| `drafted` | draft written, not reviewed |
| `blocked` | reviewed, a hard gate failed |
| `ready` | reviewed, passes |

Published posts do not live here. They move into Astro's `src/content/` when a
record reaches `ready` ([ADR-0001](.agents/adr/0001-framework.md)), which is why this
directory is called `pipeline/` and not `content/`.
