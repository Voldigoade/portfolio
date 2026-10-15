---
version: alpha
name: Voldigoade
description: A personal technical portfolio with an optional Spoor component.
colors:
  background: '#0a0a0a'
  surface: '#101010'
  text: '#fafafa'
  muted: '#a3a3a3'
  border: '#2b2b2b'
  primary: '#b8c4ff'
  on-primary: '#0a0a0a'
typography:
  sans:
    fontFamily: 'Geist, sans-serif'
  mono:
    fontFamily: 'Geist Mono, monospace'
rounded:
  control: '20px'
  surface: '14px'
spacing:
  page-max: '900px'
  mobile-gutter: '20px'
---

# Voldigoade

The approved foundation is Concept A: a centered name, one factual supporting line, small floating navigation, a dark neutral palette and a geometric dot field. The Once UI demo is the concrete reference for proportions, typography, controls and restraint. Use actual Once UI Core primitives. No portfolio template is used.

## Composition

The homepage contains the hero, two short About paragraphs adapted from the public profile README, six compact area groups, two restrained Selected Work entries, a compact collapsible Spoor component and the footer. The personal portfolio must remain complete if Spoor is removed. The hero action leads to About. Navigation puts the identity and About before Spoor. Existing localized research detail URLs remain available, but the homepage is not a project gallery.

The desktop hero is 365px high with an 80px heading, 24px supporting line and 40px actions. Homepage sections have a 900px maximum width. At 390px, the hero is 325px high with 20px content gutters. Mobile keeps a small identity mark, two section links and language links at the top. Areas become compact rows. At 430px and narrower, the Spoor input and action stack; results use one readable column.

The hero stays in the same position across terminal states. Results expand the page below it. Do not move the hero to accommodate a report. Do not add filler sections, slogans, diagrams, telemetry or decorative paths.

## Components and tokens

`src/styles/global.css` owns the site tokens mirrored above. Once UI Core supplies headings, buttons, inputs, the matrix effect, theme and responsive layout context. Export uses a small semantic surface positioned with Floating UI. The theme is dark, neutral gray, with contrast buttons and a restrained pale indigo status/focus accent. Fonts are self-hosted Geist and Geist Mono. Translucency, backdrop blur and a thin inner highlight are confined to the Spoor shell. About and stack remain open content without cards, pills or icons.

Shared export-menu behavior lives in `src/components/site/Menu.tsx`. Menus support outside dismissal, Escape, Arrow keys, Home and End, and return focus to their trigger. The report uses semantic headings and definition lists; status uses text and shapes in addition to color.

`src/components/spoor/` owns presentation. `src/spoor/` owns the small client boundary, target parsing and localized interface copy. Fixture data is isolated in `src/spoor/demo/`. UI components never interpret GitHub data or implement analysis.

## Spoor states

The ordinary page starts with Spoor collapsed. Its disclosure animates height, opacity and a small vertical offset; collapsed content is inert and excluded from the accessibility tree. Input and results survive minimizing. A completed lookup reopens the card. If the result heading is outside the viewport, it scrolls into view without taking keyboard focus. There are no public fixture controls, demo badges, provider-debugging panels or terminal jokes.

The public client uses the deployed Spoor v0.1.3 service in fast mode with schema 1.1. Progress and results come from real API responses, with SSE, polling recovery and bounded timeouts. No fixture fallback is allowed. Development-only `/preview/spoor/:scene` routes exercise idle, populated input, starting, provider events, complete, error, rate limited and partial results. These routes are omitted from production, and their fixture notice sits outside the portfolio composition. Fixtures are never presented as real public results.

Summary fields are optional. Missing fields disappear; partial status stays visible. Copy copies the visible summary with localized feedback. Export offers PDF, Markdown, JSON, TXT and SVG; preview exports stay disabled. There is no full-report action until a useful report experience exists. No fake downloads are generated.

## Motion and accessibility

The real Once UI MatrixFx renders simple dots at 24fps, masked from the top center. A CSS dot field is available before hydration. Motion stops when reduced motion is requested, the document is hidden or the field leaves the viewport. There is no visible motion toggle and no persisted preference.

Use a short hero entrance, quiet navigation and button responses, a height-based disclosure and short result/menu reveals. There is no typing animation or intentional lookup delay. Reduced motion removes animations and smooth scrolling. Keep visible focus, accessible names, keyboard submission, live status announcements and native links. The static portfolio remains readable without JavaScript; Spoor needs JavaScript to interact.

## Content and privacy

French, English and Spanish are complete equivalents with explicit language links. Language is not evidence of location. The public identity is Voldigoade only. Keep copy short and factual. Use the public profile voice: concrete technical habits and interests, without personality adjectives or a manifesto.

The document title is simply Voldigoade. Localized metadata descriptions describe the portfolio. The site remains statically rendered by Astro with a React island. No analytics, visitor database, external fonts, cookies or stored inputs. Only an explicit submission transmits a target to the public Spoor API. All provider credentials stay in the external backend.
