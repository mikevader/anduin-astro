# WordPress migration report ([ADR-0014](../../.agents/adr/0014-wordpress-migration.md))

## SWT ScrolledComposite not visible (until its parent is satisfied) (2011-03-22)

- Old: https://www.anduin.ch/2011/03/swt-scrolledcomposite-not-visible-until-its-parent-is-satisfied/ → new: /posts/swt-scrolledcomposite-not-visible-until-its-parent-is-satisfied/
- Source: REST API (`/wp-json/wp/v2/posts/14`), fetched 2026-10-13 · raw: pipeline/migration/swt-scrolledcomposite-not-visible-until-its-parent-is-satisfied.html
- Original title as WordPress gives it: `SWT ScrolledComposite not visible (until it&#8217;s parent is satisfied)`
- Dates: published 2011-03-22T07:23:31, modified 2015-01-22T16:49:42. The publication date is used.

### Corrections (2)
- Title: `until it’s parent` → `until its parent` — possessive, not a contraction.
- Paragraph 2: `The ScrollComposite absolutely refuses` → `The ScrolledComposite absolutely refuses` — misspelt class name; the first paragraph names the class correctly, and SWT has no `ScrollComposite`.

### Left as is
- `Hopefully it took you not the two hours I have spent until finding this undocumented fact.` — German word order, not a typo (ADR-0004; the skill's own example).
- `special requirements to its parent` — choice of preposition, a construction.
- `parent agnostic` — no hyphen; style, not spelling.

### Not carried over
- Comments: 0.
- Featured image: none (`featured_media` 0). The theme's site-wide header image is not post content.
- Category `Uncategorized` (id 1): replaced by the tags `swt`, `java`.
- WordPress's auto-generated excerpt with its "Continue reading" link: the new excerpt is the post's own first sentence.
- The `modified` timestamp (2015-01-22): the new schema has no field for it.

### For Michael to confirm
- **voice.md Sample 1 is not verbatim in its paragraphing.** It splits the post into four paragraphs; the original has three, with "The content should be parent agnostic." closing the first. The wording matches. The post follows the original; voice.md is unchanged and says "Complete post, verbatim" about this sample.
- Tags `swt`, `java`: both already in `TAGS`, no new tag.
- The REST API lists **six** posts, as CONTEXT.md says. The one voice.md does not quote is "Copys from old blog" (2013-03-27, `/2013/03/copys-from-old-blog/`).

## Site-wide (collected while migrating, completed after the last post)

- `/` redirects to `/en/` on the old site. Only the post permalinks get redirect pages; `/en/` does not.
- `/feed/`, date and category archives, `/?p=ID`: no redirect pages (ADR-0014).
