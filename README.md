# Voldigoade portfolio

A static personal portfolio in French, English and Spanish. Built with Astro, TypeScript and plain CSS. Fonts are self-hosted IBM Plex Sans; browser JavaScript only preserves section anchors during language changes.

## Development

Use Node.js 22.12 or later and npm.

```sh
npm ci
npm run dev
```

```sh
npm run format:check
npm run lint
npm run check
npm run build
npm test
npm run preview
```

Tests inspect the production output, so build before running them.

## Content

`src/data/locales.ts` contains interface copy and route mappings. `/` is French, `/en` English and `/es` Spanish. Project, privacy and error pages have corresponding localized routes. Language switching retains the current page and section.

`src/data/projects.ts` is the project source of truth. Keep every translation complete, use public sources, and distinguish published evidence from planned work. Adding a project with a unique slug automatically adds its homepage entry, localized detail pages and sitemap entries. Extend the route and content assertions in the tests alongside new public projects.

`src/styles/global.css` owns the runtime tokens. `DESIGN.md` records their intent and mapping. The tests check that the documented color tokens match the CSS.

## Deployment

`npm run build` writes a static site to `dist/`. Vercel settings and security headers are in `vercel.json`. The canonical production origin defaults to `https://voldigoade-portfolio.vercel.app`; set the build-time `SITE_URL` when using another domain. It must be an absolute HTTPS origin. Rebuild after changing it so canonical URLs, alternates, social previews, robots and sitemap use the new origin.

The site has no backend, visitor database, cookies or analytics. A view counter is intentionally omitted because no durable aggregate storage is configured. Hosting providers may maintain their own technical request logs.

Public project statements reference [the profile README](https://github.com/Voldigoade/voldigoade) and [Secure Messaging Research](https://github.com/Voldigoade/recherche-messageries). They are checked during maintenance, never fetched by visitors.

No license for this repository has been selected. IBM Plex Sans retains its separate OFL license in `public/licenses/`.

Before publishing, run `npm run audit:public` against the staged files and current Git history. Public commits use the Voldigoade identity, its GitHub noreply address, and UTC for both author and committer timestamps. Set commit timestamps explicitly to UTC; the audit rejects local timezone offsets.
