# ADR-0001: Static site framework - Hugo or Astro

- **Status:** Open
- **Date:** 2026-08-28
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

Not yet. Blocked on nothing external — it needs a deliberate call now that the content
profile is known. To decide it: weigh Astro's build-time validation against Hugo's
zero-maintenance toolchain, given that this site will go long stretches without being
touched and that the agent needs a way to check its own output.

## Consequences

To be filled in when decided.

## Revisit when

Decide before Iteration 3 (site + migration) starts. Reopen if unattended agent
authoring turns out to produce silently broken pages, or if toolchain maintenance
turns into a recurring tax.
