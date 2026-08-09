/**
 * Render polished product UI mocks → public/images/screenshots/*.png
 * Requires: npx playwright (chromium)
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../../public/images/screenshots');

const FONT = `'Open Sans', 'Segoe UI', sans-serif`;
const FONT_LINK = `https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap`;

const logoSvg = `
<svg width="28" height="28" viewBox="0 0 72 72" fill="none">
  <g fill="#fff" stroke="#fff">
    <line x1="10" y1="36" x2="42" y2="12" stroke-width="5" stroke-linecap="round"/>
    <line x1="10" y1="36" x2="42" y2="60" stroke-width="5" stroke-linecap="round"/>
    <line x1="42" y1="12" x2="42" y2="60" stroke-width="5" stroke-linecap="round"/>
    <circle cx="10" cy="36" r="7"/><circle cx="42" cy="12" r="7"/><circle cx="42" cy="60" r="7"/>
  </g>
</svg>`;

function chrome(active, product = 'Hired') {
  const items = [
    ['Overview', 'overview'],
    ['Job Postings', 'jobs'],
    ['Applications', 'apps'],
    ['Pipeline', 'pipeline'],
    ['Sourcing', 'sourcing'],
    ['Comp', 'comp'],
    ['Reporting', 'reporting'],
    ['AI Assistant', 'ai'],
  ];
  return `
  <aside class="sidebar">
    <div class="brand">
      ${logoSvg}
      <div class="brand-text">
        <span class="brand-name">Kixlogic</span>
        <span class="brand-product">${product}</span>
      </div>
    </div>
    <nav class="nav">
      ${items.map(([label, key]) =>
        `<div class="nav-item${key === active ? ' active' : ''}"><span class="nav-dot"></span>${label}</div>`
      ).join('')}
    </nav>
    <div class="nav-foot">
      <div class="muted">Workspace</div>
      <div class="who">Northwind Labs</div>
    </div>
  </aside>`;
}

const baseCss = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 1440px; height: 900px; overflow: hidden;
  font-family: ${FONT}; background: #E8EFF1; color: #0C1B20;
  -webkit-font-smoothing: antialiased;
}
.shell { display: flex; height: 900px; }
.sidebar {
  width: 228px; flex-shrink: 0; color: #fff;
  background: linear-gradient(180deg, #042833 0%, #063D4C 55%, #0A5F75 100%);
  padding: 22px 16px 18px; display: flex; flex-direction: column;
}
.brand {
  display: flex; align-items: center; gap: 10px; padding: 4px 6px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.12); margin-bottom: 18px;
}
.brand-text { display: flex; flex-direction: column; gap: 1px; }
.brand-name { font-weight: 700; font-size: 18px; letter-spacing: -0.02em; line-height: 1; }
.brand-product {
  font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: rgba(255,255,255,0.62);
}
.nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.nav-item {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px;
  border-radius: 8px; font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,0.72);
}
.nav-item.active { background: rgba(255,255,255,0.14); color: #fff; font-weight: 600; }
.nav-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.55; }
.nav-item.active .nav-dot { background: #7ED4E8; opacity: 1; }
.nav-foot { border-top: 1px solid rgba(255,255,255,0.12); padding-top: 14px; margin-top: 12px; }
.nav-foot .muted { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 4px; }
.nav-foot .who { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.88); }
.main { flex: 1; padding: 28px 32px 32px; overflow: hidden; }
.top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.top h1 { font-weight: 700; font-size: 28px; letter-spacing: -0.02em; }
.search {
  width: 320px; height: 40px; border-radius: 10px; border: 1px solid #D0DEE3;
  background: #fff; padding: 0 14px; display: flex; align-items: center; gap: 8px;
  color: #6B8289; font-size: 13px;
}
.panel {
  background: #fff; border: 1px solid #D0DEE3; border-radius: 12px; padding: 18px 20px;
}
.panel h2 { font-size: 15px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 14px; }
.badge {
  display: inline-block; font-size: 11.5px; font-weight: 600;
  padding: 3px 9px; border-radius: 99px;
}
.b-offer { background: #E6F7ED; color: #1B6B3A; }
.b-interview { background: #FFF1E0; color: #9A5B12; }
.b-new { background: #E6F3F6; color: #0A5F75; }
.b-review { background: #EEE8F8; color: #5B3F8C; }
.b-hired { background: #063D4C; color: #fff; }
.muted { color: #6B8289; }
`;

function page(css, body) {
  return `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="${FONT_LINK}" rel="stylesheet"/>
<style>${baseCss}${css}</style>
</head><body>${body}</body></html>`;
}

const overview = page(`
.kpis { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 16px; }
.kpi { background:#fff; border:1px solid #D0DEE3; border-radius:12px; padding:18px; }
.kpi-label { font-size:12px; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; color:#6B8289; margin-bottom:10px; }
.kpi-val { font-size:32px; font-weight:700; letter-spacing:-0.02em; line-height:1; }
.kpi-sub { margin-top:8px; font-size:12.5px; color:#4A646C; }
.kpi-sub em { font-style:normal; color:#0A5F75; font-weight:600; }
.panels { display:grid; grid-template-columns:1.15fr 1fr; gap:14px; margin-bottom:14px; }
.stage { display:grid; grid-template-columns:88px 1fr 28px; align-items:center; gap:10px; margin-bottom:10px; font-size:12.5px; color:#4A646C; }
.bar { height:8px; border-radius:99px; background:#E8EFF1; overflow:hidden; }
.bar>i { display:block; height:100%; border-radius:99px; font-style:normal; }
.stage strong { text-align:right; color:#0C1B20; font-weight:700; }
.job-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #E8EFF1; font-size:13px; }
.job-row:last-child { border-bottom:0; }
.job-title { font-weight:600; }
.job-meta { color:#6B8289; font-size:12px; margin-top:2px; }
.job-count { font-weight:700; font-size:16px; color:#0A5F75; }
.table-panel { padding:0; overflow:hidden; }
.table-panel h2 { padding:16px 20px 0; margin-bottom:10px; }
table { width:100%; border-collapse:collapse; }
th { text-align:left; font-size:11px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; color:#6B8289; padding:8px 20px; border-bottom:1px solid #E8EFF1; }
td { padding:11px 20px; font-size:13px; border-bottom:1px solid #F3F7F8; vertical-align:middle; }
tr:last-child td { border-bottom:0; }
.who-cell { display:flex; align-items:center; gap:10px; }
.av { width:28px; height:28px; border-radius:50%; background:#E6F3F6; color:#0A5F75; display:grid; place-items:center; font-size:11px; font-weight:700; }
.name { font-weight:600; }
.email { font-size:11.5px; color:#6B8289; }
`, `
<div class="shell">
  ${chrome('overview')}
  <main class="main">
    <div class="top"><h1>Overview</h1>
      <div class="search">Search applicants…</div>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="kpi-label">Applications</div><div class="kpi-val">128</div><div class="kpi-sub"><em>+18%</em> vs last cycle</div></div>
      <div class="kpi"><div class="kpi-label">In review</div><div class="kpi-val">34</div><div class="kpi-sub">Awaiting decision</div></div>
      <div class="kpi"><div class="kpi-label">Open roles</div><div class="kpi-val">9</div><div class="kpi-sub">3 closing this week</div></div>
      <div class="kpi"><div class="kpi-label">Hired</div><div class="kpi-val">6</div><div class="kpi-sub">This quarter</div></div>
    </div>
    <div class="panels">
      <div class="panel"><h2>Pipeline</h2>
        <div class="stage"><span>New</span><div class="bar"><i style="width:78%;background:#0A5F75"></i></div><strong>22</strong></div>
        <div class="stage"><span>Screen</span><div class="bar"><i style="width:54%;background:#0C7A94"></i></div><strong>14</strong></div>
        <div class="stage"><span>Interview</span><div class="bar"><i style="width:42%;background:#3A9BB0"></i></div><strong>11</strong></div>
        <div class="stage"><span>Offer</span><div class="bar"><i style="width:22%;background:#2E8A5A"></i></div><strong>4</strong></div>
        <div class="stage"><span>Hired</span><div class="bar"><i style="width:18%;background:#063D4C"></i></div><strong>6</strong></div>
      </div>
      <div class="panel"><h2>Active postings</h2>
        <div class="job-row"><div><div class="job-title">Staff Software Engineer</div><div class="job-meta">Engineering · Remote</div></div><div class="job-count">28</div></div>
        <div class="job-row"><div><div class="job-title">Clinical Research Associate</div><div class="job-meta">Clinical · Hybrid</div></div><div class="job-count">19</div></div>
        <div class="job-row"><div><div class="job-title">Revenue Operations Lead</div><div class="job-meta">Go-to-market · SF</div></div><div class="job-count">12</div></div>
        <div class="job-row"><div><div class="job-title">Product Designer</div><div class="job-meta">Design · Remote</div></div><div class="job-count">9</div></div>
      </div>
    </div>
    <div class="panel table-panel"><h2>Recent applicants</h2>
      <table><thead><tr><th>Applicant</th><th>Role</th><th>Stage</th><th>AI match</th><th>Submitted</th></tr></thead>
      <tbody>
        <tr><td><div class="who-cell"><div class="av">AM</div><div><div class="name">Ava Morales</div><div class="email">ava@example.com</div></div></div></td><td>Staff Software Engineer</td><td><span class="badge b-interview">Interview</span></td><td><strong style="color:#0A5F75">94</strong></td><td class="muted">Aug 4</td></tr>
        <tr><td><div class="who-cell"><div class="av">JK</div><div><div class="name">Jonah Kim</div><div class="email">jonah@example.com</div></div></div></td><td>Product Designer</td><td><span class="badge b-offer">Offer</span></td><td><strong style="color:#0A5F75">91</strong></td><td class="muted">Aug 3</td></tr>
        <tr><td><div class="who-cell"><div class="av">SR</div><div><div class="name">Sofia Reyes</div><div class="email">sofia@example.com</div></div></div></td><td>Clinical Research Associate</td><td><span class="badge b-review">Reviewed</span></td><td><strong style="color:#0A5F75">87</strong></td><td class="muted">Aug 2</td></tr>
        <tr><td><div class="who-cell"><div class="av">DL</div><div><div class="name">Devon Lee</div><div class="email">devon@example.com</div></div></div></td><td>Revenue Operations Lead</td><td><span class="badge b-new">New</span></td><td><strong style="color:#0A5F75">82</strong></td><td class="muted">Aug 2</td></tr>
      </tbody></table>
    </div>
  </main>
</div>`);

const pipeline = page(`
.board { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; height:calc(900px - 100px); }
.col { background:#fff; border:1px solid #D0DEE3; border-radius:12px; padding:14px; display:flex; flex-direction:column; min-height:0; }
.col-h { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.col-h strong { font-size:13px; font-weight:700; }
.col-h span { font-size:11px; font-weight:600; color:#6B8289; background:#F3F7F8; padding:2px 8px; border-radius:99px; }
.card { background:#F3F7F8; border:1px solid #E8EFF1; border-radius:10px; padding:12px; margin-bottom:10px; }
.card .t { font-size:13px; font-weight:600; margin-bottom:4px; }
.card .s { font-size:11.5px; color:#6B8289; margin-bottom:8px; }
.card .meta { display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#4A646C; }
.match { color:#0A5F75; font-weight:700; }
`, `
<div class="shell">
  ${chrome('pipeline')}
  <main class="main">
    <div class="top"><h1>Pipeline</h1><div class="search">Filter by role or name…</div></div>
    <div class="board">
      ${[
        ['New', [['Ava Morales','Staff SWE','94'],['Devon Lee','RevOps Lead','82']]],
        ['Screen', [['Sofia Reyes','CRA','87'],['Marcus Chen','Staff SWE','85']]],
        ['Interview', [['Priya Nair','Product Designer','90'],['Eli Brooks','CRA','79']]],
        ['Offer', [['Jonah Kim','Product Designer','91']]],
        ['Hired', [['Nina Park','Staff SWE','96']]],
      ].map(([title, cards]) => `
        <div class="col">
          <div class="col-h"><strong>${title}</strong><span>${cards.length}</span></div>
          ${cards.map(([n,r,m]) => `<div class="card"><div class="t">${n}</div><div class="s">${r}</div><div class="meta"><span>AI match</span><span class="match">${m}</span></div></div>`).join('')}
        </div>`).join('')}
    </div>
  </main>
</div>`);

const sourcing = page(`
.hero-copy { margin-bottom: 22px; max-width: 720px; }
.hero-copy h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 8px; }
.hero-copy p { font-size: 14px; color: #4A646C; line-height: 1.55; }
.pills { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
.pill { font-size:12px; font-weight:600; padding:7px 12px; border-radius:99px; background:#fff; border:1px solid #D0DEE3; color:#4A646C; }
.pill.on { background:#E6F3F6; border-color:#A8C0C8; color:#063D4C; }
.form { background:#fff; border:1px solid #D0DEE3; border-radius:12px; padding:22px; max-width:860px; }
.row { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
label { display:block; font-size:11px; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; color:#6B8289; margin-bottom:6px; }
.field { height:42px; border:1px solid #D0DEE3; border-radius:8px; background:#F3F7F8; padding:0 12px; display:flex; align-items:center; font-size:13px; color:#4A646C; }
.area { min-height:110px; border:1px solid #D0DEE3; border-radius:8px; background:#F3F7F8; padding:12px; font-size:13px; color:#4A646C; line-height:1.5; }
.actions { display:flex; gap:10px; margin-top:18px; }
.btn { height:42px; padding:0 18px; border-radius:8px; font-size:13.5px; font-weight:600; display:inline-flex; align-items:center; }
.btn-p { background:#0A5F75; color:#fff; border:none; }
.btn-g { background:#fff; color:#0A5F75; border:1px solid #A8C0C8; }
`, `
<div class="shell">
  ${chrome('sourcing', 'Sourcer')}
  <main class="main">
    <div class="hero-copy">
      <h1>Find your next hire before competitors do</h1>
      <p>Kixlogic Sourcer searches public talent signals and ranks matches for any role — then shortlists people you can outreach.</p>
    </div>
    <div class="pills">
      <span class="pill on">Your ATS</span>
      <span class="pill on">LinkedIn &amp; web</span>
      <span class="pill">Resume Boolean</span>
      <span class="pill">OpenAlex</span>
      <span class="pill">GitHub</span>
    </div>
    <div class="form">
      <div class="row">
        <div><label>Load from posting</label><div class="field">Staff Software Engineer</div></div>
        <div><label>Role title</label><div class="field">Staff Software Engineer</div></div>
      </div>
      <div><label>Who are you looking for?</label>
        <div class="area">10+ years backend, distributed systems, B2B SaaS scale-up experience. Prefer candidates open to remote US.</div>
      </div>
      <div class="actions">
        <div class="btn btn-p">Run search →</div>
        <div class="btn btn-g">Save as project</div>
      </div>
    </div>
  </main>
</div>`);

const comp = page(`
.grid { display:grid; grid-template-columns:1.1fr 0.9fr; gap:14px; }
.tools { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
.tool { background:#fff; border:1px solid #D0DEE3; border-radius:12px; padding:16px; }
.tool h3 { font-size:14px; font-weight:700; margin-bottom:6px; }
.tool p { font-size:12.5px; color:#4A646C; line-height:1.45; }
.range { display:flex; align-items:flex-end; gap:8px; height:160px; margin-top:8px; }
.range .b { flex:1; border-radius:8px 8px 4px 4px; background:#C5DEE5; position:relative; }
.range .b.on { background:#0A5F75; }
.range .b span { position:absolute; bottom:-22px; left:50%; transform:translateX(-50%); font-size:11px; color:#6B8289; white-space:nowrap; }
.stat-row { display:flex; justify-content:space-between; padding:12px 0; border-bottom:1px solid #E8EFF1; font-size:13px; }
.stat-row:last-child { border-bottom:0; }
.stat-row strong { color:#0A5F75; }
`, `
<div class="shell">
  ${chrome('comp', 'Comp')}
  <main class="main">
    <div class="top"><h1>Comp Intelligence</h1><div class="search">Analyze a role…</div></div>
    <div class="tools">
      <div class="tool"><h3>Market Lookup</h3><p>Benchmarks by role, location, and company size.</p></div>
      <div class="tool"><h3>Offer Analyzer</h3><p>Score competitiveness before you send an offer.</p></div>
      <div class="tool"><h3>Pay Equity</h3><p>Spot gaps by gender, dept, and tenure.</p></div>
      <div class="tool"><h3>Compression</h3><p>Find tenure-vs-pay risk inside a band.</p></div>
    </div>
    <div class="grid">
      <div class="panel">
        <h2>Staff Software Engineer · Remote US</h2>
        <div class="range">
          <div class="b" style="height:45%"><span>P10</span></div>
          <div class="b" style="height:62%"><span>P25</span></div>
          <div class="b on" style="height:78%"><span>P50</span></div>
          <div class="b" style="height:90%"><span>P75</span></div>
          <div class="b" style="height:100%"><span>P90</span></div>
        </div>
      </div>
      <div class="panel">
        <h2>Recommended range</h2>
        <div class="stat-row"><span>Base (P50)</span><strong>$168k</strong></div>
        <div class="stat-row"><span>Total cash</span><strong>$192k</strong></div>
        <div class="stat-row"><span>Offer score</span><strong>Competitive</strong></div>
        <div class="stat-row"><span>Skill premium</span><strong>+8%</strong></div>
      </div>
    </div>
  </main>
</div>`);

const jobs = [
  { file: '01-overview.png', html: overview },
  { file: '03-pipeline.png', html: pipeline },
  { file: '07-sourcing.png', html: sourcing },
  { file: '14-comp-intelligence.png', html: comp },
];

await mkdir(outDir, { recursive: true });
await mkdir(path.join(__dirname, 'tmp'), { recursive: true });

const browser = await chromium.launch();
const pageCtx = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const job of jobs) {
  const tmp = path.join(__dirname, 'tmp', job.file.replace('.png', '.html'));
  await writeFile(tmp, job.html, 'utf8');
  await pageCtx.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
  // Wait for fonts
  await pageCtx.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await pageCtx.waitForTimeout(400);
  const out = path.join(outDir, job.file);
  await pageCtx.screenshot({ path: out, type: 'png' });
  console.log('wrote', out);
}

await browser.close();
console.log('done');
