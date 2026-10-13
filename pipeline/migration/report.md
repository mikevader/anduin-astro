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

## SWT Sashes with minimal size (2011-03-30)

- Old: https://www.anduin.ch/2011/03/swt-sashes-with-minimal-size/ → new: /posts/swt-sashes-with-minimal-size/
- Source: REST API (`/wp-json/wp/v2/posts/11`), fetched 2026-10-13 · raw: pipeline/migration/swt-sashes-with-minimal-size.html
- Dates: published 2011-03-30T07:22:43, modified 2019-10-20T23:32:45. The publication date is used.
- Markup: seven paragraphs and two code blocks, in the original order. The two `<br />` inside paragraphs 3 and 5 are Markdown hard breaks (`\`), not new paragraphs. `<em>calculateMinimalHeight </em>and` became `*calculateMinimalHeight* and`: the space moved outside the emphasis, because Markdown does not close an emphasis on a space; the rendered text is the same.

### Corrections (1)
- Paragraph 3: `thats what I show` → `that’s what I show`.

### Left as is
- `set the composites layout` — a possessive apostrophe is missing, but the text does not say whether it is `composite's` or `composites'`. Picking one is a reading, not a spelling fix.
- `A cool feature of SWT are sashes.` — agreement; grammar, not spelling.
- `Neither the sash or any other control.` — neither/or; grammar.
- `Preferably a grid layout with grabs space.` — a sentence fragment; construction.
- `self made way` — no hyphen; style.
- **Code, byte for byte, including what looks wrong in it:**
  - in the second block, `calculateMinimalHeiht(firstPart)` and `calculateMinimalHeight(secondPart).;`;
  - both listener registrations close with `}` and no `);`;
  - `this.entriesWidget` where the rest of the post says `secondPart`;
  - the second block has no indentation in the source and keeps none.

### Not carried over
- Comments: 0.
- Featured image: none (`featured_media` 0).
- Category `Uncategorized` (id 1): replaced by the tags `swt`, `java`.
- The Enlighter plugin markup (`class="EnlighterJSRAW"`). Its language, `java`, is kept as the fence language of the first block. The second block is a bare `<pre>` with no language, so its fence has none.
- The `modified` timestamp (2019-10-20): the new schema has no field for it. What changed on that date is not recorded in the REST API.

### For Michael to confirm
- **voice.md Sample 2 leaves out a whole paragraph** although it calls its prose verbatim: "So we have to adapt to changes of the sash position as well as changes to the size of the surrounding composite. Therefore we have to listen to either changes of the sash position or changes to the control and do something to the layout:" — the sentence that introduces the second code block. The rest matches word for word. The sample also treats the two `<br />` differently: it joins paragraph 3 into one, and splits paragraph 5 into two. voice.md is unchanged.
- Tags `swt`, `java`: both already in `TAGS`.
- The errors in the second code block stay as published (see "Left as is"). A note on them would be new text, which this migration does not write.

## Site-wide (collected while migrating, completed after the last post)

- `/` redirects to `/en/` on the old site. Only the post permalinks get redirect pages; `/en/` does not.
- `/feed/`, date and category archives, `/?p=ID`: no redirect pages (ADR-0014).
