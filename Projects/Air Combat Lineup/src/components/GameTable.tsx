import { useState } from 'react'
import { useStore } from '../store'
import type { Id, Minute } from '../types'
import { MINUTES, formatMinute } from '../types'
import { SlotCell } from './SlotCell'
import { ConfirmDialog } from './ConfirmDialog'

const OPPONENT_LIST_ID = 'known-opponents'

export function GameTable({ teamId }: { teamId: Id }) {
  const { state, dispatch } = useStore()
  const [pendingId, setPendingId] = useState<Id | null>(null)
  const games = state.games
    .filter(g => g.teamId === teamId)
    .sort((a, b) => a.minute - b.minute)

  function removeGame(gameId: Id) {
    const game = games.find(g => g.id === gameId)
    const hasOccupiedSlot = game?.slots.some(slot => slot.playerId || slot.accountId) ?? false
    if (!hasOccupiedSlot) {
      dispatch({ type: 'removeGame', gameId })
      return
    }
    setPendingId(gameId)
  }

  return (
    <>
      <table className="w-full border-collapse table-fixed text-[14px]">
        <thead>
          <tr>
            <th className="border-b border-edge px-1.5 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim w-[76px]">Min</th>
            <th className="border-b border-edge px-1.5 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim w-[150px]">Opponent</th>
            <th className="border-b border-edge px-1.5 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim">Player 1</th>
            <th className="border-b border-edge px-1.5 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim">Player 2</th>
            <th className="border-b border-edge px-1.5 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim">Player 3</th>
            <th className="border-b border-edge px-1.5 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim">Player 4</th>
            <th className="border-b border-edge px-1.5 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-dim w-[36px]" />
          </tr>
        </thead>
        <tbody>
          {games.map(game => (
            <tr key={game.id}>
              <td className="border-b border-edge-soft px-1.5 py-1.5 align-top">
                <select
                  className="field w-auto font-mono text-ink-mono"
                  value={game.minute}
                  onChange={e =>
                    dispatch({ type: 'setGameMinute', gameId: game.id, minute: Number(e.target.value) as Minute })
                  }
                >
                  {MINUTES.map(m => (
                    <option key={m} value={m}>
                      {formatMinute(m)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border-b border-edge-soft px-1.5 py-1.5 align-top">
                <input
                  className="field"
                  list={OPPONENT_LIST_ID}
                  placeholder="opponent"
                  value={game.opponentName}
                  onChange={e =>
                    dispatch({ type: 'setGameOpponent', gameId: game.id, opponentName: e.target.value })
                  }
                />
              </td>
              {game.slots.map((_, i) => (
                <SlotCell key={i} gameId={game.id} slotIndex={i} />
              ))}
              <td className="border-b border-edge-soft px-1.5 py-1.5 align-top">
                <button
                  className="opacity-50 hover:text-rose-300 hover:opacity-100"
                  title="Delete this game"
                  onClick={() => removeGame(game.id)}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
          {games.length === 0 && (
            <tr>
              <td colSpan={7} className="italic text-ink-dim">
                No games yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ConfirmDialog
        open={pendingId !== null}
        message="Delete this game? Its player and account assignments will be lost."
        confirmLabel="Delete game"
        onConfirm={() => {
          if (pendingId) dispatch({ type: 'removeGame', gameId: pendingId })
          setPendingId(null)
        }}
        onCancel={() => setPendingId(null)}
      />
    </>
  )
}
