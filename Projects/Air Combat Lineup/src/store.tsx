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
    setState(current => {
      const result = reduce(current, action)
      if (result.message) setMessage(result.message)

      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        saveState(result.state).catch((err: Error) => setMessage(`Save failed: ${err.message}`))
      }, SAVE_DEBOUNCE_MS)

      return result.state
    })
  }, [])

  const dismissMessage = useCallback(() => setMessage(null), [])

  return (
    <StoreContext.Provider value={{ state, dispatch, problems, message, dismissMessage, status }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext)
  if (!value) throw new Error('useStore must be used inside <StoreProvider>')
  return value
}
