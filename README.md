# Voldigoade — Portfolio

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

Articles live directly in `content/writing/<slug>.md` with **YAML frontmatter and a Markdown body**. The application currently has no public articles. The single internal test article remains `draft: true` and returns 404 publicly. Only published static article parameters are routable; publication triggers a new build. Standard Next.js rendering is used because Cache Components partial streams caused hydration errors during production QA.

| Field | Required | Format |
| --- | --- | --- |
| `title` | yes | Nonempty string |
| `slug` | yes | Lowercase letters/numbers separated by hyphens; exactly matches filename |
| `summary` | yes | Nonempty string |
| `type` | yes | `Article`, `Write-up`, `Research`, `Note`, or `Project Log` |
| `tags` | yes | At least one nonempty string; trimmed and deduplicated |
| `publishedAt` | yes | `YYYY-MM-DD` or UTC ISO timestamp |
| `updatedAt` | no | Same date format; empty means absent |
| `draft` | yes | Boolean; CMS defaults to `true` |
| `cover` | no | Local `/images/writing/` raster image |
| `canonical` | no | Absolute HTTP(S) URL |
| `body` | Markdown body | Content after the closing `---` delimiter |

YAML date values are normalized to ISO strings. Invalid frontmatter, filename mismatches and duplicate slugs fail collection validation. Only complete YAML delimiters are accepted: executable frontmatter engines are rejected before parsing.

```markdown
---
title: "Internal example"
slug: "internal-example"
summary: "A draft used to check the editor."
type: "Note"
tags: ["internal-test"]
publishedAt: "2026-10-18"
draft: true
---

Internal Markdown content.
```

`.pages.yml` uses the documented `yaml-frontmatter` collection format, `string` with `list: true` for tags, `select.options.values` for writing types, and `rich-text.options.format: markdown`. Media upload paths are `public/images/writing` → `/images/writing`; allowed extensions are png, jpg, jpeg, webp and avif, with safe upload filenames. SVG uploads are excluded. See the official [content schema](https://pagescms.org/docs/configuration/content/), [select](https://pagescms.org/docs/configuration/fields/select/), [rich text](https://pagescms.org/docs/configuration/fields/rich-text/), and [media](https://pagescms.org/docs/configuration/media/) documentation.

To use the hosted editor, authorize the Pages CMS GitHub App for this repository, select the intended branch and inspect the generated diff before publishing. GitHub App authorization and a real hosted-editor save must be performed by the repository owner; local schema verification does not prove the hosted connection is configured.

Raw HTML renders as text. Links allow HTTP(S), mailto, root-relative paths and anchors. Markdown images and covers are restricted to the local writing raster folder. Code fences use Marked tokens and Shiki, with escaped plain-code fallback. Inline HTML embeds and remote Markdown images are deliberately unsupported.

Public listings, article routes, search/tags, social metadata, RSS (`/rss.xml`), Atom (`/feed.xml`) and sitemap use published articles only. Empty feeds remain valid. Static sitemap routes omit modification dates; article dates come from frontmatter. An empty Atom feed uses its generation time for the required feed-level `updated` field.

## Public project data

The fixed allowlist is `spoor`, `recherche-messageries`, `ide-research` and `crukst`. The archived/discontinued `diskboot` project is excluded. Descriptions reflect the public READMEs; Crukst is early design/implementation work, not a functioning firmware comparison tool.

GitHub requests are unauthenticated, server-side, fixed to `Voldigoade`, bounded to eight seconds and cached for up to twelve hours. **No GitHub token or caller-selected username is used.** Only exact, public, active, non-fork allowlist matches can supply live metrics. Arbitrary upstream metadata is never copied into responses. Private, foreign, duplicate, malformed or missing responses use the same independently curated static card data as an outage. Stars/forks/watchers and update dates remain absent when unknown; aggregate totals show unavailable unless all required values exist. No authenticated/private contribution calendar is requested.

The public endpoints are `/api/portfolio/repos`, `/api/portfolio/github-overview`, `/api/portfolio/posts` and `/api/portfolio/stats`. Query parameters cannot change the GitHub identity.

## Environment

Create an ignored `.env.local` only for features you actually configure. Never commit tokens.

```sh
# Optional origin override; production should retain the canonical origin.
NEXT_PUBLIC_SITE_URL=https://voldigoade.xyz

# Optional analytics. Blank/unconfigured means no corresponding script.
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=

# Optional server-only contact provider key.
WEB3FORMS_ACCESS_KEY=

# Optional coding statistics; no provider is configured by default.
CODING_STATS_PROVIDER=wakatime
WAKATIME_ACCESS_TOKEN=
NEXT_PUBLIC_WAKATIME_USER=
# Or: CODING_STATS_PROVIDER=hackatime
HACKATIME_API_KEY=
NEXT_PUBLIC_HACKATIME_USER=
# Optional trusted server configuration override:
# HACKATIME_API_BASE_URL=https://hackatime.hackclub.com
```

The legacy server variable `WAKATIME_API_KEY`, if used, is only an alias for an OAuth token; raw WakaTime API keys cannot read statistics.

WakaTime requires an OAuth read token with appropriate stats/summary access, per its [developer documentation](https://wakatime.com/developers/). Secrets travel only in server request headers. Unconfigured/incomplete provider data displays unavailable; missing activity is never replaced with invented zeros. No live provider account was verified during this review.

## Analytics and consent

Google Analytics and Google Tag Manager initialize only when `voldigoade_cookie_consent` is exactly `accepted`. Dismiss stores `dismissed` and keeps Google disabled across reloads. Missing/malformed choices prompt again; inaccessible storage fails closed. IDs are environment-only and format-checked. If both GA and GTM are configured, do not also configure the same GA page-view tag in GTM, or visits may be counted twice.

Cloudflare uses its documented manual module beacon, `data-cf-beacon` token, and cookieless behavior independently of the Google choice. Configure one installation method in Cloudflare to avoid duplicate automatic/manual beacons. See [Cloudflare setup](https://developers.cloudflare.com/web-analytics/get-started/) and [FAQ/CSP requirements](https://developers.cloudflare.com/web-analytics/faq/). No Vercel Analytics, Speed Insights, fingerprinting or identity correlation is implemented.

## Contact and abuse limits

The server validates and normalizes all fields independently of the form: names/countries up to 100 characters, email 254, topic 200, message 20–5000, phone 20, calendar dates and date order. A hidden honeypot rejects filled submissions. Web3Forms requests have an eight-second AbortController timeout, stable application errors and no raw provider response/secret exposure. An unconfigured key produces an actionable GitHub fallback. Tests use mocked provider responses and send no real messages.

The server keeps at most 1000 SHA-256 email keys for a one-minute per-process cooldown; no raw email is stored by that limiter. This is a modest local abuse baseline, **not durable or distributed rate limiting**. It can be bypassed with different addresses and resets on cold starts; parallel instances do not share it. Enable provider/platform abuse controls before exposing a high-traffic form. No Redis service is assumed or provisioned. Form input and the client cooldown remain in memory, never persisted to localStorage.

## Security and CI

`vercel.json` defines HSTS, nosniff, Referrer-Policy, Permissions-Policy, DENY framing and a CSP; `next.config.ts` applies the same headers locally. CSP permits the configured Google/Cloudflare scripts and endpoints, local fonts, GitHub public media/API and Next.js inline scripts/styles. It blocks objects and framing and restricts base/form destinations. Static Next.js rendering requires `unsafe-inline`; this is not a nonce-based strict CSP. Production does not allow `unsafe-eval`; development adds it for tooling. New GTM tags may need explicit CSP additions. See [Next.js CSP guidance](https://nextjs.org/docs/app/guides/content-security-policy) and [Google CSP requirements](https://developers.google.com/tag-platform/security/guides/csp).

GitHub Actions runs frozen Bun install, typecheck, Biome, deterministic tests and production build on pull requests and pushes to main. Actions are pinned to reviewed official release SHAs. Dependency Review and repository-managed CodeQL remain enabled. Workflow updates are covered by Dependabot. External Vercel project access and integration settings are separate from repository CI; this branch never deploys to production manually.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).
