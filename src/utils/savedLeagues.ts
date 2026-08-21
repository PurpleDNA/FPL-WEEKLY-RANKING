const KEY = "fpl-pulse:leagues";
const VERSION = 1;
const MAX_SAVED = 8;

export interface SavedLeague {
  id: number;
  name: string;
  // The season the league was saved under. FPL reissues mini-league IDs every
  // season, so a saved ID eventually stops resolving and we need to say why.
  season: string;
  lastVisited: number;
  stale?: boolean;
}

interface Envelope {
  version: number;
  leagues: SavedLeague[];
}

// localStorage throws in some private-browsing and embedded contexts. Saved
// leagues are a convenience, never a dependency — degrade to an empty list.
export function readLeagues(): SavedLeague[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Envelope;
    if (parsed.version !== VERSION || !Array.isArray(parsed.leagues)) return [];

    return parsed.leagues.sort((a, b) => b.lastVisited - a.lastVisited);
  } catch {
    return [];
  }
}

export function writeLeagues(leagues: SavedLeague[]): SavedLeague[] {
  const trimmed = leagues
    .sort((a, b) => b.lastVisited - a.lastVisited)
    .slice(0, MAX_SAVED);

  try {
    const envelope: Envelope = { version: VERSION, leagues: trimmed };
    localStorage.setItem(KEY, JSON.stringify(envelope));
  } catch {
    // Ignore — the in-memory list still works for this session.
  }

  return trimmed;
}

// Accepts a bare league ID or a pasted FPL league URL, e.g.
// https://fantasy.premierleague.com/leagues/1863884/standings/c
export function parseLeagueId(input: string): number | null {
  const trimmed = input.trim();
  const fromUrl = trimmed.match(/leagues\/(\d+)/);
  const id = Number(fromUrl ? fromUrl[1] : trimmed);

  return Number.isInteger(id) && id > 0 ? id : null;
}
