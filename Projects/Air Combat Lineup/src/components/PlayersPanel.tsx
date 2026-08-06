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
    <section className="glass mb-3.5 px-3 py-3">
      <div className="mb-2 flex flex-wrap items-center gap-2.5">
        <h2 className="m-0 text-[15px] font-semibold text-white">Players</h2>
        <span className="text-[11px] text-ink-dim">shared across all teams</span>
      </div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {state.players.map(player => (
          <span key={player.id} className="inline-flex items-center gap-1 rounded-full border border-edge bg-white/8 py-0.5 pl-2.5 pr-1 text-[12px]">
            {player.name}
            <button
              className="rounded-full px-1 leading-none opacity-50 hover:text-rose-300 hover:opacity-100"
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
      <div className="flex gap-2">
        <input
          className="field w-auto min-w-[170px]"
          value={name}
          placeholder="player name"
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="btn-primary" onClick={add}>+ Add player</button>
      </div>
    </section>
  )
}
