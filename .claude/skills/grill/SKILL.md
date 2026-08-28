---
name: grill
description: Interrogate a raw dump in pipeline/ until what only Michael knows is on the page, then record it verbatim and decide post or stub. Produces a capture record and never a draft.
disable-model-invocation: true
---

# grill

**One job: get out of Michael's head what is not in the dump, and write it down in his
own words.** This is C1 in [AGENTS.md](../../../AGENTS.md), and it is the primary job of
the whole harness. Writing comes later and is somebody else's problem — `/draft`'s.

Read [CONTEXT.md](../../../CONTEXT.md) before you ask anything about the subject
matter. Do not read [voice.md](../../../.agents/voice.md); you are not writing prose
here, and knowing the target voice is how a grill turns into a draft by accident.

## Hard rules

1. **Talk German.** Every question, every follow-up. [ADR-0002](../../../.agents/adr/0002-language.md).
   The record's structure and your own notes are English; his answers are German,
   verbatim.
2. **Verbatim means verbatim.** Copy his answers character for character, typos and
   all. Never tidy, never translate, never summarise. The record is the evidence a
   later draft gets checked against; a paraphrase destroys exactly that.
3. **Write no prose.** Not a sentence that could appear in a post. Not an opening line,
   not a "so what happened was". If you catch yourself composing, stop — that is the
   failure this skill exists to prevent.
4. **Never fill a gap yourself.** An unanswered question is recorded as unanswered.
5. **One round is not an interrogation.** See below.

## Phase 1 — read

Read the target file in `pipeline/`. If Michael named no file, list the ones with
`status: dump` and ask which.

Read it for what is *missing*, not for what is there. A dump is the residue of the
work, not the work. In particular the value may be invisible: `micro_video.md` looks
like a link dump with two empty headings, and the actual work in it is the
decomposition into sub-problems. Assume there is something.

## Phase 2 — ask

Cover these axes. Every one gets an entry in the record, including the ones that come
back empty — `not answered`, or `not applicable` with the reason. Silently dropping an
axis is how a grill gets skipped past.

| Axis | What you are after |
|---|---|
| First attempt | What did you try first, and why did you abandon it |
| The break | Exact symptom. Error message, or explicitly: no error at all |
| Rejected option | Which obvious approach did you not take, and why |
| Deciding criterion | For evaluations: what actually decided it |
| Versions | Of anything version-sensitive |
| Residual ignorance | What is still not understood. This is content, not a gap |
| Dates | When did this happen |
| Sources | What was copied from where |
| Names | Which names came up, and may they be published |
| One sentence | The single thing future-you needs from this |

**Do not ask what it cost.** Struck from the gates in
[ADR-0003](../../../.agents/adr/0003-post-done.md) and struck from the questions here.
If Michael volunteers a duration, record it; never ask for one.

### How to ask

- **In rounds.** Three or four questions, wait, then follow up on the thin answers. A
  single batch answered in a single batch is a form filled in, not an interrogation.
- **Never accept the first answer to the central question.** In the mail service case
  the first answer named the wrong cause, confidently, and it was the answer he
  believed. Ask one follow-up that could contradict it: what was the symptom, did that
  change actually fix it, how did you confirm.
- **Ask about what is not there.** Empty headings, dead links, an unfinished sentence.
  `micro_video.md` has a heading "Make Settings stick" with nothing under it. That
  heading is a problem he hit.
- **Do not offer him the answer.** "Was it a caching problem?" gets you a yes. "Was
  genau ist passiert?" gets you the thing you did not know to ask about.

## Phase 3 — check the repo

[ADR-0005](../../../.agents/adr/0005-interrogate-the-repo.md). Only after Phase 2, so
his account is uncontaminated.

**Judge relevance first.** Not every post has a repo behind it and not every post needs
one. A record with `No repo — <reason>` is complete, not deficient.

If a repo is relevant:

1. `gh repo list mikevader --visibility public` — live, every time. No checked-in list.
   If `gh` fails, treat every repo as private and say so in the record.
2. Read the CHANGELOG and the commit subjects in the window the conversation implies.
   Ask him for the date if you cannot derive it. Do not guess a window.
3. Diffs only for the commits that actually matter.
4. **Bring every contradiction back as a question.** Never resolve one yourself, in
   either direction. The repo is not automatically right — it records what was
   committed, not what was tried.

The mismatch is the highest-value question available, because it is the only one he
cannot answer from memory alone. It is also the reason this phase exists at all.

Follow-up answers go in the record under their own heading, so it stays visible which
answers came before the repo check and which came after.

## Phase 4 — verdict

[ADR-0003](../../../.agents/adr/0003-post-done.md). Two tests, in this order.

**The floor:**
> A post needs own work — something tried, compared, rejected or decided. A link
> collection without my own judgement is a stub.

**The substance gate:**
> The post contains what only Michael knows: the failure path, **or** the rejected
> option with its reason, **or** the criterion that decided it.

At least one of the three. Post shapes are not a concept here — do not classify the
post and then pick a bar.

Rules on the verdict:

- **Decide it after the interrogation, never from the dump.** Always.
- `stub` is a correct, expected outcome (C2). Naming what is missing is the deliverable
  in that case, so the next pass knows what to ask.
- The verdict is a proposal. Michael can override it; write the override and his reason
  into the record so a later pass can see the gate was overruled rather than met.
- Quote which answer satisfies the gate. If you cannot point at one, the verdict is
  `stub`, whatever your impression of the conversation was.

## Phase 5 — write the record

Rewrite the file in place, preserving the original dump verbatim in section 1.

```markdown
---
status: captured        # or: stub
grilled: YYYY-MM-DD
---

# <topic>

## 1. Raw dump (as written)

<the original file content, fenced, unchanged>

## 2. Interrogation (verbatim, German)

**F: <question>**
> <his answer, character for character>

## 3. Repo check

- Repos considered, public or private, how that was determined
- Window read, what was found
- or: `No repo — <reason>`

### Follow-ups after the repo contradicted the account

**F: <question>**
> <answer>

## 4. Sources

## 5. Coverage

| Axis | Status |
|---|---|
| First attempt | answered / not answered / n/a - reason |
| ... | |

## 6. Verdict

`post` or `stub`, and the quote from section 2 that carries it.
For a stub: what is missing, as questions the next pass should ask.

## 7. Open before publishing
```

Then tell him the verdict and stop. **Do not offer to draft, and do not start.** He
types `/draft` when he is ready — the gap between the two is the human step that makes
C1 real.

## You have failed this skill if

- You asked everything in one message and wrote the record from one reply.
- The record contains an English paraphrase where a German answer should be.
- An axis is missing from the coverage table because it did not come up.
- You accepted the first explanation of the central problem without one probing
  follow-up.
- You skipped Phase 3 without recording why.
- There is a sentence in the record that reads like the opening of a blog post.
- The verdict is `post` and you cannot quote the answer that earns it.
