export type Id = string

export type Minute = 0 | 10 | 20 | 30 | 40 | 50

export const MINUTES: Minute[] = [0, 10, 20, 30, 40, 50]

export const SLOTS_PER_GAME = 4

export interface Team {
  id: Id
  name: string
}

export interface Player {
  id: Id
  name: string
}

export interface Account {
  id: Id
  teamId: Id
  username: string
  password: string
  note: string
}

export interface Slot {
  playerId: Id | null
  accountId: Id | null
}

export interface Game {
  id: Id
  minute: Minute
  teamId: Id
  opponentName: string
  slots: Slot[]
}

export interface AppState {
  teams: Team[]
  players: Player[]
  accounts: Account[]
  games: Game[]
}

export function makeSlots(): Slot[] {
  return Array.from({ length: SLOTS_PER_GAME }, () => ({ playerId: null, accountId: null }))
}

export function emptyState(): AppState {
  return { teams: [], players: [], accounts: [], games: [] }
}

/** Formats a minute mark for display: 0 -> ":00", 10 -> ":10". */
export function formatMinute(minute: Minute): string {
  return ':' + String(minute).padStart(2, '0')
}
