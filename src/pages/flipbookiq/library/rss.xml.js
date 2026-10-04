// An RSS feed of the FlipbookIQ Library, so readers and aggregators can follow new flipbooks.
export const prerender = false;

import { LIBRARY_PATH, ORG_NAME, SITE, entryPath, fetchLibrary } from '../../../lib/library';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const { items } = await fetchLibrary();
  const entries = items
    .map(
      (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${SITE}${entryPath(i.slug)}</link>
      <guid isPermaLink="true">${SITE}${entryPath(i.slug)}</guid>
      <pubDate>${new Date(i.addedAt * 1000).toUTCString()}</pubDate>
      <description>${esc(i.description)}</description>
${i.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`,
    )
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FlipbookIQ Library</title>
    <link>${SITE}${LIBRARY_PATH}</link>
    <atom:link href="${SITE}${LIBRARY_PATH}rss.xml" rel="self" type="application/rss+xml" />
    <description>Page-turning flipbooks made with FlipbookIQ by Kixlogic.</description>
    <language>en-us</language>
    <copyright>© ${new Date().getUTCFullYear()} ${esc(ORG_NAME)}. All rights reserved.</copyright>
${entries}
  </channel>
</rss>
`;
  return new Response(body, {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=300, s-maxage=900' },
  });
}
