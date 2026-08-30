# design.md

How anduin.ch looks, and why. The visual counterpart to
[voice.md](voice.md): that file is how I write, this one is how the site is
built. Read it before changing anything visual.

**The code is the source of truth**, not this file. Tokens live in
[`src/styles/tokens.css`](../src/styles/tokens.css), the class vocabulary in
[`layout.css`](../src/styles/layout.css), element defaults in
[`base.css`](../src/styles/base.css), components in
[`src/components/`](../src/components/). What this file adds is the part code
cannot hold: where the values came from, what was rejected, and which rules are
load-bearing rather than incidental.

**This file replaces the design canvas.** The design was drawn first as eight
artboards (`*.dc.html` + `canvas.json`) and published to a Claude Design canvas.
Everything in them that is not already in the code is written down here, so they
can be deleted. See [ADR-0008](adr/0008-astro-components-no-design-sync.md) for
why there is no synced design system.

**Keeping it true is part of changing a component.** A design document that has
drifted from the code is worse than none — it is a confident lie, which is the
exact failure mode this harness exists to prevent. Update it in the same commit,
not afterwards.

---

## 1. Provenance

Two earlier versions of anduin.ch exist, at `../anduin` (2004) and
`../anduin-revamp` (2005). They are the source of the whole visual identity and
should not be thrown away:

- **`../anduin` (2004).** A greyscale Middle-earth map as the page ground, with
  the river Anduin traced across it in coral. Accent `#af2` (chartreuse). White
  content panels with 1px accent borders over `#ececec`. Helvetica, 9pt. A
  compass rose in the map's top-right corner.
- **`../anduin-revamp` (2005).** A warm parchment map, the Anduin traced in
  blue, floating white panels with soft shadows, Verdana. A logo lockup of blue
  `anduin` + green `.ch`. The river carried its name in italic along its course.

**The through-line in both: the river Anduin drawn as a coloured line across a
map.** That is the identity. Everything below is that idea made to do work
rather than decorate.

---

## 2. The direction

**An engineering notebook with a cartographic nod.** Notebook structure —
dated entries, metadata visible, code first-class. Cartographic body — the map
supplies the ground, the spine and the labels.

Concretely, the mash-up is one split: **mono chrome, serif prose.** IBM Plex
Mono carries every piece of structure; Newsreader carries the writing.

### Two directions that were rejected

Recorded so they are not re-proposed. Both were built as full page drawings
before the choice was made.

- **Restrained.** The map as a hint only: a thin river in the gutter, contours
  behind the header alone, tags as plain legend squares. Rejected as *too*
  quiet — the identity barely registered. Its palette, layout and metadata rail
  survived into the final design.
- **Cartographic.** The map turned all the way up: the rail became a framed map
  strip with a neatline, compass rose and imprint line; tags became settlements
  sited on the river with dashed leader lines; contours ran the full page behind
  the body text; the ground went warmer toward parchment; code blocks were framed
  as map insets. Rejected for readability — settlements are a lovely idea and a
  poor way to read a tag list, and 6% contours behind body text is a tax on every
  paragraph. Its terrain, its named river and its drop cap survived.

The shipped design is Restrained's palette, layout and metadata rail plus
Cartographic's terrain, named river and drop cap.

### One thing that was tried and cut

A `STATUS` field in the post rail (`never rolled out`, traceable to the post's
own last line). Cut as data slop: it read as oversharing, and the notebook idea
does not need a metadata field for every fact that happens to be true.

---

## 3. Colour

Defined in oklch, shipped as hex. Both accents sit at the same lightness and
chroma (L .620 / C .150) and differ only in hue — coral is the 2004 river, moss
is that site's `#af2` and the green in the 2005 logo. Ground chroma stays at or
under .02, so the whites are toned rather than tinted.

Contrast is measured against `--paper`, not estimated.

| Token | oklch | hex | Contrast | Role |
|---|---|---|---|---|
| `--paper` | `.975 .008 85` | `#f9f6f1` | — | Page ground |
| `--panel` | `.995 .004 85` | `#fffdfa` | — | Raised surfaces. Only the search field so far |
| `--code` | `.951 .011 85` | `#f2eee7` | — | Code blocks and inline code |
| `--rule` | `.885 .013 75` | `#ded8d0` | — | Hairlines within a section |
| `--rule-strong` | `.800 .016 75` | `#c4bcb3` | — | Structural edges, legend squares, dashed slots |
| `--ink` | `.285 .013 60` | `#2f2924` | 13.31:1 | Body copy, titles, code |
| `--muted` | `.530 .016 60` | `#736a63` | 4.91:1 | All secondary text |
| `--link` | `.550 .150 32` | `#b94834` | 4.82:1 | Inline links, drop cap |
| `--link-hover` | `.450 .150 32` | `#972815` | 7.41:1 | Hover only |
| `--river` | `.620 .150 32` | `#d15e49` | 3.60:1 | River stroke, active tag square |
| `--bank` | `.930 .032 32` | `#fde1db` | — | River bank, search-match highlight |
| `--moss` | `.620 .150 145` | `#409d48` | 3.18:1 | The `.ch`, current-nav underline |

### Rules

1. **`--river` is never text.** 3.60:1. It is a stroke and a filled 8px square.
2. **`--moss` is large text or graphics only.** 3.18:1 clears AA at the logo's
   27px and as a 2px underline, nothing smaller.
3. **`--link` on the code ground is the floor.** 4.50:1. Do not darken the code
   ground or lighten the link without re-measuring.
4. **Two greys for text, never three.** A third, `#a89e95`, once carried the rail
   labels, code captions and YAML comments at **2.44:1** — well under AA, and
   worst exactly where it mattered most, inside code. It was retired on
   2026-08-29. Hierarchy comes from size, tracking and case, not from a third
   grey. Do not reintroduce one.

---

## 4. Type

Two families, both Google Fonts, loaded from `styles.css`.

- **Newsreader** — prose and display. An old-style serif with a real italic;
  map hydronyms are set in italic, which is where the nod pays off.
  Fallback: `'Iowan Old Style', Palatino, Georgia, serif`.
- **IBM Plex Mono** — all structure: dates, tags, captions, nav, code, footer.
  Drafting-table texture, and code is the payload (voice.md rule 10).
  Fallback: `ui-monospace, SFMono-Regular, Menlo, monospace`.

Both fallbacks are metric-close on purpose: any export or print pass shows the
fallback, not the webfont.

**Use no third family.**

### Ramp

Token names are as they appear in `tokens.css`. Mobile values are the
`max-width: 720px` overrides.

| Role | Size | Mobile | Leading | Tracking |
|---|---|---|---|---|
| Page title | 46 | 30 | 1.14 / 1.18 | −.018em / −.014em |
| Identity title (home) | 42 | — | 1.14 | −.018em |
| Section title | 30 | — | 1.2 | −.014em |
| List title | 27 | — | 1.24 | −.012em |
| Logo | 27 | 22 | — | −.01em |
| Body | 19 | 17 | 1.72 / 1.7 | — |
| Excerpt | 17 | — | 1.62 | — |
| Code | 14 | 12 | 1.62 / 1.6 | — |
| Rail item, tag | 13 | — | — | — |
| Meta, nav, footer | 12 | — | 1.7 | .1em nav / .11em meta |
| Rail label, caption | 11 | — | — | .13em, uppercase |
| Drop cap | 62 | 44 | 0.82 | — |

Inline `<code>` is `0.86em` of its parent, never a fixed size.

Uppercase is for labels only — never for a heading or a run of prose.

---

## 5. Space, grid, measure

**Scale:** 4 · 8 · 12 · 18 · 24 · 32 · 44 · 60 · 96 (`--s-1` … `--s-9`).

Honest note: the drawings and some components also use 9, 10, 14, 26, 28, 30, 34
and 36. That drift is known and deliberately not swept up, because normalising
spacing touches every layout and is a decision to make once, on purpose.

**Radius:** 2px, on code blocks and the search field. Nothing else is rounded.
There are no cards, no pills, no rounded containers.

**Grid** (`.grid`): `rail | river | body`.

| | Desktop | Mobile (≤720px) |
|---|---|---|
| Page padding | 96 left / 64 right | 18 / 18 |
| Rail | 168 | lifts out to a full-width strip |
| River column | 56 | 10 |
| Column gap | 32 | 14 |
| Prose measure | 660 | full column |
| Masthead | 108 nav + 168 terrain | 60 nav + 130 terrain |
| Hit targets | — | 44 minimum |

The left padding is deliberately wider than the right; the rail wants the
margin. This is not a centred layout and should not be made into one.

**Prose is held to a 660px measure inside an 832px body column. Code blocks
break out to the full column** — code is the payload, so it gets the widest
line on the page.

**Long lines in code wrap; they never scroll.** A horizontally scrolled block
hides content from a reader five years out, which defeats the point of the
whole site. It is the ugliest rule in the system and it stays.

---

## 6. The map assets

### The river

One continuous river runs the length of every page: out of the mountains in the
masthead, down the left gutter beside the article, and off the bottom of the
page below the footer. It is the reading spine, not decoration.

- Course is **generated, not drawn**: a smooth vertical meander about the
  column centre, so it fits any post length.
- Desktop: 2.2px `--river` over a 7px `--bank`, amplitude ±11, period 440.
- Mobile: 2px over 6px, amplitude ±3, period 380, **no label**.
- Label: `anduin`, Newsreader italic 15px, tracking 3.2, `--link` at 62%
  opacity, set along the course on a `textPath` — the way the 2005 site wrote
  the river's name along it. One per ~1100px of course.
- Narrow is **redrawn, not scaled**. Scaling thins the stroke and squashes the
  lettering.

**The anchoring rule, which is load-bearing.** The article river is pinned to
the **bottom** of its column and generated upward, so its final point always
lands dead centre; the footer river is pinned to the **top** and picks that
hand-off up on the same axis. Without this the article course is cropped at an
arbitrary point in its meander and the two segments meet at different x. Both
sit on one axis derived from `--river-left`, never from duplicated arithmetic.

**The river must be out of flow.** It is absolutely positioned inside a column
that clips it. A 6000px course in normal flow makes the river define the page
height instead of the content — a bug that shipped once and was not obvious.

### The terrain

Contour ground behind the masthead and the footer. 1px `--ink` stroke, no fill,
at 11.5% (masthead) and 9% (footer).

Composition, read west to east: a massif with a spur running off it, the plain,
the river crossing, rising ground, then a range running north–south off both
edges with a valley cutting west into it — contours pointing upstream, which is
how a map draws a valley. Same profile as the ground between Minas Tirith and
Minas Morgul.

**It is drawn, not traced.** Nothing is lifted from Tolkien's map artwork and no
place names appear on it. Keep it that way.

The narrow variant is redrawn, not cropped or scaled: the massif moves right so
the river still exits low and left, on the axis the article river runs down.

Only the masthead terrain carries a river. The footer's is drawn by the
continuous page river so the two join without a seam.

---

## 7. Components

Live in [`src/components/`](../src/components/).

| Component | Anatomy and rules |
|---|---|
| `Masthead` | Logo + nav over the masthead terrain. Current page carries a 2px `--moss` underline, 3px above it. |
| `Footer` | Rule, byline, links, then the footer terrain. Carries the continuous river segment. |
| `River` | See §6. Props: `height`, `anchor`. |
| `Terrain` | See §6. Props: `variant` (`masthead` \| `footer`). |
| `Tag` | A map legend key: an 8px square (7px inline) plus the name, 10px gap. Active = filled `--river` square, `--ink` label. Never a pill. |
| `PostCard` | Date, title, excerpt, tags. A trailing `(parenthetical)` in the title is split out and set muted italic. |
| `CodeBlock` | Caption naming the file, language upper-right, then the block. Breaks out of the measure. |
| `SearchField` | 58px, `--panel` ground, `--rule-strong` border, `--river` caret. |
| `PlaceholderSlot` | Dashed `--rule-strong`, mono, bracketed text. **Never ship one filled with a guess.** |
| `Icon` | Stroke icons on a 20px grid, 1.6 stroke. `search`, `menu`, `external`. |

**Icons are drawn SVG. No emoji anywhere, in any component or any content.**

**The drop cap** opens the post and only the post: `.prose > p:first-of-type`,
62px (44 mobile), `--link`.

---

## 8. Page compositions

Five page types, all built. Each uses the `rail | river | body` grid under a
title block and above the footer.

| Page | Rail | Body |
|---|---|---|
| Home (`index.astro`) | Tag index | Identity block, bracketed standfirst, post list |
| Post (`Post.astro`) | Filed under, written by | Title block, prose with drop cap, code blocks |
| Tag (`tags/[tag].astro`) | Tag index, current one active | Filtered post list |
| Search (`search.astro`) | Tag index | Search field, results |
| Projects (`projects.astro`) | Bracketed filter slots | Bracketed candidate slots only |

**The projects page is structure only, on purpose.** CONTEXT.md: *"No priority,
no structure, no copy yet. Do not invent one."* The three candidate names it
carries (word clock, 3D work, the cluster) are the ones CONTEXT.md already
lists. Every other slot is bracketed. Do not fill them in without Michael.

---

## 9. Prohibitions

Derived from what was actually rejected while building this, not imported from a
generic list.

- **No emoji.** Anywhere. Content, components, headings.
- **No rounded-corner container with a left accent border.** The single most
  recognisable AI-design tell.
- **No gradient backgrounds.** The ground is flat; depth comes from the contour
  texture.
- **No third text grey.** See §3 rule 4.
- **No pills.** Tags are legend keys.
- **No invented copy in a placeholder.** A bracketed slot ships bracketed.
- **No reading-time estimates, share buttons, or "related posts".** None of them
  serve future-me, who is the first audience.
- **No centred layout.** The asymmetric margin is the design.
- **No horizontally scrolling code.**

---

## 10. Still open

Recorded so they are not mistaken for finished decisions.

- **The collapsing masthead.** 276px is a lot of page before the title, and no
  scrolled state has been designed. Needs a height, what the terrain does, and
  whether the logo shrinks.
- **The tablet width.** Between 720 and 1280 the rail has nowhere good to go.
  Only two breakpoints are drawn.
- **Code fence chrome.** Markdown fences get the styling but not the
  caption/language header — wiring fence metadata through to `CodeBlock` is not
  done.
- **The terrain crop** is redrawn per breakpoint by hand rather than derived.
- **Spacing normalisation.** See §5.
- **The tag vocabulary** in `src/content.config.ts` is derived from the existing
  corpus, not confirmed. It is a closed enum, so a wrong entry blocks a build.

---

## 11. If this ever becomes a Claude Design system

It cannot today: the sync needs client-mountable framework components and
`.astro` files compile server-side only. See
[ADR-0008](adr/0008-astro-components-no-design-sync.md), which also records what
it would take — porting the ten components to React `.tsx` with `@astrojs/react`,
about an hour, with no client JavaScript cost to visitors.

If that day comes, this file is the input: §3 through §7 are the design system,
§9 is the prohibition list, and §2 is the reasoning that keeps a design agent
from re-proposing the two directions already rejected.
