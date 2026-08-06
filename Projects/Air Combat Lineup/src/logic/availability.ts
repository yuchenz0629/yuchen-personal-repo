import type { Account, AppState, Id, Minute, Player } from '../types'
import { formatMinute } from '../types'

export interface Booking {
  gameId: Id
  teamId: Id
  minute: Minute
  slotIndex: number
}

export interface Option<T> {
  item: T
  blockedBy: Booking | null
}

/** Every player id and account id in use at `minute`, mapped to the slot using it. */
export function bookingsAt(
  state: AppState,
  minute: Minute,
): { players: Map<Id, Booking>; accounts: Map<Id, Booking> } {
  const players = new Map<Id, Booking>()
  const accounts = new Map<Id, Booking>()

  for (const game of state.games) {
    if (game.minute !== minute) continue
    game.slots.forEach((slot, slotIndex) => {
      const booking: Booking = { gameId: game.id, teamId: game.teamId, minute, slotIndex }
      if (slot.playerId) players.set(slot.playerId, booking)
      if (slot.accountId) accounts.set(slot.accountId, booking)
    })
  }

  return { players, accounts }
}

/** Human-readable location of a booking, e.g. "Team A :10". */
export function describeBooking(state: AppState, booking: Booking): string {
  const team = state.teams.find(t => t.id === booking.teamId)
  return `${team ? team.name : 'Unknown team'} ${formatMinute(booking.minute)}`
}

function isOwnSlot(booking: Booking, gameId: Id, slotIndex: number): boolean {
  return booking.gameId === gameId && booking.slotIndex === slotIndex
}

export function playerOptions(state: AppState, gameId: Id, slotIndex: number): Option<Player>[] {
  const game = state.games.find(g => g.id === gameId)
  if (!game) return []
  const { players } = bookingsAt(state, game.minute)

  return state.players.map(player => {
    const booking = players.get(player.id) ?? null
    return {
      item: player,
      blockedBy: booking && !isOwnSlot(booking, gameId, slotIndex) ? booking : null,
    }
  })
}

export function accountOptions(state: AppState, gameId: Id, slotIndex: number): Option<Account>[] {
  const game = state.games.find(g => g.id === gameId)
  if (!game) return []
  const { accounts } = bookingsAt(state, game.minute)

  return state.accounts
    .filter(account => account.teamId === game.teamId)
    .map(account => {
      const booking = accounts.get(account.id) ?? null
      return {
        item: account,
        blockedBy: booking && !isOwnSlot(booking, gameId, slotIndex) ? booking : null,
      }
    })
}
