import { describe, expect, it } from 'vitest'
import { validateState } from './validate'

const wellFormed = {
  teams: [{ id: 'tA', name: 'Team A' }],
  players: [{ id: 'p1', name: 'Alex' }],
  accounts: [{ id: 'a1', teamId: 'tA', username: 'raptor_01', password: 'x', note: '' }],
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

describe('validateState', () => {
  it('accepts a well-formed document with no problems', () => {
    const { state, problems } = validateState(wellFormed)
    expect(problems).toEqual([])
    expect(state.games[0].slots[0].playerId).toBe('p1')
  })

  it('returns an empty state for non-object input', () => {
    const { state, problems } = validateState('nonsense')
    expect(state).toEqual({ teams: [], players: [], accounts: [], games: [] })
    expect(problems).toHaveLength(1)
    expect(problems[0]).toContain('not a valid state document')
  })

  it('reports and drops a game whose team does not exist', () => {
    const raw = { ...wellFormed, games: [{ ...wellFormed.games[0], teamId: 'ghost' }] }
    const { state, problems } = validateState(raw)
    expect(state.games).toHaveLength(0)
    expect(problems[0]).toContain('unknown team')
  })

  it('reports and clears an account belonging to another team', () => {
    const raw = {
      ...wellFormed,
      teams: [...wellFormed.teams, { id: 'tOther', name: 'Team Other' }],
      accounts: [
        ...wellFormed.accounts,
        { id: 'b1', teamId: 'tOther', username: 'viper_01', password: 'z', note: '' },
      ],
      games: [
        {
          ...wellFormed.games[0],
          slots: [
            { playerId: 'p1', accountId: 'b1' },
            { playerId: null, accountId: null },
            { playerId: null, accountId: null },
            { playerId: null, accountId: null },
          ],
        },
      ],
    }
    const { state, problems } = validateState(raw)
    expect(state.games[0].slots[0].accountId).toBeNull()
    expect(problems.some(p => p.includes('does not belong to'))).toBe(true)
  })

  it('reports and clears a duplicate player booking at one minute', () => {
    const raw = {
      ...wellFormed,
      games: [
        wellFormed.games[0],
        {
          id: 'g2', minute: 10, teamId: 'tA', opponentName: 'Wolves',
          slots: [
            { playerId: 'p1', accountId: null },
            { playerId: null, accountId: null },
            { playerId: null, accountId: null },
            { playerId: null, accountId: null },
          ],
        },
      ],
    }
    const { state, problems } = validateState(raw)
    expect(state.games[0].slots[0].playerId).toBe('p1')
    expect(state.games[1].slots[0].playerId).toBeNull()
    expect(problems.some(p => p.includes('booked twice'))).toBe(true)
  })

  it('pads a game with too few slots to four', () => {
    const raw = { ...wellFormed, games: [{ ...wellFormed.games[0], slots: [{ playerId: null, accountId: null }] }] }
    const { state, problems } = validateState(raw)
    expect(state.games[0].slots).toHaveLength(4)
    expect(problems.some(p => p.includes('four slots'))).toBe(true)
  })

  it('reports and drops a game with an invalid minute', () => {
    const raw = { ...wellFormed, games: [{ ...wellFormed.games[0], minute: 7 }] }
    const { state, problems } = validateState(raw)
    expect(state.games).toHaveLength(0)
    expect(problems.some(p => p.includes('invalid minute'))).toBe(true)
  })

  it('reports and drops malformed team entries', () => {
    const raw = { ...wellFormed, teams: [...wellFormed.teams, null, 'nope', { name: 'No Id Team' }] }
    const { state, problems } = validateState(raw)
    expect(state.teams).toHaveLength(1)
    expect(problems.filter(p => p.toLowerCase().includes('team entry'))).toHaveLength(3)
    expect(problems.some(p => p.includes('No Id Team'))).toBe(true)
  })

  it('reports and drops malformed player entries', () => {
    const raw = { ...wellFormed, players: [...wellFormed.players, null, 'nope', { name: 'No Id Player' }] }
    const { state, problems } = validateState(raw)
    expect(state.players).toHaveLength(1)
    expect(problems.filter(p => p.toLowerCase().includes('player entry'))).toHaveLength(3)
    expect(problems.some(p => p.includes('No Id Player'))).toBe(true)
  })
})
