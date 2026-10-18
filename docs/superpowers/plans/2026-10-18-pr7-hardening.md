# PR #7 Production Hardening Plan

**Goal:** Review and finish the existing portfolio migration, push fixes to PR #7, and leave it unmerged.

**Architecture:** Retain the current Next.js application, audited upstream baseline, retro visual system, and first-party Markdown pipeline. Tighten content, server trust boundaries, configuration and verification without restarting the migration.

**Tech Stack:** Next.js 16.3.8, React 19, TypeScript 7, Bun, Marked/Shiki, Pages CMS, GitHub Actions, Vercel.

**Spec:** `/home/cruck/.codex/attachments/9d692503-cacd-4e12-9f01-3ecc780be25c/pasted-text-1.txt`

## Global Constraints

- Stay on `feat/muhammad-portfolio-adaptation`; update existing PR #7; never merge.
- Preserve upstream baseline `32aa93ec8ed0323da5d46be264898084c7fa634b`, design, archive branch and provenance.
- Public identity Voldigoade; canonical origin `https://voldigoade.xyz`.
- No invented endorsements, professional claims, articles, metrics, timestamps or private repository exposure.
- Keep Pages CMS, Markdown writing, consent-gated Google tracking and cookieless Cloudflare analytics.
- Store browser artifacts outside the repository; never commit secrets or build artifacts.

## Review Focus

- GitHub sends malformed/private/nonallowlisted data: no metadata or existence leaks.
- Hostile Markdown/frontmatter and draft routes: safe HTML and no public drafts.
- Unconfigured external services: truthful empty states, bounded requests and safe errors.
- Consent reload/malformed storage: Google stays disabled without explicit acceptance.
- Responsive content and empty collections: retain visual geometry and functional navigation.

## Execution

The user explicitly authorized autonomous execution. Use parallel agents for independent domains under the dispatching-parallel-agents skill, then integrate and request a fresh whole-branch review. Keep all work in the current branch as explicitly required.

### Task 1: Writing and CMS

Files: `src/lib/blog.ts`, article route, feeds, sitemap, `.pages.yml`, `content/writing`, blog/feed tests.

- [ ] Inspect implementation and official current Pages CMS docs.
- [ ] Add failing deterministic parser/draft/feed/XSS tests; run to establish defects.
- [ ] Remove synthetic published articles; retain at most one explicit internal draft.
- [ ] Correct schema, safe Markdown, draft isolation, empty collection and XML behavior.
- [ ] Run focused tests, typecheck relevant interfaces; report exact schema/docs and findings.

### Task 2: Public project data

Files: `src/lib/server/portfolio-data.ts`, `portfolio-types.ts`, API routes, project/stats consumers, security tests.

- [ ] Verify public active repository metadata through GitHub; never publish private metadata.
- [ ] Add failing mocked tests for public/private/nonallowlisted/error/missing-stat cases.
- [ ] Separate static curation from optional live metrics; reject private/foreign/archived responses.
- [ ] Preserve visual cards and honest unconfigured stats; prove no caller-selected identity.
- [ ] Run focused tests/typecheck and document fallback behavior.

### Task 3: Factual content and design fidelity

Files: home/about/contact UI, metadata, layout/footer/release controls, site/link configuration.

- [ ] Read public repository evidence and upstream baseline; inventory invented/stale text and links.
- [ ] Repurpose testimonial/donation visuals with truthful project content; weaken unsupported claims.
- [ ] Remove empty links and inherited identity/release/contact contamination outside provenance.
- [ ] Preserve upstream geometry, themes and responsiveness; check obvious accessibility defects.
- [ ] Report all visual/content changes and intentional differences.

### Task 4: Contact, analytics, deployment and CI

Files: contact action/form/store, analytics/cookie components, security header config, workflows, tests.

- [ ] Add failing contact validation/timeout/provider-error and consent tests before behavior fixes.
- [ ] Implement bounded normalized server validation, timeout and safe provider errors; document local abuse baseline.
- [ ] Verify analytics against official docs and exercise consent without live tracking.
- [ ] Restore compatible security headers, evaluate CSP in the actual browser.
- [ ] Restore maintained Bun CI and preserve dependency/security checks; investigate Vercel failure.

### Task 5: Integration and release review

Files: README and final review notes; targeted fixes discovered during integration.

- [ ] Reconcile README, CMS, parser, fixtures and draft schema.
- [ ] Run `bun install --frozen-lockfile`, `bun x tsc --noEmit`, `bun run lint`, `bun test`, `bun run build`.
- [ ] Run production server; verify reference/local desktop 1440x900 and mobile 390x844, themes, routes, navigation, consent, console/network, XML and APIs.
- [ ] Inspect preview if available; request independent whole-branch review and resolve material findings.
- [ ] Review diffs/secrets/identity matches; commit coherent fixes, push existing branch, update PR #7.
- [ ] Wait for checks; fix branch failures, precisely document external blockers and leave PR unmerged.
