const LoadingSkeleton = ({ count }: { count: number }) => {
  return Array.from({ length: count }).map((_, key) => (
    <div
      key={key}
      className="w-48 h-4 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"
    ></div>
  ));
};

export default LoadingSkeleton;
