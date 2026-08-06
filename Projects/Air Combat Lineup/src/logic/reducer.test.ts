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
      { id: 'a1', teamId: 'tA', username: 'raptor_01', password: 'x', note: '' },
      { id: 'b1', teamId: 'tB', username: 'viper_01', password: 'z', note: '' },
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
      id: 'a2', teamId: 'tA', username: '', password: '', note: '',
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

  it('removing an account clears it out of every slot but keeps the player', () => {
    const { state } = reduce(fixture(), { type: 'removeAccount', accountId: 'a1' })
    expect(state.accounts.map(a => a.id)).toEqual(['b1'])
    expect(state.games[0].slots[0]).toEqual({ playerId: 'p1', accountId: null })
  })
})
