---
title: "SWT ScrolledComposite not visible (until its parent is satisfied)"
date: 2011-03-22
excerpt: "A ScrolledComposite has some special requirements to its parent, which is quite unusual in OOP with composite patterns."
tags: [swt, java]
migrated:
  from: "https://www.anduin.ch/2011/03/swt-scrolledcomposite-not-visible-until-its-parent-is-satisfied/"
  corrections: 2
---

A ScrolledComposite has some special requirements to its parent, which is quite unusual in OOP with composite patterns. The content should be parent agnostic.

The ScrolledComposite absolutely refuses to work properly if the parent composite does not have the FillLayout.

Hopefully it took you not the two hours I have spent until finding this undocumented fact.
