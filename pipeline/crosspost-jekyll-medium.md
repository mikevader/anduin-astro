---
status: dump
---

# Cross post jekyll to medium

## medium to jekyll

There are several ideas how to read medium posts over rss and post them to jekyll:

* https://medium.com/@jameshamann/displaying-medium-posts-on-your-jekyll-website-7eef230309e4
* https://github.com/jameshamann/jekyll-display-medium-posts
* https://github.com/Donohue/medium-to-jekyll

As this is not what I want to do I skip over it. (But maybe the links help somebody else)


## Use crosspost plugin

I found the follow plugin for jekyll which seems to help here (https://github.com/aarongustafson/jekyll-crosspost-to-medium)

The plugin is abandoned, but simple enough that I could take it over in case there is a serious issue.

Several thing to notice:

**Liquid** syntax is not resolved in provided text etc.

The text **{{ url }}** will be replaced with the generated url for the original blog post on jekyll.

All **Medium Blog posts URLs** are stored in the file `.jekyll-crosspost_to_medium/medium_crossposted.yml` and used to prevent double posts. This means, the changes in this post have to be preserved in github actions.


## Integration

By default disable crosspost but update in the workflow the plugin with:
https://github.com/fjogeleit/yaml-update-action

In the workflow commit the crosspost reference file with:
https://github.com/marketplace/actions/add-commit

