---
title: "SWT Sashes with minimal size"
date: 2011-03-30
excerpt: "A cool feature of SWT are sashes."
tags: [swt, java]
migrated:
  from: "https://www.anduin.ch/2011/03/swt-sashes-with-minimal-size/"
  corrections: 1
---

A cool feature of SWT are sashes. They are ideal for creating flexible editors and views. But they have one major drawback (as do all SWT components). There is no way to set a minimal size on controls which the sash would use to calculate its range to move around.

This is one of the features I miss most from Swing.

There is of course the self made way and that’s what I show in the following code examples.\
First we need to create the content with the layout:

```java
// Our member variables:
Composite firstPart;
Sash sash;
Composite secondPart;

private void createContent(Composite parent, FormToolkit toolkit) {
  parent.setLayout(new FormLayout());
  firstPart = toolkit.createComposite(parent);
  createFirstPart(firstPart); // This method creates buttons, labels what ever inside this composite

  sash = new Sash(parent, SWT.HORIZONTAL);
  secondPart = toolkit.createComposite(parent); createSecondPart(secondPart); // Same as above
  FormData firstFormData = new FormData();
  firstFormData.left = new FormAttachment(0, 0);
  firstFormData.right = new FormAttachment(100, 0);
  firstFormData.top = new FormAttachment(0, 0);
  firstFormData.bottom = new FormAttachment(sash, 0);
  firstPart.setLayoutData(firstFormData);

  FormData sashFormData = new FormData();
  sashFormData.left = new FormAttachment(0, 0);
  sashFormData.right = new FormAttachment(100, 0);
  sashFormData.top = new FormAttachment(50, 0); // This will place the sash in the middle
  sash.setLayoutData(sashFormData);

  FormData secondFormData = new FormData();
  secondFormData.left = new FormAttachment(0, 0);
  secondFormData.right = new FormAttachment(100, 0);
  secondFormData.top = new FormAttachment(sash, 0);
  secondFormData.bottom = new FormAttachment(100, 0);
  secondPart.setLayoutData(secondFormData);
}
```

With this we will get two parts separated by a horizontal sash. The two composite create methods just create their content and set the composites layout. Preferably a grid layout with grabs space.

But it’s still possible to drag the sash over the content of either part. Assume we have a table with some buttons beside it in the first part: this will be a serious problem. The table will adjust its size if we make the first part bigger, but if we make it smaller there is a point where the content will vanish under the sash (or more exactly under the second part) and the scrollbar of the table might not even appear because the composite and therefore the table does not get smaller.\
So we do actually have a minimal size of the composite but which no one respects. Neither the sash or any other control.

So we have to adapt to changes of the sash position as well as changes to the size of the surrounding composite. Therefore we have to listen to either changes of the sash position or changes to the control and do something to the layout:

```
sash.addListener(SWT.Selection, new Listener() {
public void handleEvent(Event e) {
layoutSash(e);
}
}
parent.addControlListener(new ControlAdapter() {
public void controlResized(ControlEvent e) {
layoutSash(null);
}
}

private void layoutSash(Event e) {
FormData sashFormData = (FormData) sash.getLayoutData();
Rectangle sashRect = sash.getBounds();
Rectangle workAreaRect = sash.getParent().getClientArea();

int totalHeight = workAreaRect.height;
int minimalSecondPartHeight = calculateMinimalHeight(secondPart).;
int absoluteSashMinY = calculateMinimalHeiht(firstPart) + 5;

sashFormData.top.numerator = 0; // As we use offsets from now on we must set the numerator back to zero

if (e != null) { // if we call this from a sash change:
int maxY = totalHeight - minimalSecondPartHeight;
if (e.y <= absoluteSashMinY) {
e.y = absoluteSashMinY;
sashFormData.top.offset = absoluteSashMinY;
} else if (e.y >= maxY) {
e.y = maxY;
sashFormData.top.offset = maxY;
} else {
sashFormData.top.offset = e.y;
}
} else {
if (firstPart.getBounds().height < absoluteSashMinY) {
sashFormData.top.offset = absoluteSashMinY;
}
if (this.entriesWidget.getBounds().height < minimalSecondPartHeight) {
sashFormData.top.offset = totalHeight - minimalSecondPartHeight;
}
}
this.parent.layout(true, true);
}
```

Now all we have to do is to create a sensible implementation of the *calculateMinimalHeight* and we have it.
