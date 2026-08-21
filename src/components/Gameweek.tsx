import { useParams, useNavigate } from "react-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import useFpl from "../hooks/fplhooks";
import FPLSkeleton from "./Skeleton";
import { ErrorState, TruncationNotice } from "./Notices";

const Gameweek = () => {
  const { week, leagueId } = useParams();
  const id = Number(leagueId);
  const currentWeek = Number(week);

  const {
    weekDetails,
    isFetching,
    leagueName,
    leagueError,
    truncated,
    gameweeks,
  } = useFpl(currentWeek, id);
  const navigate = useNavigate();

  const lastGameweek = gameweeks?.length ?? 38;
  const canGoBack = currentWeek > 1;
  const canGoForward = currentWeek < lastGameweek;

  const go = (target: number) => navigate(`/league/${id}/gameweek/${target}`);

  return (
    <div className="min-h-screen px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate(`/league/${id}`)}
          className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-chalk-dim transition-colors hover:text-chalk"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {leagueName ?? "Back"}
        </button>

        <header className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-chalk-dim">
              Net standings
            </p>
            <h1 className="text-4xl font-extrabold leading-none tracking-tight sm:text-5xl">
              Gameweek <span className="tnum font-mono">{currentWeek}</span>
            </h1>
          </div>

          <div className="flex shrink-0 gap-px bg-line">
            <button
              type="button"
              aria-label="Previous gameweek"
              disabled={!canGoBack}
              onClick={() => go(currentWeek - 1)}
              className="bg-pitch p-2.5 text-chalk-dim transition-colors hover:text-gold disabled:pointer-events-none disabled:text-chalk-dim/25"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next gameweek"
              disabled={!canGoForward}
              onClick={() => go(currentWeek + 1)}
              className="bg-pitch p-2.5 text-chalk-dim transition-colors hover:text-gold disabled:pointer-events-none disabled:text-chalk-dim/25"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </header>

        {truncated && <TruncationNotice />}

        {leagueError ? (
          <ErrorState message={leagueError.message} />
        ) : isFetching ? (
          <FPLSkeleton />
        ) : weekDetails && weekDetails.length > 0 ? (
          <>
            <div className="flex items-center gap-4 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-chalk-dim">
              <span className="w-6">#</span>
              <span className="flex-1">Manager</span>
              <span className="w-20 text-right">Net</span>
            </div>

            <ul className="divide-y divide-line border-y border-line">
              {weekDetails.map((manager) => {
                const isLeader = manager.position === 1;

                return (
                  <li
                    key={manager.entry}
                    className={`flex items-center gap-4 py-4 ${
                      isLeader ? "border-l-2 border-gold pl-4" : ""
                    }`}
                  >
                    <span
                      className={`tnum w-6 shrink-0 font-mono ${
                        isLeader ? "text-gold" : "text-chalk-dim"
                      }`}
                    >
                      {manager.position}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate font-semibold ${
                          isLeader ? "text-gold" : "text-chalk"
                        }`}
                      >
                        {manager.teamName}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-chalk-dim">
                        {manager.managerName}
                      </span>
                    </span>

                    {/* The subtraction is the point of this app, so it is shown
                        rather than folded away. Clean weeks show one number. */}
                    <span className="w-20 shrink-0 text-right">
                      <span
                        className={`tnum block font-mono text-2xl font-semibold ${
                          isLeader ? "text-gold" : "text-chalk"
                        }`}
                      >
                        {manager.netPoints}
                      </span>
                      {manager.transferCost > 0 && (
                        <span className="tnum mt-0.5 block font-mono text-xs text-chalk-dim">
                          {manager.points}{" "}
                          <span className="text-hit">
                            −{manager.transferCost}
                          </span>
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 font-mono text-xs text-chalk-dim">
              {weekDetails.length} managers · net of transfer hits
            </p>
          </>
        ) : (
          <p className="border-y border-line py-8 text-center text-chalk-dim">
            No scores for this gameweek yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Gameweek;
