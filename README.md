# Voldigoade: Portfolio

A personal portfolio for public projects and first-party technical writing, built with Next.js 16, React 19, TypeScript and Bun. Canonical site: [voldigoade.xyz](https://voldigoade.xyz).

## Provenance

Adapted from [Muhammad Fiaz's portfolio](https://github.com/muhammad-fiaz/portfolio), audited at commit `32aa93ec8ed0323da5d46be264898084c7fa634b`, under the [MIT license](LICENSE). The orange/cyan/lime themes, Space Grotesk / Press Start 2P / Bungee typography, square borders, hard shadows, windows and section layout are intentionally retained.

The previous Astro application is preserved on `archive/astro-portfolio-2026-10-18` at `2c83c554d0e043df5eaa9b2755f0a6f8a76a35a6`. This branch continues the existing Next.js migration.

## Development

Use Bun **1.4.3** (the CI version) and a Node.js version supported by Next.js 16 (Node 20.9 or later).

```sh
bun install --frozen-lockfile
bun run dev
```

The development server uses [localhost:3000](http://localhost:3000). For a production check:

```sh
bun x tsc --noEmit
bun run lint
bun test
bun run build
bun run start
```

`next/font` downloads the reference fonts during the build, so the build requires outbound access to Google Fonts. Fonts are then served locally. The tests mock external services; they do not require live GitHub, analytics or contact-provider access.

## Writing and Pages CMS

Articles live in `content/writing/fr/<slug>.md` and `content/writing/en/<slug>.md` with **YAML frontmatter and a Markdown body**. The site is French-first with an English section. Articles support bidirectional translation linking via the optional `frenchVersion` or `englishVersion` frontmatter fields (or matching slugs). The single internal test articles remain `draft: true` and return 404 publicly. Only published static article parameters are routable; publication triggers a new build. Standard Next.js rendering is used because Cache Components partial streams caused hydration errors during production QA.

| Field | Required | Format |
| --- | --- | --- |
| `title` | yes | Nonempty string |
| `slug` | yes | Lowercase letters/numbers separated by hyphens; exactly matches filename |
| `summary` | yes | Nonempty string |
| `category` | no | Nonempty string (`Systèmes` or `Systems` default by locale) |
| `tags` | yes | At least one nonempty string; trimmed and deduplicated |
| `publishedAt` | yes | `YYYY-MM-DD` or UTC ISO timestamp |
| `updatedAt` | no | Same date format; empty means absent |
| `draft` | yes | Boolean; CMS defaults to `true` |
| `cover` | no | Local `/images/writing/` raster image |
| `canonical` | no | Absolute HTTP(S) URL |
| `frenchVersion` | no | Slug of corresponding French article (English collection) |
| `englishVersion` | no | Slug of corresponding English article (French collection) |
| `body` | Markdown body | Content after the closing `---` delimiter |

YAML date values are normalized to ISO strings. Invalid frontmatter, filename mismatches and duplicate slugs fail collection validation. Only complete YAML delimiters are accepted: executable frontmatter engines are rejected before parsing.

```markdown
---
title: "Article de test"
slug: "article-de-test"
summary: "Brouillon pour tester le rendu."
category: "Systèmes"
tags: ["test"]
publishedAt: "2026-10-18"
draft: true
---

Contenu Markdown.
```

`.pages.yml` defines two collections: `writing_fr` (`content/writing/fr`) and `writing_en` (`content/writing/en`) using the documented `yaml-frontmatter` format, `string` with `list: true` for tags, and `rich-text.options.format: markdown`. Media upload paths map `public/images/writing` to `/images/writing`; allowed extensions are png, jpg, jpeg, webp and avif, with safe upload filenames. SVG uploads are excluded. See the official [content schema](https://pagescms.org/docs/configuration/content/), [select](https://pagescms.org/docs/configuration/fields/select/), [rich text](https://pagescms.org/docs/configuration/fields/rich-text/), and [media](https://pagescms.org/docs/configuration/media/) documentation.

To use the hosted editor, authorize the Pages CMS GitHub App for this repository, select the intended branch and inspect the generated diff before publishing. GitHub App authorization and a real hosted-editor save must be performed by the repository owner; local schema verification does not prove the hosted connection is configured.

Raw HTML renders as text. Links allow HTTP(S), root-relative paths and anchors (mailto links are rejected to avoid unvetted URI handlers). Markdown images and covers are restricted to the local writing raster folder. Code fences use Marked tokens and Shiki, with escaped plain-code fallback. Inline HTML embeds and remote Markdown images are deliberately unsupported.

Public listings, article routes, search/tags, social metadata, RSS (`/rss.xml` and `/en/rss.xml`), Atom (`/feed.xml`) and sitemap use published articles only. Empty feeds remain valid. Static sitemap routes omit modification dates; article dates come from frontmatter. An empty Atom feed uses its generation time for the required feed-level `updated` field.

## Public project data

The fixed allowlist is `spoor`, `recherche-messageries`, `ide-research` and `crukst`. The archived/discontinued `diskboot` project is excluded. Descriptions reflect the public READMEs; Crukst is early design/implementation work, not a functioning firmware comparison tool.

GitHub requests are unauthenticated, server-side, fixed to `Voldigoade`, bounded to eight seconds and cached for up to twelve hours. **No GitHub token or caller-selected username is used.** Only exact, public, active, non-fork allowlist matches can supply live metrics. Arbitrary upstream metadata is never copied into responses. Private, foreign, duplicate, malformed or missing responses use the same independently curated static card data as an outage. Stars/forks/watchers and update dates remain absent when unknown; aggregate totals show unavailable unless all required values exist. No authenticated/private contribution calendar is requested.

The public endpoints are `/api/portfolio/repos`, `/api/portfolio/github-overview`, and `/api/portfolio/posts`. Query parameters cannot change the GitHub identity.

## Environment

Create an ignored `.env.local` only for features you actually configure. Never commit tokens.

```sh
# Optional origin override; production should retain the canonical origin.
NEXT_PUBLIC_SITE_URL=https://voldigoade.xyz

# Optional Cloudflare Web Analytics beacon token. Blank/unconfigured means no analytics script.
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=
```

## Analytics and Privacy

Cloudflare Web Analytics operates as the sole, privacy-first measurement system. It uses a documented manual module beacon with a `data-cf-beacon` token, functioning completely without cookies, without local storage, and without visitor fingerprinting or user identity correlation. See [Cloudflare setup](https://developers.cloudflare.com/web-analytics/get-started/) and [FAQ/CSP requirements](https://developers.cloudflare.com/web-analytics/faq/). No Google Analytics, Google Tag Manager, Vercel Analytics, or Speed Insights are loaded.

## Security and CI

`vercel.json` defines HSTS, nosniff, Referrer-Policy, Permissions-Policy, DENY framing and a strict CSP; `next.config.ts` applies the same headers locally. CSP permits the configured Cloudflare beacon script and endpoints, local fonts, GitHub public media/API and Next.js inline scripts/styles. It completely blocks framing (`frame-src 'none'`, `frame-ancestors 'none'`), objects, and restricts base and form destinations. Static Next.js rendering requires `unsafe-inline`; production does not allow `unsafe-eval`.

GitHub Actions runs frozen Bun install, typecheck, Biome, deterministic tests and production build on pull requests and pushes to main. Actions are pinned to reviewed official release SHAs. Dependency Review and repository-managed CodeQL remain enabled. Workflow updates are covered by Dependabot. External Vercel project access and integration settings are separate from repository CI; this branch never deploys to production manually.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).
