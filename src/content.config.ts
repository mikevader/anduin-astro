import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * The tag vocabulary is a closed set on purpose.
 *
 * ADR-0001 chose Astro over Hugo on one axis above all others: a malformed tag
 * should fail the build rather than render an empty page. An open `z.string()`
 * array would not deliver that — `kubernets` would sail through and produce a
 * tag page with one post on it that nobody ever finds again.
 *
 * Adding a tag is a deliberate edit here. That is the feature.
 *
 * Seeded from the tags the existing corpus actually needs (the five posts
 * quoted in .agents/voice.md, plus the AirPrint post). NOT yet confirmed by
 * Michael — see NOTE in the commit / handover.
 */
export const TAGS = [
  'ansible',
  'cocoapods',
  'cups',
  'homelab',
  'ios',
  'java',
  'objective-c',
  'storyboard',
  'swt',
] as const;

export type Tag = (typeof TAGS)[number];

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    /** Rendered as the page title and the index entry. */
    title: z.string().min(1),

    /** Publication date. Drives ordering and the `2026 · 08 · 28` stamp. */
    date: z.coerce.date(),

    /**
     * Shown under the title on the index. Required, because every index entry
     * has one in the design — a missing excerpt is a hole in the page, and
     * this is exactly the class of silent gap ADR-0001 exists to catch.
     *
     * Convention (voice.md): the post's own first sentence, verbatim. Not a
     * summary written for the index.
     */
    excerpt: z.string().min(1),

    /** At least one. Closed vocabulary — see TAGS above. */
    tags: z.array(z.enum(TAGS)).min(1),

    /** Kept out of the production build while still rendering in dev. */
    draft: z.boolean().default(false),

    /**
     * Set on posts carried over from the WordPress site (ADR-0014), and only
     * there. `from` is the old permalink: a redirect page is built at its path,
     * so the list of redirects is this field and nothing else. `corrections` is
     * the number of typos fixed under ADR-0004 rule A; the list itself is in
     * pipeline/migration/report.md. Either way the post says it was migrated.
     */
    migrated: z
      .object({
        from: z.url({ protocol: /^https?$/, hostname: /^(www\.)?anduin\.ch$/ }),
        corrections: z.number().int().min(0),
      })
      .optional(),
  }),
});

export const collections = { posts };
