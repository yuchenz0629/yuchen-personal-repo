import { useStore } from '../store'
import type { Id, Minute } from '../types'
import { MINUTES, formatMinute } from '../types'
import { SlotCell } from './SlotCell'

const OPPONENT_LIST_ID = 'known-opponents'

export function GameTable({ teamId }: { teamId: Id }) {
  const { state, dispatch } = useStore()
  const games = state.games
    .filter(g => g.teamId === teamId)
    .sort((a, b) => a.minute - b.minute)

  function removeGame(gameId: Id) {
    const game = games.find(g => g.id === gameId)
    const hasOccupiedSlot = game?.slots.some(slot => slot.playerId || slot.accountId) ?? false
    if (hasOccupiedSlot && !confirm('Delete this game? Its player and account assignments will be lost.')) return
    dispatch({ type: 'removeGame', gameId })
  }

  return (
    <>
      <table className="schedule">
        <thead>
          <tr>
            <th>Min</th>
            <th>Opponent</th>
            <th>Player 1</th>
            <th>Player 2</th>
            <th>Player 3</th>
            <th>Player 4</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {games.map(game => (
            <tr key={game.id}>
              <td>
                <select
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
              <td>
                <input
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
              <td>
                <button
                  className="danger"
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
              <td colSpan={7} className="empty-row">
                No games yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
