import type { Account, AppState, Game, Id, Minute, Slot } from '../types'

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

    default:
      throw new Error(`Unhandled action: ${(action as Action).type}`)
  }
}
