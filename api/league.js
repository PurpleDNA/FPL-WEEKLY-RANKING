const FPL = "https://fantasy.premierleague.com/api";

// Standings come back 50 managers per page. Cap the fan-out so a huge public
// league (e.g. 314, the global Overall league) can't stall the function.
const MAX_PAGES = 3;
const CONCURRENCY = 8;

// A finished gameweek's scores never change, so it can be cached hard. Only a
// gameweek still being played needs a short TTL.
const CACHE_LIVE = "public, s-maxage=300, stale-while-revalidate=600";
const CACHE_SETTLED = "public, s-maxage=3600, stale-while-revalidate=86400";

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  const leagueId = Number(req.query.leagueId);

  if (!Number.isInteger(leagueId) || leagueId <= 0) {
    return res.status(400).json({ error: "Invalid league ID" });
  }

  try {
    // Runs alongside the standings fetch, so it costs no extra wall-clock time.
    const [{ entries, name, truncated }, cachePolicy] = await Promise.all([
      fetchAllStandings(leagueId),
      fetchCachePolicy(),
    ]);

    const managers = await mapWithConcurrency(entries, CONCURRENCY, async (m) => {
      const base = { entry: m.entry, manager: m.player_name, team: m.entry_name };

      const response = await fetch(`${FPL}/entry/${m.entry}/history/`);
      if (!response.ok) return { ...base, gws: {} };

      const history = await response.json();

      // history.current only holds the gameweeks this entry actually played, so
      // key by event number rather than array position.
      const gws = {};
      for (const event of history.current) {
        gws[event.event] = [event.points, event.event_transfers_cost];
      }
      return { ...base, gws };
    });

    res.setHeader("Cache-Control", cachePolicy);
    res.status(200).json({ league: { id: leagueId, name }, truncated, managers });
  } catch (err) {
    res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "Could not load this league" });
  }
}

// /event-status/ is a few hundred bytes, unlike bootstrap-static's 1.5MB. It
// reports each match day's scoring state: "c" once points are confirmed.
//
// Deliberately one-directional — we only extend the TTL on positive evidence
// that scores have settled. Anything unclear (empty status pre-season, a failed
// request, a shape we don't recognise) falls back to the short TTL, so the
// worst case is the behaviour we already had.
async function fetchCachePolicy() {
  try {
    const response = await fetch(`${FPL}/event-status/`);
    if (!response.ok) return CACHE_LIVE;

    const { status, leagues } = await response.json();
    if (!Array.isArray(status) || status.length === 0) return CACHE_LIVE;

    const settled =
      leagues === "Updated" && status.every((day) => day.points === "c");
    return settled ? CACHE_SETTLED : CACHE_LIVE;
  } catch {
    return CACHE_LIVE;
  }
}

async function fetchAllStandings(leagueId) {
  const entries = [];
  let name = "";
  let page = 1;
  let hasNext = true;

  while (hasNext && page <= MAX_PAGES) {
    const response = await fetch(
      `${FPL}/leagues-classic/${leagueId}/standings/?page_standings=${page}`
    );

    if (!response.ok) {
      throw Object.assign(
        new Error(
          response.status === 404
            ? "No league found with that ID"
            : "Could not load this league — it may be private"
        ),
        { status: response.status === 404 ? 404 : 502 }
      );
    }

    const data = await response.json();
    name = data.league.name;
    entries.push(...data.standings.results);
    hasNext = data.standings.has_next;
    page++;
  }

  return { entries, name, truncated: hasNext };
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await fn(items[index]);
      }
    })
  );

  return results;
}
