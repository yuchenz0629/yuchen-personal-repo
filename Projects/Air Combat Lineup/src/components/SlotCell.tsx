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
  const selectedAccount = accounts.find(({ item }) => item.id === slot.accountId)?.item
  const accountTitle = selectedAccount?.username

  return (
    <td className="group relative min-w-[150px] border-b border-edge-soft px-1.5 py-1.5 align-top">
      <select
        className="field mb-1"
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
        className="field font-mono text-[12.5px] text-ink-mono"
        value={slot.accountId ?? ''}
        title={accountTitle}
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
          className="absolute right-0.5 top-0.5 rounded px-1 text-[14px] leading-none opacity-0 transition-opacity group-hover:opacity-60 focus-visible:opacity-100 hover:text-rose-300 hover:opacity-100"
          title="Clear this slot"
          onClick={() => dispatch({ type: 'clearSlot', gameId, slotIndex })}
        >
          ×
        </button>
      )}
    </td>
  )
}
