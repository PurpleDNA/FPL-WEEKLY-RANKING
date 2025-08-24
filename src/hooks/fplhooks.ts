/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import // useQuery,
// useMutation,
//  useQueryClient
"@tanstack/react-query";
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

const useFpl = (week: number) => {
  const [standingsList, setStandingsList] = useState<Standings[]>([]);
  const [weekDetails, setWeekDetails] = useState<WeekDetails[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [seasonDetails, setSeasonDetails] = useState<any[]>([]);
  // const { data: seasonDetails } = useQuery({
  //   queryKey: ["seasonDetails"],
  //   queryFn: async () => {
  //     const res = await fetch("/api/seasonDetails");
  //     return res.json();
  //   },
  // });

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch("/api/seasonDetails");
      const data = await res.json();
      setSeasonDetails(data);
    };
    fetchDetails();
  }, []);
  const gameweeks = seasonDetails.map((gw, index) => ({
    number: index + 1,
    status: gw.finished
      ? "completed"
      : gw.is_current
      ? "current"
      : gw.is_next
      ? "next"
      : gw.is_previous
      ? "previous"
      : "future",
    deadline: formatDate(gw.deadline_time),
  }));

  useEffect(() => {
    const fetchData = async () => {
      await fetch("/api/standings?leagueId=1863884").then(async (res) => {
        const parsed = await res.json();
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
    gameweeks,
  };
};

export default useFpl;
