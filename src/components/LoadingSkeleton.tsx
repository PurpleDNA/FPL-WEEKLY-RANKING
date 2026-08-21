const LoadingSkeleton = ({ count }: { count: number }) => {
  return Array.from({ length: count }).map((_, key) => (
    <div key={key} className="h-6 w-32 max-w-full animate-pulse rounded-sm bg-line" />
  ));
};

export default LoadingSkeleton;
