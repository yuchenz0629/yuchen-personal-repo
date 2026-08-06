# Lineup — air combat game account scheduler

**Date:** 2026-08-05
**Status:** Approved design

## Problem

An air combat game runs matches on ten-minute marks (`:00, :10, :20, :30, :40, :50`). Each match needs four players. We field several teams — five or six — and a team can have more than one match running at the same minute mark. Each team owns a pool of game accounts, and a player plays a match by logging into one of them.

Two constraints make this fiddly to track by hand:

- A person can only be in one match at a given minute mark.
- An account can only be used by one person at a given minute mark, and only for the team that owns it.

After the lineup is set, each player needs to be told, individually, which minute marks they play, against whom, and with which credentials.

This app manages that: enter teams, players, accounts and matches on one page; the app makes clashes unselectable; export a per-player schedule to send them.

## Scope

Single user (the person organising the lineup), running locally. Small data — a handful of teams, a few dozen accounts, a few matches at a time.

**In scope:** teams, players, accounts, matches, clash prevention, per-player text export.

**Out of scope:** opponent rosters or opponent player identities (an opponent is only a name), match results or scoring, dates and history, multi-user access, authentication, auto-assignment of lineups.

## Architecture

Vite + React + TypeScript front end, with a small Express server behind it.

The server does exactly two things:

- `GET /api/state` — return `data/state.json` (or a seeded empty state if absent)
- `PUT /api/state` — overwrite `data/state.json` with the posted document

All logic lives client-side; the server is a persistence pipe. `npm run dev` starts both (Vite proxies `/api` to Express). Saves are debounced ~500ms after any edit and write the whole document. Single user, so no locking or merge handling.

Rejected alternatives: browser-only localStorage (data tied to one browser profile, no better for credential safety, easy to lose); a hosted app with a database (needs auth, puts credentials on a server, unwarranted at this scale). A single JSON file can be opened, backed up and hand-edited, which suits the data volume.

Credentials are stored in plain text in `data/state.json` on the user's own machine. This is deliberate and acceptable for a local single-user tool; the file must not be committed to version control.

## Data model

`data/state.json`:

```jsonc
{
  "teams":    [{ "id": "t1", "name": "Team A" }],
  "players":  [{ "id": "p1", "name": "Alex" }],
  "accounts": [{ "id": "a1", "teamId": "t1",
                 "username": "raptor_01", "password": "a8x2k", "note": "" }],
  "games":    [{ "id": "g1", "minute": 10, "teamId": "t1",
                 "opponentName": "Falcons",
                 "slots": [ { "playerId": "p1", "accountId": "a1" },
                            { "playerId": null, "accountId": null },
                            { "playerId": null, "accountId": null },
                            { "playerId": null, "accountId": null } ] }]
}
```

Notes:

- `minute` is one of `0, 10, 20, 30, 40, 50`. There is no date — the app holds one live schedule at a time.
- `slots` is always exactly four entries. A slot may hold a player without an account, or an account without a player; both null means empty.
- An account belongs to exactly one team (`teamId`) and can only be used in that team's games.
- Players are a shared roster with no team affiliation; any player can be slotted into any team's game.
- An opponent is a free-text `opponentName` on the game. There is no opponent entity. The UI offers previously used names via a `datalist`.
- Everything else references by `id`, so renaming a team or player never breaks a game.

### Invariants

1. Within a minute mark, a `playerId` appears in at most one slot across all games.
2. Within a minute mark, an `accountId` appears in at most one slot across all games.
3. A slot's `accountId` must reference an account whose `teamId` equals the game's `teamId`.
4. Every game has exactly four slots.

The UI enforces 1–3 by filtering what can be selected, so these states are unreachable through normal use. A hand-edited file could still violate them, so the app validates on load and shows a banner listing any violations rather than crashing.

## Layout

One page, no navigation. Top to bottom:

**Toolbar** — `+ Add team`, `Export schedule for… ▾`, `Clear all games`.

**One block per team**, each containing:

- Header: team name, a `N games · M accounts` summary, `rename`, `remove team`.
- Schedule table, one row per game:

  | Min | Opponent | Player 1 | Player 2 | Player 3 | Player 4 | |
  |---|---|---|---|---|---|---|

  Each player cell holds two stacked dropdowns: the player on top, their account underneath. Rows sort by minute. Hovering a cell reveals an `×` that clears that slot only. The row's `×` deletes the game.
- `+ Add game` below the table.
- A collapsible accounts section, closed by default, opened from the account count in the header. It contains an editable username / password / note table for that team's accounts, with add and delete. Passwords render masked with a per-row reveal toggle.

**Players panel** at the bottom — the shared roster as chips with add and delete.

## Behaviour

### Selection filtering

A single pure function `availability(state)` returns, per minute mark, the set of booked player ids and booked account ids (each with the game that booked them).

- The player dropdown in a row at minute *m* greys out and disables any player booked at *m* in another game, labelled with where they are (e.g. `Alex — Team B :10`). The player currently occupying this slot remains selectable.
- The account dropdown lists only accounts whose `teamId` matches the block's team, greying out those booked at *m* in the same way.

### Editing a game's minute

Changing a row's minute re-runs the check. If the new minute would create a clash, the change is applied and only the clashing cells are cleared, with a message naming what was cleared. A deliberate edit is never silently rejected.

### Resetting

Three granularities:

- Slot `×` — clears that slot's player and account.
- Row `×` — deletes that game.
- `Clear all games` — deletes every game across all teams, behind a confirm. Teams, players and accounts are untouched.

There is no undo stack; each of these is cheap to redo.

### Removing a team

Cascade-deletes that team's games and accounts, behind a confirm dialog naming the counts: *"Remove Team A? This deletes 2 games and 6 accounts."* Nothing is left orphaned. The JSON file on disk serves as the backup.

### Export

`Export schedule for… ▾` lists every player holding at least one slot. Selecting one renders that player's schedule into a panel with a **Copy** button. The output is line-based, sized to paste straight into a chat message:

```
=====Alex=====
:10 vs Falcons
rzcloud07@gmail.com
NJA202077

:30 vs Kites
touma80@hotmail.com
Touma646606123
```

The exact shape:

- A header line: five `=`, the player's name, five `=`.
- Then one block per game, blocks separated by a single blank line. There is no blank line between the header and the first block.
- Each block is three lines: `:MM vs <opponent>`, then the account username on its own line, then the account password on its own line.
- Blocks are ordered by minute mark.
- The team name is not shown — the account credentials already identify which team the player is on.
- A slot with a player but no account renders a single line reading `account not assigned` in place of the two credential lines, making the block two lines instead of three.
- A game with a blank opponent renders `(opponent TBC)` as the opponent.
- A player with no games renders the header followed by `No games scheduled.`

The username field typically holds an email address; the app treats it as opaque text either way.

## Code structure

```
server.js                     GET/PUT /api/state → data/state.json
src/state.ts                  types, load/save, debounced sync, load-time validation
src/logic/availability.ts     booked players/accounts per minute mark
src/logic/exportText.ts       renderPlayerSchedule(state, playerId) → string
src/components/TeamBlock.tsx
src/components/GameTable.tsx
src/components/SlotCell.tsx
src/components/AccountsPanel.tsx
src/components/PlayersPanel.tsx
src/App.tsx
data/state.json               gitignored
```

`availability.ts` and `exportText.ts` are pure functions over plain state and hold all the real logic. Components read state and dispatch edits; they contain no scheduling rules.

## Testing

Unit tests with Vitest, written before the implementation of each pure module.

`availability`:
- A player booked at `:10` is reported booked at `:10` and free at `:30`.
- Two games at the same minute for different teams both contribute bookings.
- An account is only offered for its owning team.
- The occupant of the slot being edited is not reported as blocking itself.

`renderPlayerSchedule`:
- A player with no games — header plus `No games scheduled.`
- One game — header, then the `:MM vs opponent` line, username line and password line.
- Several games — ordered by minute, separated by one blank line, no blank line after the header.
- A slot with a player but no account.
- A game with a blank opponent name.
- An unknown player id.

Load-time validation:
- A file violating each invariant produces a corresponding banner entry.

Components are verified by using the app; they are kept thin enough that this is sufficient.
