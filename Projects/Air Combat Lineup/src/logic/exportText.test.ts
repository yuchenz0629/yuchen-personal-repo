import { describe, expect, it } from 'vitest'
import type { AppState, Minute, Slot } from '../types'
import { playersWithGames, renderPlayerSchedule } from './exportText'

function base(): AppState {
  return {
    teams: [{ id: 'tA', name: 'Team A' }],
    players: [
      { id: 'p1', name: 'Alex' },
      { id: 'p2', name: 'Bo' },
    ],
    accounts: [
      { id: 'a1', teamId: 'tA', username: 'rzcloud07@gmail.com', password: 'NJA202077', note: '' },
      { id: 'a2', teamId: 'tA', username: 'touma80@hotmail.com', password: 'Touma646606123', note: '' },
    ],
    games: [],
  }
}

function game(id: string, minute: Minute, opponent: string, slot0: Slot) {
  return {
    id,
    minute,
    teamId: 'tA',
    opponentName: opponent,
    slots: [
      slot0,
      { playerId: null, accountId: null },
      { playerId: null, accountId: null },
      { playerId: null, accountId: null },
    ],
  }
}

describe('playersWithGames', () => {
  it('is empty when nobody is scheduled', () => {
    expect(playersWithGames(base())).toEqual([])
  })

  it('includes only players holding a slot', () => {
    const state = base()
    state.games = [game('g1', 10, 'Falcons', { playerId: 'p2', accountId: 'a1' })]
    expect(playersWithGames(state).map(p => p.id)).toEqual(['p2'])
  })

  it('lists each player once even with several games', () => {
    const state = base()
    state.games = [
      game('g1', 10, 'Falcons', { playerId: 'p1', accountId: 'a1' }),
      game('g2', 30, 'Kites', { playerId: 'p1', accountId: 'a1' }),
    ]
    expect(playersWithGames(state).map(p => p.id)).toEqual(['p1'])
  })

  it('keeps roster order, not game order', () => {
    const state = base()
    state.games = [
      game('g1', 10, 'Falcons', { playerId: 'p2', accountId: 'a1' }),
      game('g2', 30, 'Kites', { playerId: 'p1', accountId: 'a2' }),
    ]
    expect(playersWithGames(state).map(p => p.id)).toEqual(['p1', 'p2'])
  })
})

describe('renderPlayerSchedule', () => {
  it('renders the header and a note when the player has no games', () => {
    expect(renderPlayerSchedule(base(), 'p1')).toBe('=====Alex=====\nNo games scheduled.')
  })

  it('renders one game as three lines under the header', () => {
    const state = base()
    state.games = [game('g1', 10, 'Falcons', { playerId: 'p1', accountId: 'a1' })]
    expect(renderPlayerSchedule(state, 'p1')).toBe(
      '=====Alex=====\n' +
        ':10 vs Falcons\n' +
        'rzcloud07@gmail.com\n' +
        'NJA202077',
    )
  })

  it('separates games with a blank line and orders them by minute', () => {
    const state = base()
    state.games = [
      game('g2', 30, 'Kites', { playerId: 'p1', accountId: 'a2' }),
      game('g1', 10, 'Falcons', { playerId: 'p1', accountId: 'a1' }),
    ]
    expect(renderPlayerSchedule(state, 'p1')).toBe(
      '=====Alex=====\n' +
        ':10 vs Falcons\n' +
        'rzcloud07@gmail.com\n' +
        'NJA202077\n' +
        '\n' +
        ':30 vs Kites\n' +
        'touma80@hotmail.com\n' +
        'Touma646606123',
    )
  })

  it('pads the minute mark to two digits', () => {
    const state = base()
    state.games = [game('g1', 0, 'Falcons', { playerId: 'p1', accountId: 'a1' })]
    expect(renderPlayerSchedule(state, 'p1')).toContain(':00 vs Falcons')
  })

  it('renders a single line when the slot has no account', () => {
    const state = base()
    state.games = [game('g1', 10, 'Falcons', { playerId: 'p1', accountId: null })]
    expect(renderPlayerSchedule(state, 'p1')).toBe(
      '=====Alex=====\n:10 vs Falcons\naccount not assigned',
    )
  })

  it('uses a placeholder when the opponent is blank', () => {
    const state = base()
    state.games = [game('g1', 10, '   ', { playerId: 'p1', accountId: 'a1' })]
    expect(renderPlayerSchedule(state, 'p1')).toContain(':10 vs (opponent TBC)')
  })

  it('returns an empty string for an unknown player', () => {
    expect(renderPlayerSchedule(base(), 'nope')).toBe('')
  })

  it('does not reorder the caller\'s games array', () => {
    const state = base()
    state.games = [
      game('g2', 30, 'Kites', { playerId: 'p1', accountId: 'a2' }),
      game('g1', 10, 'Falcons', { playerId: 'p1', accountId: 'a1' }),
    ]
    renderPlayerSchedule(state, 'p1')
    expect(state.games.map(g => g.id)).toEqual(['g2', 'g1'])
  })
})
