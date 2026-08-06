import { describe, expect, it } from 'vitest'
import type { AppState } from '../types'
import { reduce } from './reducer'

function fixture(): AppState {
  return {
    teams: [
      { id: 'tA', name: 'Team A' },
      { id: 'tB', name: 'Team B' },
    ],
    players: [{ id: 'p1', name: 'Alex' }],
    accounts: [
      { id: 'a1', teamId: 'tA', username: 'raptor_01', email: '', password: 'x', note: '' },
      { id: 'b1', teamId: 'tB', username: 'viper_01', email: '', password: 'z', note: '' },
    ],
    games: [
      {
        id: 'g1', minute: 10, teamId: 'tA', opponentName: 'Falcons',
        slots: [
          { playerId: 'p1', accountId: 'a1' },
          { playerId: null, accountId: null },
          { playerId: null, accountId: null },
          { playerId: null, accountId: null },
        ],
      },
    ],
  }
}

describe('purity', () => {
  it('does not mutate the input state', () => {
    const before = fixture()
    const snapshot = JSON.stringify(before)
    reduce(before, { type: 'addTeam', id: 'tC', name: 'Team C' })
    expect(JSON.stringify(before)).toBe(snapshot)
  })

  it('removePlayer does not mutate the caller\'s slot object or state', () => {
    const before = fixture()
    const snapshot = JSON.stringify(before)
    const slotBefore = before.games[0].slots[0]

    const result = reduce(before, { type: 'removePlayer', playerId: 'p1' })

    expect(slotBefore).toEqual({ playerId: 'p1', accountId: 'a1' })
    expect(result.state.games[0].slots[0]).not.toBe(slotBefore)
    expect(JSON.stringify(before)).toBe(snapshot)
  })

  it('removeAccount does not mutate the caller\'s slot object or state', () => {
    const before = fixture()
    const snapshot = JSON.stringify(before)
    const slotBefore = before.games[0].slots[0]

    const result = reduce(before, { type: 'removeAccount', accountId: 'a1' })

    expect(slotBefore).toEqual({ playerId: 'p1', accountId: 'a1' })
    expect(result.state.games[0].slots[0]).not.toBe(slotBefore)
    expect(JSON.stringify(before)).toBe(snapshot)
  })
})

describe('teams', () => {
  it('appends a team', () => {
    const { state } = reduce(fixture(), { type: 'addTeam', id: 'tC', name: 'Team C' })
    expect(state.teams.map(t => t.name)).toEqual(['Team A', 'Team B', 'Team C'])
  })

  it('renames a team without touching its games', () => {
    const { state } = reduce(fixture(), { type: 'renameTeam', teamId: 'tA', name: 'Alpha' })
    expect(state.teams[0].name).toBe('Alpha')
    expect(state.games[0].teamId).toBe('tA')
  })

  it('removing a team cascades to its games and accounts', () => {
    const { state, message } = reduce(fixture(), { type: 'removeTeam', teamId: 'tA' })
    expect(state.teams.map(t => t.id)).toEqual(['tB'])
    expect(state.games).toHaveLength(0)
    expect(state.accounts.map(a => a.id)).toEqual(['b1'])
    expect(message).toContain('Team A')
  })

  it('removing a team leaves other teams intact', () => {
    const { state } = reduce(fixture(), { type: 'removeTeam', teamId: 'tB' })
    expect(state.games).toHaveLength(1)
    expect(state.accounts.map(a => a.id)).toEqual(['a1'])
  })
})

describe('players', () => {
  it('appends a player', () => {
    const { state } = reduce(fixture(), { type: 'addPlayer', id: 'p2', name: 'Bo' })
    expect(state.players.map(p => p.name)).toEqual(['Alex', 'Bo'])
  })

  it('removing a player clears them out of every slot but keeps the account', () => {
    const { state } = reduce(fixture(), { type: 'removePlayer', playerId: 'p1' })
    expect(state.players).toHaveLength(0)
    expect(state.games[0].slots[0]).toEqual({ playerId: null, accountId: 'a1' })
  })
})

describe('accounts', () => {
  it('adds a blank account to the given team', () => {
    const { state } = reduce(fixture(), { type: 'addAccount', id: 'a2', teamId: 'tA' })
    expect(state.accounts.find(a => a.id === 'a2')).toEqual({
      id: 'a2', teamId: 'tA', username: '', email: '', password: '', note: '',
    })
  })

  it('updates only the named fields', () => {
    const { state } = reduce(fixture(), {
      type: 'updateAccount', accountId: 'a1', fields: { password: 'new' },
    })
    const account = state.accounts.find(a => a.id === 'a1')!
    expect(account.password).toBe('new')
    expect(account.username).toBe('raptor_01')
  })

  it('creates a blank account with an empty email', () => {
    const { state } = reduce(fixture(), { type: 'addAccount', id: 'a9', teamId: 'tA' })
    expect(state.accounts.find(a => a.id === 'a9')).toEqual({
      id: 'a9', teamId: 'tA', username: '', email: '', password: '', note: '',
    })
  })

  it('updates the email without touching other fields', () => {
    const { state } = reduce(fixture(), {
      type: 'updateAccount', accountId: 'a1', fields: { email: 'recovery@example.com' },
    })
    const account = state.accounts.find(a => a.id === 'a1')!
    expect(account.email).toBe('recovery@example.com')
    expect(account.username).toBe('raptor_01')
    expect(account.password).toBe('x')
  })

  it('removing an account clears it out of every slot but keeps the player', () => {
    const { state } = reduce(fixture(), { type: 'removeAccount', accountId: 'a1' })
    expect(state.accounts.map(a => a.id)).toEqual(['b1'])
    expect(state.games[0].slots[0]).toEqual({ playerId: 'p1', accountId: null })
  })
})

describe('games', () => {
  it('adds a game with four empty slots and a blank opponent', () => {
    const { state } = reduce(fixture(), { type: 'addGame', id: 'g2', teamId: 'tB', minute: 30 })
    const game = state.games.find(g => g.id === 'g2')!
    expect(game.opponentName).toBe('')
    expect(game.minute).toBe(30)
    expect(game.slots).toHaveLength(4)
    expect(game.slots.every(s => s.playerId === null && s.accountId === null)).toBe(true)
  })

  it('removes a game', () => {
    const { state } = reduce(fixture(), { type: 'removeGame', gameId: 'g1' })
    expect(state.games).toHaveLength(0)
  })

  it('sets the opponent name', () => {
    const { state } = reduce(fixture(), { type: 'setGameOpponent', gameId: 'g1', opponentName: 'Kites' })
    expect(state.games[0].opponentName).toBe('Kites')
  })

  it('clears every game and nothing else', () => {
    const { state } = reduce(fixture(), { type: 'clearAllGames' })
    expect(state.games).toEqual([])
    expect(state.teams).toHaveLength(2)
    expect(state.accounts).toHaveLength(2)
    expect(state.players).toHaveLength(1)
  })
})

describe('setGameMinute', () => {
  /** g1 at :10 has Alex on a1. g2 at :30 is empty and on the same team. */
  function twoGames(): AppState {
    const state = fixture()
    state.games.push({
      id: 'g2', minute: 30, teamId: 'tA', opponentName: 'Kites',
      slots: [
        { playerId: null, accountId: null },
        { playerId: null, accountId: null },
        { playerId: null, accountId: null },
        { playerId: null, accountId: null },
      ],
    })
    return state
  }

  it('moves a game with no clashes and reports nothing', () => {
    const { state, message } = reduce(twoGames(), { type: 'setGameMinute', gameId: 'g1', minute: 50 })
    expect(state.games.find(g => g.id === 'g1')!.minute).toBe(50)
    expect(state.games.find(g => g.id === 'g1')!.slots[0].playerId).toBe('p1')
    expect(message).toBeUndefined()
  })

  it('clears a clashing player and reports it', () => {
    const state = twoGames()
    state.games[1].slots[0] = { playerId: 'p1', accountId: null }
    const result = reduce(state, { type: 'setGameMinute', gameId: 'g1', minute: 30 })
    const moved = result.state.games.find(g => g.id === 'g1')!
    expect(moved.minute).toBe(30)
    expect(moved.slots[0].playerId).toBeNull()
    expect(moved.slots[0].accountId).toBe('a1')
    expect(result.message).toContain('Alex')
  })

  it('clears a clashing account and reports it', () => {
    const state = twoGames()
    state.games[1].slots[0] = { playerId: null, accountId: 'a1' }
    const result = reduce(state, { type: 'setGameMinute', gameId: 'g1', minute: 30 })
    const moved = result.state.games.find(g => g.id === 'g1')!
    expect(moved.slots[0].accountId).toBeNull()
    expect(moved.slots[0].playerId).toBe('p1')
    expect(result.message).toContain('raptor_01')
  })

  it('leaves the other game untouched', () => {
    const state = twoGames()
    state.games[1].slots[0] = { playerId: 'p1', accountId: null }
    const result = reduce(state, { type: 'setGameMinute', gameId: 'g1', minute: 30 })
    expect(result.state.games.find(g => g.id === 'g2')!.slots[0].playerId).toBe('p1')
  })
})

describe('slots', () => {
  it('sets a slot player', () => {
    const { state } = reduce(fixture(), { type: 'setSlotPlayer', gameId: 'g1', slotIndex: 1, playerId: 'p1' })
    expect(state.games[0].slots[1].playerId).toBe('p1')
  })

  it('sets a slot account', () => {
    const { state } = reduce(fixture(), { type: 'setSlotAccount', gameId: 'g1', slotIndex: 1, accountId: 'a1' })
    expect(state.games[0].slots[1].accountId).toBe('a1')
  })

  it('clears both fields of one slot only', () => {
    const { state } = reduce(fixture(), { type: 'clearSlot', gameId: 'g1', slotIndex: 0 })
    expect(state.games[0].slots[0]).toEqual({ playerId: null, accountId: null })
    expect(state.games[0].slots).toHaveLength(4)
  })
})
