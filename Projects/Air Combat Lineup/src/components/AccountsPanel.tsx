import { useState } from 'react'
import { useStore } from '../store'
import type { Id } from '../types'

export function AccountsPanel({ teamId }: { teamId: Id }) {
  const { state, dispatch } = useStore()
  const [revealed, setRevealed] = useState<Set<Id>>(new Set())
  const accounts = state.accounts.filter(a => a.teamId === teamId)

  function toggleReveal(id: Id) {
    setRevealed(current => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mb-2.5 rounded-lg border border-dashed border-edge bg-black/15 p-2">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th className="border-b border-edge px-1.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-dim">Username</th>
            <th className="border-b border-edge px-1.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-dim">Password</th>
            <th className="border-b border-edge px-1.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-dim">Note</th>
            <th className="border-b border-edge px-1.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-dim" />
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td className="border-b border-edge-soft px-1.5 py-1.5 align-top">
                <input
                  className="field"
                  value={account.username}
                  placeholder="username"
                  onChange={e =>
                    dispatch({ type: 'updateAccount', accountId: account.id, fields: { username: e.target.value } })
                  }
                />
              </td>
              <td className="border-b border-edge-soft px-1.5 py-1.5 align-top">
                <input
                  className="field"
                  type={revealed.has(account.id) ? 'text' : 'password'}
                  value={account.password}
                  placeholder="password"
                  onChange={e =>
                    dispatch({ type: 'updateAccount', accountId: account.id, fields: { password: e.target.value } })
                  }
                />
                <button className="btn mt-1 text-[10px]" onClick={() => toggleReveal(account.id)}>
                  {revealed.has(account.id) ? 'hide' : 'show'}
                </button>
              </td>
              <td className="border-b border-edge-soft px-1.5 py-1.5 align-top">
                <input
                  className="field"
                  value={account.note}
                  placeholder="note"
                  onChange={e =>
                    dispatch({ type: 'updateAccount', accountId: account.id, fields: { note: e.target.value } })
                  }
                />
              </td>
              <td className="border-b border-edge-soft px-1.5 py-1.5 align-top">
                <button
                  className="opacity-50 hover:text-rose-300 hover:opacity-100"
                  title="Delete this account"
                  onClick={() => {
                    if (confirm(`Delete account ${account.username || '(unnamed)'}? It will be cleared from any game using it.`)) {
                      dispatch({ type: 'removeAccount', accountId: account.id })
                    }
                  }}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
          {accounts.length === 0 && (
            <tr>
              <td colSpan={4} className="border-b border-edge-soft px-1.5 py-1.5 align-top italic text-ink-dim">
                No accounts for this team yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="btn-primary mt-2" onClick={() => dispatch({ type: 'addAccount', id: crypto.randomUUID(), teamId })}>
        + Add account
      </button>
    </div>
  )
}
