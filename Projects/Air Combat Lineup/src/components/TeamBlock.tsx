import { useState } from 'react'
import { useStore } from '../store'
import type { Id, Minute } from '../types'
import { AccountsPanel } from './AccountsPanel'
import { GameTable } from './GameTable'
import { ConfirmDialog } from './ConfirmDialog'

const DEFAULT_MINUTE: Minute = 0

export function TeamBlock({ teamId }: { teamId: Id }) {
  const { state, dispatch } = useStore()
  const [showAccounts, setShowAccounts] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const team = state.teams.find(t => t.id === teamId)
  if (!team) return null

  const gameCount = state.games.filter(g => g.teamId === teamId).length
  const accountCount = state.accounts.filter(a => a.teamId === teamId).length

  function rename() {
    const next = prompt('Team name', team!.name)
    if (next && next.trim()) dispatch({ type: 'renameTeam', teamId, name: next.trim() })
  }

  function remove() {
    setConfirming(true)
  }

  return (
    <section className="glass mb-3.5 px-3 py-3">
      <div className="mb-2 flex flex-wrap items-center gap-2.5">
        <h2 className="m-0 text-[17px] font-semibold text-white">{team.name}</h2>
        <button className="btn text-[12px] text-ink-dim" onClick={() => setShowAccounts(v => !v)}>
          {gameCount} game(s) · {accountCount} account(s) {showAccounts ? '▾' : '▸'}
        </button>
        <span className="ml-auto" />
        <button className="btn text-[12px]" onClick={rename}>rename</button>
        <button className="btn text-[12px] hover:border-rose-400/50 hover:bg-rose-500/20 hover:text-rose-200" onClick={remove}>remove team</button>
      </div>

      {showAccounts && <AccountsPanel teamId={teamId} />}

      <GameTable teamId={teamId} />

      <button
        className="btn-primary mt-2"
        onClick={() => dispatch({ type: 'addGame', id: crypto.randomUUID(), teamId, minute: DEFAULT_MINUTE })}
      >
        + Add game
      </button>

      <ConfirmDialog
        open={confirming}
        message={`Remove ${team.name}? This deletes ${gameCount} game(s) and ${accountCount} account(s).`}
        confirmLabel="Remove team"
        onConfirm={() => {
          dispatch({ type: 'removeTeam', teamId })
          setConfirming(false)
        }}
        onCancel={() => setConfirming(false)}
      />
    </section>
  )
}
