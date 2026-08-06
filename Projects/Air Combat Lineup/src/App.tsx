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
        <h1 className="mb-4 text-xl font-semibold tracking-tight text-white">Air Combat Lineup</h1>
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-3 rounded-xl border border-amber-400/50 bg-amber-400/10 px-3 py-2.5 text-[12.5px] text-amber-200">
            <strong>The saved state could not be loaded.</strong>
            <ul className="mt-1.5 list-disc pl-[18px] space-y-0.5">
              {problems.map((problem, i) => (
                <li key={i}>{problem}</li>
              ))}
            </ul>
            <p>Make sure the state server is running, then reload this page. Nothing will be saved until it loads successfully.</p>
          </div>
        </div>
      </>
    )
  }

  const knownOpponents = [...new Set(state.games.map(g => g.opponentName.trim()).filter(Boolean))]

  return (
    <>
      <h1 className="mb-4 text-xl font-semibold tracking-tight text-white">Air Combat Lineup</h1>

      <div className="mx-auto max-w-[1400px]">
        <datalist id="known-opponents">
          {knownOpponents.map(name => (
            <option key={name} value={name} />
          ))}
        </datalist>

        {problems.length > 0 && (
          <div className="mb-3 rounded-xl border border-amber-400/50 bg-amber-400/10 px-3 py-2.5 text-[12.5px] text-amber-200">
            <strong>The saved file needed repairs:</strong>
            <ul className="mt-1.5 list-disc pl-[18px] space-y-0.5">
              {problems.map((problem, i) => (
                <li key={i}>{problem}</li>
              ))}
            </ul>
          </div>
        )}

        {message && (
          <div className="glass mb-3 flex items-center gap-3 px-3 py-2.5 text-[12.5px]">
            {message}
            <button className="btn ml-auto shrink-0" onClick={dismissMessage}>dismiss</button>
          </div>
        )}

        <Toolbar />

        {state.teams.map(team => (
          <TeamBlock key={team.id} teamId={team.id} />
        ))}

        {state.teams.length === 0 && <p className="text-ink-dim">No teams yet — add one from the toolbar.</p>}

        <PlayersPanel />
      </div>
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
