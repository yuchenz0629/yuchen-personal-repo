# Dialogs, Type Scale and Column Widths — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Larger text, equal-width player columns, the export in a modal, and a shared in-app confirmation dialog replacing every `confirm()`.

**Architecture:** A single `Dialog` primitive wrapping the native `<dialog>` element (`showModal()` gives Escape, focus trapping and an inert backdrop for free), plus a `ConfirmDialog` built on it. Call sites move from synchronous `if (confirm(…))` to holding a pending item in state and dispatching from the dialog's confirm callback. Type scale and column widths are class changes.

**Tech Stack:** React 18, Tailwind v4. No new dependencies. Playwright invoked ad hoc via `npx` for verification.

## Global Constraints

- Working directory: `Projects/Air Combat Lineup/` in the clone at `~/Desktop/yuchen-personal-repo`, branch `air-combat-lineup`. Quote paths — the directory name has spaces. Never `git push`.
- Source of truth: `docs/superpowers/specs/2026-08-06-dialogs-and-scale-design.md`.
- Never modify `src/logic/*`, `src/store.tsx`, `src/api.ts`, `src/types.ts`, `server.js`. The 64 existing tests must pass untouched in every task.
- Available Tailwind utilities from the theme: `glass`, `field`, `btn`, `btn-primary`; colour tokens `text-ink`, `text-ink-dim`, `text-ink-mono`, `border-edge`, `border-edge-soft`.
- `backdrop-filter` stays on panel containers only. The dialog panel counts as a panel; its backdrop does not get its own blur beyond a plain dim.
- The export text rendered on screen and the text written to the clipboard must remain **one shared binding**. The export is whitespace-sensitive.
- `data/state.json` holds plaintext passwords, is gitignored, and must never be committed — nor any seed or backup of it.
- `prompt()` for team name and rename stays as it is. Out of scope.
- Conventional Commits. Commit after every task.

---

### Task 1: Dialog primitive and ConfirmDialog

**Files:**
- Create: `src/components/Dialog.tsx`, `src/components/ConfirmDialog.tsx`

**Interfaces:**
- Consumes: nothing beyond React
- Produces:
  - `Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode })`
  - `ConfirmDialog({ open, message, confirmLabel, onConfirm, onCancel }: { open: boolean; message: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void })`

Nothing renders these yet — Tasks 4 and 5 wire them up.

- [ ] **Step 1: Write the Dialog primitive**

Create `src/components/Dialog.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/**
 * Modal built on the native <dialog>. showModal() gives Escape-to-close,
 * focus trapping and an inert backdrop without reimplementing them.
 */
export function Dialog({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={event => {
        // A click landing on the <dialog> itself is the backdrop; the panel
        // inside stops propagation, so this cannot fire from panel content.
        if (event.target === ref.current) onClose()
      }}
      className="m-auto max-w-[min(92vw,640px)] bg-transparent p-0 text-ink backdrop:bg-[rgba(4,10,30,.62)]"
    >
      <div className="glass p-4" onClick={event => event.stopPropagation()}>
        {children}
      </div>
    </dialog>
  )
}
```

Note `onClose` on the `<dialog>` fires for Escape as well as programmatic `close()`, so Escape is handled without a key listener.

- [ ] **Step 2: Write ConfirmDialog**

Create `src/components/ConfirmDialog.tsx`:

```tsx
import { Dialog } from './Dialog'

export function ConfirmDialog({
  open,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <p className="m-0 mb-4 text-[15px] leading-relaxed">{message}</p>
      <div className="flex justify-end gap-2">
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="btn border-rose-400/50 bg-rose-500/25 text-rose-100 hover:bg-rose-500/40"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  )
}
```

Cancel is listed first so it takes initial focus — the safe default for a destructive prompt.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: clean, 64 passing, build succeeds. Nothing renders these components yet, so the app is visually unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/components/Dialog.tsx src/components/ConfirmDialog.tsx
git commit -m "feat: add dialog primitive and reusable confirm dialog"
```

---

### Task 2: Type scale

**Files:**
- Modify: `src/index.css`, `src/App.tsx`, `src/components/Toolbar.tsx`, `src/components/TeamBlock.tsx`, `src/components/PlayersPanel.tsx`, `src/components/AccountsPanel.tsx`, `src/components/GameTable.tsx`, `src/components/SlotCell.tsx`

**Interfaces:**
- Consumes: the existing theme
- Produces: the larger scale every later task inherits

- [ ] **Step 1: Raise the base**

In `src/index.css`:
- `body`'s `font-size` from `14px` to `16px`.
- The `field` utility: `font-size` from `11.5px` to `14px`, and `padding` from `3px 7px` to `6px 8px`.
- The `btn` and `btn-primary` utilities: `font-size` from `12px` to `14px`, `padding` from `4px 11px` to `6px 12px`.

Change nothing else in that file — not the colours, the backdrop, or the `glass` utility.

- [ ] **Step 2: Raise the per-element sizes**

Across the seven component files, apply these substitutions to `className` strings. Each is a literal text replacement of a Tailwind arbitrary-size class:

| Find | Replace | Where |
|---|---|---|
| `text-[10px]` | `text-[11px]` | column headers, small labels |
| `text-[11px]` | `text-[12px]` | small buttons — apply AFTER the row above, or you will double-promote |
| `text-[11.5px]` | `text-[14px]` | any remaining control text |
| `text-[12px]` | `text-[13px]` | chips and secondary labels |
| `text-[12.5px]` | `text-[14px]` | table text, banners, the export `<pre>` |
| `text-[13px]` | `text-[14px]` | accounts table |
| `text-[15px]` | `text-[17px]` | panel headings (`h2`) |
| `text-xl` | `text-2xl` | the page `<h1>`, both occurrences |

**Order matters.** Applying these as blind sequential find-and-replace will double-promote sizes — for example `text-[10px]` → `text-[11px]` and then that result → `text-[12px]`. Work out the final value for each occurrence first, then apply one pass. State in your report how you avoided double-promotion.

Also in `SlotCell.tsx`, the account select's `text-[11px]` becomes `text-[12.5px]` (monospace account lines), which is a different target from the generic `text-[11px]` → `text-[12px]` rule above. Handle it explicitly.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: clean, 64 passing, build succeeds.

Then grep the components for any remaining `text-[1[012]` sizes and list what you find with its context, so the reviewer can confirm nothing was missed or over-applied.

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/App.tsx src/components
git commit -m "feat: raise type scale one step"
```

---

### Task 3: Equal-width player columns

**Files:**
- Modify: `src/components/GameTable.tsx`

**Interfaces:**
- Consumes: nothing new

- [ ] **Step 1: Make the table fixed-layout**

On the schedule `<table>`, add `table-fixed` to its existing classes.

- [ ] **Step 2: Set widths on the three non-player columns only**

- The `Min` `<th>`: add `w-[76px]`
- The `Opponent` `<th>`: add `w-[150px]`
- The trailing empty `<th>` (above the row-delete button): add `w-[36px]`
- The four player `<th>` elements: **no width class at all.**

With `table-fixed`, columns without a specified width share the remaining space equally — that is what makes the four player columns equal, and it stays true no matter how long an account email is. Do not add percentage widths; they would drift if the fixed columns ever change.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: clean, 64 passing, build succeeds.

Column equality is measured from the DOM in Task 6, not by eye here.

- [ ] **Step 4: Commit**

```bash
git add src/components/GameTable.tsx
git commit -m "feat: give the four player columns equal width"
```

---

### Task 4: Export in a modal

**Files:**
- Modify: `src/components/Toolbar.tsx`

**Interfaces:**
- Consumes: `Dialog` from Task 1

- [ ] **Step 1: Replace the inline panel with a dialog**

In `Toolbar.tsx`:

- Keep `exportFor`, `exportable`, `selectedPlayer`, `selectValue` and `scheduleText` exactly as they are. In particular keep `scheduleText` as the single binding used both for display and for the clipboard write — do not introduce a second derivation.
- Remove the inline `{selectedPlayer && (<div className="export-panel …">…</div>)}` block and the `export-panel` wrapper.
- Render instead, at the end of the component's markup:

```tsx
<Dialog open={selectedPlayer !== undefined} onClose={() => setExportFor('')}>
  <h2 className="m-0 mb-3 text-[17px] font-semibold text-white">
    {selectedPlayer?.name}
  </h2>
  <pre className="m-0 mb-4 max-h-[60vh] overflow-auto font-mono text-[14px] leading-relaxed whitespace-pre-wrap break-all text-ink">
    {scheduleText}
  </pre>
  <div className="flex justify-end gap-2">
    <button className="btn-primary" onClick={copy}>
      {copied ? 'Copied' : 'Copy'}
    </button>
    <button className="btn" onClick={() => setExportFor('')}>
      Close
    </button>
  </div>
</Dialog>
```

`whitespace-pre-wrap` and `break-all` are load-bearing — the export is whitespace-sensitive and contains long emails. `max-h-[60vh] overflow-auto` keeps a long schedule scrollable inside the dialog instead of overflowing the viewport.

- Setting `exportFor` to `''` on close makes `selectedPlayer` undefined, which both closes the dialog and returns the dropdown to its placeholder. Do not add separate open state — one source of truth.
- Leave `clearAll` alone in this task; Task 5 converts it.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: clean, 64 passing, build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Toolbar.tsx
git commit -m "feat: move player schedule export into a modal dialog"
```

---

### Task 5: Replace every confirm() with ConfirmDialog

**Files:**
- Modify: `src/components/Toolbar.tsx`, `src/components/TeamBlock.tsx`, `src/components/PlayersPanel.tsx`, `src/components/AccountsPanel.tsx`, `src/components/GameTable.tsx`

**Interfaces:**
- Consumes: `ConfirmDialog` from Task 1

This is the riskiest task in the plan. `confirm()` is synchronous; a dialog is not. Every call site changes shape.

**The pattern.** For a single action (Toolbar, TeamBlock), hold a boolean:

```tsx
const [confirming, setConfirming] = useState(false)
```

For a per-row action (PlayersPanel, AccountsPanel, GameTable), hold the pending row's id:

```tsx
const [pendingId, setPendingId] = useState<Id | null>(null)
```

The row's button sets the id instead of dispatching. One `ConfirmDialog` is rendered per component — **not one per row** — with `open={pendingId !== null}`, its message derived from the pending row, and its confirm callback dispatching for that id then clearing it. Cancel clears the id without dispatching.

**The failure mode to avoid:** dispatching for the wrong row. Derive the message and the dispatched id from the same `pendingId` lookup, never from a captured loop variable.

- [ ] **Step 1: Toolbar — clear all games**

Replace the `confirm()` in `clearAll` with `setConfirming(true)` (return early when `state.games.length === 0`, as now). Render:

```tsx
<ConfirmDialog
  open={confirming}
  message={`Delete all ${state.games.length} game(s)? Teams, players and accounts are kept.`}
  confirmLabel="Delete all games"
  onConfirm={() => {
    dispatch({ type: 'clearAllGames' })
    setExportFor('')
    setConfirming(false)
  }}
  onCancel={() => setConfirming(false)}
/>
```

- [ ] **Step 2: TeamBlock — remove team**

Replace the `confirm()` in `remove` with `setConfirming(true)`. The message keeps the counts it already computes: `` `Remove ${team.name}? This deletes ${gameCount} game(s) and ${accountCount} account(s).` ``. Confirm label `Remove team`. On confirm, dispatch `removeTeam` then clear the flag.

- [ ] **Step 3: PlayersPanel — remove player**

The chip's `×` sets `setPendingId(player.id)` instead of confirming. Render one `ConfirmDialog` with the pending player looked up from `state.players`, message `` `Remove ${pendingPlayer.name}? They will be cleared from any game they are in.` ``, confirm label `Remove player`, dispatching `removePlayer` for `pendingId`.

Guard the message against the player having vanished between opening and rendering — fall back to a generic wording rather than crashing on `undefined`.

- [ ] **Step 4: AccountsPanel — delete account**

Same shape. Message `` `Delete account ${account.username || '(unnamed)'}? It will be cleared from any game using it.` ``, confirm label `Delete account`, dispatching `removeAccount`. Look the account up from the panel's already-filtered team accounts.

- [ ] **Step 5: GameTable — delete a filled game**

Currently the row `×` confirms only when the game has an occupied slot, and deletes outright otherwise. Preserve that exactly: if the game has no occupied slot, dispatch `removeGame` immediately with no dialog. Otherwise set `pendingId` and let the dialog handle it. Message `Delete this game? Its player and account assignments will be lost.`, confirm label `Delete game`.

- [ ] **Step 6: Confirm no `confirm()` survives**

Run: `grep -rn "confirm(" src/components/` — the only matches should be `ConfirmDialog` usages and the word inside identifiers such as `setConfirming` or `onConfirm`. There must be no remaining call to the global `confirm()`. Paste the grep output into your report.

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: clean, 64 passing, build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/components
git commit -m "feat: replace native confirms with in-app confirm dialog"
```

---

### Task 6: Interaction and visual verification

**Files:**
- Create then delete: a temporary seed file and a temporary Playwright script (neither committed)

**Interfaces:**
- Consumes: the finished UI

No production changes, except a single-class correction if you find one — and say so prominently if you make one.

- [ ] **Step 1: Back up any real state**

If `data/state.json` exists, copy it aside first; restore it at Step 5. It holds real credentials. Never commit it or the backup.

- [ ] **Step 2: Seed state**

Write a `data/state.json` with two teams, five players, four accounts on team A and three on team B with long realistic email usernames, and four games — two at `:10` on different teams, one at `:30`, one at `:50` — with the `:10` games filled so a player booked in one is blocked in the other. Exactly four slots per game; one slot left empty; one game with an empty opponent.

- [ ] **Step 3: Drive the real UI**

Start the app, then with a throwaway script run via `npx playwright@1.62.1` (browsers are already cached; do NOT add Playwright to `package.json`), assert each of these against the running app and report the actual result of each:

1. **Export opens.** Choose a player in `Export schedule for…`. A dialog appears containing `=====<name>=====` and the expected `:MM vs Opponent` lines.
2. **Close resets.** Click Close. The dialog goes away and the dropdown shows its placeholder again, not the player's name.
3. **Escape closes.** Reopen, press Escape, confirm it closes and the dropdown resets.
4. **Cancel is safe.** Click `Clear all games`, then Cancel. Assert the number of game rows is unchanged.
5. **Confirm works.** Click `Clear all games`, then the confirm button. Assert zero game rows remain.
6. **The right row is deleted.** Reload to restore the seed. With five players in the roster, click the `×` on the third chip and confirm. Assert that exactly that player is gone and the other four remain, by name. This is the wrong-row failure mode and the single most important assertion here.
7. **Columns are equal.** Measure the four player `<th>` bounding boxes from the DOM and assert their widths are equal within 1px. Report the measured numbers.
8. **Type scale applied.** Read the computed `font-size` of the body and of a table cell; report both.

- [ ] **Step 4: Screenshots**

Capture at 1600×1000 into the system temp directory: the full page, the export dialog open, and the confirm dialog open. Look at each and describe what you actually see — glass rendering, legibility, clipping, whether the dialog is centred and its backdrop dims the page, and whether anything looks unstyled. "Looks fine" is not a report.

- [ ] **Step 5: Clean up**

Delete the temporary script; restore the state backup or delete the seeded file; remove the backup. Run `git status --short` and confirm it is clean with no `data/` entries.

- [ ] **Step 6: Report**

Every assertion from Step 3 with its actual result, the measurements, the screenshot descriptions, and any defect found with severity. If an assertion could not be run, say so plainly rather than omitting it.

---

## Self-Review Notes

- Every spec item maps to a task: type scale → Task 2; equal columns → Task 3; export modal → Tasks 1 and 4; confirm dialogs → Tasks 1 and 5; verification → Task 6.
- The wrong-row dispatch risk the spec calls out is addressed structurally in Task 5 (one dialog per component keyed on a pending id, never a captured loop variable) and verified behaviourally in Task 6 assertion 6.
- The whitespace-sensitivity requirement is restated at both places the `<pre>` classes appear (Task 4) and in the Global Constraints.
- Task 2's find-and-replace table carries an explicit double-promotion warning, which is the obvious way that task goes wrong.
- No new dependency is introduced anywhere; Playwright is `npx`-only in Task 6.
