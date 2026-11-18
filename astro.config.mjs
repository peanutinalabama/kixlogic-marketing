import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// Cloudflare caps dist/_routes.json at 100 include + exclude rules. scripts/trim-routes.mjs (run by npm run build)
// keeps only the excludes that sit under an include, so static pages, files and redirects cost no rules.
// It fails the build if the count still passes 100. Comment lines in public/_redirects are still best avoided.
// (/ats and /sourcer redirect to /apps/; the ATS itself still runs at app.kixlogic.com for existing customers.)
export default defineConfig({
  site: 'https://kixlogic.com',
  output: 'hybrid',
  adapter: cloudflare(),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
});
