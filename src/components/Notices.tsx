import { AlertTriangle, Info } from "lucide-react";

export const ErrorState = ({ message }: { message: string }) => (
  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 backdrop-blur-sm p-6 text-center">
    <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
    <p className="text-white font-semibold mb-1">Something went wrong</p>
    <p className="text-gray-300 text-sm">{message}</p>
  </div>
);

export const TruncationNotice = () => (
  <div className="mb-4 flex items-start space-x-2 rounded-xl border border-yellow-400/20 bg-yellow-400/10 backdrop-blur-sm px-4 py-3">
    <Info className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5" />
    <p className="text-sm text-yellow-100">
      This league is too large to load in full — showing the top 150 managers by
      overall rank.
    </p>
  </div>
);
