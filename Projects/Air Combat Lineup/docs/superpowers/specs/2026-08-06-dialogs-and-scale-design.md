# Air Combat Lineup — dialogs, type scale and column widths

**Date:** 2026-08-06
**Status:** Approved design
**Builds on:** `2026-08-06-glass-theme-design.md` (visual system) and `2026-08-05-lineup-scheduler-design.md` (behaviour, data model, invariants — both unchanged).

## Goal

Four requested changes: larger text, equal-width player columns, the export moved from an inline panel into a modal, and the browser's native `confirm()` replaced by an in-app dialog everywhere.

## 1. Type scale

One step up across the app. Current → new:

| Element | Now | New |
|---|---|---|
| Base / body | 14px | 16px |
| Table cells, form controls | 12.5px | 14px |
| Column headers | 10px | 11px |
| Monospace account lines | 11px | 12.5px |
| Small buttons (rename, show/hide) | 10–11px | 12px |
| Page heading | 20px | 24px |

Vertical padding inside `field` grows from 3px to 6px so rows gain height rather than only cramming larger glyphs into the same box. The four player columns must still fit side by side without horizontal scrolling at 1440px wide.

## 2. Equal-width player columns

The schedule table becomes `table-fixed`. Explicit widths are set **only** on Min (76px), Opponent (150px) and the trailing delete column (36px). The four player columns are given no width, so `table-fixed` divides the remaining space equally between them by definition.

This is deliberately not hand-computed percentages: the columns must stay equal regardless of how long an account's email address is, and `table-fixed` guarantees that where percentage arithmetic would drift as the fixed columns change.

## 3. Export as a modal

The inline export panel is replaced by a modal dialog.

- Built on the native `<dialog>` element opened with `showModal()`. This provides Escape-to-close, focus trapping, and an inert backdrop natively rather than reimplementing them.
- Choosing a player from the toolbar's `Export schedule for…` dropdown opens the dialog. The dropdown stays as the selection mechanism.
- Contents: the player's name as a heading, the schedule in a `<pre>` with the same whitespace handling as now, a **Copy** button and a **Close** button.
- The rendered string and the string written to the clipboard remain one shared binding — that identity is a standing requirement, since the export is whitespace-sensitive.
- Closing by any route (Close, Escape, backdrop) resets the selection so the dropdown returns to its placeholder.

## 4. One reusable confirmation dialog

All five destructive actions stop using `confirm()` and use a shared `ConfirmDialog`:

| Component | Action |
|---|---|
| `Toolbar` | Clear all games |
| `TeamBlock` | Remove team (message names the game and account counts) |
| `PlayersPanel` | Remove a player |
| `AccountsPanel` | Delete an account |
| `GameTable` | Delete a game — only when it has at least one occupied slot |

Same `<dialog>` foundation. Takes a message, a confirm label, and a rose-tinted confirm button; cancel is the default focus.

**Consequence to handle carefully:** `confirm()` is synchronous and blocking, so the current call sites read `if (confirm(...)) { dispatch(...) }`. A dialog is not synchronous. Each call site changes to holding what is pending in component state, opening the dialog, and dispatching from its confirm callback. For the per-row cases (`PlayersPanel`, `AccountsPanel`, `GameTable`) the pending item's id must be held, and the dialog message must describe **that** row. Dispatching for the wrong row is the specific failure mode this design is exposed to, and it is what verification must rule out.

`prompt()` for team name and rename is out of scope and stays as it is.

## Verification

- `npm test` — the 64 existing tests still pass. They cover the pure logic layer and are unaffected.
- `npx tsc --noEmit` clean; `npm run build` succeeds.
- **Playwright interaction, not unit tests.** jsdom does not implement `HTMLDialogElement.showModal()`, so a Vitest component test would exercise a polyfill rather than the real element and prove little. Instead a headless Chromium run drives the real UI and asserts observable outcomes:
  1. Choosing a player opens the export dialog showing the correct `=====Name=====` text; Close resets the dropdown to its placeholder.
  2. Escape closes the export dialog.
  3. Clear all games opens the confirm dialog; cancelling leaves the games present; confirming removes them.
  4. Deleting a specific player, with several present, removes **that** player and no other — the wrong-row failure mode.
  5. Screenshots confirm the type scale is applied and the four player columns are equal width, measured from the DOM rather than judged by eye.
- No new runtime or dev dependency. Playwright is invoked ad hoc via `npx`.
