/**
 * FlipbookIQ's blog, shown on the Kixlogic blog too.
 *
 * Posts are read live from the FlipbookIQ site (its /blog/posts.json), so a post published there appears here with
 * nothing to copy and nothing to deploy. The original stays the canonical page: search engines are told so, and each
 * post here says where it was first published. If FlipbookIQ cannot be reached the Kixlogic blog still works, without them.
 */

export const FIQ_ORIGIN = 'https://www.flipbookiq.com';

export interface FiqPost {
  slug: string;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  tags: string[];
  url: string;
  minutes: number;
  html: string;
}

export async function fiqPosts(): Promise<FiqPost[]> {
  try {
    const res = await fetch(`${FIQ_ORIGIN}/blog/posts.json`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return [];
    const data = (await res.json()) as { posts?: FiqPost[] };
    return Array.isArray(data.posts) ? data.posts : [];
  } catch {
    return [];
  }
}

/** The shape the Kixlogic blog index already renders. */
export function asKixlogicCard(p: FiqPost) {
  return {
    slug: p.slug,
    href: `/blog/flipbookiq/${p.slug}/`,
    title: p.title,
    excerpt: p.description,
    author: 'FlipbookIQ',
    tags: ['FlipbookIQ', ...p.tags.filter((t) => t !== 'FlipbookIQ')],
    published_at: `${p.date}T12:00:00.000Z`,
  };
}
