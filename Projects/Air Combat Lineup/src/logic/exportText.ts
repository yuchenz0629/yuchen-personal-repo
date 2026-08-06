import type { AppState, Id, Player } from '../types'
import { formatMinute } from '../types'

const HEADER_RULE = '====='

/** Players holding at least one slot, in roster order. */
export function playersWithGames(state: AppState): Player[] {
  const booked = new Set<Id>()
  for (const game of state.games) {
    for (const slot of game.slots) {
      if (slot.playerId) booked.add(slot.playerId)
    }
  }
  return state.players.filter(player => booked.has(player.id))
}

/**
 * One player's schedule as pasteable text: a name header, then one block per
 * game — minute and opponent, then the account email and password on their
 * own lines — separated by blank lines and ordered by minute mark.
 */
export function renderPlayerSchedule(state: AppState, playerId: Id): string {
  const player = state.players.find(p => p.id === playerId)
  if (!player) return ''

  const header = `${HEADER_RULE}${player.name}${HEADER_RULE}`

  const blocks = state.games
    .filter(game => game.slots.some(slot => slot.playerId === playerId))
    .sort((a, b) => a.minute - b.minute)
    .map(game => {
      const slot = game.slots.find(s => s.playerId === playerId)!
      const account = state.accounts.find(a => a.id === slot.accountId)
      const opponent = game.opponentName.trim() || '(opponent TBC)'
      const lines = [`${formatMinute(game.minute)} vs ${opponent}`]
      if (account) {
        const email = account.email.trim()
        lines.push(email || '(email not set)', account.password)
      } else lines.push('account not assigned')
      return lines.join('\n')
    })

  if (blocks.length === 0) return `${header}\nNo games scheduled.`

  return `${header}\n${blocks.join('\n\n')}`
}
