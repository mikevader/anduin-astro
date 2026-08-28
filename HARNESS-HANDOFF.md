# Harness Handoff Brief

Seed document for building an agent harness around a personal website/blog project.
Drop this at the repo root, point Claude Code at it, and work through **Iteration 1 only**.

---

## 1. Project brief

**The site**
- Personal website: blog (tags + search) plus a separate projects page
- Statically generated, internationalized, image optimization during the build
- Content authored in Markdown
- An older existing website needs to be migrated over

**The harness**
Built *before* the site, in iterations. Its jobs, in priority order:

1. Turn raw dumps — thoughts, links, terminal output, half-formed ideas — into blog posts
   that are understandable years later
2. Help build and maintain a professional site, including migrating the old one
3. Produce diagrams and images that stay maintainable

**Audience for the posts:** future me first, people with similar interests second.
Assume Kubernetes/self-hosting literacy. Do not assume knowledge of my specific cluster.

**Side goal:** understand how to build and use a harness, and be able to lift the generic
parts into future projects.

---

## 2. Design constraints (non-negotiable)

These exist because of a specific failure mode: a sparse dump plus a capable model
produces fluent, plausible, generic text, and future-me cannot tell which parts were
actually known and which were filled in. That is worse than no post.

**C1 — Interrogate before drafting.**
The primary skill is not a writer, it is an interrogator. Its job is to extract what only
I know: what I tried first, what broke, which version, why I rejected the obvious approach.
Drafting happens after.

**C2 — The agent may refuse to write a post.**
"This dump is not enough" and filing it as a stub is a valid, expected outcome. Without an
exit, the agent will always produce something.

**C3 — Assumptions are marked, not smoothed.**
Anything not traceable to the dump or a cited source gets flagged inline as an assumption.

**C4 — Decisions get ADRs.**
Every non-obvious choice is recorded with its reasoning, so it does not get re-litigated
in six months.

---

## 3. Decisions

**Made**
- Harness lives inside the website repo for now; generic parts get extracted in Iteration 5
- Framework shortlist: Hugo vs Astro (see open decisions)

**Open — resolve during Iteration 1, record as ADRs**
- **ADR-0001: Hugo vs Astro.** Deliberately deferred until CONTEXT.md exists, because
  writing it will reveal how diagram- and code-heavy the content actually is. Relevant
  axis that emerged late: how easily an agent can *verify its own work*. Astro's
  typed content collections fail loudly on a malformed tag or missing frontmatter field;
  Hugo more often renders a page with a silently empty field.
- **ADR-0002: Blog language.** German, English, or both. Drives the i18n design *and*
  voice.md — if both, samples are needed in both, since the two voices will not match.
  Also determines what language the interrogation happens in.
- **ADR-0003: Definition of done for a post.** Must exist before the review skill has
  anything to check against.

---

## 4. Iteration plan

Each iteration ships something usable. Do not start the next one until the current
exit test passes.

| # | Scope | Exit test |
|---|-------|-----------|
| 1 | Foundation: repo skeleton, CONTEXT.md, voice.md, ADR discipline | Agent drafts on a topic I already wrote about; output is recognizably mine |
| 2 | Capture → draft pipeline: grill, draft, review skills | One real dump becomes a post I would actually publish |
| 3 | Site + migration skills | One old page migrated, with a report of what could not be carried over |
| 4 | Diagrams as checked-in text (Mermaid or D2) | Cluster topology diagram rendered from source in the repo |
| 5 | Extract generic skills for reuse | Generic set symlinked into a second project |

---

## 5. Iteration 1 — what to actually build

Target layout:

```
AGENTS.md              # how an agent works in this repo
CONTEXT.md             # domain vocabulary + audience definition
.agents/
  adr/                 # 0001-framework.md, 0002-language.md, ...
  voice.md             # how I write, with samples
  skills/              # empty for now
```

**CONTEXT.md** — the shared vocabulary, so the agent stops re-explaining things.
Seed it with the homelab stack: k3s, Raspberry Pi nodes, Flannel, MetalLB, Traefik,
HelmChartConfig, CoreDNS. Include the audience definition from section 1.

**voice.md** — 3–5 samples of writing I actually like from myself, plus explicit
prohibitions. Generic style instructions ("be concise, be technical") do close to nothing.
Samples plus a list of banned constructions do a lot.

**AGENTS.md** — working agreements: constraints C1–C4 above, where ADRs live, how skills
are structured (one SKILL.md per directory, YAML frontmatter with name + description),
and the user-invoked vs model-invoked split.

**ADRs** — write 0001–0003 as open questions first, then close them as they get decided.

### Exit test
Pick a topic I have already written about. Have the agent draft it from a short dump.
If the output is not recognizably mine, voice.md is too thin — iterate on it, do not
proceed. Everything downstream inherits this problem.

---

## 6. Working agreements for the Claude Code session

- **One iteration per session.** Clear context between them. Iteration 1 is interactive,
  not AFK — voice.md and the ADRs cannot be written without me.
- **Skills are small and single-purpose.** One SKILL.md per directory, YAML frontmatter
  with `name` and `description`, referenced scripts where needed.
- **Two kinds of skill.** User-invoked skills orchestrate and are only reachable when I
  type them. Model-invoked skills hold reusable discipline and can be reached for
  automatically. A user-invoked skill may call model-invoked ones, never another
  user-invoked one.
- **Do not scaffold Iterations 2–5 now.** The abstractions are guesses until Iteration 1
  is real.

---

## 7. Bootstrap prompt

```
Read HARNESS-HANDOFF.md.

We are doing Iteration 1 only — do not scaffold later iterations.

Before writing anything, ask me the questions you need answered to write CONTEXT.md
and voice.md well. For voice.md specifically, ask me for writing samples rather than
inferring a style.

Then propose the file layout and wait for my confirmation before creating files.
```
