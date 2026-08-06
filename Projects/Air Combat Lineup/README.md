# Air Combat Lineup

Assigns players and team-owned game accounts to ten-minute-mark matches without clashes,
and exports each player's schedule as pasteable line-based text you can paste into a message.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:5173. This starts both the Vite dev server and the state
server on port 5174.

## How it works

Everything lives on one page. Each team is a block containing its own schedule table —
one row per game, with columns for the minute mark, the opponent, and four player slots.
Each slot holds a player and one of that team's accounts.

The app makes clashes impossible to create: a player already booked at a minute mark is
greyed out in every other game at that mark, and an account is only ever offered for the
team that owns it.

Expand a team's account count in its header to edit that team's usernames, passwords and
notes.

## Exporting a schedule

Pick a player from the "Export schedule for…" dropdown in the toolbar to copy their schedule
as pasteable text. The format is a `=====Name=====` header, followed by one three-line block
per match (ordered by minute mark), each with the game time and opponent, account username,
and password:

```
=====Alex=====
:10 vs Falcons
rzcloud07@gmail.com
NJA202077

:30 vs Kites
touma80@hotmail.com
Touma646606123
```

## Data

All data lives in `data/state.json`. It contains plaintext account passwords, so it is
gitignored and must never be committed. Back it up by copying the file.

## Tests

```bash
npm test
```

The scheduling rules live in `src/logic/` as pure functions and are covered by unit tests.
UI components are verified by using the app.
