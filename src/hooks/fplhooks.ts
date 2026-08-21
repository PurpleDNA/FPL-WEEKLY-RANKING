import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatDate } from "../utils/utils";

export type FplError = Error & { status?: number };

interface ManagerSeason {
  entry: number;
  manager: string;
  team: string;
  // Keyed by gameweek number: [points, transferCost]. A missing key means the
  // manager did not play that gameweek.
  gws: Record<number, [number, number] | undefined>;
}

interface LeagueResponse {
  league: { id: number; name: string };
  truncated: boolean;
  managers: ManagerSeason[];
}

export interface WeekDetails {
  entry: number;
  managerName: string;
  teamName: string;
  points: number;
  transferCost: number;
  netPoints: number;
  position: number;
}

interface gws {
  number: number;
  status: string;
  deadline: string;
}

interface SeasonData {
  gameweeks: gws[];
  season: string;
}

interface seasonDetails {
  deadline_time: string;
  is_next: boolean;
  is_current: boolean;
  finished: boolean;
  is_previous: boolean;
}

async function fetchLeague(leagueId: number): Promise<LeagueResponse> {
  const res = await fetch(`/api/league?leagueId=${leagueId}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error: FplError = new Error(
      body.error ?? "Could not load this league",
    );
    error.status = res.status;
    throw error;
  }
  return res.json();
}

async function fetchSeasonDetails(): Promise<SeasonData> {
  const res = await fetch("/api/seasonDetails");
  if (!res.ok) throw new Error("Could not load the season calendar");

  const results = (await res.json()) as unknown as seasonDetails[];
  const gameweeks = results.map((gw, index) => ({
    number: index + 1,
    status: gw.is_previous
      ? "previous"
      : gw.finished
        ? "completed"
        : gw.is_current
          ? "current"
          : gw.is_next
            ? "next"
            : "future",
    deadline: formatDate(gw.deadline_time),
  }));

  // GW1's deadline falls in the opening year of the season, e.g. a 2026-08-21
  // deadline means the 2026/27 season.
  const startYear = results[0]
    ? new Date(results[0].deadline_time).getFullYear()
    : null;
  const season = startYear
    ? `${startYear}/${String(startYear + 1).slice(2)}`
    : "";

  return { gameweeks, season };
}

// A manager's whole season arrives in one payload, so each gameweek table is
// derived from it locally — moving between gameweeks costs no extra requests.
function buildWeekTable(
  league: LeagueResponse | undefined,
  week: number | undefined,
): WeekDetails[] | undefined {
  if (!league || !week) return undefined;

  return league.managers
    .flatMap((manager) => {
      const gw = manager.gws[week];
      if (!gw) return [];

      const [points, transferCost] = gw;
      return [
        {
          entry: manager.entry,
          managerName: manager.manager,
          teamName: manager.team,
          points,
          transferCost,
          netPoints: points - transferCost,
          position: 0,
        },
      ];
    })
    .sort((a, b) => b.netPoints - a.netPoints)
    .map((manager, index) => ({ ...manager, position: index + 1 }));
}

const useFpl = (week?: number, leagueId?: number) => {
  const {
    data: seasonData,
    isPending: isFetchingGWs,
    error: gameweeksError,
  } = useQuery({
    queryKey: ["seasonDetails"],
    queryFn: fetchSeasonDetails,
    staleTime: 30 * 60 * 1000,
  });

  const {
    data: league,
    isPending: isFetching,
    error: leagueError,
  } = useQuery<LeagueResponse, FplError>({
    queryKey: ["league", leagueId],
    queryFn: () => fetchLeague(leagueId as number),
    enabled: Boolean(leagueId),
    staleTime: 30 * 60 * 1000,
    // A missing or private league is a settled answer, not a blip. Retrying it
    // leaves the page looking healthy for seconds before the error lands.
    retry: (failureCount, error) => {
      const status = error.status ?? 0;
      if (status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
  });

  const weekDetails = useMemo(
    () => buildWeekTable(league, week),
    [league, week],
  );

  return {
    weekDetails,
    isFetching,
    leagueError,
    leagueName: league?.league.name,
    truncated: league?.truncated ?? false,
    gameweeks: seasonData?.gameweeks,
    season: seasonData?.season,
    isFetchingGWs,
    gameweeksError,
  };
};

export default useFpl;
