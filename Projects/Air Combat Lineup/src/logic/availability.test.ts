import { describe, expect, it } from 'vitest'
import type { AppState } from '../types'
import { accountOptions, bookingsAt, describeBooking, playerOptions } from './availability'

/** Two teams, four players, accounts a1-a2 on team A and b1 on team B. */
function fixture(): AppState {
  return {
    teams: [
      { id: 'tA', name: 'Team A' },
      { id: 'tB', name: 'Team B' },
    ],
    players: [
      { id: 'p1', name: 'Alex' },
      { id: 'p2', name: 'Bo' },
      { id: 'p3', name: 'Cass' },
    ],
    accounts: [
      { id: 'a1', teamId: 'tA', username: 'raptor_01', email: '', password: 'x', note: '' },
      { id: 'a2', teamId: 'tA', username: 'raptor_02', email: '', password: 'y', note: '' },
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
      {
        id: 'g2', minute: 10, teamId: 'tB', opponentName: 'Wolves',
        slots: [
          { playerId: null, accountId: null },
          { playerId: null, accountId: null },
          { playerId: null, accountId: null },
          { playerId: null, accountId: null },
        ],
      },
      {
        id: 'g3', minute: 30, teamId: 'tA', opponentName: 'Kites',
        slots: [
          { playerId: null, accountId: null },
          { playerId: null, accountId: null },
          { playerId: null, accountId: null },
          { playerId: null, accountId: null },
        ],
      },
    ],
  }
}

describe('bookingsAt', () => {
  it('reports a player booked at their minute', () => {
    const { players } = bookingsAt(fixture(), 10)
    expect(players.get('p1')).toEqual({ gameId: 'g1', teamId: 'tA', minute: 10, slotIndex: 0 })
  })

  it('reports that player free at other minutes', () => {
    expect(bookingsAt(fixture(), 30).players.has('p1')).toBe(false)
  })

  it('reports the account booked alongside them', () => {
    expect(bookingsAt(fixture(), 10).accounts.get('a1')?.gameId).toBe('g1')
  })

  it('collects bookings from every game at that minute, across teams', () => {
    const state = fixture()
    state.games[1].slots[0] = { playerId: 'p2', accountId: 'b1' }
    const { players, accounts } = bookingsAt(state, 10)
    expect([...players.keys()].sort()).toEqual(['p1', 'p2'])
    expect([...accounts.keys()].sort()).toEqual(['a1', 'b1'])
  })
})

describe('describeBooking', () => {
  it('names the team and minute', () => {
    const state = fixture()
    const booking = bookingsAt(state, 10).players.get('p1')!
    expect(describeBooking(state, booking)).toBe('Team A :10')
  })
})

describe('playerOptions', () => {
  it('blocks a player booked in another game at the same minute', () => {
    const options = playerOptions(fixture(), 'g2', 0)
    expect(options.find(o => o.item.id === 'p1')!.blockedBy!.gameId).toBe('g1')
    expect(options.find(o => o.item.id === 'p2')!.blockedBy).toBeNull()
  })

  it('does not block the slot from its own current occupant', () => {
    const options = playerOptions(fixture(), 'g1', 0)
    expect(options.find(o => o.item.id === 'p1')!.blockedBy).toBeNull()
  })

  it('does not block a player booked at a different minute', () => {
    const options = playerOptions(fixture(), 'g3', 0)
    expect(options.find(o => o.item.id === 'p1')!.blockedBy).toBeNull()
  })

  it('lists every player in the roster', () => {
    expect(playerOptions(fixture(), 'g2', 0)).toHaveLength(3)
  })
})

describe('accountOptions', () => {
  it("only offers the game team's accounts", () => {
    expect(accountOptions(fixture(), 'g2', 0).map(o => o.item.id)).toEqual(['b1'])
    expect(accountOptions(fixture(), 'g1', 1).map(o => o.item.id)).toEqual(['a1', 'a2'])
  })

  it('blocks an account already used at that minute', () => {
    const options = accountOptions(fixture(), 'g1', 1)
    expect(options.find(o => o.item.id === 'a1')!.blockedBy!.gameId).toBe('g1')
    expect(options.find(o => o.item.id === 'a2')!.blockedBy).toBeNull()
  })

  it('does not block the slot from its own current account', () => {
    const options = accountOptions(fixture(), 'g1', 0)
    expect(options.find(o => o.item.id === 'a1')!.blockedBy).toBeNull()
  })
})

describe('unknown game', () => {
  it('returns empty option lists rather than throwing', () => {
    expect(playerOptions(fixture(), 'nope', 0)).toEqual([])
    expect(accountOptions(fixture(), 'nope', 0)).toEqual([])
  })
})
