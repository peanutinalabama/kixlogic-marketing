// Dynamic sitemap: static marketing URLs + live CMS blog posts.
export const prerender = false;

const STATIC_URLS = [
  { loc: 'https://kixlogic.com/', changefreq: 'weekly', priority: '1.0' },
  { loc: 'https://kixlogic.com/ats/', changefreq: 'monthly', priority: '0.9' },
  { loc: 'https://kixlogic.com/compensation/', changefreq: 'monthly', priority: '0.9' },
  { loc: 'https://kixlogic.com/pricing/', changefreq: 'monthly', priority: '0.9' },
  { loc: 'https://kixlogic.com/about/', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://kixlogic.com/contact/', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://kixlogic.com/blog/', changefreq: 'weekly', priority: '0.8' },
  { loc: 'https://kixlogic.com/privacy/', changefreq: 'yearly', priority: '0.4' },
  { loc: 'https://kixlogic.com/terms/', changefreq: 'yearly', priority: '0.4' },
  { loc: 'https://kixlogic.com/security/', changefreq: 'yearly', priority: '0.5' },
  { loc: 'https://kixlogic.com/support/', changefreq: 'monthly', priority: '0.5' },
  { loc: 'https://kixlogic.com/sales-partner/', changefreq: 'monthly', priority: '0.5' },
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
    const res = await fetch('https://api.kixlogic.com/api/blog/posts-public');
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

  const urls = [...STATIC_URLS, ...blogUrls];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => {
  let entry = `  <url><loc>${escapeXml(u.loc)}</loc>`;
  if (u.lastmod) entry += `<lastmod>${u.lastmod}</lastmod>`;
  entry += `<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`;
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
