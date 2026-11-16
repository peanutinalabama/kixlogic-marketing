// Job feed in LinkedIn's Basic Jobs XML format: the same published roles as the careers pages.
// See JOB-FEEDS.md for how it is registered and why LINKEDIN_COMPANY_ID and JOB_FEED_EMAIL matter.
import { fetchPostings, linkedinXml, feedSettings } from '../../lib/careers.js';

export const prerender = false;

export async function GET({ locals }) {
  let postings;
  try {
    postings = await fetchPostings();
  } catch {
    return new Response('Job feed unavailable', { status: 503, headers: { 'Retry-After': '600' } });
  }
  return new Response(linkedinXml(postings, feedSettings(locals?.runtime?.env)), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=900' },
  });
}
