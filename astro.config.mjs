import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: process.env.SITE_URL || 'https://voldigoade.xyz',
  output: 'static',
  integrations: [react()],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' https://avatars.githubusercontent.com",
        "font-src 'self'",
        "connect-src 'self' https://api--spoor--xsw6djgrvwtl.code.run",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'self'",
      ],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  markdown: { syntaxHighlight: false },
  build: { inlineStylesheets: 'never' },
  vite: {
    ssr: { noExternal: ['@once-ui-system/core'] },
    environments: {
      prerender: {
        resolve: { noExternal: [/^@once-ui-system\/core(?:\/|$)/] },
      },
    },
    build: { sourcemap: false, assetsInlineLimit: 0 },
  },
});
