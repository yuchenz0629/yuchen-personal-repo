import type { Account, AppState, Game, Id, Minute, Player, Slot, Team } from '../types'
import { MINUTES, SLOTS_PER_GAME, emptyState, formatMinute } from '../types'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function idOrNull(value: unknown): Id | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

/**
 * Parses an unknown JSON document into a usable AppState, repairing what it can
 * and describing every repair. Never throws.
 */
export function validateState(raw: unknown): { state: AppState; problems: string[] } {
  const problems: string[] = []

  if (!isObject(raw)) {
    return { state: emptyState(), problems: ['The saved file is not a valid state document; starting empty.'] }
  }

  const teams: Team[] = []
  for (const candidate of Array.isArray(raw.teams) ? raw.teams : []) {
    if (!isObject(candidate) || !idOrNull(candidate.id)) {
      const label = isObject(candidate) ? str(candidate.name) : ''
      problems.push(label ? `Team entry "${label}" was malformed or had no id; it was removed.` : 'A team entry was malformed or had no id; it was removed.')
      continue
    }
    teams.push({ id: String(candidate.id), name: str(candidate.name, 'Unnamed team') })
  }

  const players: Player[] = []
  for (const candidate of Array.isArray(raw.players) ? raw.players : []) {
    if (!isObject(candidate) || !idOrNull(candidate.id)) {
      const label = isObject(candidate) ? str(candidate.name) : ''
      problems.push(label ? `Player entry "${label}" was malformed or had no id; it was removed.` : 'A player entry was malformed or had no id; it was removed.')
      continue
    }
    players.push({ id: String(candidate.id), name: str(candidate.name, 'Unnamed player') })
  }

  const teamIds = new Set(teams.map(t => t.id))
  const playerIds = new Set(players.map(p => p.id))

  const accounts: Account[] = []
  for (const candidate of Array.isArray(raw.accounts) ? raw.accounts : []) {
    if (!isObject(candidate) || !idOrNull(candidate.id)) {
      const label = isObject(candidate) ? str(candidate.username) : ''
      problems.push(label ? `Account entry "${label}" was malformed or had no id; it was removed.` : 'An account entry was malformed or had no id; it was removed.')
      continue
    }
    const teamId = str(candidate.teamId)
    if (!teamIds.has(teamId)) {
      problems.push(`Account "${str(candidate.username, String(candidate.id))}" references an unknown team; it was removed.`)
      continue
    }
    accounts.push({
      id: String(candidate.id),
      teamId,
      username: str(candidate.username),
      email: str(candidate.email),
      password: str(candidate.password),
      note: str(candidate.note),
    })
  }
  const accountsById = new Map(accounts.map(a => [a.id, a]))

  const games: Game[] = []
  for (const candidate of Array.isArray(raw.games) ? raw.games : []) {
    if (!isObject(candidate) || !idOrNull(candidate.id)) {
      const label = isObject(candidate) ? str(candidate.opponentName) : ''
      problems.push(label ? `Game entry "${label}" was malformed or had no id; it was removed.` : 'A game entry was malformed or had no id; it was removed.')
      continue
    }
    const label = str(candidate.opponentName, String(candidate.id))

    const teamId = str(candidate.teamId)
    if (!teamIds.has(teamId)) {
      problems.push(`Game "${label}" references an unknown team; it was removed.`)
      continue
    }

    const minute = candidate.minute
    if (typeof minute !== 'number' || !MINUTES.includes(minute as Minute)) {
      problems.push(`Game "${label}" has an invalid minute (${String(minute)}); it was removed.`)
      continue
    }

    const rawSlots = Array.isArray(candidate.slots) ? candidate.slots : []
    if (rawSlots.length !== SLOTS_PER_GAME) {
      problems.push(`Game "${label}" did not have four slots; it was adjusted to four.`)
    }

    const slots: Slot[] = Array.from({ length: SLOTS_PER_GAME }, (_, i) => {
      const rawSlot = rawSlots[i]
      if (!isObject(rawSlot)) return { playerId: null, accountId: null }

      let playerId = idOrNull(rawSlot.playerId)
      if (playerId && !playerIds.has(playerId)) {
        problems.push(`Game "${label}" slot ${i + 1} references an unknown player; it was cleared.`)
        playerId = null
      }

      let accountId = idOrNull(rawSlot.accountId)
      if (accountId) {
        const account = accountsById.get(accountId)
        if (!account) {
          problems.push(`Game "${label}" slot ${i + 1} references an unknown account; it was cleared.`)
          accountId = null
        } else if (account.teamId !== teamId) {
          problems.push(`Game "${label}" slot ${i + 1} uses account ${account.username}, which does not belong to that team; it was cleared.`)
          accountId = null
        }
      }

      return { playerId, accountId }
    })

    games.push({ id: String(candidate.id), minute: minute as Minute, teamId, opponentName: str(candidate.opponentName), slots })
  }

  // Second pass: no player or account may appear twice at one minute mark.
  // The first occurrence in game order wins; later ones are cleared.
  for (const minute of MINUTES) {
    const seenPlayers = new Set<Id>()
    const seenAccounts = new Set<Id>()
    for (const game of games) {
      if (game.minute !== minute) continue
      game.slots.forEach((slot, i) => {
        if (slot.playerId) {
          if (seenPlayers.has(slot.playerId)) {
            const name = players.find(p => p.id === slot.playerId)?.name ?? slot.playerId
            problems.push(`${name} was booked twice at ${formatMinute(minute)}; the later booking (game "${game.opponentName}" slot ${i + 1}) was cleared.`)
            slot.playerId = null
          } else {
            seenPlayers.add(slot.playerId)
          }
        }
        if (slot.accountId) {
          if (seenAccounts.has(slot.accountId)) {
            const username = accountsById.get(slot.accountId)?.username ?? slot.accountId
            problems.push(`Account ${username} was booked twice at ${formatMinute(minute)}; the later booking (game "${game.opponentName}" slot ${i + 1}) was cleared.`)
            slot.accountId = null
          } else {
            seenAccounts.add(slot.accountId)
          }
        }
      })
    }
  }

  return { state: { teams, players, accounts, games }, problems }
}
