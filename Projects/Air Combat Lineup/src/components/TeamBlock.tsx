import { useState } from 'react'
import { useStore } from '../store'
import type { Id, Minute } from '../types'
import { AccountsPanel } from './AccountsPanel'
import { GameTable } from './GameTable'

const DEFAULT_MINUTE: Minute = 0

export function TeamBlock({ teamId }: { teamId: Id }) {
  const { state, dispatch } = useStore()
  const [showAccounts, setShowAccounts] = useState(false)
  const team = state.teams.find(t => t.id === teamId)
  if (!team) return null

  const gameCount = state.games.filter(g => g.teamId === teamId).length
  const accountCount = state.accounts.filter(a => a.teamId === teamId).length

  function rename() {
    const next = prompt('Team name', team!.name)
    if (next && next.trim()) dispatch({ type: 'renameTeam', teamId, name: next.trim() })
  }

  function remove() {
    const ok = confirm(`Remove ${team!.name}? This deletes ${gameCount} game(s) and ${accountCount} account(s).`)
    if (ok) dispatch({ type: 'removeTeam', teamId })
  }

  return (
    <section className="block">
      <div className="block-header">
        <h2>{team.name}</h2>
        <button className="link" onClick={() => setShowAccounts(v => !v)}>
          {gameCount} game(s) · {accountCount} account(s) {showAccounts ? '▾' : '▸'}
        </button>
        <span className="spacer" />
        <button className="link" onClick={rename}>rename</button>
        <button className="link danger-text" onClick={remove}>remove team</button>
      </div>

      {showAccounts && <AccountsPanel teamId={teamId} />}

      <GameTable teamId={teamId} />

      <button
        onClick={() => dispatch({ type: 'addGame', id: crypto.randomUUID(), teamId, minute: DEFAULT_MINUTE })}
      >
        + Add game
      </button>
    </section>
  )
}
