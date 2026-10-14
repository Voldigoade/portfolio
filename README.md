# Voldigoade portfolio

A personal portfolio in French, English and Spanish, statically rendered with Astro and enhanced with native TypeScript, Canvas and SVG. The interactive field, research preview and layer explorer share motion preferences and accessible navigation. Fonts are self-hosted IBM Plex Sans.

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
npm run test:browser
npm run preview
```

Tests inspect the production output, so build before running them.

Browser checks use an installed Microsoft Edge by default, start a local production preview, and save their report and screenshots in a temporary directory. Set `PORTFOLIO_BROWSER` to another Playwright browser channel or `PORTFOLIO_BASE_URL` to check an existing deployment.

## Content

`src/data/locales.ts` contains interface copy and route mappings. `/` is French, `/en` English and `/es` Spanish. Project, privacy and error pages have corresponding localized routes. Language switching retains the current page and section.

`src/data/experience.ts` contains the compact homepage copy, research questions and five layer contexts. The shared tab behavior supports pointer, touch, Arrow keys, Home, End and Space. Layer and research selections use hash links that survive language changes.

`src/components/ResearchPreview.astro` renders the current project's structural preview. It can be replaced with actual project media without changing the project caption or routing.

`src/data/projects.ts` is the project source of truth. Keep every translation complete, use public sources, and distinguish published evidence from planned work. Adding a project with a unique slug automatically adds its homepage entry, localized detail pages and sitemap entries. Extend the route and content assertions in the tests alongside new public projects.

`src/styles/global.css` owns the runtime tokens. `DESIGN.md` records their intent and mapping. The tests check that the documented color tokens match the CSS.

## Motion

The Canvas field caps rendering at 60fps on desktop and 30fps on mobile, with bounded device pixel ratios. Canvas and SVG ambient motion suspend offscreen and in hidden tabs. The pause control stops ambient motion; reduced-motion preferences render a complete static composition. No preference is persisted. Native links and static visual fallbacks keep navigation usable without JavaScript.

Run `npm run social` after changing visual tokens to regenerate the localized social previews.

## Deployment

`npm run build` writes a static site to `dist/`. Vercel settings and security headers are in `vercel.json`. The canonical production origin defaults to `https://voldigoade-portfolio.vercel.app`; set the build-time `SITE_URL` when using another domain. It must be an absolute HTTPS origin. Rebuild after changing it so canonical URLs, alternates, social previews, robots and sitemap use the new origin.

The site has no backend, visitor database, cookies or analytics. A view counter is intentionally omitted because no durable aggregate storage is configured. Hosting providers may maintain their own technical request logs.

Public project statements reference [the profile README](https://github.com/Voldigoade/voldigoade) and [Secure Messaging Research](https://github.com/Voldigoade/recherche-messageries). They are checked during maintenance, never fetched by visitors.

No license for this repository has been selected. IBM Plex Sans retains its separate OFL license in `public/licenses/`.

Before publishing, run `npm run audit:public` against the staged files and current Git history. Public commits use the Voldigoade identity, its GitHub noreply address, and UTC for both author and committer timestamps. Set commit timestamps explicitly to UTC; the audit rejects local timezone offsets.
