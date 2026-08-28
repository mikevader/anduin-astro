# voice.md

How I write. Generic style instructions ("be concise, be technical") do close to
nothing. Samples plus a list of banned constructions do a lot — so the samples are the
substance of this file, and the rules below them are only there to make the pattern
explicit. When the rules and the samples disagree, the samples win.

All samples are real posts from anduin.ch, 2011-2014. **Typos and grammar slips are
reproduced exactly** — see the open question at the bottom about how far to clean them
up. Nothing here was rewritten.

---

## Sample 1 - "SWT ScrolledComposite not visible (until it's parent is satisfied)" (2011-03-22)

*Complete post, verbatim. This is the entire thing.*

> A ScrolledComposite has some special requirements to its parent, which is quite
> unusual in OOP with composite patterns.
>
> The content should be parent agnostic.
>
> The ScrollComposite absolutely refuses to work properly if the parent composite does
> not have the FillLayout.
>
> Hopefully it took you not the two hours I have spent until finding this undocumented
> fact.

**Take from this:** four sentences is a complete, publishable post. It states the
surprise, the rule, and the cost, and then it stops. The last line does the emotional
work through understatement, not adjectives. No introduction, no conclusion.

---

## Sample 2 - "SWT Sashes with minimal size" (2011-03-30)

*Prose verbatim; two code blocks omitted and marked.*

> A cool feature of SWT are sashes. They are ideal for creating flexible editors and
> views. But they have one major drawback (as do all SWT components). There is no way
> to set a minimal size on controls which the sash would use to calculate its range to
> move around.
>
> This is one of the features I miss most from Swing.
>
> There is of course the self made way and thats what I show in the following code
> examples. First we need to create the content with the layout:
>
> `[code]`
>
> With this we will get two parts separated by a horizontal sash. The two composite
> create methods just create their content and set the composites layout. Preferably a
> grid layout with grabs space.
>
> But it's still possible to drag the sash over the content of either part. Assume we
> have a table with some buttons beside it in the first part: this will be a serious
> problem. The table will adjust its size if we make the first part bigger, but if we
> make it smaller there is a point where the content will vanish under the sash (or
> more exactly under the second part) and the scrollbar of the table might not even
> appear because the composite and therefore the table does not get smaller.
>
> So we do actually have a minimal size of the composite but which no one respects.
> Neither the sash or any other control.
>
> `[code]`
>
> Now all we have to do is to create a sensible implementation of the
> *calculateMinimalHeight* and we have it.

**Take from this:** the failure is walked through concretely ("assume we have a table
with some buttons beside it") rather than asserted. Self-correction happens in the open
— "or more exactly under the second part". Ends on the next step, not on a summary.

---

## Sample 3 - "iOS Logic Tests with CocoaPods and RestKit" (2013-04-10)

*Prose verbatim; one code block omitted and marked.*

> I wanted to create for my RestKit mappings simple tests to get all the complicated
> relation mappings correct. First I tried it with usual tests but soon gave up because
> they start the whole application which made the tests quite slow and network
> dependent.
>
> So I remembered the possibility of creating logic tests which require only a small
> testbed. After some time of unsuccessful attempts I remembered, that using CocoaPods
> might have an impact on the newly created Target for the logic tests. So I had to set
> the CocoaPods configuration for the new target in the project configuration.
>
> But still it was not working because the linker had problems in finding my own
> classes. I checked everything: Imports, target dependencies, associated targets of
> the class files, header search paths, etc. But nothing seemed to help.
>
> Until I found a little bit strange solution on the net which did the trick: Setting
> the "Bundle Loader" and "Test Host" fields in the build settings:
>
> `[code]`
>
> After this it worked fine. But as far as I understood it the idea of logic tests is
> not to start the full simulator and application. Maybe someday I will find out.

**Take from this — this is the most important sample in the file.** It is a debugging
story told strictly in the order it happened, and every dead end is named: what was
tried first, why it was abandoned, what was checked and did not help, what finally
worked and that it was "a little bit strange". It ends by admitting the solution is
not understood. This is exactly what C1 exists to extract, and it is proof that the
material is in my head — the interrogation only has to get it out.

---

## Sample 4 - "Parse JSON date from .net WebService in Objective-C" (2014-05-19)

*Prose verbatim; two code blocks omitted and marked.*

> In my iOS class @FHNW I set the students a task for creating a CRUD application. The
> backend is an existing .net REST WebService with JSON. Unfourtanatly Microsoft has
> decided to create their own date formate instead of using a standard like RFC1123.
> Therefore the solution to display the date correctly or parsing an NSDate is not
> strait forward.
>
> You can parse the date the the following snipped:
>
> `[code]`
>
> This solution is copied from stack overflow.
>
> To produce a .net WebService compatible date string again the solution is a little
> bit simpler. The important parts are caring about second/millisecond base and the
> time zones:
>
> `[code]`

**Take from this:** opens with the concrete situation that produced the problem, not
with the topic. Blame is stated flatly and once ("Microsoft has decided to create their
own date formate instead of using a standard"), then dropped. Attribution is one bare
sentence with no ceremony: "This solution is copied from stack overflow." The post ends
on a code block — no closing paragraph at all.

---

## Sample 5 - "Combining custom actions with segues in table cell selections" (2014-05-19)

*Complete post, verbatim.*

> Triggering custom actions like open an URL with segues in storyboards is not quite
> obvious in the first attempt.
>
> The trick is to drag a segue from the cell to the view controller icon on the bottom
> of the scene. This segue is pointing to the same scene as seen in the image below:
>
> `[screenshot]`
>
> Now just set an identifier for the segue and trigger the correct action according to
> the identifier in the method `-prepareForSegue`
>
> `[code]`

**Take from this:** "is not quite obvious in the first attempt" is the standard opening
move — name the thing that surprised you. "The trick is" is a recurring phrase and is
allowed. The image is load-bearing and is referenced in the sentence before it.

---

## Rules, derived from the samples

1. **Open with the situation or the surprise.** "In my iOS class @FHNW I set the
   students a task…", "A ScrolledComposite has some special requirements to its
   parent…". Never open by announcing what the post is about.
2. **Tell it in the order it happened.** Past tense for what I did, present tense for
   how the thing behaves. Dead ends stay in, named and dated in sequence: first I tried
   X, gave up because Y, then Z.
3. **Name the cost.** Two hours. "After some time of unsuccessful attempts." That
   number is the most useful thing in the post for future-me.
4. **"I" for history, "we" for walking through code**, "you" occasionally and dryly.
   The switch from "I tried" to "First we need to create the content" is real and
   consistent — keep it.
5. **Stop when the problem stops.** Every existing post ends on the fix, the next step,
   or a code block. Not one has a summary, a conclusion, or a takeaways section.
6. **Say what is still not understood.** "Maybe someday I will find out." "So we do
   actually have a minimal size of the composite but which no one respects." Residual
   ignorance is content, not a gap to paper over.
7. **Credit sources in one flat sentence.** "This solution is copied from stack
   overflow." No gratitude, no hedging about whether it is the best approach.
8. **Understatement carries the tone.** "absolutely refuses to work properly", "a
   little bit strange solution", "Hopefully it took you not the two hours I have
   spent". Dry, mildly annoyed, never enthusiastic and never performatively frustrated.
9. **Length is whatever the problem was.** Four sentences is a post. Padding to look
   substantial is a defect.
10. **Code blocks are the payload; prose is connective tissue.** Each block is
    introduced by the sentence directly before it, which says what the block does.

## Prohibitions

Never write these. This list is derived from the samples rather than dictated by me,
so treat it as a first draft that I have not yet confirmed.

- **Topic announcements.** "In this post we'll explore", "Let's dive in", "Today I want
  to talk about", "By the end of this article you will".
- **Summary, conclusion, TL;DR or "Key takeaways" sections.** No existing post has one.
- **Rhetorical questions as section openers.** "So what does this mean?"
- **Reassurance adverbs.** "simply", "just", "easily", "straightforward" used to tell
  the reader something is easy. (Note: *complaining* that something is "not strait
  forward" is fine and is in the corpus. The ban is on the reassuring direction.)
- **Vendor vocabulary.** "leverage", "seamless", "robust", "powerful", "game-changer",
  "under the hood", "best practice", "battle-tested".
- **Hedged throat-clearing.** "It's important to note that", "It's worth mentioning
  that", "As you might expect".
- **Manufactured enthusiasm.** "Awesome!", "Voilà!", "and that's it!", exclamation
  marks in general.
- **Emoji.** Anywhere. Headings included.
- **Invented shared feeling.** "As developers, we all know the pain of…". I do not
  speak for the reader.
- **Sustained tutorial second person.** "You'll want to…", "Go ahead and…". Occasional
  "you" is fine; a whole post addressed at the reader is not.
- **Padding sections** — "Prerequisites", "What you'll learn", "Further reading" — when
  there is nothing real to put in them.
- **Plausible filler.** Any version number, timing, error message or command not
  traceable to the dump, the interrogation, or a cited source. This is C3, and it is
  the whole reason the harness exists.

## Open - do not resolve alone

- **Two samples are still missing.** The Stack Overflow question
  (`stackoverflow.com/q/36556397`) blocks automated fetching, and the anti-sample
  (`post=115`) is an unpublished draft that returns 404 publicly. Both need pasting.
  The anti-sample matters more than any of the five above: knowing what "feels like
  rambling around" to me is the sharpest available signal.
- **How much do we clean up the English?** The corpus is non-native English —
  "Unfourtanatly", "the the following snipped", German word order in "Hopefully it took
  you not the two hours I have spent". My assumption, to be confirmed: fix outright
  typos, keep the sentence rhythm, the word order and the directness. Smoothing this
  into idiomatic native-speaker English is most of what would make a draft stop
  sounding like me — but publishing typos on purpose is a different decision, and it
  is yours.
- **The prohibition list is derived, not confirmed.** You had nothing to add when
  asked; it should get revisited the first time a draft feels wrong for a reason not
  covered here.
- **Only one post shape so far** (debugging story / here-is-the-trick note). If a
  build log, an opinion piece or a reference note appears later, this file needs
  sections rather than one set of rules.
