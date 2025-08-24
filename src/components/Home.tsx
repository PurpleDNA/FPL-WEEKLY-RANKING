// import { Trophy, Play, Calendar, TrendingUp, Users } from "lucide-react";
import { Calendar, Play, TrendingUp, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router";
import useFpl from "../hooks/fplhooks";
import FPLSkeleton from "./Skeleton";
import LoadingSkeleton from "./LoadingSkeleton";

const Home = () => {
  const { gameweeks, isLoading } = useFpl();
  const prevGameweek = gameweeks.find((gw) => gw.status === "previous");
  const { weekDetails } = useFpl(prevGameweek?.number);

  const navigate = useNavigate();

  const getGameweekIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "previous":
        return <Trophy className=" text-green-400" size={32} />;
      case "current":
        return <Play className=" text-yellow-400" size={32} />;
      default:
        return <Calendar className=" text-gray-400" size={32} />;
    }
  };

  //   const getGameweekGradient = (status) => {
  //     switch (status) {
  //       case "completed":
  //         return "from-green-500/15 via-emerald-400/10 to-teal-400/5";
  //       case "current":
  //         return "from-yellow-400/20 via-amber-300/15 to-yellow-500/10";
  //       default:
  //         return "from-slate-600/15 via-slate-500/10 to-slate-600/5";
  //     }
  //   };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
      case "previous":
        return "Completed";
      case "current":
        return "Current";
      case "next":
        return "Next";
      default:
        return "Upcoming";
    }
  };

  const handleGameweekClick = (gameweekNumber: number) => {
    navigate(`/gameweek/${gameweekNumber}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            5H5K Premier League
          </h1>
          <p className="text-gray-300 mt-4 text-lg mb-1">
            2025/26 Season Gameweeks
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
        </div>
        <h2 className="font-bold text-white text-lg mb-1">Stats </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">
                  Gameweek {prevGameweek?.number} champion
                </p>
                <p className="text-2xl font-bold text-white">
                  {weekDetails[0]?.managerName ? (
                    weekDetails[0]?.managerName
                  ) : (
                    <LoadingSkeleton count={1} />
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <Play className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-400">Current Gameweek</p>
                <p className="text-2xl font-bold text-white">
                  {gameweeks.find((gw) => gw.status === "current")?.number}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-2xl font-bold text-white">22</p>
                <p className="text-sm text-gray-400">Upcoming</p>
              </div>
            </div>
          </div> */}
        </div>
        {/* Column Headers */}
        <div className="mb-4 px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-16 sm:w-20 text-center">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  GW
                </span>
              </div>
              <div className="w-8 sm:w-10"></div>
              <div className="flex-1">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Gameweek
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-right">
              <div className="hidden sm:block w-20">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Status
                </span>
              </div>
              <div className="w-8"></div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {isLoading ? (
            <FPLSkeleton />
          ) : (
            gameweeks.map((gameweek) => (
              <div
                key={gameweek.number}
                onClick={() => handleGameweekClick(gameweek.number)}
                className={`relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm bg-gradient-to-r hover:scale-[1.02] hover:border-white/20 transition-all duration-300                           shadow-lg hover:shadow-xl cursor-pointer group`}
              >
                <div className="p-4 sm:p-6 flex items-center justify-between">
                  {/* Left Section */}
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Gameweek Number */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-bold text-lg sm:text-2xl ${
                          gameweek.status === "current"
                            ? "bg-gradient-to-br from-yellow-400/30 to-amber-300/20 text-yellow-300 border-2 border-yellow-400/30"
                            : gameweek.status === "future" ||
                              gameweek.status === "next"
                            ? "bg-gradient-to-br from-green-400/20 to-emerald-300/15 text-green-300 border border-green-400/20"
                            : "bg-slate-700/30 text-gray-300 border border-gray-600/20"
                        }`}
                      >
                        {gameweek.number}
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10">
                        {getGameweekIcon(gameweek.status)}
                      </div>
                    </div>

                    {/* Gameweek Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-2xl font-bold text-white truncate leading-tight group-hover:text-green-300 transition-colors">
                        Gameweek {gameweek.number}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300 truncate leading-tight">
                        {gameweek.deadline}
                      </p>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center space-x-4 text-right">
                    {/* Status */}
                    <div className="hidden sm:block w-20">
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          gameweek.status === "current"
                            ? "bg-yellow-400/20 text-yellow-300"
                            : gameweek.status === "completed" ||
                              gameweek.status === "previous"
                            ? "bg-green-400/20 text-green-300"
                            : "bg-gray-600/20 text-gray-400"
                        }`}
                      >
                        {getStatusText(gameweek.status)}
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="w-8 h-8 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </div>
                </div>

                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            ))
          )}
        </div>
        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-gray-300 text-sm">
              2025/26 Premier League Season
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
