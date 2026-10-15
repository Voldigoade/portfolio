# Voldigoade portfolio

Personal portfolio in French, English and Spanish. Astro builds static pages; React and Once UI Core handle interactive controls. Geist fonts are self-hosted.

## Development

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

```sh
npm run check:prose
npm run format:check
npm run lint
npm run check
npm run build
npm test
npm run test:browser
npm run audit:public
```

Build before running tests. Browser checks use installed Microsoft Edge and write screenshots outside the repository. Set `PORTFOLIO_BROWSER` for another Playwright channel or `PORTFOLIO_BASE_URL` for an existing server.

## Editing

- `src/data/locales.ts`: routes, metadata and shared translations. French lives at `/`, English at `/en`, Spanish at `/es`.
- `src/data/experience.ts`: homepage copy and selected work.
- `src/data/projects.ts`: research detail content and source links.
- `src/styles/global.css`: visual tokens and layout.
- [DESIGN.md](DESIGN.md): approved composition and interaction behavior.

Language links retain the current page and section. No portfolio template is used.

## Spoor

The browser calls the external Spoor v0.1.3 service using `fast` with `enrich: true` and report schema 1.1. SSE supplies progress; polling recovers missed completion or a dropped stream. Completion reopens the card and reveals an offscreen result heading. Copy uses the displayed summary; exports download backend files.

The small client boundary lives in `src/spoor/`; presentation lives in `src/components/spoor/`. [Integration notes](docs/spoor-api.md) cover the contract, retries and privacy. Provider credentials and analysis code belong in the backend.

Development-only `/preview/spoor/:scene` routes use isolated fixtures and are omitted from production. Production errors never fall back to mock data.

Real E2E tests trigger backend work. Set `SPOOR_REAL_E2E=1`, `PORTFOLIO_BASE_URL` and an external `PORTFOLIO_QA_OUTPUT`, then run `npm run test:e2e`. Repeated failure-state tests use intercepted requests instead.

## Privacy and deployment

No analytics, cookies, visitor database or stored inputs. Motion respects reduced motion. Static content stays readable without JavaScript. Hosting providers may keep request logs.

`npm run build` writes `dist/`. The canonical origin defaults to `https://voldigoade.xyz`; changing `SITE_URL` requires a rebuild. Astro generates script hashes for CSP; `vercel.json` adds security headers. The browser uses exact-origin CORS to reach Spoor directly.

Run `npm run social` after changing identity copy or visual tokens. Font licenses remain in `public/licenses/`; Once UI Core is MIT-licensed. This repository has no selected license.

Run `npm run audit:public` before publishing. Commits use the Voldigoade identity, its GitHub noreply address and UTC author/committer timestamps.
