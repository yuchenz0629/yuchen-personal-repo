import type { Account, AppState, Game, Id, Minute, Slot } from '../types'
import { makeSlots } from '../types'
import { bookingsAt } from './availability'

export type Action =
  | { type: 'addTeam'; id: Id; name: string }
  | { type: 'renameTeam'; teamId: Id; name: string }
  | { type: 'removeTeam'; teamId: Id }
  | { type: 'addPlayer'; id: Id; name: string }
  | { type: 'removePlayer'; playerId: Id }
  | { type: 'addAccount'; id: Id; teamId: Id }
  | { type: 'updateAccount'; accountId: Id; fields: Partial<Pick<Account, 'username' | 'password' | 'note'>> }
  | { type: 'removeAccount'; accountId: Id }
  | { type: 'addGame'; id: Id; teamId: Id; minute: Minute }
  | { type: 'removeGame'; gameId: Id }
  | { type: 'setGameMinute'; gameId: Id; minute: Minute }
  | { type: 'setGameOpponent'; gameId: Id; opponentName: string }
  | { type: 'setSlotPlayer'; gameId: Id; slotIndex: number; playerId: Id | null }
  | { type: 'setSlotAccount'; gameId: Id; slotIndex: number; accountId: Id | null }
  | { type: 'clearSlot'; gameId: Id; slotIndex: number }
  | { type: 'clearAllGames' }

export interface ReduceResult {
  state: AppState
  /** Set when the reducer did something the user should be told about. */
  message?: string
}

/** Applies `fn` to every slot of every game, returning new game objects. */
function mapSlots(games: Game[], fn: (slot: Slot) => Slot): Game[] {
  return games.map(game => ({ ...game, slots: game.slots.map(fn) }))
}

export function reduce(state: AppState, action: Action): ReduceResult {
  switch (action.type) {
    case 'addTeam':
      return { state: { ...state, teams: [...state.teams, { id: action.id, name: action.name }] } }

    case 'renameTeam':
      return {
        state: {
          ...state,
          teams: state.teams.map(t => (t.id === action.teamId ? { ...t, name: action.name } : t)),
        },
      }

    case 'removeTeam': {
      const team = state.teams.find(t => t.id === action.teamId)
      const gameCount = state.games.filter(g => g.teamId === action.teamId).length
      const accountCount = state.accounts.filter(a => a.teamId === action.teamId).length
      return {
        state: {
          ...state,
          teams: state.teams.filter(t => t.id !== action.teamId),
          accounts: state.accounts.filter(a => a.teamId !== action.teamId),
          games: state.games.filter(g => g.teamId !== action.teamId),
        },
        message: `Removed ${team ? team.name : 'team'} along with ${gameCount} game(s) and ${accountCount} account(s).`,
      }
    }

    case 'addPlayer':
      return { state: { ...state, players: [...state.players, { id: action.id, name: action.name }] } }

    case 'removePlayer':
      return {
        state: {
          ...state,
          players: state.players.filter(p => p.id !== action.playerId),
          games: mapSlots(state.games, slot =>
            slot.playerId === action.playerId ? { ...slot, playerId: null } : slot,
          ),
        },
      }

    case 'addAccount':
      return {
        state: {
          ...state,
          accounts: [
            ...state.accounts,
            { id: action.id, teamId: action.teamId, username: '', password: '', note: '' },
          ],
        },
      }

    case 'updateAccount':
      return {
        state: {
          ...state,
          accounts: state.accounts.map(a =>
            a.id === action.accountId ? { ...a, ...action.fields } : a,
          ),
        },
      }

    case 'removeAccount':
      return {
        state: {
          ...state,
          accounts: state.accounts.filter(a => a.id !== action.accountId),
          games: mapSlots(state.games, slot =>
            slot.accountId === action.accountId ? { ...slot, accountId: null } : slot,
          ),
        },
      }

    case 'addGame':
      return {
        state: {
          ...state,
          games: [
            ...state.games,
            { id: action.id, minute: action.minute, teamId: action.teamId, opponentName: '', slots: makeSlots() },
          ],
        },
      }

    case 'removeGame':
      return { state: { ...state, games: state.games.filter(g => g.id !== action.gameId) } }

    case 'setGameOpponent':
      return {
        state: {
          ...state,
          games: state.games.map(g =>
            g.id === action.gameId ? { ...g, opponentName: action.opponentName } : g,
          ),
        },
      }

    case 'setGameMinute': {
      const target = state.games.find(g => g.id === action.gameId)
      if (!target) return { state }

      // Bookings at the destination minute, ignoring the game being moved.
      const others = { ...state, games: state.games.filter(g => g.id !== action.gameId) }
      const { players: bookedPlayers, accounts: bookedAccounts } = bookingsAt(others, action.minute)

      const cleared: string[] = []
      const slots = target.slots.map(slot => {
        let { playerId, accountId } = slot
        if (playerId && bookedPlayers.has(playerId)) {
          cleared.push(state.players.find(p => p.id === playerId)?.name ?? playerId)
          playerId = null
        }
        if (accountId && bookedAccounts.has(accountId)) {
          cleared.push(state.accounts.find(a => a.id === accountId)?.username ?? accountId)
          accountId = null
        }
        return { playerId, accountId }
      })

      return {
        state: {
          ...state,
          games: state.games.map(g =>
            g.id === action.gameId ? { ...g, minute: action.minute, slots } : g,
          ),
        },
        message: cleared.length
          ? `Moved the game, but cleared ${cleared.join(', ')} — already booked at that minute.`
          : undefined,
      }
    }

    case 'setSlotPlayer':
    case 'setSlotAccount':
    case 'clearSlot': {
      const patch: Partial<Slot> =
        action.type === 'setSlotPlayer'
          ? { playerId: action.playerId }
          : action.type === 'setSlotAccount'
            ? { accountId: action.accountId }
            : { playerId: null, accountId: null }

      return {
        state: {
          ...state,
          games: state.games.map(g =>
            g.id === action.gameId
              ? { ...g, slots: g.slots.map((s, i) => (i === action.slotIndex ? { ...s, ...patch } : s)) }
              : g,
          ),
        },
      }
    }

    case 'clearAllGames':
      return { state: { ...state, games: [] } }

    default:
      throw new Error(`Unhandled action: ${(action as Action).type}`)
  }
}
