import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../utils/utils";

interface Standings {
  id: number;
  event_total: number;
  player_name: string;
  rank: number;
  last_rank: number;
  rank_sort: number;
  total: number;
  entry: number;
  entry_name: string;
  has_played: boolean;
}

interface WeekDetails {
  id: number;
  managerName: string;
  teamName: string;
  points: string;
  transferCost: number;
  netPoints: number;
  position: number;
}

interface gws {
  number: number;
  status: string;
  deadline: string;
}

interface seasonDetails {
  deadline_time: string;
  is_next: boolean;
  is_current: boolean;
  finished: boolean;
  is_previous: boolean;
}

const useFpl = (week: number = 0) => {
  async function fetchGameweekDetails(gameweek: number) {
    const res = await fetch("/api/standings?leagueId=1863884");
    const parsed = await res.json();
    const standingsList = parsed.standings.results as Standings[];
    const details = (await Promise.all(
      standingsList.map(async (manager) => {
        const data = await fetch(`/api/history?entry=${manager.entry}`);
        const history = await data.json();
        const transfersCost =
          manager.entry === 10720565
            ? history.current[gameweek - 2]?.event_transfers_cost
            : history.current[gameweek - 1]?.event_transfers_cost;
        const points =
          manager.entry === 10720565
            ? history.current[gameweek - 2]?.points
            : history.current[gameweek - 1]?.points;
        return {
          id: manager.id,
          managerName: manager.player_name,
          teamName: manager.entry_name,
          points,
          transferCost: transfersCost,
          netPoints: points - transfersCost,
          position: 0,
        };
      })
    )) as WeekDetails[];

    const sortedTable = details
      .sort((a, b) => b.netPoints - a.netPoints)
      .map((manager, index) => {
        return {
          ...manager,
          position: index + 1,
        };
      });
    return sortedTable;
  }

  async function fetchSeasonDetails(): Promise<gws[]> {
    const res = await fetch("/api/seasonDetails");
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
    return gameweeks;
  }

  const { data: gameweeks, isPending: isFetchingGWs } = useQuery({
    queryKey: ["seasonDetails"],
    queryFn: fetchSeasonDetails,
    staleTime: 30 * 60 * 1000,
  });

  const { data: weekDetails, isPending: isFetching } = useQuery<WeekDetails[]>({
    queryKey: ["weekDetails", week],
    queryFn: () => fetchGameweekDetails(week),
    staleTime: 30 * 60 * 1000,
  });

  return {
    weekDetails,
    isFetching,
    gameweeks,
    isFetchingGWs,
  };
};

export default useFpl;
