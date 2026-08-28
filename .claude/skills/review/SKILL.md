---
name: review
description: Check a draft in pipeline/ against the definition of done. Blocks on the three hard gates only, reports everything else, and never rewrites the draft.
disable-model-invocation: true
---

# review

Check a draft against [ADR-0003](../../../.agents/adr/0003-post-done.md). **You may
block, and only on three things. You may not rewrite.**

Read [CONTEXT.md](../../../CONTEXT.md), [voice.md](../../../.agents/voice.md) and
[ADR-0004](../../../.agents/adr/0004-english-register.md) first. Read the whole capture
record, not only section 8 — the record is what the draft gets checked against, and a
review that only reads the draft can only check style.

## Hard gates — these block

Exactly three. You may not invent a fourth, and none of them is negotiable by argument.

### 1. No unresolved C3 markers

Grep for `[ASSUMPTION:`. Every hit blocks. They are resolved or cut before publishing,
never smoothed away.

### 2. Redaction rules pass

Use `redaction-check` on every value in the draft: host names, endpoints, ports, IPs,
account identifiers, repo names, paths, URLs, and the file name itself.

This gate is a judgement call applied per value against the governing test, not a
pattern match. Treating it as a regex would be worse than useless. The draft section is
in scope; sections 1-7 of the record are not
([ADR-0006](../../../.agents/adr/0006-pipeline-in-repo.md)).

### 3. Sources credited

Anything taken from elsewhere is credited in the text, in one flat sentence. Check the
record's section 4 against the draft: a source that was named in the interrogation and
then used silently in the draft is a gate failure.

**The URL has to survive, not only the name** ([ADR-0007](../../../.agents/adr/0007-links-survive.md)).
Crediting "a guide from geekonthepc" without its address is a gate failure — this gate
passed exactly that once, which is why the rule is now explicit. Separately, and as a
soft finding: every URL in the dump is either in the draft or accounted for in the
record.

## Soft — reported, never blocks

- **Traceability.** Walk the draft claim by claim with `source-trace` and find each
  claim's source in the record. Report every claim that has none.
- Exact versions named for anything version-sensitive.
- Open questions stated rather than hidden.
- voice.md prohibitions and rules.

### Known limit, on purpose

The most valuable finding this skill produces is usually **an untraceable claim that
carries no marker** — a fluent, plausible, unsourced sentence. Under ADR-0003 that is
soft, so it is reported and does not block. Report it first and loudly anyway.

The reason it is soft is Michael's call, recorded in ADR-0003. The reason it matters is
[voice.md](../../../.agents/voice.md)'s failure signature: an unsourced sentence tends
to read *better* than the sourced ones around it, so fluency in a draft is a signal to
look harder, not a result.

## Not your job

- **Do not rewrite.** Quote the offending sentence, say what is wrong with it, stop.
  Proposing replacement prose makes you the author, and then nobody is checking.
- **Do not fix the English.** Per ADR-0004, German-influenced word order and long
  coordinated sentences are the voice, not errors. If a review pass makes a draft feel
  less like his, this is the first suspect.
- **Do not check what does not exist yet.** Frontmatter fields, tags, slugs and titles
  are Iteration 3 and are explicitly out of scope in ADR-0003.
- **Do not ask for the cost.** Struck as a done criterion. voice.md rule 3 still governs
  how cost is written when it is there; its absence does not hold up a post.

## Output

Append to the record:

```markdown
---
status: ready        # or: blocked
reviewed: YYYY-MM-DD
---

## 9. Review

**Verdict:** ready | blocked

### Blocking
<gate, the quoted text, what is wrong. Empty if none.>

### Reported
<soft findings, untraceable claims first>
```

## Overriding

A block is a veto against the agent proceeding on its own, **not against Michael.** He
can override any block. Write the override and his reason into the record, so a later
pass can see the gate was overruled rather than met.

If the same gate gets overridden more than twice, the gate is wrong and ADR-0003 says
to revisit it. Say so when you notice it.

## You have failed this skill if

- You blocked on something that is not one of the three gates.
- You rewrote a sentence instead of naming what is wrong with it.
- You corrected grammar that ADR-0004 protects.
- You passed a draft without opening the capture record.
- You reported "looks good" without having traced a single claim back to a quote.
