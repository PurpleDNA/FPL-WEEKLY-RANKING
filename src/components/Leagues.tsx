import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, X } from "lucide-react";
import { useSavedLeagues } from "../hooks/useSavedLeagues";
import { parseLeagueId } from "../utils/savedLeagues";

const Leagues = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const { leagues, remove } = useSavedLeagues();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const leagueId = parseLeagueId(input);
    if (!leagueId) {
      setError("That doesn't look like a league link or ID.");
      return;
    }

    setError("");
    navigate(`/league/${leagueId}`);
  };

  return (
    <div className="min-h-screen px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-xl">
        <header className="mb-14">
          <h1 className="text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-6xl">
            FPL
            <br />
            Pulse
          </h1>
          <p className="mt-5 max-w-sm text-chalk-dim">
            Weekly mini-league standings ranked by net points — after your
            transfer hits come off.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mb-14">
          <label
            htmlFor="league"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-chalk-dim"
          >
            League link or ID
          </label>
          <div className="flex border-b border-line focus-within:border-chalk-dim">
            <input
              id="league"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="premierleague.com/leagues/314/standings/c"
              // text-base on phones: iOS Safari zooms the page in when a
              // focused field is under 16px. Back to text-sm from sm up.
              className="min-w-0 flex-1 bg-transparent py-3 font-mono text-base text-chalk placeholder:text-chalk-dim/50 focus:outline-none sm:text-sm"
            />
            <button
              type="submit"
              aria-label="Open league"
              className="px-2 text-chalk-dim transition-colors hover:text-gold"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <p
            className={`mt-2 text-sm ${error ? "text-hit" : "text-chalk-dim"}`}
          >
            {error || "Open your league on the FPL site and copy the address."}
          </p>
        </form>

        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-chalk-dim">
          Your leagues
        </h2>

        {leagues.length === 0 ? (
          <p className="border-t border-line py-6 text-sm text-chalk-dim">
            Leagues you open are saved here.
          </p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {leagues.map((league) => (
              <li key={league.id} className="group flex items-center">
                <button
                  type="button"
                  onClick={() => navigate(`/league/${league.id}`)}
                  className="flex-1 py-4 text-left"
                >
                  <span
                    className={`block font-semibold transition-colors ${
                      league.stale
                        ? "text-chalk-dim"
                        : "text-chalk group-hover:text-gold"
                    }`}
                  >
                    {league.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-xs text-chalk-dim">
                    {league.stale
                      ? `Unavailable — saved in ${league.season}`
                      : `${league.season} · ${league.id}`}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${league.name}`}
                  onClick={() => remove(league.id)}
                  className="p-2 text-chalk-dim/50 transition-colors hover:text-hit"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Leagues;
