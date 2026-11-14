// Job feed for Google, Indeed and ZipRecruiter: the same published roles as the careers pages.
import { fetchPostings, jobsXml } from '../../lib/careers.js';

export const prerender = false;

export async function GET() {
  let postings;
  try {
    postings = await fetchPostings();
  } catch {
    return new Response('Job feed unavailable', { status: 503, headers: { 'Retry-After': '600' } });
  }
  return new Response(jobsXml(postings), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=900' },
  });
}
