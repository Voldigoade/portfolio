---
version: alpha
name: Voldigoade
description: Interactive technical portfolio with a routed matrix field and visual project studies.
colors:
  background: '#0C1013'
  surface: '#141B20'
  text: '#EDF3F6'
  muted: '#A5B2BD'
  border: '#2B3942'
  primary: '#94D3E3'
  on-primary: '#0C1013'
typography:
  sans:
    fontFamily: 'IBM Plex Sans, Segoe UI, sans-serif'
  mono:
    fontFamily: 'SFMono-Regular, Consolas, Liberation Mono, monospace'
rounded:
  control: '12px'
  surface: '18px'
spacing:
  page-max: '70rem'
  section-gap: '7rem'
components:
  navigation:
    textColor: '{colors.muted}'
    backgroundColor: '{colors.surface}'
  button:
    textColor: '{colors.on-primary}'
    backgroundColor: '{colors.primary}'
  project:
    textColor: '{colors.text}'
  separator:
    backgroundColor: '{colors.border}'
  layers:
    textColor: '{colors.primary}'
---

# Voldigoade Design System

## Overview

A personal portfolio built around changing the scale of a problem. The visual signature is an ordered matrix with routed signals: a field around the identity, a research model to inspect, and a five-layer path that responds to selection. Work is visual and immediately accessible. Long methodology belongs on project pages.

This is a content site with isolated interactive visualizations. French is the default, English and Spanish are complete equivalents. Language is not evidence of location. No automatic locale detection. The public identity remains Voldigoade only.

The visual reference is the restraint and motion quality of the Once UI demo: centered hierarchy, fine background texture, negative space, small controls and controlled depth. The implementation is original native Canvas, SVG, CSS and TypeScript. No Once UI template or component code is copied. IBM Plex Sans is retained because its technical shapes work at the newly prominent display scale.

## Colors

The canonical tokens are the CSS custom properties in `src/styles/global.css`. This document mirrors the exact base values. `colors.{name}` maps directly to `--color-{name}`. Components consume those properties; Canvas reads the primary and text values once from computed CSS. The social preview generator reads the same stylesheet. Alpha variants, neutral border highlights and a lighter primary hover are derived surface treatments.

Dark graphite, near-white text, readable muted labels and one pale cyan primary. Local light falloff gives the research surface depth. No saturated purple gradient, giant glow or colorful sector coding. Forced colors preserve selected outlines and semantic content.

## Typography

Self-hosted IBM Plex Sans 400 and 500, with Latin coverage for all three locales. The name is the hero heading, up to 128px desktop and approximately 55px at 390px. The identity line is 24–36px. Small metadata uses native monospace. Body text remains 16px on detail pages. Control typography is explicit. The hero contains one identity line and a compact list of real areas, not a biography.

## Layout

Maximum width 70rem. Desktop gutters 3rem; below 1100px 2.5rem; below 740px 1.25rem. The hero fills most of the viewport and exposes the next project transition. The name is centered in the field, with clear primary and secondary actions.

Desktop navigation is a small fixed center surface; the mark and language control sit at the outer edges. Mobile keeps mark and languages at the top and moves the same section links to a bottom navigation surface with safe-area clearance. Interactive targets are at least 44px. Anchor margins account for the fixed header.

The research preview is one substantial surface, followed by a short caption and real project actions. Layer navigation is spatial, not a list. On mobile it becomes a two-row winding path with the same five choices. Detailed project and privacy routes keep the same shell and type system but allow longer reading.

## Elevation & Depth

Depth is confined to small navigation surfaces, the research preview and selected nodes. A low-opacity local gradient and thin borders separate surfaces. There is no full-site glass treatment or card grid. A schematic stack in the layer context represents the selected abstraction; it is native vector geometry rather than a decorative 3D object.

## Shapes

Controls use 12px corners; visual surfaces 18px; navigation and hero actions use a compact rounded geometry. Coordinate nodes remain square. Icons use a consistent 1.4–1.7px stroke, 18–24px size, currentColor, and are hidden from assistive technology. The restrained V mark is replaceable. No shield, lock, skull, technology logo or invented metric.

## Components

The source for concise homepage content is `src/data/experience.ts`. Project facts remain in `src/data/projects.ts`. Shared localized routes and metadata remain in `src/data/locales.ts` and `Layout.astro`.

`SignalField.astro` owns the hero visual. Its Canvas renderer runs at up to 60fps desktop and 30fps mobile, caps DPR at 1.75/1.5, uses deterministic fixed dots, and suspends offscreen or when the document is hidden. Pointer coordinates are read from input events with cached bounds; there are no per-frame layout reads. Static CSS/SVG fallbacks preserve the field without JavaScript.

`ResearchPreview.astro` is a structural model, not a result matrix. Four selections reveal the research question for identity, metadata, network and trust. The scope names are backed by the public research. No fabricated score, finding or unfinished-data skeleton. The component can be replaced by actual project media without changing project routing or the caption.

`Layers.astro` has one shared tab behavior with the research preview. Native links work without JavaScript. Enhancement adds tab semantics, roving focus, Arrow/Home/End/Space handling, linked panels and a selected path. Layer selection updates the hash, and language switching retains that state. All five contextual sections remain readable without enhancement. Selected state is shown by shape, text and ARIA as well as color.

Motion tokens: fast 180ms, state 360ms, entrance 700ms; easing `cubic-bezier(0.22, 1, 0.36, 1)`. One coordinated identity entrance, moving signal heads and selected path traversal establish life. Avoid repeated generic fade-up reveals. Motion state is shared by Canvas and CSS. A fixed accessible pause/resume button stops ambient motion; the system reduced-motion preference always wins. No motion preference, visitor identity or analytics is stored. Reduced motion renders a complete static design. Offscreen animation regions are paused through IntersectionObserver.

Navigation and language links use native anchors. Active navigation follows visible sections. Hover raises contrast and gives arrows a small directional shift. Focus uses a 2px primary outline with 6px offset. The motion button exposes its pressed state and localized action name. There are no async data calls, account states, forms or destructive visitor actions.

## Do's and Don'ts

- Make the work and interaction carry the identity before explanatory copy.
- Keep unknowns and research limitations visible on the project page.
- Share motion state, tab behavior, tokens and locale routing across surfaces.
- Keep the full composition understandable with motion reduced or JavaScript unavailable.
- Do not add fake telemetry, results, badges, stock imagery, terminal decoration or template sections.
- Do not introduce tracking, external fonts, unnecessary client APIs or identifying metadata.
