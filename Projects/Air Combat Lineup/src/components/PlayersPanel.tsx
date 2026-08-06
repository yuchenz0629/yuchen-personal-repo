import { useState } from 'react'
import { useStore } from '../store'

export function PlayersPanel() {
  const { state, dispatch } = useStore()
  const [name, setName] = useState('')

  function add() {
    const trimmed = name.trim()
    if (!trimmed) return
    dispatch({ type: 'addPlayer', id: crypto.randomUUID(), name: trimmed })
    setName('')
  }

  return (
    <section className="block">
      <div className="block-header">
        <h2>Players</h2>
        <span className="muted">shared across all teams</span>
      </div>
      <div className="chips">
        {state.players.map(player => (
          <span key={player.id} className="chip">
            {player.name}
            <button
              className="danger"
              title="Remove this player"
              onClick={() => {
                if (confirm(`Remove ${player.name}? They will be cleared from any game they are in.`)) {
                  dispatch({ type: 'removePlayer', playerId: player.id })
                }
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="add-row">
        <input
          value={name}
          placeholder="player name"
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button onClick={add}>+ Add player</button>
      </div>
    </section>
  )
}
