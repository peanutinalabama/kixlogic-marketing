import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// Prerender to a static /rss.xml so feed pollers (Make/Zapier/dlvr.it) and readers
// get a cacheable feed. Rebuilt on every deploy — a new published post appears here.
export const prerender = true;

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: 'Kixlogic Blog',
    description: 'Hiring, compensation, and workforce intelligence insights from Kixlogic.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      author: post.data.author,
      categories: post.data.tags,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
