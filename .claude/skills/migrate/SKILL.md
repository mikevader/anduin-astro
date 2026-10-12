---
name: migrate
description: Carry one post from the old WordPress site at anduin.ch over into src/content/posts/, keep its raw source in pipeline/migration/, and write what could not be carried over into the migration report. Never rewrites the post; corrects typos only, and lists every one.
disable-model-invocation: true
---

# migrate

Move one existing post from the WordPress site into the Astro site. **This is not
writing.** The post was published years ago and is Michael's text; the job is to carry
it over intact and to say, precisely, what did not survive the move.

Read [ADR-0014](../../../.agents/adr/0014-wordpress-migration.md) first — it holds every
decision this skill applies. Then [ADR-0004](../../../.agents/adr/0004-english-register.md)
for what counts as a typo, and [CONTEXT.md](../../../CONTEXT.md) for the redaction rules.

Input: one post, by slug or by its old URL. One run, one post.

## Gate — before touching anything

1. **The source is reachable.** Fetch the post from the live site (step 1 below). If
   `anduin.ch` cannot be reached, stop and say so. **Never reconstruct a post from
   [voice.md](../../../.agents/voice.md)** or from memory: the samples there are
   verbatim for the prose but omit code and images, and a migrated post with invented
   code in it is worse than no post.
2. **It has not been migrated already.** Grep `src/content/posts/` for the old URL in
   `migrated.from`. If it is there, stop — a second run would fork the post.

## 1. Fetch, and keep the raw source

- `https://anduin.ch/wp-json/wp/v2/posts?slug=<slug>` for `id`, `date`, `slug`, `link`,
  `title.rendered`, `content.rendered`, `categories`, `tags`.
- Comments: `https://anduin.ch/wp-json/wp/v2/comments?post=<id>` — **count only.** Do not
  store comment bodies, names, e-mail addresses or IPs anywhere.
- If the REST API is unavailable, fall back to the post's own page and take the
  `.entry-content` element. Say in the report which route was used.
- Write the fetched HTML **unchanged** to `pipeline/migration/<slug>.html`
  ([ADR-0006](../../../.agents/adr/0006-pipeline-in-repo.md): raw sources stay raw). It
  is what every later question about this post gets checked against.

## 2. Convert

Work from the raw HTML, element by element. Nothing is paraphrased, summarised,
reordered, expanded or "improved".

### Prose

- **Verbatim**, with one exception: misspellings and doubled words are corrected under
  ADR-0004 rule A. Word order, rhythm, German-influenced constructions and directness
  stay exactly as they are. *"Hopefully it took you not the two hours I have spent"*
  is not a typo.
- **Every correction is recorded** in the report as `before → after`. A correction that
  is not in the list is a defect, and the verification compares the two.
- When unsure whether something is a typo or a construction, **leave it** and list it
  under "left as is" in the report. Erring toward leaving it is the cheaper mistake.

### Code

- Every code block becomes a fenced block. The language comes from the source markup
  (`<pre class="brush: java">`, `[sourcecode language="objc"]`, a `lang-` class); if the
  source does not say, leave the fence without a language rather than guess one.
- The code itself is copied byte for byte after HTML-entity decoding. No reformatting, no
  modernising, no fixing of what looks like a bug in it.

### Links

- Kept, on the same words they sat on.
- Links to another post on anduin.ch are rewritten to that post's new URL
  (`/posts/<slug>/`) if it is already migrated; otherwise left pointing at the old URL,
  which the redirect pages will cover, and listed in the report.
- Run `redaction-check` on every URL and hostname before it is written. The posts were
  public, but the rules apply to every public artifact regardless of where the value
  came from.

### Images

[ADR-0009](../../../.agents/adr/0009-build-time-image-optimisation.md), option A.

- Images **in the content** are downloaded at full resolution into
  `src/assets/posts/<slug>/`, keeping the original file name, and referenced relatively
  from the post: `![alt](../../assets/posts/<slug>/<file>)`. The build optimises them and
  fails on a missing file.
- Alt text comes from the source. If the source has none, write an
  `[ASSUMPTION: alt text missing in the original — describe what the image shows]`
  marker, never an invented description.
- Theme header images are not content. Do not carry them over; list them in the report.

### Anything else

Shortcodes, embeds, galleries, tables, footnotes, anything not covered above: carry it
over if Markdown can hold it faithfully, otherwise leave it out **and list it in the
report**. Never approximate it with something that looks similar.

## 3. Frontmatter

```yaml
---
title: "<title, verbatim, typos corrected and listed>"
date: <original publication date, YYYY-MM-DD>
excerpt: "<the post's own first sentence, verbatim as migrated>"
tags: [<from the closed vocabulary in src/content.config.ts>]
migrated:
  from: "<the old permalink, exactly as WordPress gives it>"
  corrections: <number of entries in this post's correction list>
---
```

- **Tags:** the old posts are all `Uncategorized`. Pick from `TAGS` in
  `src/content.config.ts`. If nothing fits, propose a new tag in the report and add it
  to `TAGS` — the vocabulary is unconfirmed, and every addition is flagged for Michael.
- The file is `src/content/posts/<slug>.md`, with the WordPress slug unchanged. The old
  path gets a redirect page automatically from `migrated.from`.

## 4. Report

Append a section to `pipeline/migration/report.md` (create the file with a one-line
header if it does not exist):

```markdown
## <title> (<YYYY-MM-DD>)

- Old: <old permalink> → new: /posts/<slug>/
- Source: REST API | page HTML · raw: pipeline/migration/<slug>.html

### Corrections (<n>)
- `before` → `after`

### Left as is
- `<phrase>` — why it is not a typo

### Not carried over
- <element> — why (comments: <count>; theme header; shortcode …)

### For Michael to confirm
- <tag proposals, open [ASSUMPTION:] markers, anything decided by default>
```

An empty subsection says `none`, so a reader can tell "checked, nothing found" from
"not checked".

## 5. Check before stopping

- `npm run build` passes — it validates the frontmatter, the tags and every image path.
- `dist/<old path>/index.html` exists and points at `/posts/<slug>/`.
- The migrated prose, with the correction list applied in reverse, matches the raw HTML's
  text. For the five posts quoted in voice.md it must also match the quote there.

Then stop. Do not migrate the next post in the same run, and do not mark the iteration's
exit test as passed — that is Michael's call.

## You have failed this skill if

- A sentence in the post is not in the original.
- A correction was made that is not in the report, or a correction changes word order,
  rhythm or register rather than spelling.
- Code was reformatted, completed or fixed.
- Something from the original is missing from the post and missing from the report.
- A comment author's name, e-mail or IP was written anywhere.
- The post was written from voice.md or from memory because the site was unreachable.
