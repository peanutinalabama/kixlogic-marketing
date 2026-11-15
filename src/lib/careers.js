// Published job postings for kixlogic.com/careers. The list comes from Kixlogic Command, which only returns
// requisitions Charles chose to publish. Client names are never in that list.
//
// If the feed cannot be read, the careers pages answer 503 (and the sitemap lists the index only), so nothing
// is removed from search by a bad fetch on a page that is already indexed.
// CAREERS_FEED_URL can point a local build at a test copy of the feed. It is unset in production.
export const FEED_URL = import.meta.env.CAREERS_FEED_URL || 'https://app.kixlogic.com/command/careers/postings.json';
export const SITE = 'https://kixlogic.com';
export const COMPANY = 'Kixlogic, LLC';

export async function fetchPostings() {
  const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(15000), cf: { cacheTtl: 300, cacheEverything: true } });
  if (!res.ok) throw new Error(`Careers feed returned ${res.status}`);
  const data = await res.json();
  if (!data || !Array.isArray(data.postings)) throw new Error('Careers feed has no postings list');
  return data.postings;
}

export function postingPath(p) {
  return `/careers/${encodeURIComponent(String(p.id).toLowerCase())}/`;
}

export function placeLine(p) {
  const loc = p.location || {};
  const where = [loc.city, loc.state].filter(Boolean).join(', ');
  const remote = loc.remoteType ? String(loc.remoteType) : '';
  return [where, remote].filter(Boolean).join(' · ') || 'Location to be confirmed';
}

/** schema.org JobPosting. Pay is not sent as structured salary, because the pay text is free text. */
export function jobPostingJsonLd(p) {
  const loc = p.location || {};
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: p.title,
    identifier: { '@type': 'PropertyValue', name: COMPANY, value: p.id },
    description: jobDescriptionHtml(p),
    datePosted: p.postedAt ? p.postedAt.slice(0, 10) : undefined,
    hiringOrganization: { '@type': 'Organization', name: COMPANY, sameAs: SITE },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: loc.city || undefined,
        addressRegion: loc.state || undefined,
        postalCode: loc.postalCode || undefined,
        addressCountry: 'US',
      },
    },
    employmentType: p.jobType ? String(p.jobType).toUpperCase().replace(/[\s-]+/g, '_') : undefined,
    validThrough: p.closeDate || undefined,
    url: `${SITE}${postingPath(p)}`,
  };
  if (String(loc.remoteType || '').toLowerCase().includes('remote')) ld.jobLocationType = 'TELECOMMUTE';
  return stripUndefined(ld);
}

export function stripUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''));
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The posting as plain text, for summaries and meta descriptions. */
export function plainPosting(p) {
  return String(p.description || p.positionSummary || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * The posting body for the careers page and the job feeds. A posting written in the Command box is one HTML block,
 * already cleaned by Command, so it is shown as it is. Postings made before that box keep their separate sections.
 */
export function jobDescriptionHtml(p) {
  const pay = p.payRange ? `<p><strong>Pay:</strong> ${esc(p.payRange)}</p>` : '';
  if (p.description) return p.description + pay;
  const parts = [
    ['About the role', p.positionSummary],
    ['Key responsibilities', p.keyResponsibilities],
    ['Qualifications', p.qualifications],
    ['Knowledge and skills', p.knowledgeSkills],
    ['Physical requirements', p.physicalRequirements],
  ];
  return parts
    .filter(([, text]) => text)
    .map(([head, text]) => `<h2>${esc(head)}</h2><p>${esc(text).replace(/\n/g, '<br>')}</p>`)
    .join('') + pay;
}

/** Indeed / ZipRecruiter style XML feed: one <job> per published requisition. */
export function jobsXml(postings) {
  const jobs = postings.map((p) => {
    const loc = p.location || {};
    return [
      '  <job>',
      `    <title>${esc(p.title)}</title>`,
      `    <date>${esc(p.postedAt ? p.postedAt.slice(0, 10) : '')}</date>`,
      `    <referencenumber>${esc(p.id)}</referencenumber>`,
      `    <requisitionid>${esc(p.id)}</requisitionid>`,
      `    <url>${esc(`${SITE}${postingPath(p)}`)}</url>`,
      `    <company>${esc(COMPANY)}</company>`,
      `    <city>${esc(loc.city || '')}</city>`,
      `    <state>${esc(loc.state || '')}</state>`,
      `    <country>US</country>`,
      `    <postalcode>${esc(loc.postalCode || '')}</postalcode>`,
      `    <description><![CDATA[${jobDescriptionHtml(p)}]]></description>`,
      `    <jobtype>${esc(p.jobType || '')}</jobtype>`,
      p.payRange ? `    <salary>${esc(p.payRange)}</salary>` : null,
      `    <apply_url>${esc(p.applyUrl)}</apply_url>`,
      '  </job>',
    ].filter(Boolean).join('\n');
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<source>\n  <publisher>${esc(COMPANY)}</publisher>\n  <publisherurl>${SITE}/careers/</publisherurl>\n  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${jobs.join('\n')}\n</source>\n`;
}
