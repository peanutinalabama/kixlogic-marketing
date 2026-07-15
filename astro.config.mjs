import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://kixlogic.com',
  output: 'hybrid',
  adapter: cloudflare(),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
});
