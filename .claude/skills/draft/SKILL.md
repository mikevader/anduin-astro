---
name: draft
description: Turn a capture record in pipeline/ into a draft post. Refuses when there is no record, when the record is thin, or when the substance gate cannot be satisfied by quotation. Never interrogates and never asks Michael to fill a gap.
disable-model-invocation: true
---

# draft

Turn a capture record into a post. **This skill cannot ask questions**, and that is
deliberate: whoever can ask can also fill a gap, and filling gaps while writing is the
exact failure the harness exists to prevent. Everything you need is in the record or it
is not available.

Read [CONTEXT.md](../../../CONTEXT.md) and [voice.md](../../../.agents/voice.md) before
writing a word. voice.md is the substance — the samples outrank the rules in it, and
when the two disagree the samples win.

## Gate — run this before writing anything

All five. Any failure stops the skill; none of them is a judgement call you get to make
in the draft's favour.

1. **A capture record exists** for the named file, with `status: captured`. A file with
   `status: dump` has not been interrogated → refuse, say `/grill` first.
2. **Section 2 has answers, not just questions.** Questions with no `>` block under
   them mean the interrogation did not finish → refuse.
3. **The answers are German and verbatim.** English prose in section 2 means somebody
   paraphrased, and per [ADR-0002](../../../.agents/adr/0002-language.md) a paraphrase
   is where invention enters → refuse.
4. **The verdict is `post`.** `status: stub` → refuse. Michael can override this, but
   he has to say so, and the override goes into the record with his reason.
5. **The substance gate is satisfied by quotation.** Name the passage in section 2 that
   supplies the failure path, the rejected option with its reason, or the deciding
   criterion. You may not satisfy this gate by reasoning about the material — only by
   pointing at a quote. Cannot point → refuse.

### Refusing properly

A refusal is an outcome with an artifact (C2), not a message in the chat. Write into
the record:

```markdown
---
status: stub
---

## Draft refused YYYY-MM-DD

Which gate failed, and what is missing — phrased as the questions the next `/grill`
pass should ask.
```

Then stop. Do not draft a shorter version, do not draft "what is possible so far".

## Writing

### Sourcing

Use `source-trace` for every claim. Four admissible sources: the dump, the verbatim
answers, CONTEXT.md, a cited source. Nothing else, and specifically not what you know
about the tool.

The German-to-English crossing happens here and only here, which makes this skill the
single point where fabrication can enter unseen. Translate close. When the German is
ambiguous, mark it — do not pick the reading that writes better.

Anything you cannot source gets an inline `[ASSUMPTION: ...]` marker where the claim
sits, or gets cut. Cutting is usually right.

### Redaction

Use `redaction-check` at the moment a value is about to be typed, never afterwards.
The dump is not vetted material — a value being in the dump is not permission. Invent
example values and label them as invented **in the prose**.

### Links

[ADR-0007](../../../.agents/adr/0007-links-survive.md). Turning a link collection into
prose **without losing the links** is the point of the exercise, and most dumps are
mostly links.

- A source that is used gets its **URL on the phrase that credits it.** One flat
  sentence per voice.md rule 7, with the address attached.
- A link with no prose home goes inline as a dry aside, framed the way the dump framed
  it — "I did not use it, but it might help somebody else".
- A trailing list is the fallback, never the default, and only for what genuinely has
  no home. It costs the ending, so earn it.
- **No link from the dump disappears silently.** Cutting one is allowed; doing it
  without saying so in the record is not.

### Voice

From voice.md, the parts a draft gets wrong most often:

- **Open with the situation or the surprise.** Never announce the topic.
- **Tell it in the order it happened.** Dead ends stay in, in sequence.
- **Stop when the problem stops.** No summary, no conclusion, no takeaways. Not one
  existing post has one.
- **Say what is still not understood.** Residual ignorance is content.
- **Length is whatever the problem was.** Four sentences is a complete post. Padding is
  a defect.
- **Understatement carries the tone.** Dry, mildly annoyed, never enthusiastic.
- **Credit sources in one flat sentence.** "This solution is copied from stack overflow."

Check the prohibition list. Check it again for the reassurance adverbs — "simply",
"just", "easily" — which are the ones that survive a first pass.

### Register

[ADR-0004](../../../.agents/adr/0004-english-register.md): fix typos and doubled words,
keep sentence rhythm, word order and directness. **Do not write idiomatic native-speaker
English.** That register is the default a language model reaches for and it is most of
what makes a draft stop sounding like his. German-influenced word order is not an error
here.

## Output

Append to the record, do not overwrite it:

```markdown
---
status: drafted
drafted: YYYY-MM-DD
---

## 8. Draft

<the post>
```

Then stop. Do not review your own draft — `/review` exists, Michael runs it, and a
draft that grades itself grades generously.

## You have failed this skill if

- You wrote anything at all after a gate failed.
- You asked Michael a question. This skill does not ask; it refuses.
- A sentence in the draft cannot be traced to a quote, a cited source or CONTEXT.md,
  and carries no marker.
- You produced a number, a version, a duration or an error message that nobody stated.
- The draft has a concluding paragraph.
- A URL that was in the dump is not in the draft and not accounted for in the record.
- The draft reads like fluent technical English written by nobody in particular. That
  is the diagnosis in voice.md's anti-sample, and it means the record was thin — which
  should have been caught at the gate.
