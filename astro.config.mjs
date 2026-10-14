import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://voldigoade-portfolio.vercel.app',
  output: 'static',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'never' },
  vite: { build: { sourcemap: false, assetsInlineLimit: 0 } },
});
