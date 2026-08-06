import { StoreProvider, useStore } from './store'

function Page() {
  const { state, status } = useStore()
  if (status === 'loading') return <p>Loading…</p>
  return (
    <div>
      <h1>Air Combat Lineup</h1>
      <p>{state.teams.length} team(s) loaded.</p>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Page />
    </StoreProvider>
  )
}
