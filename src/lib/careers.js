// Published job postings for kixlogic.com/careers. The list comes from Kixlogic Command, which only returns
// requisitions Charles chose to publish. Client names are never in that list.
//
// If the feed cannot be read, the careers pages answer 503 (and the sitemap lists the index only), so nothing
// is removed from search by a bad fetch on a page that is already indexed.
// CAREERS_FEED_URL can point a local build at a test copy of the feed. It is unset in production.
// Build-time settings. Each is read by its full name (Astro only inlines import.meta.env.NAME written out), and the
// try lets plain Node (scripts/check-feeds.mjs) load this file, where import.meta.env does not exist.
const BUILD_ENV = (() => {
  try {
    return {
      CAREERS_FEED_URL: import.meta.env.CAREERS_FEED_URL,
      LINKEDIN_COMPANY_ID: import.meta.env.LINKEDIN_COMPANY_ID,
      JOB_FEED_EMAIL: import.meta.env.JOB_FEED_EMAIL,
    };
  } catch {
    return {};
  }
})();
export const FEED_URL = BUILD_ENV.CAREERS_FEED_URL || 'https://app.kixlogic.com/command/careers/postings.json';
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
    employmentType: p.jobType ? (JOB_TYPE[jobTypeKey(p.jobType)]?.schema || String(p.jobType).toUpperCase().replace(/[\s-]+/g, '_')) : undefined,
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

// ---------------------------------------------------------------------------------------------------------------
// XML job feeds. Both feeds read only the public posting fields above (never a client), and pay is only present
// when Command sent payRange, which it does only when the requisition's show_pay switch is on.
//
// Feed settings. Each can be set here or as an environment variable of the same name on the site's Cloudflare
// project (the environment variable wins). Left empty, the element is left out of the feed.
//   LINKEDIN_COMPANY_ID: the numeric ID of the Kixlogic LinkedIn Page (from the Page's admin address).
//   JOB_FEED_EMAIL:      a kixlogic.com address. Indeed's <email> and LinkedIn's <posterEmail> both ask for one.
export const LINKEDIN_COMPANY_ID = '';
export const JOB_FEED_EMAIL = '';

/** Reads the feed settings, preferring the Cloudflare runtime environment, then the build environment. */
export function feedSettings(runtimeEnv) {
  const pick = (name, fallback) => {
    const v = (runtimeEnv && runtimeEnv[name]) || BUILD_ENV[name] || fallback;
    return String(v || '').trim();
  };
  return { linkedinCompanyId: pick('LINKEDIN_COMPANY_ID', LINKEDIN_COMPANY_ID), email: pick('JOB_FEED_EMAIL', JOB_FEED_EMAIL) };
}

// Command's job type choices (FT, PT, Contract, Temporary, Internship) in each format. A value typed in with
// "Other" is passed through to Indeed as written and left out where a feed only takes fixed codes.
const JOB_TYPE = {
  ft: { indeed: 'fulltime', linkedin: 'FULL_TIME', schema: 'FULL_TIME' },
  pt: { indeed: 'parttime', linkedin: 'PART_TIME', schema: 'PART_TIME' },
  contract: { indeed: 'contract', linkedin: 'CONTRACT', schema: 'CONTRACTOR' },
  temporary: { indeed: 'temporary', linkedin: null, schema: 'TEMPORARY' },
  internship: { indeed: 'internship', linkedin: 'INTERNSHIP', schema: 'INTERN' },
};
function jobTypeKey(v) {
  const k = String(v || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
  if (k === 'ft' || k === 'fulltime') return 'ft';
  if (k === 'pt' || k === 'parttime') return 'pt';
  if (k === 'contract' || k === 'contractor') return 'contract';
  if (k === 'temporary' || k === 'temp') return 'temporary';
  if (k === 'internship' || k === 'intern') return 'internship';
  return null;
}

// Command's experience levels in LinkedIn's codes. "Lead / principal" and "Manager" have no clean LinkedIn
// match, so they are left out of that feed rather than guessed.
const LINKEDIN_EXPERIENCE = {
  'entry level': 'ENTRY_LEVEL',
  'mid level': 'MID_SENIOR_LEVEL',
  senior: 'MID_SENIOR_LEVEL',
  director: 'DIRECTOR',
  executive: 'EXECUTIVE',
};

/** "On-site", "Hybrid" or "Remote" from Command's remote type, or null. */
export function workplaceType(remoteType) {
  const v = String(remoteType || '').trim().toLowerCase();
  if (!v) return null;
  if (v.includes('hybrid')) return 'Hybrid';
  if (v.includes('remote')) return 'Remote';
  if (v.replace(/[\s-]+/g, '') === 'onsite' || v === 'in office' || v === 'in-office') return 'On-site';
  return null;
}

// Characters XML 1.0 does not allow, removed from every value.
const BAD_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;

/** A value inside CDATA, safe even if the text itself contains "]]>". */
function cdata(v) {
  const s = String(v ?? '').replace(BAD_XML_CHARS, '');
  return `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}
const el = (indent, tag, v) => `${indent}<${tag}>${cdata(v)}</${tag}>`;

/**
 * Indeed and LinkedIn both ask for HTML inside CDATA with literal characters rather than entities. Entities are
 * turned back into characters, except &lt; and &gt;, which stay so text such as "<5 years" is not read as a tag.
 */
export function feedHtml(html) {
  return String(html || '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, name) => {
    let code;
    if (name[0] === '#') code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    else code = { amp: 38, quot: 34, apos: 39, nbsp: 160, lt: 60, gt: 62 }[name.toLowerCase()];
    if (code === undefined || Number.isNaN(code) || code === 60 || code === 62) return m;
    if (code === 160) return ' ';
    try { return String.fromCodePoint(code); } catch { return m; }
  });
}

/**
 * LinkedIn keeps only b, strong, u, i, em, br, p, ul and li and shows other tags as plain text. Headings become
 * bold paragraphs, numbered lists become bulleted lists and links keep their words, so the posting reads the same.
 */
export function linkedinHtml(html) {
  return feedHtml(html)
    .replace(/<h[1-6]\b[^>]*>/gi, '<p><strong>').replace(/<\/h[1-6]\s*>/gi, '</strong></p>')
    .replace(/<ol\b[^>]*>/gi, '<ul>').replace(/<\/ol\s*>/gi, '</ul>')
    .replace(/<blockquote\b[^>]*>/gi, '<p>').replace(/<\/blockquote\s*>/gi, '</p>')
    .replace(/<hr\b[^>]*\/?>/gi, '')
    .replace(/<\/?a\b[^>]*>/gi, '')
    .replace(/<(\/?)(b|strong|u|i|em|br|p|ul|li)\b[^>]*?(\/?)>/gi, (m, close, tag, self) => `<${close}${tag.toLowerCase()}${self ? ' /' : ''}>`);
}

/** YYYY-MM-DD from Command, as MM/DD/YYYY for LinkedIn. */
function usDate(ymd) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ymd || ''));
  return m ? `${m[2]}/${m[3]}/${m[1]}` : '';
}

/**
 * Indeed XML feed (docs.indeed.com, "XML feed reference"): one <job> per published requisition, every value in
 * CDATA, the same elements in every job (blank when Command has nothing for them). Also read by ZipRecruiter and
 * other boards that take the Indeed format.
 */
export function jobsXml(postings, settings = {}) {
  const email = settings.email || '';
  const jobs = postings.map((p) => {
    const loc = p.location || {};
    const remote = workplaceType(loc.remoteType);
    // Indeed: a fully remote job says "Remote" in place of a real city (or keeps only its state when the role is
    // limited to one state). Remote is never combined with a real city.
    let city = loc.city || '';
    let postal = loc.postalCode || '';
    if (remote === 'Remote') {
      city = loc.state ? '' : 'Remote';
      postal = '';
    }
    const jt = JOB_TYPE[jobTypeKey(p.jobType)];
    const I = '    ';
    return [
      '  <job>',
      el(I, 'title', p.title),
      el(I, 'date', p.postedAt || ''),
      el(I, 'referencenumber', p.id),
      el(I, 'requisitionid', p.id),
      el(I, 'url', `${SITE}${postingPath(p)}?source=Indeed`),
      el(I, 'company', COMPANY),
      el(I, 'city', city),
      el(I, 'state', loc.state || ''),
      el(I, 'country', 'US'),
      el(I, 'postalcode', postal),
      email ? el(I, 'email', email) : null,
      el(I, 'description', feedHtml(jobDescriptionHtml(p))),
      p.payRange ? el(I, 'salary', p.payRange) : null,
      el(I, 'jobtype', jt ? jt.indeed : (p.jobType || '')),
      el(I, 'category', p.industry || ''),
      el(I, 'experience', p.experienceLevel || ''),
      el(I, 'expirationdate', p.closeDate || ''),
      el(I, 'remotetype', remote === 'Remote' ? 'Fully remote' : remote === 'Hybrid' ? 'Hybrid remote' : ''),
      el(I, 'lastactivitydate', p.updatedAt || p.postedAt || ''),
      el(I, 'apply_url', p.applyUrl),
      '  </job>',
    ].filter(Boolean).join('\n');
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<source>\n  <publisher>${cdata(COMPANY)}</publisher>\n  <publisherurl>${cdata(`${SITE}/careers/`)}</publisherurl>\n  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n${jobs.join('\n')}${jobs.length ? '\n' : ''}</source>\n`;
}

/**
 * The checks LinkedIn applies before it accepts a job: an ID of 40 characters or fewer, a description of at least
 * 100 characters and an apply address. A job that fails is left out of the LinkedIn feed (LinkedIn would reject it).
 */
export function linkedinEligible(p) {
  const id = String(p.id || '');
  if (!id || id.length > 40) return false;
  if (!p.applyUrl || !p.title) return false;
  return plainPosting({ description: jobDescriptionHtml(p) }).length >= 100;
}

/**
 * LinkedIn Basic Jobs XML feed (learn.microsoft.com, LinkedIn "XML Feeds Development Guide"): <source> with one
 * <job> per posting, values in CDATA as in LinkedIn's example. companyId and posterEmail come from feedSettings.
 */
export function linkedinXml(postings, settings = {}) {
  const companyId = settings.linkedinCompanyId || '';
  const email = settings.email || '';
  const eligible = postings.filter(linkedinEligible);
  const jobs = eligible.map((p) => {
    const loc = p.location || {};
    const workplace = workplaceType(loc.remoteType);
    const jt = JOB_TYPE[jobTypeKey(p.jobType)];
    const exp = LINKEDIN_EXPERIENCE[String(p.experienceLevel || '').trim().toLowerCase()] || null;
    const I = '    ';
    return [
      '  <job>',
      el(I, 'partnerJobId', p.id),
      el(I, 'company', COMPANY),
      el(I, 'title', p.title),
      el(I, 'description', linkedinHtml(jobDescriptionHtml(p))),
      el(I, 'applyUrl', p.applyUrl),
      companyId ? el(I, 'companyId', companyId) : null,
      el(I, 'location', [loc.city, loc.state].filter(Boolean).join(', ') || 'United States'),
      loc.city ? el(I, 'city', loc.city) : null,
      loc.state ? el(I, 'state', loc.state) : null,
      el(I, 'country', 'US'),
      loc.postalCode ? el(I, 'postalCode', loc.postalCode) : null,
      workplace ? el(I, 'workplaceTypes', workplace) : null,
      exp ? el(I, 'experienceLevel', exp) : null,
      jt && jt.linkedin ? el(I, 'jobtype', jt.linkedin) : null,
      p.closeDate ? el(I, 'expirationDate', usDate(p.closeDate)) : null,
      email ? el(I, 'posterEmail', email) : null,
      '  </job>',
    ].filter(Boolean).join('\n');
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<source>\n  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n  <publisherUrl>${cdata(`${SITE}/careers/`)}</publisherUrl>\n  <publisher>${cdata(COMPANY)}</publisher>\n  <expectedJobCount>${cdata(eligible.length)}</expectedJobCount>\n${jobs.join('\n')}${jobs.length ? '\n' : ''}</source>\n`;
}
