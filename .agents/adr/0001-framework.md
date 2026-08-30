# ADR-0001: Static site framework - Hugo or Astro

- **Status:** Accepted
- **Date:** 2026-08-28, decided 2026-08-29
- **Question:** which static site generator builds anduin.ch?

## Context

Deliberately deferred until [CONTEXT.md](../../CONTEXT.md) existed, on the theory that
writing it would reveal how diagram- and code-heavy the content actually is. It has,
and it also changed two of the inputs:

- **The content is broader than assumed.** Not a Kubernetes blog: iOS, Java/SWT,
  Ansible, teaching, hardware. Tag design matters more than any single domain's needs.
- **The corpus is tiny.** Six posts on anduin.ch (2011-2014), all English, all
  `Uncategorized`. Migration is small enough that it cannot justify a framework choice.
- **Code blocks are the payload.** In every existing post the prose is connective
  tissue between snippets. Syntax highlighting, copyable blocks and stable code
  formatting carry more weight than image handling.
- **Images are near-absent** in existing posts — only theme headers. Build-time image
  optimisation is a requirement from the brief, not from the corpus.
- **i18n pressure is gone.** [ADR-0002](0002-language.md) settled on English-only
  posts, so multi-language content routing is no longer a selection criterion. It was
  a major one when the brief was written.
- **Diagrams arrive in Iteration 4** as checked-in text (Mermaid or D2). Both
  candidates can do it; the question is how much plumbing.

The axis that emerged late, and that matters most here: **how easily can an agent
verify its own work?** Astro's typed content collections fail loudly on a malformed
tag or a missing frontmatter field. Hugo more often renders the page with a silently
empty field — a failure mode that pairs badly with an agent that writes content
unattended.

**A second axis arrived on 2026-08-29**, after the design work in this repo produced
a component inventory ([System.dc.html](../../System.dc.html)) and `/design-sync` was
run against the repo. It could not run, and the reason generalises: syncing a design
system to Claude Design consumes a **compiled component library**. Astro leaves real
components behind. Hugo leaves partials and Go templates, which that path has no way
to consume. This does not decide the ADR on its own — the site does not depend on the
sync — but it is a real cost that only lands on one side.

**Bias to name explicitly:** this repo is called `anduin-hugo`. The name predates the
decision and is not evidence for it.

## Options

### A - Hugo

Single binary, no Node toolchain, very fast builds, mature taxonomy/tag support out of
the box. Weak on verification: missing or misspelled frontmatter fields tend to render
as empty rather than fail. Templating is its own language.

### B - Astro

Typed content collections give schema validation with loud failures at build time,
which is the strongest argument on the table for an agent-written site. Node toolchain
and dependency maintenance, which is ongoing cost for a personal site that may sit
untouched for a year.

## Decision

**Astro.**

Verification decided it. This entire harness exists because of one failure mode: a
capable model produces fluent, plausible output and future-me cannot tell which parts
were real. C3 answers that for prose. Nothing answered it for the site build until
now. Astro's content collections fail the build on a malformed tag or a missing
frontmatter field; Hugo renders the page with the field silently empty. Choosing the
toolchain that stays quiet when something is wrong would have contradicted the reason
the harness was built.

The design-system axis pointed the same way and cost nothing to follow.

Hugo's zero-maintenance toolchain was the real argument against, and it was not
dismissed — it is priced in below.

## Consequences

- **Node toolchain maintenance is now a recurring tax**, and it lands hardest exactly
  where this site is weakest: long untouched stretches. A cold start after a year will
  plausibly need a dependency bump before it builds at all. This is the cost that was
  accepted, not one that was argued away. Lockfile is committed; versions are pinned;
  a build that fails after a long gap is expected maintenance, not a regression.
- **Hugo's single binary is given up.** If the toolchain tax turns real, this is what
  is missed, and reopening means a full template rewrite — the migration cost is not
  symmetric.
- **A component library becomes the site's source of truth**, not an optional layer.
  The library is the executable form of [System.dc.html](../../System.dc.html), the
  website is built from it, and the Claude Design sync consumes the same build. That
  fork is the sequencing: library first, then the site and the sync independently.
- **The repo name `anduin-hugo` is now actively wrong** and should be renamed.
- **The site lives in this repo**, per the handoff brief and
  [ADR-0006](0006-pipeline-in-repo.md). The repo stays private because of `pipeline/`;
  only built output is published.
- For this to keep being right, build-time validation has to actually catch agent
  mistakes. If schema errors turn out to be rare and the toolchain tax turns out to be
  frequent, the trade inverts.

## Revisit when

Reopen if a cold build after a long gap costs more than an afternoon more than once,
or if content-collection validation turns out not to catch the failures it was chosen
for. Do not reopen over the design-sync axis alone — that path is a consumer of the
library, not a reason to keep it.
