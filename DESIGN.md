---
version: alpha
name: Voldigoade
description: A compact technical identity shaped by movement between software, systems, networks and research.
colors:
  background: '#111417'
  surface: '#171C20'
  text: '#E9EDF0'
  muted: '#A5AFB7'
  border: '#343E46'
  accent: '#94BDD5'
  on-accent: '#111417'
typography:
  sans:
    fontFamily: 'IBM Plex Sans, Segoe UI, sans-serif'
  mono:
    fontFamily: 'SFMono-Regular, Consolas, Liberation Mono, monospace'
rounded:
  control: '2px'
spacing:
  page-max: '75rem'
  section-gap: '6rem'
components:
  navigation: {}
  button: {}
  project: {}
  trace: {}
---

# Voldigoade Design System

## Overview

An editorial systems interface for technical visitors reading actual work. The signature is a fine trace that changes level at a section boundary, echoed by offset paths through software, system, network and protocol. These paths express the subject without becoming a network diagram.

This is a content site, with no application dashboard or account flows. French is the default; English and Spanish are complete alternate versions. Languages identify the copy, not the author's location. No locale detection or automatic redirection.

Runtime CSS custom properties in `src/styles/global.css` are canonical. This document mirrors their accepted values. Colors map to `--color-{name}`, typography to `--font-sans` and `--font-mono`, spacing to `--page-max` and `--section-gap`, rounded.control to `--radius-control`. Shared layout and components consume those variables. The project tests verify token drift.

## Colors

Graphite background, neutral text and a single cool accent. The accent marks links, selected language, research status and a small part of the trace. Muted text remains readable. Borders establish structure, not emphasis. No gradients, glow, glass or alternating accent palettes. The public site has one dark theme. Forced colors follow system colors; print switches to paper contrast.

## Typography

Self-hosted IBM Plex Sans, 400 for body, 500 for headings and controls. Latin coverage supports all three locales. The font is licensed under OFL-1.1. Native monospace is reserved for compact metadata. Body 16px, lead 18px; headings use a restrained fluid scale. Line lengths stay below approximately 75 characters. No full-page monospace and no animated text.

## Layout

Maximum width 75rem, 3.5rem desktop gutters; 2.5rem below 1050px, 1.5rem below 740px and 1.125rem below 370px. Main sections are separated by open space and fine rules. Hero uses a text column and narrow trace column. Mobile brings the navigation onto its own visible row and reduces the trace to a compact strip. Research scope becomes a two-column list. Main links have approximately 44px targets.

## Elevation & Depth

No shadows, floating panels or nested cards. Text, spacing and border hierarchy carry the design. Native page scrolling remains visible with stable scrollbar space. There are no overlays or sticky surfaces.

## Shapes

Fine rules, open rows and 2px control corners. No pills, large rounded panels or decorative icons. The V mark is derived from the same fine-line geometry and remains replaceable.

## Components

Navigation is always visible. Languages use native anchors, their own language names and a current-page underline; switching preserves the equivalent route and section hash. Back links point to the work section. A primary action has an accent fill with background-colored text; secondary links have explicit text and an arrow. Hover increases contrast, focus uses a 2px accent outline with 6px offset, and active controls retain visible contrast.

Projects consume structured localized content from `src/data/projects.ts`. No fabricated project, metric or conclusion. Current public research is described as published and revisable. Method and limitations remain visible on the detail page. No form, select, modal, loading state or client data fetching is needed.

Arrows are 18px custom SVG, currentColor, 1.5px stroke, hidden from assistive technology. Traces are decorative and also hidden. Transitions last 160ms and only move the link arrow or change control colors. Reduced motion disables transitions and smooth scrolling. There is no continuous animation.

## Do's and Don'ts

- Lead with real work and show the boundary between evidence and claims.
- Preserve the same navigation, action vocabulary and spacing across locales and detail pages.
- Keep public identity limited to Voldigoade and intentionally public work.
- Do not add decorative terminal windows, badges, dashboards, fake data or technology logos.
- Do not introduce third-party scripts, remote fonts, analytics or cookies.
