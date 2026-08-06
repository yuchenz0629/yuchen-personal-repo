import type { AppState } from './types'

export async function fetchState(): Promise<unknown> {
  const response = await fetch('/api/state')
  if (!response.ok) throw new Error(`Could not load state (${response.status})`)
  return response.json()
}

export async function saveState(state: AppState, keepalive = false): Promise<void> {
  const response = await fetch('/api/state', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(state),
    keepalive,
  })
  if (!response.ok) throw new Error(`Could not save state (${response.status})`)
}
