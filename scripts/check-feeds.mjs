// Checks the two job feeds (Indeed jobs.xml and LinkedIn linkedin.xml) from sample postings, with no network.
// Run: node scripts/check-feeds.mjs
// It asserts that each feed is well-formed XML, never carries a client field, has pay only when payRange is set,
// and maps the fields the way the Indeed and LinkedIn specs ask.
import assert from 'node:assert/strict';
import { jobsXml, linkedinXml, linkedinEligible, feedHtml, linkedinHtml, workplaceType } from '../src/lib/careers.js';

// ---- A small strict XML well-formedness checker (tags balanced, names valid, CDATA closed, entities known). ----
function checkWellFormed(xml, label) {
  let i = 0;
  const stack = [];
  const name = /^[A-Za-z_][\w.\-]*/;
  if (!xml.startsWith('<?xml ')) throw new Error(`${label}: missing XML declaration`);
  i = xml.indexOf('?>') + 2;
  let roots = 0;
  while (i < xml.length) {
    const lt = xml.indexOf('<', i);
    const text = xml.slice(i, lt === -1 ? xml.length : lt);
    if (/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/i.test(text)) throw new Error(`${label}: bare & in text near ${JSON.stringify(text.slice(0, 40))}`);
    if (!stack.length && text.trim()) throw new Error(`${label}: text outside the root element`);
    if (lt === -1) break;
    if (xml.startsWith('<![CDATA[', lt)) {
      if (!stack.length) throw new Error(`${label}: CDATA outside the root`);
      const end = xml.indexOf(']]>', lt + 9);
      if (end === -1) throw new Error(`${label}: unclosed CDATA`);
      i = end + 3;
      continue;
    }
    if (xml.startsWith('<!--', lt)) { i = xml.indexOf('-->', lt) + 3; continue; }
    const gt = xml.indexOf('>', lt);
    if (gt === -1) throw new Error(`${label}: unclosed tag`);
    const raw = xml.slice(lt + 1, gt);
    if (raw.startsWith('/')) {
      const n = raw.slice(1).trim();
      const open = stack.pop();
      if (open !== n) throw new Error(`${label}: </${n}> closes <${open}>`);
    } else {
      const selfClosing = raw.endsWith('/');
      const m = name.exec(raw);
      if (!m) throw new Error(`${label}: bad tag name in <${raw}>`);
      if (!stack.length) roots += 1;
      if (!selfClosing) stack.push(m[0]);
    }
    i = gt + 1;
  }
  if (stack.length) throw new Error(`${label}: unclosed <${stack.join('>, <')}>`);
  if (roots !== 1) throw new Error(`${label}: expected one root element, found ${roots}`);
}

/** Text of every <tag> in a feed, CDATA unwrapped. */
function values(xml, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g');
  return [...xml.matchAll(re)].map((m) => m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1'));
}

const LONG = '<p>Lead method development for small-molecule assays in a growing analytical team. You will plan studies, train two associates and report results to the site director.</p><h2>Qualifications</h2><ol><li>BS in chemistry</li><li>HPLC &amp; LC-MS experience</li></ol>';

// Rows in Command's public shape. Two extra fields a buggy feed might leak are added to prove they never appear.
const samples = [
  {
    id: 'KX-1001', title: 'Senior Analytical Chemist', department: 'Quality', jobType: 'FT', industry: 'Pharmaceuticals',
    experienceLevel: 'Senior', location: { city: 'Huntsville', state: 'AL', postalCode: '35801', remoteType: 'On-site' },
    payRange: '$95,000 - $115,000 per year', description: LONG, closeDate: '2026-12-31',
    postedAt: '2026-11-01T14:00:00.000Z', updatedAt: '2026-11-10T09:30:00.000Z', applyUrl: 'https://app.kixlogic.com/command/apply/KX-1001',
    client: 'Acme Pharma Secret', clientName: 'Acme Pharma Secret',
  },
  {
    id: 'KX-1002', title: 'Clinical Data Manager', jobType: 'Contract', industry: 'Clinical research', experienceLevel: 'Manager',
    location: { city: 'Birmingham', state: 'AL', postalCode: '35203', remoteType: 'Remote' },
    payRange: null, description: LONG + '<p>Fully remote within Alabama. Weird ]]> text & "quotes".</p>', closeDate: null,
    postedAt: '2026-11-05T10:00:00.000Z', updatedAt: null, applyUrl: 'https://app.kixlogic.com/command/apply/KX-1002',
  },
  {
    id: 'KX-1003', title: 'Process Engineer', jobType: 'Temporary', industry: null, experienceLevel: 'Entry level',
    location: { city: 'Decatur', state: 'AL', postalCode: null, remoteType: 'Hybrid' },
    payRange: null, description: null,
    positionSummary: 'Support scale-up of a new filling line, write batch records, and run equipment trials with the production team on day shift.',
    keyResponsibilities: 'Trials\nBatch records', closeDate: '2027-01-15',
    postedAt: '2026-11-07T10:00:00.000Z', updatedAt: null, applyUrl: 'https://app.kixlogic.com/command/apply/KX-1003',
  },
  {
    // Too short for LinkedIn (under 100 characters): kept in the Indeed feed, left out of LinkedIn's.
    id: 'KX-1004', title: 'Lab Technician', jobType: 'PT', location: { city: 'Mobile', state: 'AL' },
    payRange: '$22 - $26 per hour', description: '<p>Short posting.</p>', postedAt: '2026-11-08T10:00:00.000Z',
    applyUrl: 'https://app.kixlogic.com/command/apply/KX-1004',
  },
];

const settings = { linkedinCompanyId: '12345678', email: 'jobs@kixlogic.com' };
const indeed = jobsXml(samples, settings);
const linkedin = linkedinXml(samples, settings);
const indeedBare = jobsXml(samples);
const linkedinBare = linkedinXml(samples);
const empty = [jobsXml([]), linkedinXml([])];

let passed = 0;
const check = (label, fn) => { fn(); passed += 1; console.log(`ok  ${label}`); };

// A second opinion from fast-xml-parser's validator when it is installed (it comes with @astrojs/rss).
let XMLValidator = null;
try { ({ XMLValidator } = await import('fast-xml-parser')); } catch { /* the built-in checker still runs */ }

check('both feeds are well-formed XML', () => {
  const all = { 'jobs.xml': indeed, 'linkedin.xml': linkedin, 'jobs.xml (no settings)': indeedBare, 'linkedin.xml (no settings)': linkedinBare, 'empty jobs.xml': empty[0], 'empty linkedin.xml': empty[1] };
  for (const [label, xml] of Object.entries(all)) {
    checkWellFormed(xml, label);
    if (XMLValidator) {
      const r = XMLValidator.validate(xml);
      assert.equal(r, true, `${label}: ${JSON.stringify(r && r.err)}`);
    }
  }
  if (!XMLValidator) console.log('    (fast-xml-parser not found: built-in checker only)');
});

check('no client field or client name anywhere', () => {
  for (const xml of [indeed, linkedin]) {
    assert.ok(!/Acme Pharma Secret/.test(xml), 'client name leaked');
    assert.ok(!/<client/i.test(xml), 'client element present');
    assert.ok(!/hiringManager/i.test(xml), 'hiring manager present');
  }
});

check('department is not sent (it can hold a client label)', () => {
  assert.ok(!/<category>[^<]*Quality/.test(indeed));
  assert.ok(!/Quality/.test(linkedin.replace(/<description>[\s\S]*?<\/description>/g, '')));
});

check('Indeed: salary only when payRange is set', () => {
  const sal = values(indeed, 'salary');
  assert.deepEqual(sal, ['$95,000 - $115,000 per year', '$22 - $26 per hour']);
  assert.equal(values(indeed, 'job').length, 4);
  const jobs = indeed.split('<job>').slice(1);
  assert.ok(!/<salary>/.test(jobs[1]) && !/<salary>/.test(jobs[2]));
});

check('LinkedIn: no structured salary, pay only in the description when payRange is set', () => {
  assert.ok(!/<salar/.test(linkedin));
  const desc = values(linkedin, 'description');
  assert.ok(desc[0].includes('$95,000 - $115,000 per year'));
  assert.ok(!desc[1].includes('Pay:') && !desc[2].includes('Pay:'));
});

check('Indeed: required and optional elements', () => {
  assert.deepEqual(values(indeed, 'referencenumber'), ['KX-1001', 'KX-1002', 'KX-1003', 'KX-1004']);
  assert.equal(values(indeed, 'date')[0], '2026-11-01T14:00:00.000Z');
  assert.equal(values(indeed, 'url')[0], 'https://kixlogic.com/careers/kx-1001/?source=Indeed');
  assert.deepEqual(values(indeed, 'company'), Array(4).fill('Kixlogic, LLC'));
  assert.deepEqual(values(indeed, 'jobtype'), ['fulltime', 'contract', 'temporary', 'parttime']);
  assert.deepEqual(values(indeed, 'remotetype'), ['', 'Fully remote', 'Hybrid remote', '']);
  assert.deepEqual(values(indeed, 'expirationdate'), ['2026-12-31', '', '2027-01-15', '']);
  assert.deepEqual(values(indeed, 'category'), ['Pharmaceuticals', 'Clinical research', '', '']);
  assert.deepEqual(values(indeed, 'experience'), ['Senior', 'Manager', 'Entry level', '']);
  assert.deepEqual(values(indeed, 'email'), Array(4).fill('jobs@kixlogic.com'));
  assert.ok(!/<email>/.test(indeedBare), 'email left out when not set');
});

check('Indeed: remote job does not combine "Remote" with a real city', () => {
  const remote = indeed.split('<job>')[2];
  assert.equal(values(remote, 'city')[0], '');
  assert.equal(values(remote, 'state')[0], 'AL');
  assert.equal(values(remote, 'postalcode')[0], '');
  const onlyRemote = jobsXml([{ ...samples[1], location: { remoteType: 'Remote' } }]);
  assert.equal(values(onlyRemote, 'city')[0], 'Remote');
});

check('descriptions use literal characters inside CDATA, and "]]>" cannot break out', () => {
  const d = values(indeed, 'description')[0];
  assert.ok(d.includes('HPLC & LC-MS') && !d.includes('&amp;'));
  assert.ok(indeed.includes(']]]]><![CDATA[>'));
  assert.equal(feedHtml('a &lt;5 years&gt; &amp; b&nbsp;c &#39;d&#39;'), "a &lt;5 years&gt; & b c 'd'");
});

check('LinkedIn: field mapping', () => {
  assert.deepEqual(values(linkedin, 'partnerJobId'), ['KX-1001', 'KX-1002', 'KX-1003']);
  assert.deepEqual(values(linkedin, 'workplaceTypes'), ['On-site', 'Remote', 'Hybrid']);
  assert.deepEqual(values(linkedin, 'jobtype'), ['FULL_TIME', 'CONTRACT']); // Temporary has no LinkedIn code
  assert.deepEqual(values(linkedin, 'experienceLevel'), ['MID_SENIOR_LEVEL', 'ENTRY_LEVEL']); // Manager left out
  assert.deepEqual(values(linkedin, 'expirationDate'), ['12/31/2026', '01/15/2027']);
  assert.deepEqual(values(linkedin, 'location'), ['Huntsville, AL', 'Birmingham, AL', 'Decatur, AL']);
  assert.deepEqual(values(linkedin, 'country'), ['US', 'US', 'US']);
  assert.deepEqual(values(linkedin, 'companyId'), ['12345678', '12345678', '12345678']);
  assert.deepEqual(values(linkedin, 'posterEmail'), Array(3).fill('jobs@kixlogic.com'));
  assert.equal(values(linkedin, 'expectedJobCount')[0], '3');
  assert.equal(values(linkedin, 'applyUrl')[0], 'https://app.kixlogic.com/command/apply/KX-1001');
});

check('LinkedIn: companyId and posterEmail left out when not set', () => {
  assert.ok(!/<companyId>/.test(linkedinBare));
  assert.ok(!/<posterEmail>/.test(linkedinBare));
});

check('LinkedIn: short descriptions and long IDs are left out', () => {
  assert.equal(linkedinEligible(samples[3]), false);
  assert.equal(linkedinEligible({ ...samples[0], id: 'X'.repeat(41) }), false);
  assert.equal(linkedinEligible(samples[0]), true);
});

check('LinkedIn: description uses only the tags LinkedIn keeps', () => {
  for (const d of values(linkedin, 'description')) {
    const tags = [...d.matchAll(/<\/?([a-z0-9]+)/gi)].map((m) => m[1].toLowerCase());
    for (const t of tags) assert.ok(['b', 'strong', 'u', 'i', 'em', 'br', 'p', 'ul', 'li'].includes(t), `tag <${t}> in LinkedIn description`);
  }
  assert.equal(linkedinHtml('<h2 class="x">Hi</h2><ol><li><a href="https://x">go</a></li></ol><hr>'), '<p><strong>Hi</strong></p><ul><li>go</li></ul>');
});

check('workplace type mapping', () => {
  assert.equal(workplaceType('On-site'), 'On-site');
  assert.equal(workplaceType('onsite'), 'On-site');
  assert.equal(workplaceType('Hybrid'), 'Hybrid');
  assert.equal(workplaceType('Remote'), 'Remote');
  assert.equal(workplaceType(''), null);
  assert.equal(workplaceType('Flexible'), null);
});

console.log(`\n${passed} feed checks passed.`);
