# Air Combat Lineup — blue glass theme

**Date:** 2026-08-06
**Status:** Approved design
**Supersedes:** the styling described in `2026-08-05-lineup-scheduler-design.md`. That document's behaviour, data model and invariants are unchanged and remain authoritative.

## Goal

Restyle the finished app with a brighter blue palette and a frosted-glass surface treatment, using Tailwind CSS. Presentation only — no behaviour changes.

## Scope

**In scope:** `src/index.css`, all nine files under `src/components/`, `src/App.tsx`, `index.html`, and the build config needed for Tailwind.

**Out of scope and explicitly not to be modified:** `src/logic/*` (and their tests), `src/store.tsx`, `src/api.ts`, `src/types.ts`, `server.js`. No component's props, state, event handlers, or dispatched actions change. All 64 tests must pass untouched.

## Setup

Tailwind v4 through the `@tailwindcss/vite` plugin. No `tailwind.config.js` and no PostCSS chain — v4 configures itself from CSS. `src/index.css` becomes an `@import "tailwindcss"` plus an `@theme` block and a small set of component utilities; every other rule currently in that file is deleted, its job taken over by utility classes on the components.

`@tailwindcss/vite` is added to `devDependencies`; nothing else is added.

## Visual system

### Backdrop

A fixed full-viewport layer behind the app:

- Base `#0b1533`.
- Two blurred radial blobs: blue `rgba(56,132,255,.75)` upper-left, violet `rgba(120,80,255,.6)` lower-right, each ~60px blur.
- `position: fixed` so scrolling a long team list does not drag the glow with it.

### Glass surface

One shared treatment, applied to panel containers only:

- `background: rgba(16,32,72,.55)`
- `backdrop-filter: blur(12px) saturate(140%)`
- `border: 1px solid rgba(120,170,255,.28)`
- `box-shadow: 0 4px 18px rgba(4,12,40,.35)`
- `border-radius: 12px`

**Performance constraint:** `backdrop-filter` is applied to panel containers only — never to table rows, cells, chips, or form controls. The number of blurred layers must stay proportional to the number of panels, not to the number of games. A page with six teams and thirty games must not produce more than a handful of blurred layers.

### Palette

| Role | Value |
|---|---|
| Primary text | `#e8f0ff` |
| Secondary text, column headers | `#9fc0ff` |
| Monospace (usernames, minute marks) | `#a9c8ff` |
| Primary action | gradient `#4d9bff` → `#2f6fe4`, white text |
| Destructive | rose, on hover only |
| Warn (validation banner) | amber rim and text |

### Semantics that must survive the restyle

- **Blocked options.** Disabled player and account entries carry labels like `Alex — Team B :10`. This is the app's core feedback — it must remain unmistakably unavailable and the label must remain legible. It must not become decorative or low-contrast.
- **Two distinct banners.** The validation-problems banner (amber) and the transient reducer message must stay visually distinct from each other and from ordinary panels.
- **Destructive actions** stay quiet at rest and turn rose on hover, so nothing in the resting UI reads as alarming.
- **Masked passwords** stay masked by default, with the show/hide control clearly operable.

### Form controls

Native `<select>` and `<input>` elements must be explicitly styled for the dark surface — background, text colour, border, and the dropdown indicator. Left unstyled they render as light-mode OS widgets on a dark panel, which is the most common way a dark restyle looks broken. Options inside a native `<select>` popup are OS-rendered and cannot be fully styled; the popup's own colour scheme is set via `color-scheme: dark` rather than fought.

## Carried-over fixes

Two previously deferred findings are closed as part of this work, since both live in the CSS being rewritten:

1. The clear-slot button gets a real focus-visible ring rather than relying on `opacity` plus `:hover`, so keyboard users can see what they have focused.
2. Long email usernames get a `title` attribute so the full value is reachable when the closed `<select>` truncates it.

## Verification

- `npm test` — 64 tests, unchanged and passing.
- `npx tsc --noEmit` — clean.
- `npm run build` — succeeds.
- **Screenshots.** A headless Chromium (Playwright, run ad hoc via `npx` — not added as a dependency) loads the running app against a seeded state file containing two teams, several players and accounts, and games at three minute marks, then captures: the full page; a team block with its accounts panel expanded; an open player dropdown showing a blocked entry with its label; and the export panel with rendered schedule text. These are inspected before the work is called done — the previous round shipped without anyone seeing the UI render, and that gap is not repeated.
- The seeded state file used for screenshots is temporary and must not be committed.
