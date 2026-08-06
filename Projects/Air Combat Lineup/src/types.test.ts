import { describe, expect, it } from 'vitest'
import { MINUTES, emptyState, makeSlots } from './types'

describe('MINUTES', () => {
  it('is the six ten-minute marks in order', () => {
    expect(MINUTES).toEqual([0, 10, 20, 30, 40, 50])
  })
})

describe('makeSlots', () => {
  it('returns exactly four empty slots', () => {
    const slots = makeSlots()
    expect(slots).toHaveLength(4)
    expect(slots.every(s => s.playerId === null && s.accountId === null)).toBe(true)
  })

  it('returns a fresh array each call', () => {
    expect(makeSlots()).not.toBe(makeSlots())
  })
})

describe('emptyState', () => {
  it('has empty collections', () => {
    expect(emptyState()).toEqual({ teams: [], players: [], accounts: [], games: [] })
  })
})
