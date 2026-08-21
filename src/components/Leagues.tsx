import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Trophy, X } from "lucide-react";
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
      setError("Paste an FPL league link, or enter the league ID on its own.");
      return;
    }

    setError("");
    navigate(`/league/${leagueId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            FPL Pulse
          </h1>
          <p className="text-gray-300 mt-4 text-lg mb-1">
            Gameweek standings by net points, for any FPL mini-league
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="mb-10">
          <label
            htmlFor="league"
            className="block text-sm text-gray-400 mb-2 uppercase tracking-wide"
          >
            League link or ID
          </label>
          <div className="flex space-x-2">
            <input
              id="league"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="fantasy.premierleague.com/leagues/314/standings/c"
              className="flex-1 min-w-0 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-400/50 transition"
            />
            <button
              type="submit"
              className="flex-shrink-0 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 px-5 py-3 font-semibold text-slate-900 hover:opacity-90 transition"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          {error ? (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          ) : (
            <p className="text-gray-500 text-sm mt-2">
              Open your league on the FPL site and copy the address.
            </p>
          )}
        </form>

        <h2 className="font-bold text-white text-lg mb-3">Your leagues</h2>

        {leagues.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center">
            <Trophy className="w-8 h-8 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              Leagues you open will be saved here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leagues.map((league) => (
              <div
                key={league.id}
                onClick={() => navigate(`/league/${league.id}`)}
                className="relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm bg-white/5 hover:scale-[1.02] hover:border-white/20 transition-all duration-300 shadow-lg cursor-pointer group"
              >
                <div className="p-4 sm:p-5 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-lg sm:text-xl font-bold truncate leading-tight transition-colors ${
                        league.stale
                          ? "text-gray-500"
                          : "text-white group-hover:text-green-300"
                      }`}
                    >
                      {league.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate leading-tight">
                      {league.stale
                        ? `Unavailable — saved in ${league.season}, may be from a past season`
                        : `${league.season} season · ID ${league.id}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${league.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(league.id);
                    }}
                    className="flex-shrink-0 ml-4 p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leagues;
