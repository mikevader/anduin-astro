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

**Iteration 2 (capture to draft: grill, draft and review skills) is next and has not
been started.** Begin it in a fresh session. Do not scaffold Iterations 3-5 — their
abstractions are still guesses.

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
place.

## Skills

None yet. `.claude/skills/` stays empty until Iteration 2. When skills arrive:

- One directory per skill, one `SKILL.md` in it, YAML frontmatter with `name` and
  `description`. Referenced scripts live beside it.
- Small and single-purpose. A skill that does two things is two skills.
- **User-invoked** skills orchestrate, and are only reachable when I type them.
- **Model-invoked** skills hold reusable discipline, and can be reached for
  automatically.
- A user-invoked skill may call model-invoked skills. It may never call another
  user-invoked skill.

## Layout

```
AGENTS.md            # this file
CLAUDE.md            # symlink -> AGENTS.md
CONTEXT.md           # vocabulary, audience, homelab facts, redaction rules
HARNESS-HANDOFF.md   # iteration plan and rationale
.agents/
  voice.md           # samples and prohibitions
  adr/               # template.md, 0001-*, 0002-*, 0003-*
.claude/
  skills/            # empty until Iteration 2
```

Drafts produced for testing are not repo files. They go to a scratch directory; only
the verdict lands here.
