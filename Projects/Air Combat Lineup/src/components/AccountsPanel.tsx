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
    <div className="accounts-panel">
      <table className="schedule">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Note</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>
                <input
                  value={account.username}
                  placeholder="username"
                  onChange={e =>
                    dispatch({ type: 'updateAccount', accountId: account.id, fields: { username: e.target.value } })
                  }
                />
              </td>
              <td>
                <input
                  type={revealed.has(account.id) ? 'text' : 'password'}
                  value={account.password}
                  placeholder="password"
                  onChange={e =>
                    dispatch({ type: 'updateAccount', accountId: account.id, fields: { password: e.target.value } })
                  }
                />
                <button className="link" onClick={() => toggleReveal(account.id)}>
                  {revealed.has(account.id) ? 'hide' : 'show'}
                </button>
              </td>
              <td>
                <input
                  value={account.note}
                  placeholder="note"
                  onChange={e =>
                    dispatch({ type: 'updateAccount', accountId: account.id, fields: { note: e.target.value } })
                  }
                />
              </td>
              <td>
                <button
                  className="danger"
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
              <td colSpan={4} className="empty-row">
                No accounts for this team yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => dispatch({ type: 'addAccount', id: crypto.randomUUID(), teamId })}>
        + Add account
      </button>
    </div>
  )
}
