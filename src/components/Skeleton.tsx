const FPLSkeleton = ({ rows = 8 }) => {
  return (
    <div className="animate-pulse divide-y divide-line border-y border-line">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 py-4">
          <div className="h-4 w-6 rounded-sm bg-line" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 max-w-[60%] rounded-sm bg-line" />
            <div className="h-3 w-28 max-w-[40%] rounded-sm bg-line/60" />
          </div>
          <div className="h-6 w-12 rounded-sm bg-line" />
        </div>
      ))}
    </div>
  );
};

export default FPLSkeleton;
