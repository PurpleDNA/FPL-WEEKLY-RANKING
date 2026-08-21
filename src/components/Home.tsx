import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import useFpl from "../hooks/fplhooks";
import { useSavedLeagues } from "../hooks/useSavedLeagues";
import FPLSkeleton from "./Skeleton";
import LoadingSkeleton from "./LoadingSkeleton";
import CrownIcon from "./CrownIcon";
import { ErrorState, TruncationNotice } from "./Notices";

const Home = () => {
  const { leagueId } = useParams();
  const id = Number(leagueId);

  const { gameweeks, season, isFetchingGWs, gameweeksError } = useFpl(
    undefined,
    id,
  );
  const prevGameweek = gameweeks?.find((gw) => gw.status === "previous");
  const currentGameweek = gameweeks?.find((gw) => gw.status === "current");
  const nextGameweek = gameweeks?.find((gw) => gw.status === "next");

  // Shares the cached league + season queries with the call above, so this
  // second call costs no extra requests.
  const { weekDetails, leagueName, leagueError, truncated } = useFpl(
    prevGameweek?.number,
    id,
  );

  const { save, markStale } = useSavedLeagues();
  const navigate = useNavigate();

  // Save on success rather than on submit, so a league only lands in the list
  // once we know it resolves — and once we know its real name.
  useEffect(() => {
    if (leagueName && season) save({ id, name: leagueName, season });
  }, [id, leagueName, season, save]);

  // FPL reissues mini-league IDs each season, so a saved ID can stop resolving.
  useEffect(() => {
    if (leagueError?.status === 404) markStale(id);
  }, [id, leagueError, markStale]);

  const champion = weekDetails?.[0]?.managerName;

  return (
    <div className="min-h-screen px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-chalk-dim transition-colors hover:text-chalk"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All leagues
        </button>

        <header className="mb-12">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-chalk-dim">
            {season ? `${season} season` : " "}
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            {leagueName ?? (leagueError ? "League unavailable" : " ")}
          </h1>
        </header>

        {truncated && <TruncationNotice />}

        <div className="mb-12 grid grid-cols-2 gap-px border border-line bg-line">
          <div className="bg-pitch p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-chalk-dim">
              {prevGameweek ? `GW${prevGameweek.number} winner` : "Last winner"}
            </p>
            <div className="mt-2 text-xl font-semibold text-gold">
              {leagueError ? (
                "—"
              ) : !isFetchingGWs && !prevGameweek ? (
                <span className="text-chalk-dim">Not played yet</span>
              ) : champion ? (
                champion
              ) : (
                <LoadingSkeleton count={1} />
              )}
            </div>
          </div>

          <div className="bg-pitch p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-chalk-dim">
              {currentGameweek ? "Current" : "Next up"}
            </p>
            <p className="tnum mt-2 font-mono text-xl font-semibold">
              {(currentGameweek ?? nextGameweek)?.number ?? "—"}
            </p>
          </div>
        </div>

        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-chalk-dim">
          Gameweeks
        </h2>

        {leagueError ? (
          <ErrorState message={leagueError.message} />
        ) : gameweeksError ? (
          <ErrorState message={gameweeksError.message} />
        ) : isFetchingGWs ? (
          <FPLSkeleton />
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {gameweeks?.map((gameweek) => {
              const isCurrent = gameweek.status === "current";
              const played =
                gameweek.status === "completed" ||
                gameweek.status === "previous";

              return (
                <li key={gameweek.number}>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/league/${id}/gameweek/${gameweek.number}`)
                    }
                    className={`group flex w-full items-center gap-4 py-4 text-left ${
                      isCurrent ? "border-l-2 border-gold pl-4" : ""
                    }`}
                  >
                    <span
                      className={`tnum w-8 font-mono text-lg ${
                        isCurrent
                          ? "text-gold"
                          : played
                            ? "text-chalk"
                            : "text-chalk-dim"
                      }`}
                    >
                      {gameweek.number}
                    </span>

                    <span className="flex-1">
                      <span
                        className={`block font-semibold transition-colors ${
                          played || isCurrent
                            ? "text-chalk group-hover:text-gold"
                            : "text-chalk-dim"
                        }`}
                      >
                        Gameweek {gameweek.number}
                      </span>
                      <span className="mt-0.5 block font-mono text-xs text-chalk-dim">
                        {gameweek.deadline}
                      </span>
                    </span>

                    {isCurrent && (
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                        Live
                      </span>
                    )}

                    {played && (
                      <>
                        <CrownIcon className="h-5 w-5 shrink-0 text-gold" />
                        <span className="sr-only">Completed</span>
                      </>
                    )}

                    <ArrowUpRight className="h-4 w-4 shrink-0 text-chalk-dim/40 transition-colors group-hover:text-gold" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
