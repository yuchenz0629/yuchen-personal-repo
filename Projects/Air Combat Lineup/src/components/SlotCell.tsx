import { accountOptions, describeBooking, playerOptions } from '../logic/availability'
import { useStore } from '../store'
import type { Id } from '../types'

export function SlotCell({ gameId, slotIndex }: { gameId: Id; slotIndex: number }) {
  const { state, dispatch } = useStore()
  const game = state.games.find(g => g.id === gameId)
  if (!game) return null
  const slot = game.slots[slotIndex]

  const players = playerOptions(state, gameId, slotIndex)
  const accounts = accountOptions(state, gameId, slotIndex)
  const isEmpty = slot.playerId === null && slot.accountId === null

  return (
    <td className="slot-cell">
      <select
        value={slot.playerId ?? ''}
        onChange={e => dispatch({ type: 'setSlotPlayer', gameId, slotIndex, playerId: e.target.value || null })}
      >
        <option value="">player…</option>
        {players.map(({ item, blockedBy }) => (
          <option key={item.id} value={item.id} disabled={blockedBy !== null}>
            {blockedBy ? `${item.name} — ${describeBooking(state, blockedBy)}` : item.name}
          </option>
        ))}
      </select>

      <select
        className="account-select"
        value={slot.accountId ?? ''}
        onChange={e => dispatch({ type: 'setSlotAccount', gameId, slotIndex, accountId: e.target.value || null })}
      >
        <option value="">account…</option>
        {accounts.map(({ item, blockedBy }) => (
          <option key={item.id} value={item.id} disabled={blockedBy !== null}>
            {blockedBy ? `${item.username} — ${describeBooking(state, blockedBy)}` : item.username}
          </option>
        ))}
      </select>

      {!isEmpty && (
        <button
          className="clear-slot"
          title="Clear this slot"
          onClick={() => dispatch({ type: 'clearSlot', gameId, slotIndex })}
        >
          ×
        </button>
      )}
    </td>
  )
}
