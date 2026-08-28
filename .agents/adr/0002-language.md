# ADR-0002: Blog language

- **Status:** Accepted
- **Date:** 2026-08-28
- **Question:** which language(s) are posts published in, and which language does the
  interrogation happen in?

## Context

The choice drives the i18n design, voice.md, and the language of the capture
conversation. German and English voices do not match, so publishing both would need
two sample sets and two sets of prohibitions.

The audience is future-me first and people with similar interests second. The existing
corpus on anduin.ch is entirely English. The surrounding ecosystem — Kubernetes,
Helm, iOS — is English-first. I am a German speaker; the existing posts are
non-native English, and that is audibly part of the voice.

## Options

### A - English only

One voice, one sample set, no i18n work in Iteration 1. Matches both the existing
corpus and the ecosystem.

### B - German and English

Doubles voice.md and forces i18n design now. Would make the German posts more natural
to write, at the cost of maintaining two voices, two tag vocabularies and translation
drift.

### C - German only

Most natural voice, smallest reach, and inconsistent with every post already published.

## Decision

**English-only posts.** The interrogation conversation happens in **German**;
everything checked into the repo — ADRs, CONTEXT.md, voice.md, skills, commit
messages — stays **English**.

## Consequences

- voice.md needs one sample set. The samples are non-native English written by a German
  speaker, and that texture is part of what "recognizably mine" means. See the open
  question in [voice.md](../voice.md) about how far to clean it up.
- i18n stops being a framework selection criterion. That materially changes
  [ADR-0001](0001-framework.md); it was a major axis when the brief was written.
- Interrogating in German should surface more detail than English would, because it
  removes the friction from the answer side.
- **The trap:** every answer now crosses a language boundary before it reaches the
  draft. Translation is exactly where invented detail sneaks in, because rephrasing
  and inventing look identical in the output. The grill skill (Iteration 2) must
  capture German answers verbatim and keep them, so a claim in the draft can be traced
  back to what I actually said, not to a paraphrase of it.
- Multi-language support remains possible later as a site capability, without
  reopening this ADR.

## Revisit when

I want to write a post whose audience is specifically Swiss or German-speaking, or if
the German capture turns out to introduce drift the verbatim rule does not catch.
