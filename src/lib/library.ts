/**
 * The FlipbookIQ Library, as the website sees it.
 *
 * The data lives in the FlipbookIQ service (the Worker behind flipbook.kixlogic.com); the administrator adds
 * a flipbook from the Studio and it appears here within minutes, with no rebuild. These helpers fetch it for
 * the server-rendered pages under /flipbookiq/library/.
 */

export interface LibraryItem {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  pages: number;
  /** One page's width divided by its height. */
  ratio: number;
  /** Unix seconds. */
  addedAt: number;
  updatedAt: number;
  cover: string;
  embed: string;
  view: string;
  url: string;
  /** The words on each page, present on a single entry only. */
  text?: { n: number; text: string }[];
}

const API = 'https://flipbook.kixlogic.com/api/library';
export const SITE = 'https://kixlogic.com';
export const LIBRARY_PATH = '/flipbookiq/library/';
export const STUDIO = 'https://app.flipbookiq.com/studio';
export const ORG_NAME = 'Kixlogic, LLC';

export const entryPath = (slug: string) => `${LIBRARY_PATH}${slug}/`;
export const tagSlug = (tag: string) => tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
export const tagPath = (tag: string) => `${LIBRARY_PATH}tag/${tagSlug(tag)}/`;
export const iso = (sec: number) => new Date(sec * 1000).toISOString();

/** Every entry, newest first. `ok` is false when the service could not be reached, so a page can say so rather than claim the library is empty. */
export async function fetchLibrary(): Promise<{ items: LibraryItem[]; ok: boolean }> {
  try {
    const res = await fetch(API, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return { items: [], ok: false };
    const data = (await res.json()) as { items?: LibraryItem[] };
    return { items: Array.isArray(data.items) ? data.items : [], ok: true };
  } catch {
    return { items: [], ok: false };
  }
}

/** One entry with its page text, `null` when there is no such entry, `'error'` when the service could not be reached. */
export async function fetchEntry(slug: string): Promise<LibraryItem | null | 'error'> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const res = await fetch(`${API}/${slug}`, { signal: AbortSignal.timeout(4000) });
    if (res.status === 404) return null;
    if (!res.ok) return 'error';
    return (await res.json()) as LibraryItem;
  } catch {
    return 'error';
  }
}

/** Entries that share the most tags with `item`, then the newest; never the item itself. */
export function related(item: LibraryItem, all: LibraryItem[], limit = 3): LibraryItem[] {
  return all
    .filter((o) => o.slug !== item.slug)
    .map((o) => ({ o, score: o.tags.filter((t) => item.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score || b.o.addedAt - a.o.addedAt)
    .slice(0, limit)
    .map((x) => x.o);
}

/** JSON for a <script type="application/ld+json"> block: "<" is escaped so nothing in a title can close the tag. */
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

/** Cache headers for the server-rendered pages: fresh enough that a new entry shows within minutes. */
export const CACHE = 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600';
