// Posts published before this moment were taken off kixlogic.com on 2026-11-12 (Charles). Only posts published
// from here on (from the Command Center, "Publish to Kixlogic.com") are listed and served. Nothing was deleted.
export const BLOG_SINCE = Date.parse('2026-11-12T00:00:00Z');
export const isCurrentPost = (p: { published_at?: string | null } | null | undefined) =>
  !!p && !!p.published_at && Date.parse(p.published_at) >= BLOG_SINCE;
// Articles written into the site's own source (src/data/insights-local.json, source "site") are always listed,
// whatever their posting date, so they can be dated across the year. The cutoff above still applies to Command posts.
export const isSitePost = (p: { source?: string } | null | undefined) => !!p && p.source === 'site';
