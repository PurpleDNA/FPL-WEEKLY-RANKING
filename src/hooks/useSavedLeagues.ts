import { useCallback, useState } from "react";
import {
  readLeagues,
  writeLeagues,
  type SavedLeague,
} from "../utils/savedLeagues";

export function useSavedLeagues() {
  const [leagues, setLeagues] = useState<SavedLeague[]>(readLeagues);

  const update = useCallback(
    (fn: (current: SavedLeague[]) => SavedLeague[]) => {
      setLeagues((current) => writeLeagues(fn(current)));
    },
    [],
  );

  const save = useCallback(
    (league: { id: number; name: string; season: string }) => {
      update((current) => [
        { ...league, lastVisited: Date.now() },
        ...current.filter((l) => l.id !== league.id),
      ]);
    },
    [update],
  );

  const remove = useCallback(
    (id: number) => {
      update((current) => current.filter((l) => l.id !== id));
    },
    [update],
  );

  const markStale = useCallback(
    (id: number) => {
      update((current) =>
        current.map((l) => (l.id === id ? { ...l, stale: true } : l)),
      );
    },
    [update],
  );

  return { leagues, save, remove, markStale };
}
