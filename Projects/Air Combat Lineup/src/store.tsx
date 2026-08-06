import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchState, saveState } from './api'
import type { Action } from './logic/reducer'
import { reduce } from './logic/reducer'
import { validateState } from './logic/validate'
import type { AppState } from './types'
import { emptyState } from './types'

const SAVE_DEBOUNCE_MS = 500

interface StoreValue {
  state: AppState
  dispatch: (action: Action) => void
  problems: string[]
  message: string | null
  setMessage: (message: string | null) => void
  dismissMessage: () => void
  status: 'loading' | 'ready' | 'error'
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState)
  const [problems, setProblems] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pending = useRef<AppState | null>(null)
  const statusRef = useRef(status)
  const stateRef = useRef(state)

  statusRef.current = status
  stateRef.current = state

  const flushPendingSave = useCallback((keepalive = false) => {
    if (!timer.current) return
    clearTimeout(timer.current)
    timer.current = null
    const toSave = pending.current
    pending.current = null
    if (toSave) {
      saveState(toSave, keepalive).catch((err: Error) => setMessage(`Save failed: ${err.message}`))
    }
  }, [])

  useEffect(() => {
    return () => flushPendingSave()
  }, [flushPendingSave])

  useEffect(() => {
    const handleBeforeUnload = () => flushPendingSave(true)
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [flushPendingSave])

  useEffect(() => {
    fetchState()
      .then(raw => {
        const { state: loaded, problems: found } = validateState(raw)
        setState(loaded)
        setProblems(found)
        setStatus('ready')
      })
      .catch((err: Error) => {
        setProblems([err.message])
        setStatus('error')
      })
  }, [])

  const dispatch = useCallback((action: Action) => {
    if (statusRef.current !== 'ready') return

    const result = reduce(stateRef.current, action)
    stateRef.current = result.state
    setState(result.state)
    if (result.message) setMessage(result.message)

    if (timer.current) clearTimeout(timer.current)
    pending.current = result.state
    timer.current = setTimeout(flushPendingSave, SAVE_DEBOUNCE_MS)
  }, [flushPendingSave])

  const dismissMessage = useCallback(() => setMessage(null), [])

  return (
    <StoreContext.Provider value={{ state, dispatch, problems, message, setMessage, dismissMessage, status }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore must be used inside <StoreProvider>')
  return value
}
