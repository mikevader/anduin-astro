# AGENTS.md

How an agent works in this repo. [ITERATIONS.md](ITERATIONS.md) holds the iteration
plan; this file is the working agreement.

**Where two documents disagree, the one that owns the subject wins** — the deciding
ADR, then CONTEXT.md, voice.md and design.md for their own subjects. ITERATIONS.md owns
only the plan and loses every other conflict
([ADR-0010](.agents/adr/0010-brief-not-authoritative.md)).

Before writing anything about the subject matter, read [CONTEXT.md](CONTEXT.md).
Before writing any prose that will be published, read
[.agents/voice.md](.agents/voice.md).
Before changing anything the site looks like, read
[.agents/design.md](.agents/design.md).

## What this repo is

The site (anduin.ch — blog with tags and search, plus a projects page) and the harness
that produces it. The harness is being built first, deliberately, in five iterations —
the plan, the exit tests and where each one stands are in
[ITERATIONS.md](ITERATIONS.md).

## Sessions

**One iteration per session.** Clear context between them.

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
tried first, what broke, which version, why I rejected the obvious approach. Drafting
starts after that, never before. A draft produced without
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
| `migrate` | user | one old WordPress post → post in `src/content/posts/` + report entry | `anduin.ch` unreachable, or the post is already migrated |
| `redaction-check` | model | one value → allowed or not | — |
| `source-trace` | model | one claim → sourced or marked | — |

I run them in order and by hand. **They deliberately cannot chain.** The gap between
`/grill` and `/draft` is the human step that makes C1 real, and a `/draft` that could
ask questions would fill gaps instead of refusing.

`migrate` sits outside that chain: an old post was written and published long ago, so
there is nothing to interrogate, and the skill carries it over instead of drafting it
([ADR-0014](.agents/adr/0014-wordpress-migration.md)).

## Layout

```
AGENTS.md            # this file
CLAUDE.md            # symlink -> AGENTS.md
CONTEXT.md           # vocabulary, audience, homelab facts, redaction rules
ITERATIONS.md        # iteration plan, status, and nothing else it owns
.agents/
  voice.md           # samples and prohibitions
  design.md          # tokens, type, grid, components, prohibitions
  adr/               # template.md, 0001-* .. 0014-*
.claude/
  skills/            # grill, draft, review, migrate, redaction-check, source-trace
pipeline/            # dumps, capture records, drafts - one file per topic
  migration/         # raw HTML of each migrated WordPress post, and report.md
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
