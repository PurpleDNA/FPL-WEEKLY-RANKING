import { useEffect, useState } from "react";

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

const useFpl = (week: number) => {
  const [standingsList, setStandingsList] = useState<Standings[]>([]);
  const [weekDetails, setWeekDetails] = useState<WeekDetails[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetch("/api/standings?leagueId=1863884").then(async (res) => {
        const parsed = await res.json();
        console.log(parsed.standings.results);
        setStandingsList(parsed.standings.results);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchGameweekDetails = async (gameweek: number) => {
      setIsFetching(true);
      const details = await Promise.all(
        standingsList.map(async (manager) => {
          const data = await fetch(`/api/history?entry=${manager.entry}`);
          const history = await data.json();
          const transfersCost =
            manager.entry === 10720565
              ? history.current[gameweek]?.event_transfers_cost
              : history.current[gameweek - 1]?.event_transfers_cost;
          const points =
            manager.entry === 10720565
              ? history.current[gameweek]?.points
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
      );

      const sorted = details
        .sort((a, b) => b.netPoints - a.netPoints)
        .map((manager, index) => {
          return {
            ...manager,
            position: index + 1,
          };
        });
      console.log(sorted);
      setWeekDetails(sorted);
      setIsFetching(false);
    };

    fetchGameweekDetails(week);
  }, [standingsList, week]);

  return {
    standingsList,
    weekDetails,
    isFetching,
  };
};

export default useFpl;
