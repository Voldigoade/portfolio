# Voldigoade — Developer Portfolio & Systems Research

<p align="center">
  <a href="https://voldigoade.xyz"><strong>voldigoade.xyz</strong></a> •
  <a href="https://github.com/Voldigoade">GitHub Profile</a> •
  <a href="https://voldigoade.xyz/blog">Technical Writing</a> •
  <a href="https://voldigoade.xyz/rss.xml">RSS Feed</a>
</p>

A developer portfolio and technical systems research site engineered with Next.js 16, React 19, TypeScript, and Bun, styled with a retro-brutalist developer aesthetic.

## Upstream Provenance & Attribution

This portfolio is an adaptation of [Muhammad Fiaz's open-source portfolio](https://github.com/muhammad-fiaz/portfolio) (audited at upstream commit `32aa93ec8ed0323da5d46be264898084c7fa634b`), licensed under the MIT License.

The visual design system—including the retro-brutalist geometry, orange/cyan/lime color palette, solid offset black shadows, typography (Space Grotesk, Press Start 2P, Bungee), and window motifs—has been intentionally preserved to honor the reference design, while the content, architecture, and identity have been repurposed for **Voldigoade**.

## Core Architecture & Key Features

- **Framework**: Next.js 16 (App Router, static prerendering, server actions).
- **Runtime & Package Manager**: [Bun](https://bun.sh/).
- **Styling**: Tailwind CSS 4 + Panda CSS + custom RetroUI utility layers (hard borders, zero-blur offset shadows, retro badge accents).
- **First-Party Writing Engine**:
  - Markdown articles stored in `content/writing/` with strict YAML frontmatter validation (`title`, `slug`, `date`, `summary`, `tags`, `type`, `published`).
  - Rendered with `gray-matter`, `marked`, and `shiki` syntax highlighting.
  - Strict draft privacy (drafts are never listed, indexed in sitemaps, or included in feeds).
  - RSS 2.0 (`/rss.xml`) and Atom (`/feed.xml`) generation with XML escaping.
  - Ready for [Pages CMS](https://pagescms.org/) via `.pages.yml`.
- **Curated Projects & Defensive Security**:
  - Server-side GitHub repository curation (`spoor`, `recherche-messageries`, `ide-research`, `crukst`, `diskboot`).
  - **Defensive API isolation**: Public API routes reject caller-supplied usernames, never fetch private repositories, and enforce strict repository allowlists.
- **Privacy-First Telemetry**:
  - **Cloudflare Web Analytics**: Cookieless, non-invasive traffic measurement with zero device fingerprinting.
  - **Consent-Gated Analytics**: Optional Google Analytics / Tag Manager scripts are strictly gated behind user consent via the retro Cookie Notice (`voldigoade_cookie_consent`).
  - **Zero Local Data Leakage**: Form cooldowns and user inputs are not stored in unencrypted browser local storage.

## Project Structure

```
├── content/
│   └── writing/              # First-party Markdown articles & research
├── public/
│   ├── images/               # Static assets & avatar
│   └── favicon.svg           # Voldigoade SVG icon
├── src/
│   ├── app/                  # Next.js App Router (home, about, project, blog, contact)
│   ├── components/
│   │   ├── layout/           # Navbar, footer, cookie notice, analytics manager
│   │   ├── pages/            # Page-level client orchestration
│   │   ├── portfolio/        # Project grids, blog grids, showcases, hero
│   │   └── retroui/          # Retro UI primitives (Button, Card, Bento, Badges)
│   ├── lib/
│   │   ├── blog.ts           # First-party Markdown & frontmatter engine
│   │   ├── site-config.ts    # Centralized URLs and site metadata
│   │   └── server/           # Curated GitHub fetching & contact server actions
│   └── store/                # Zustand client state stores
├── tests/                    # Automated test suites (Bun test runner)
└── .pages.yml                # Pages CMS schema definition
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.1+ (recommended) or Node.js 20+

### Installation

```bash
git clone https://github.com/Voldigoade/portfolio.git
cd portfolio
bun install
```

### Environment Configuration

Create a `.env.local` file for optional overrides:

```bash
# Public URL
NEXT_PUBLIC_SITE_URL=https://voldigoade.xyz

# GitHub API (Optional: increases rate limits for curated repos)
GITHUB_TOKEN=
GITHUB_USER=Voldigoade

# Privacy-Preserving Telemetry (Optional)
NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=

# Contact Form (Web3Forms)
WEB3FORMS_ACCESS_KEY=
```

### Development

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site locally.

### Automated Checks

```bash
# Typecheck
bun x tsc --noEmit

# Unit & Integration Tests
bun test

# Linting
bun run lint

# Production Build
bun run build
```

## Contributing & Security

- For bug fixes and improvements, please review [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- To report a security vulnerability, refer to [SECURITY.md](SECURITY.md).

## License

This project is licensed under the [MIT License](LICENSE). See [LICENSE](LICENSE) for upstream copyright and adaptation details.
