import { useState } from 'react'
import { playersWithGames, renderPlayerSchedule } from '../logic/exportText'
import { useStore } from '../store'
import type { Id } from '../types'

export function Toolbar() {
  const { state, dispatch } = useStore()
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
    await navigator.clipboard.writeText(scheduleText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="toolbar-wrap">
      <div className="toolbar">
        <button onClick={addTeam}>+ Add team</button>
        <span className="spacer" />
        <select
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
        <button onClick={clearAll} disabled={state.games.length === 0}>
          Clear all games
        </button>
      </div>

      {selectedPlayer && (
        <div className="export-panel">
          <pre className="export-text">{scheduleText}</pre>
          <div className="add-row">
            <button onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
            <button className="link" onClick={() => setExportFor('')}>close</button>
          </div>
        </div>
      )}
    </div>
  )
}
