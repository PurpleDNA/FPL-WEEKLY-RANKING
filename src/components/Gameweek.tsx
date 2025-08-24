import { useParams } from "react-router";
import useFpl from "../hooks/fplhooks";
import {
  Trophy,
  TrendingUp,
  Award,
  Star,
  Crown,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FPLSkeleton from "./Skeleton";
import { useNavigate } from "react-router";

const Gameweek = () => {
  const { week } = useParams();
  const { weekDetails, isFetching } = useFpl(Number(week));
  const navigate = useNavigate();

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      case 3:
      case 4:
        return <Award className="w-6 h-6  text-gray-400" />;
      default:
        return <Star className="w-5 h-5 text-green-400" />;
    }
  };

  const getPositionGradient = (position: number) => {
    if (position === 1) {
      return "from-amber-600/20 via-orange-400/15 to-amber-500/10";
    } else if (position === 2) {
      return "from-yellow-400/20 via-amber-300/15 to-yellow-500/10";
    } else if (position === 3 || position === 4) {
      return "from-slate-400/25 via-zinc-300/20 to-gray-200/15";
    }
    return "from-green-500/15 via-emerald-400/10 to-teal-400/5";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div
            className="absolute top-6 left-6 p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/10 transition"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            5H5K Weekly Standings
          </h1>
          <div className="text-gray-300 mt-4 text-lg mb-1 flex space-x-7 justify-center items-center">
            <ChevronLeft
              size={35}
              className="p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/10 transition mt-1"
              onClick={() => navigate(`/gameweek/${Number(week) - 1}`)}
            />
            <p>Gameweek {week}</p>
            <ChevronRight
              size={35}
              className="p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/10 transition mt-1"
              onClick={() => navigate(`/gameweek/${Number(week) + 1}`)}
            />
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="mb-4 px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center  sm:space-x-7 flex-1">
              <div className="w-8 sm:w-12 text-center">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  #
                </span>
              </div>
              <div className="w-6"></div> {/* Space for icon */}
              <div className="flex-1">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Team & Manager
                </span>
              </div>
            </div>

            {/* Right Section Headers */}
            <div className="flex items-center space-x-4 sm:space-x-6 text-right">
              <div className=" w-16">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Points
                </span>
              </div>
              <div className="w-16 hidden sm:block">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Minus
                </span>
              </div>
              <div className="w-16 border-l border-white/10 pl-4 sm:pl-6">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  Net
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Standings List */}
        <div className="space-y-3">
          {isFetching ? (
            <FPLSkeleton />
          ) : (
            weekDetails.map((manager) => (
              <div
                key={manager.id}
                className={`relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm                         bg-gradient-to-r ${getPositionGradient(
                  manager.position
                )} hover:scale-[1.02] hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <div className="p-4 sm:p-6 flex items-center justify-between">
                  {/* Left Section - Position, Icon, Team Info */}
                  <div className="flex items-center space-x-3 sm:space-x-5 flex-1">
                    {/* Position Number */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg                                   ${
                          manager.position <= 3
                            ? "bg-gradient-to-br from-white/20 to-white/10 text-white border border-white/20"
                            : "bg-slate-700/50 text-gray-300 border border-gray-600/30"
                        }`}
                      >
                        {manager.position}
                      </div>
                    </div>

                    {/* Position Icon */}
                    <div className="flex-shrink-0 hidden sm:block">
                      <div className="w-5 h-5 sm:w-6 sm:h-6">
                        {getPositionIcon(manager.position)}
                      </div>
                    </div>

                    {/* Team and Manager Info */}
                    <div className="flex-1 min-w-0 overflow-hidden max-w-[50%]">
                      <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-white truncate leading-tight">
                        {manager.teamName}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-gray-300 truncate leading-tight">
                        {manager.managerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 sm:space-x-6 text-right">
                    <div className="w-16">
                      <p className="text-lg sm:text-2xl font-bold text-white">
                        {manager.points}
                      </p>
                    </div>

                    <div className="hidden sm:block w-16">
                      {manager.transferCost !== 0 ? (
                        <p
                          className={`text-sm sm:text-lg font-semibold ${
                            manager.transferCost > 0
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          -{manager.transferCost}
                        </p>
                      ) : (
                        <p className="text-sm sm:text-lg font-semibold text-gray-500">
                          0
                        </p>
                      )}
                    </div>

                    <div className="w-16 border-l border-white/20 pl-4 sm:pl-6">
                      <p
                        className={`text-lg sm:text-2xl font-bold ${
                          manager.netPoints > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {manager.netPoints}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-gray-300 text-sm">
              {weekDetails.length} managers competing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gameweek;
