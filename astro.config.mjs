import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// Cloudflare caps dist/_routes.json at 100 include + exclude rules, and this site sits at that cap.
// Never put comment lines in public/_redirects: the adapter counts a comment line as a routing rule.
// (/ats and /sourcer redirect to /apps/; the ATS itself still runs at app.kixlogic.com for existing customers.)
export default defineConfig({
  site: 'https://kixlogic.com',
  output: 'hybrid',
  adapter: cloudflare(),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
});
