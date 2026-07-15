import rss from '@astrojs/rss';

// SSR (not prerendered) so the feed reflects live posts from the blog API — the same
// source the /blog page and the publish→social webhook use. A new published post shows
// up here without a site rebuild, which is what feed pollers (Make/Zapier/dlvr.it) watch.
export const prerender = false;

export async function GET(context) {
  let posts = [];
  try {
    const res = await fetch('https://api.kixlogic.com/api/blog/posts-public');
    if (res.ok) {
      const data = await res.json();
      posts = Array.isArray(data.posts) ? data.posts : [];
    }
  } catch {
    // fall through with empty list — always return a valid (possibly empty) feed
  }

  const items = posts
    .filter((p) => p.published_at)
    .map((p) => ({
      title: p.title,
      description: p.meta_description || p.excerpt || '',
      pubDate: new Date(p.published_at),
      author: p.author || 'Kixlogic Team',
      categories: p.tags || [],
      link: `/blog/${p.slug}/`,
    }));

  return rss({
    title: 'Kixlogic Blog',
    description: 'Hiring, compensation, and workforce intelligence insights from Kixlogic.',
    site: context.site,
    items,
    customData: `<language>en-us</language>`,
  });
}
