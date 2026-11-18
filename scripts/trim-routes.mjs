// Runs after `astro build`. Cloudflare Pages allows at most 100 include + exclude rules in
// dist/_routes.json. The Astro adapter lists every static file, page and redirect as an exclude rule,
// but an exclude only matters when an include rule would otherwise send that path to the Function.
// This keeps only those excludes, so adding pages, images or redirects no longer uses up rules.
import fs from 'node:fs';

const file = new URL('../dist/_routes.json', import.meta.url);
const routes = JSON.parse(fs.readFileSync(file, 'utf8'));
const norm = (p) => p.replace(/\\/g, '/');
const include = routes.include.map(norm);
const before = routes.include.length + routes.exclude.length;

if (include.includes('/*')) {
  // The adapter fell back to "send everything to the Function": every exclude is needed, and it may have
  // dropped some. Fail the build rather than ship broken redirects or static files.
  console.error('trim-routes: _routes.json includes "/*"; the adapter overflowed. Fix routing before deploying.');
  process.exit(1);
}

const prefix = (w) => w.slice(0, -1); // "/blog/*" -> "/blog/"
const covered = (e) =>
  include.some((i) => {
    if (e === i) return true;
    if (i.endsWith('/*') && (e.startsWith(prefix(i)) || e === i.slice(0, -2))) return true;
    if (e.endsWith('/*') && (i.startsWith(prefix(e)) || i === e.slice(0, -2))) return true;
    return false;
  });

routes.include = include;
routes.exclude = [...new Set(routes.exclude.map(norm))].filter(covered);
const after = routes.include.length + routes.exclude.length;
if (after > 100) {
  console.error(`trim-routes: still ${after} rules after trimming; Cloudflare allows 100.`);
  process.exit(1);
}
fs.writeFileSync(file, JSON.stringify(routes, null, 2));
console.log(`trim-routes: ${before} -> ${after} rules (limit 100)`);
