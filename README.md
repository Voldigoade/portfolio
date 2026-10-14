# Voldigoade portfolio

A personal technical portfolio in French, English and Spanish: identity, short About, compact stack and an optional Spoor component. Astro renders static pages; React and Once UI Core provide interaction and shared controls. Fonts are self-hosted Geist and Geist Mono.

## Development

Use Node.js 22.12 or later and npm.

```sh
npm ci
npm run dev
```

Release checks:

```sh
npm run format:check
npm run lint
npm run check
npm run build
npm test
npm run test:browser
npm run audit:public
```

Tests inspect the production output, so build first. Browser checks use installed Microsoft Edge and save evidence in a temporary directory. Set `PORTFOLIO_BROWSER` for another Playwright browser channel or `PORTFOLIO_BASE_URL` for an existing deployment.

## Content and design

`src/data/locales.ts` contains route mappings and shared copy. `/` is French, `/en` English and `/es` Spanish. Project, privacy and error pages have localized routes. Language switching retains the current page and section.

`src/data/experience.ts` holds the short homepage copy. `src/data/projects.ts` preserves the research detail content and public source links. Projects are not automatically added to the homepage.

`src/styles/global.css` owns the site tokens. `DESIGN.md` describes the approved composition and component behavior. Once UI Core supplies the primitives; no Magic Portfolio template is used. Astro is retained for static routes and metadata, with a React island for interaction.

## Spoor

Spoor starts collapsed and uses the deployed v0.1.2 HTTP service with schema 1.1. Public lookups use fast mode. The adapter consumes real SSE progress, recovers completion through status polling, handles cancellation/errors/timeouts and downloads actual backend exports. No GitHub or GitLeak calls, analysis engine or provider credentials belong in this repository.

Development-only `/preview/spoor/:scene` routes use isolated fixtures for UI testing. They have no production static paths, and their fixture branch is excluded from the production bundle. Production never falls back to mock results. No state selector appears in the portfolio.

`src/spoor/types.ts` defines the small client interface. `HttpSpoorClient` maps the current backend into a compact display model; presentation components consume that interface. See [the integration notes](docs/spoor-api.md) for verified source references and operational behavior.

Real browser tests deliberately trigger backend work: set `SPOOR_REAL_E2E=1`, `PORTFOLIO_BASE_URL` and `PORTFOLIO_QA_OUTPUT` outside the repository, then run `npm run test:e2e`. The standard browser suite uses isolated network interception for failure-state tests.

## Motion and privacy

The dot field, hero entrance, disclosure and result/menu transitions respect reduced motion. The field suspends when hidden or offscreen. There is no visible motion control. No preferences or inputs are stored. Without JavaScript, the static content and navigation remain readable.

There are no analytics, visitor database, cookies or external fonts. A view counter is omitted. Hosting providers may maintain their own technical request logs.

## Deployment

`npm run build` writes a static site to `dist/`. The default canonical origin is `https://voldigoade.xyz`; set build-time `SITE_URL` to another HTTPS origin and rebuild to update canonical URLs, alternates, social previews, robots and sitemap.

Astro emits the content security policy with generated script hashes. Style attributes are allowed for Once UI layout and positioning; style elements and scripts stay restricted. Vercel adds frame restrictions and the remaining security headers from `vercel.json`. The browser connects directly to the public Spoor API with exact-origin CORS; no proxy or server runtime is required.

Run `npm run social` after changing the identity line or visual tokens. Geist and Geist Mono retain their OFL notices in `public/licenses/`; Once UI Core and the official starter are MIT-licensed. No license for this repository has been selected.

Before publishing, run `npm run audit:public` against staged files and Git history. Public commits use the Voldigoade identity, its GitHub noreply address and explicit UTC author and committer timestamps.
