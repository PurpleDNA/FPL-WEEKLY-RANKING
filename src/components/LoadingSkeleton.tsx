const LoadingSkeleton = ({ count }: { count: number }) => {
  return (
    <div>
      {Array.from({ length: count }).map(() => (
        <div className="w-48 h-4 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
