# Blue Glass Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the finished Air Combat Lineup app with a brighter blue palette and frosted-glass surfaces using Tailwind CSS v4, changing presentation only.

**Architecture:** Tailwind v4 via the `@tailwindcss/vite` plugin — no config file, no PostCSS chain. `src/index.css` holds an `@theme` palette, base styles including the fixed gradient backdrop, and four shared `@utility` definitions (`glass`, `field`, `btn`, `btn-primary`). Components carry Tailwind utility classes plus those four shared utilities. Every hand-written rule currently in `index.css` is deleted.

**Tech Stack:** Tailwind CSS v4, `@tailwindcss/vite`. Playwright is used ad hoc via `npx` for screenshots and is NOT added to the project.

## Global Constraints

- Working directory: `Projects/Air Combat Lineup/` in the `yuchen-personal-repo` clone at `~/Desktop/yuchen-personal-repo`, branch `air-combat-lineup`. Quote paths — the directory name contains spaces. Never `git push`.
- Source of truth: `docs/superpowers/specs/2026-08-06-glass-theme-design.md`.
- **Presentation only.** No component's props, state, event handlers, or dispatched actions change. Never modify `src/logic/*`, `src/store.tsx`, `src/api.ts`, `src/types.ts`, or `server.js`. All 64 tests must pass untouched — if a test fails, you changed behaviour.
- `backdrop-filter` goes on panel containers only — never on table rows, cells, chips, or form controls.
- Blocked player/account options must stay unmistakably unavailable with their `Alex — Team B :10` labels legible. This is the app's core feedback.
- `data/state.json` holds plaintext passwords, is gitignored, and must never be committed. Any seeded state file used for screenshots is temporary and must be deleted.
- Conventional Commits. Commit after every task.

## Shared class vocabulary

Defined once in Task 1, used by Tasks 2–5:

| Utility | Purpose |
|---|---|
| `glass` | Frosted panel container: translucent blue fill, 12px blur, blue rim, soft shadow, 12px radius |
| `field` | `<select>` and `<input>` on a dark panel |
| `btn` | Default button: subtle translucent fill |
| `btn-primary` | Bright blue gradient action button |

Colour tokens from `@theme`: `text-ink` (`#e8f0ff`), `text-ink-dim` (`#9fc0ff`), `text-ink-mono` (`#a9c8ff`).

---

### Task 1: Tailwind setup, theme tokens and backdrop

**Files:**
- Modify: `package.json`, `vite.config.ts`, `src/index.css`

**Interfaces:**
- Consumes: nothing
- Produces: the `glass`, `field`, `btn`, `btn-primary` utilities and the `ink` colour tokens that Tasks 2–5 depend on; the fixed gradient backdrop

- [ ] **Step 1: Install Tailwind**

Run: `npm install -D tailwindcss @tailwindcss/vite`

- [ ] **Step 2: Register the Vite plugin**

In `vite.config.ts`, import `tailwindcss from '@tailwindcss/vite'` and add `tailwindcss()` to the `plugins` array after `react()`. Change nothing else — the `server.port` and the `/api` proxy to `localhost:5174` must stay exactly as they are.

- [ ] **Step 3: Replace `src/index.css` entirely**

Delete the whole current contents and write:

```css
@import "tailwindcss";

@theme {
  --color-ink: #e8f0ff;
  --color-ink-dim: #9fc0ff;
  --color-ink-mono: #a9c8ff;
  --color-edge: rgba(120, 170, 255, 0.28);
  --color-edge-soft: rgba(140, 180, 255, 0.12);
}

@layer base {
  :root {
    color-scheme: dark;
  }

  body {
    margin: 0;
    padding: 24px 20px 56px;
    min-height: 100vh;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    font-size: 14px;
    color: var(--color-ink);
    background-color: #0b1533;
  }

  /* Fixed so the glow does not drag when a long team list scrolls. */
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
      radial-gradient(760px 620px at 10% -10%, rgba(56, 132, 255, 0.75), transparent 68%),
      radial-gradient(680px 560px at 94% 110%, rgba(120, 80, 255, 0.6), transparent 68%);
  }

  :where(button, select, input, a, [tabindex]):focus-visible {
    outline: 2px solid #6fa8ff;
    outline-offset: 2px;
    border-radius: 6px;
  }
}

/* Panel containers only — never rows, cells, chips or controls. */
@utility glass {
  background: rgba(16, 32, 72, 0.55);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  border: 1px solid var(--color-edge);
  box-shadow: 0 4px 18px rgba(4, 12, 40, 0.35);
  border-radius: 12px;
}

@utility field {
  width: 100%;
  padding: 3px 7px;
  font-size: 11.5px;
  border-radius: 7px;
  color: var(--color-ink);
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(160, 200, 255, 0.22);
}

@utility btn {
  padding: 4px 11px;
  font-size: 12px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-ink);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@utility btn-primary {
  padding: 4px 11px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(180deg, #4d9bff, #2f6fe4);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 10px rgba(45, 110, 230, 0.5);
}

@layer components {
  .btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.16);
  }
  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .btn-primary:hover {
    background: linear-gradient(180deg, #5aa4ff, #3a79ee);
  }
  .field option {
    background: #14264f;
    color: var(--color-ink);
  }
}
```

- [ ] **Step 4: Verify the build wires Tailwind in**

Run: `npm run build`
Expected: succeeds. Then confirm Tailwind actually emitted CSS — inspect the built stylesheet under `dist/assets/` and check it contains the `backdrop-filter` declaration from the `glass` utility. If the file has no Tailwind output, the plugin is not wired up; fix that before continuing.

Run: `npm test` and `npx tsc --noEmit`
Expected: 64 passing, no type errors. The app will look broken at this point — components still reference deleted class names. That is expected and Tasks 2–5 fix it.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/index.css
git commit -m "feat: add tailwind v4 with blue glass theme tokens"
```

---

### Task 2: App shell and banners

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `glass`, `btn` from Task 1
- Produces: the page shell every other component renders inside

Work from the actual file and map by the existing class name. Do not change any logic, condition, hook, or handler — only `className` values and, where noted, wrapper elements.

- [ ] **Step 1: Restyle the shell**

- The `<h1>` (appears twice — in the error branch and the main branch): `className="mb-4 text-xl font-semibold tracking-tight text-white"`. Both must match.
- Wrap the main branch's content — everything from the datalist to `<PlayersPanel />` — in `<div className="mx-auto max-w-[1400px]">`. Do the same for the error branch's content. This stops the layout stretching absurdly wide on a large monitor.
- `className="banner warn"` (both occurrences) → `className="mb-3 rounded-xl border border-amber-400/50 bg-amber-400/10 px-3 py-2.5 text-[12.5px] text-amber-200"`
- `className="banner"` (the transient message) → `className="glass mb-3 flex items-center gap-3 px-3 py-2.5 text-[12.5px]"`
- The `<ul>` inside either warn banner: `className="mt-1.5 list-disc pl-[18px] space-y-0.5"`
- The dismiss `<button className="link">` → `className="btn ml-auto shrink-0"`
- `className="muted"` on the no-teams paragraph → `className="text-ink-dim"`
- Leave the `<datalist>` exactly where it is and do not style it — it is never rendered visually.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors, 64 passing.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: restyle app shell and banners for glass theme"
```

---

### Task 3: Toolbar and export panel

**Files:**
- Modify: `src/components/Toolbar.tsx`

**Interfaces:**
- Consumes: `glass`, `field`, `btn`, `btn-primary` from Task 1

- [ ] **Step 1: Restyle**

- `className="toolbar-wrap"` → `className="mb-4"`
- `className="toolbar"` → `className="glass flex flex-wrap items-center gap-2 px-3 py-2.5"`
- The `+ Add team` button → `className="btn-primary"`
- `className="spacer"` → `className="ml-auto"`
- The export `<select>` → `className="field w-auto min-w-[190px]"`
- The `Clear all games` button → `className="btn"`
- `className="export-panel"` → `className="glass mt-2 px-3 py-3"`
- `className="export-text"` on the `<pre>` → `className="m-0 mb-2 overflow-x-auto font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap break-all text-ink"`

  The `whitespace-pre-wrap` and `break-all` are load-bearing: the export is whitespace-sensitive and contains long email addresses. Losing either breaks the feature.
- `className="add-row"` in the export panel → `className="flex gap-2"`
- The `Copy` button → `className="btn-primary"`
- The `close` button → `className="btn"`

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors, 64 passing.

- [ ] **Step 3: Commit**

```bash
git add src/components/Toolbar.tsx
git commit -m "feat: restyle toolbar and export panel for glass theme"
```

---

### Task 4: Team block, players panel and accounts panel

**Files:**
- Modify: `src/components/TeamBlock.tsx`, `src/components/PlayersPanel.tsx`, `src/components/AccountsPanel.tsx`

**Interfaces:**
- Consumes: `glass`, `field`, `btn`, `btn-primary` from Task 1

- [ ] **Step 1: TeamBlock**

- `className="block"` → `className="glass mb-3.5 px-3 py-3"`
- `className="block-header"` → `className="mb-2 flex flex-wrap items-center gap-2.5"`
- The `<h2>` team name → `className="m-0 text-[15px] font-semibold text-white"`
- The accounts toggle `<button className="link">` → `className="btn text-[11px] text-ink-dim"`
- `className="spacer"` → `className="ml-auto"`
- The `rename` button → `className="btn text-[11px]"`
- The `remove team` button (`link danger-text`) → `className="btn text-[11px] hover:border-rose-400/50 hover:bg-rose-500/20 hover:text-rose-200"`
- The `+ Add game` button → `className="btn-primary mt-2"`

- [ ] **Step 2: PlayersPanel**

- `className="block"` → `className="glass mb-3.5 px-3 py-3"`
- `className="block-header"` → `className="mb-2 flex flex-wrap items-center gap-2.5"`
- The `<h2>` → `className="m-0 text-[15px] font-semibold text-white"`
- `className="muted"` → `className="text-[11px] text-ink-dim"`
- `className="chips"` → `className="mb-2 flex flex-wrap gap-1.5"`
- `className="chip"` → `className="inline-flex items-center gap-1 rounded-full border border-edge bg-white/8 py-0.5 pl-2.5 pr-1 text-[12px]"`
- The chip's delete `<button className="danger">` → `className="rounded-full px-1 leading-none opacity-50 hover:text-rose-300 hover:opacity-100"`
- `className="add-row"` → `className="flex gap-2"`
- The name `<input>` → `className="field w-auto min-w-[170px]"`
- The `+ Add player` button → `className="btn-primary"`

- [ ] **Step 3: AccountsPanel**

This panel sits *inside* the already-glass TeamBlock. Do not give it its own `glass` — nesting `backdrop-filter` is exactly the layering the spec forbids.

- `className="accounts-panel"` → `className="mb-2.5 rounded-lg border border-dashed border-edge bg-black/15 p-2"`
- `className="schedule"` on the table → `className="w-full border-collapse text-[13px]"`
- Every `<th>` → `className="border-b border-edge px-1.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-dim"`
- Every `<td>` → `className="border-b border-edge-soft px-1.5 py-1.5 align-top"`
- The username, password and note `<input>`s → `className="field"`
- The `show`/`hide` toggle button → `className="btn mt-1 text-[10px]"`
- The row delete `<button className="danger">` → `className="opacity-50 hover:text-rose-300 hover:opacity-100"`
- `className="empty-row"` → `className="italic text-ink-dim"`
- The `+ Add account` button → `className="btn-primary mt-2"`

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm test`
Expected: no type errors, 64 passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/TeamBlock.tsx src/components/PlayersPanel.tsx src/components/AccountsPanel.tsx
git commit -m "feat: restyle team block and panels for glass theme"
```

---

### Task 5: Game table and slot cell

**Files:**
- Modify: `src/components/GameTable.tsx`, `src/components/SlotCell.tsx`

**Interfaces:**
- Consumes: `field`, `btn` from Task 1

This is the densest surface in the app and the one carrying the clash feedback. Take extra care that disabled options stay readable.

- [ ] **Step 1: GameTable**

- `className="schedule"` → `className="w-full border-collapse text-[12.5px]"`
- Every `<th>` → `className="border-b border-edge px-1.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-dim"`
- Every `<td>` that is not a `SlotCell` → `className="border-b border-edge-soft px-1.5 py-1.5 align-top"`
- The minute `<select>` → `className="field w-auto font-mono text-ink-mono"`
- The opponent `<input>` → `className="field"`
- The row delete `<button className="danger">` → `className="opacity-50 hover:text-rose-300 hover:opacity-100"`
- `className="empty-row"` → `className="italic text-ink-dim"`

- [ ] **Step 2: SlotCell**

- `className="slot-cell"` on the `<td>` → `className="group relative min-w-[150px] border-b border-edge-soft px-1.5 py-1.5 align-top"`
- The player `<select>` → `className="field mb-1"`
- The account `<select>` (currently `account-select`) → `className="field font-mono text-[11px] text-ink-mono"`
- The clear `<button className="clear-slot">` → `className="absolute right-0.5 top-0.5 rounded px-1 text-[13px] leading-none opacity-0 transition-opacity group-hover:opacity-60 focus-visible:opacity-100 hover:text-rose-300 hover:opacity-100"`

  The `group` on the `<td>` plus `group-hover` reproduces the old `:hover` reveal. `focus-visible:opacity-100` is the carried-over fix — a keyboard user can now see the control they have focused. Both must be present.

- [ ] **Step 3: Keep blocked options legible**

Add to the `@layer components` block in `src/index.css`:

```css
  .field option:disabled {
    color: #7f93bf;
    font-style: italic;
  }
```

Native `<select>` popups are OS-rendered and only partially styleable. Note in your report how the disabled entries actually appeared in your screenshots — if they are illegible or indistinguishable from enabled ones on this platform, say so plainly rather than assuming the CSS took effect.

- [ ] **Step 4: Add the title attribute for long usernames**

On the account `<select>` in `SlotCell.tsx`, add `title={...}` resolving to the selected account's username, or `undefined` when no account is selected. This closes a previously deferred finding: a long email truncated in the closed select is otherwise unreachable. Derive it from data already available in the component — do not add a new store lookup or change any hook.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm test && npm run build`
Expected: no type errors, 64 passing, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/GameTable.tsx src/components/SlotCell.tsx src/index.css
git commit -m "feat: restyle game table and slot cells for glass theme"
```

---

### Task 6: Screenshot verification

**Files:**
- Create then delete: a temporary seed file and a temporary Playwright script (neither is committed)

**Interfaces:**
- Consumes: the finished UI from Tasks 1–5
- Produces: screenshots proving the app renders, plus a report on what they show

No production file changes. If you find a visual defect, report it — do not fix it unless it is a one-line class correction, and say so explicitly if you do.

- [ ] **Step 1: Back up any real state file**

If `data/state.json` exists, copy it to `data/state.json.backup-before-screenshots` first. You are about to overwrite it with seed data. Restore it at Step 5. Never commit either file.

- [ ] **Step 2: Seed a realistic state**

Write a `data/state.json` containing: two teams (`Team A`, `Team B`); five players; four accounts on Team A and three on Team B, with realistic long email usernames (e.g. `rzcloud07@gmail.com`) and passwords; and four games — two at `:10` on different teams, one at `:30`, one at `:50` — with the `:10` games filled so at least one player is booked at that minute in one game and therefore blocked in the other. One slot must be left empty and one game must have an empty opponent. Use `crypto.randomUUID()`-shaped ids and exactly four slots per game.

Sanity-check it loads: start the server, `curl -s localhost:5174/api/state | head -c 200`, and confirm it returns your document.

- [ ] **Step 3: Capture screenshots**

Start the app (`npm run dev`), wait for Vite to report ready, then drive a headless Chromium with a throwaway script run via `npx playwright@1.62.1` — do NOT add Playwright to `package.json`. Capture at 1600×1000 into a temporary directory outside the repo (use the system temp dir):

1. `full-page.png` — the whole page.
2. `team-expanded.png` — a team block with its accounts panel expanded, passwords masked.
3. `dropdown-blocked.png` — an open player dropdown in the second `:10` game, showing a blocked entry with its `Name — Team X :10` label. If the OS renders the popup outside the page and it cannot be captured, say so and instead capture the closed select plus report what the DOM shows for the disabled `<option>` (its text and `disabled` attribute).
4. `export-panel.png` — the export panel open with rendered schedule text.

Then **look at each image** and describe what you actually see.

- [ ] **Step 4: Report what the screenshots show**

For each image, state plainly: does the glass effect render; is text legible; is anything clipped, overlapping, or unstyled; do the form controls look native-light or correctly dark; are the blocked options distinguishable. Be specific and honest — "looks fine" is not a report. Attach the image paths.

- [ ] **Step 5: Clean up**

Delete the temporary script and screenshots' seed data: restore `data/state.json` from the backup if you made one, otherwise delete the seeded `data/state.json`. Remove the backup file. Run `git status --short` and confirm it is clean with no `data/` entries.

- [ ] **Step 6: Commit**

Only if you made a one-line visual correction. Otherwise there is nothing to commit — say so.

---

## Self-Review Notes

Checked against the spec:

- Tailwind v4 via the Vite plugin, no config file — Task 1.
- Fixed gradient backdrop, glass surface values, palette, form-control styling — Task 1.
- `backdrop-filter` confined to panel containers: `glass` is applied only in Tasks 2–4 to the toolbar, banners, export panel, team blocks and players panel. Task 4 Step 3 explicitly forbids it on the nested accounts panel, and Task 5 applies it nowhere.
- Blocked-option legibility — Task 5 Step 3, with an honesty requirement about what the platform actually renders.
- Both carried-over fixes: the focus-visible ring (Task 1 base layer plus Task 5 Step 2) and the `title` attribute (Task 5 Step 4).
- Screenshot verification with the seed shape the spec asks for — Task 6.
- The out-of-scope file list is repeated in Global Constraints and enforced by the 64 tests staying green in every task.
