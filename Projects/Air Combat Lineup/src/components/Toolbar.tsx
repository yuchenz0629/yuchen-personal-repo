import { useState } from 'react'
import { Dialog } from './Dialog'
import { ConfirmDialog } from './ConfirmDialog'
import { playersWithGames, renderPlayerSchedule } from '../logic/exportText'
import { useStore } from '../store'
import type { Id } from '../types'

export function Toolbar() {
  const { state, dispatch, setMessage } = useStore()
  const [exportFor, setExportFor] = useState<Id | ''>('')
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const exportable = playersWithGames(state)
  const selectedPlayer = exportable.find(player => player.id === exportFor)
  const selectValue = selectedPlayer ? exportFor : ''
  const scheduleText = selectedPlayer ? renderPlayerSchedule(state, selectedPlayer.id) : ''

  function addTeam() {
    const name = prompt('Team name')
    if (name && name.trim()) dispatch({ type: 'addTeam', id: crypto.randomUUID(), name: name.trim() })
  }

  function clearAll() {
    if (state.games.length === 0) return
    setConfirming(true)
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

      <Dialog open={selectedPlayer !== undefined} onClose={() => setExportFor('')}>
        <h2 className="m-0 mb-3 text-[17px] font-semibold text-white">
          {selectedPlayer?.name}
        </h2>
        <pre className="m-0 mb-4 max-h-[60vh] overflow-auto font-mono text-[14px] leading-relaxed whitespace-pre-wrap break-all text-ink">
          {scheduleText}
        </pre>
        <div className="flex justify-end gap-2">
          <button className="btn-primary" onClick={copy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button className="btn" onClick={() => setExportFor('')}>
            Close
          </button>
        </div>
      </Dialog>

      <ConfirmDialog
        open={confirming}
        message={`Delete all ${state.games.length} game(s)? Teams, players and accounts are kept.`}
        confirmLabel="Delete all games"
        onConfirm={() => {
          dispatch({ type: 'clearAllGames' })
          setExportFor('')
          setConfirming(false)
        }}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}
