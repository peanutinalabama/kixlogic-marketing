// Dynamic sitemap: static marketing URLs + live CMS blog posts + the FlipbookIQ Library.
export const prerender = false;

import { fetchLibrary, entryPath, tagPath } from '../lib/library';

const STATIC_URLS = [
  { loc: 'https://kixlogic.com/', changefreq: 'weekly', priority: '1.0' },
  { loc: 'https://kixlogic.com/flipbookiq/', changefreq: 'monthly', priority: '0.9' },
  { loc: 'https://kixlogic.com/flipbookiq/library/', changefreq: 'daily', priority: '0.8' },
  { loc: 'https://kixlogic.com/flipbookiq/library/contact/', changefreq: 'yearly', priority: '0.4' },
  { loc: 'https://kixlogic.com/hired/', changefreq: 'monthly', priority: '0.9' },
  { loc: 'https://kixlogic.com/renumify/', changefreq: 'monthly', priority: '0.9' },
  { loc: 'https://kixlogic.com/pricing/', changefreq: 'monthly', priority: '0.9' },
  { loc: 'https://kixlogic.com/about/', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://kixlogic.com/contact/', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://kixlogic.com/blog/', changefreq: 'weekly', priority: '0.8' },
  { loc: 'https://kixlogic.com/privacy/', changefreq: 'yearly', priority: '0.4' },
  { loc: 'https://kixlogic.com/terms/', changefreq: 'yearly', priority: '0.4' },
  { loc: 'https://kixlogic.com/security/', changefreq: 'yearly', priority: '0.5' },
  { loc: 'https://kixlogic.com/support/', changefreq: 'monthly', priority: '0.5' },
  { loc: 'https://kixlogic.com/sales-partner/', changefreq: 'monthly', priority: '0.5' },
  { loc: 'https://kixlogic.com/lilyfi/', changefreq: 'monthly', priority: '0.9' },
  { loc: 'https://kixlogic.com/auravo/', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://kixlogic.com/pixalary/', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://kixlogic.com/bingopalooza/', changefreq: 'monthly', priority: '0.8' },
];

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET() {
  let posts = [];
  try {
    const res = await fetch('https://api.kixlogic.com/api/blog/posts-public', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      posts = Array.isArray(data.posts) ? data.posts : [];
    }
  } catch {
    // keep static URLs only
  }

  const blogUrls = posts
    .filter((p) => p.slug && p.published_at)
    .map((p) => ({
      loc: `https://kixlogic.com/blog/${p.slug}/`,
      lastmod: new Date(p.published_at).toISOString().slice(0, 10),
      changefreq: 'monthly',
      priority: '0.6',
    }));

  // The library: one URL per flipbook (with its cover as an image entry) and one per topic.
  const { items: library } = await fetchLibrary();
  const libraryUrls = library.map((i) => ({
    loc: `https://kixlogic.com${entryPath(i.slug)}`,
    lastmod: new Date(i.updatedAt * 1000).toISOString().slice(0, 10),
    changefreq: 'monthly',
    priority: '0.7',
    image: i.cover,
    imageTitle: i.title,
  }));
  const seen = new Set();
  const tagUrls = [];
  for (const i of library) {
    for (const t of i.tags) {
      const loc = `https://kixlogic.com${tagPath(t)}`;
      if (seen.has(loc)) continue;
      seen.add(loc);
      tagUrls.push({ loc, changefreq: 'weekly', priority: '0.5' });
    }
  }

  const urls = [...STATIC_URLS, ...blogUrls, ...libraryUrls, ...tagUrls];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => {
  let entry = `  <url><loc>${escapeXml(u.loc)}</loc>`;
  if (u.lastmod) entry += `<lastmod>${u.lastmod}</lastmod>`;
  entry += `<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority>`;
  if (u.image) entry += `<image:image><image:loc>${escapeXml(u.image)}</image:loc><image:title>${escapeXml(u.imageTitle)}</image:title></image:image>`;
  entry += '</url>';
  return entry;
}).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
