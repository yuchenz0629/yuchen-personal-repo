import { useState } from 'react'
import { playersWithGames, renderPlayerSchedule } from '../logic/exportText'
import { useStore } from '../store'
import type { Id } from '../types'

export function Toolbar() {
  const { state, dispatch, setMessage } = useStore()
  const [exportFor, setExportFor] = useState<Id | ''>('')
  const [copied, setCopied] = useState(false)

  const exportable = playersWithGames(state)
  const selectedPlayer = exportable.find(player => player.id === exportFor)
  const selectValue = selectedPlayer ? exportFor : ''
  const scheduleText = selectedPlayer ? renderPlayerSchedule(state, selectedPlayer.id) : ''

  function addTeam() {
    const name = prompt('Team name')
    if (name && name.trim()) dispatch({ type: 'addTeam', id: crypto.randomUUID(), name: name.trim() })
  }

  function clearAll() {
    const count = state.games.length
    if (count === 0) return
    if (confirm(`Delete all ${count} game(s)? Teams, players and accounts are kept.`)) {
      dispatch({ type: 'clearAllGames' })
      setExportFor('')
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(scheduleText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      setMessage(`Copy failed: ${(err as Error).message}`)
    }
  }

  return (
    <div className="mb-4">
      <div className="glass flex flex-wrap items-center gap-2 px-3 py-2.5">
        <button className="btn-primary" onClick={addTeam}>+ Add team</button>
        <span className="ml-auto" />
        <select
          className="field w-auto min-w-[190px]"
          value={selectValue}
          onChange={e => {
            setExportFor(e.target.value)
            setCopied(false)
          }}
        >
          <option value="">Export schedule for…</option>
          {exportable.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
        <button className="btn" onClick={clearAll} disabled={state.games.length === 0}>
          Clear all games
        </button>
      </div>

      {selectedPlayer && (
        <div className="glass mt-2 px-3 py-3">
          <pre className="m-0 mb-2 overflow-x-auto font-mono text-[14px] leading-relaxed whitespace-pre-wrap break-all text-ink">{scheduleText}</pre>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
            <button className="btn" onClick={() => setExportFor('')}>close</button>
          </div>
        </div>
      )}
    </div>
  )
}
