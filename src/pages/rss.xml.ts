import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const base = site ?? new URL('https://anduin.ch');
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${new URL(`/posts/${p.id}/`, base)}</link>
      <guid>${new URL(`/posts/${p.id}/`, base)}</guid>
      <pubDate>${p.data.date.toUTCString()}</pubDate>
      <description>${esc(p.data.excerpt)}</description>
    </item>`,
    )
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>anduin.ch</title>
    <link>${base}</link>
    <description>Michael Muehlebach</description>
${items}
  </channel>
</rss>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
