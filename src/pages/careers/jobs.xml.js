// Job feed in Indeed's XML format (also read by ZipRecruiter and similar boards): the same published roles as the
// careers pages. See JOB-FEEDS.md for how it is registered.
import { fetchPostings, jobsXml, feedSettings } from '../../lib/careers.js';

export const prerender = false;

export async function GET({ locals }) {
  let postings;
  try {
    postings = await fetchPostings();
  } catch {
    return new Response('Job feed unavailable', { status: 503, headers: { 'Retry-After': '600' } });
  }
  return new Response(jobsXml(postings, feedSettings(locals?.runtime?.env)), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=900' },
  });
}
