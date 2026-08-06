import { PlayersPanel } from './components/PlayersPanel'
import { TeamBlock } from './components/TeamBlock'
import { Toolbar } from './components/Toolbar'
import { StoreProvider, useStore } from './store'

function Page() {
  const { state, problems, message, dismissMessage, status } = useStore()

  if (status === 'loading') return <p>Loading…</p>

  if (status === 'error') {
    return (
      <>
        <h1>Air Combat Lineup</h1>
        <div className="banner warn">
          <strong>The saved state could not be loaded.</strong>
          <ul>
            {problems.map((problem, i) => (
              <li key={i}>{problem}</li>
            ))}
          </ul>
          <p>Make sure the state server is running, then reload this page. Nothing will be saved until it loads successfully.</p>
        </div>
      </>
    )
  }

  const knownOpponents = [...new Set(state.games.map(g => g.opponentName.trim()).filter(Boolean))]

  return (
    <>
      <h1>Air Combat Lineup</h1>

      <datalist id="known-opponents">
        {knownOpponents.map(name => (
          <option key={name} value={name} />
        ))}
      </datalist>

      {problems.length > 0 && (
        <div className="banner warn">
          <strong>The saved file needed repairs:</strong>
          <ul>
            {problems.map((problem, i) => (
              <li key={i}>{problem}</li>
            ))}
          </ul>
        </div>
      )}

      {message && (
        <div className="banner">
          {message}
          <button className="link" onClick={dismissMessage}>dismiss</button>
        </div>
      )}

      <Toolbar />

      {state.teams.map(team => (
        <TeamBlock key={team.id} teamId={team.id} />
      ))}

      {state.teams.length === 0 && <p className="muted">No teams yet — add one from the toolbar.</p>}

      <PlayersPanel />
    </>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Page />
    </StoreProvider>
  )
}
