"use client";

type CarCardSkeletonProps = {
  count?: number;
  className?: string;
};

/**
 * Skeleton placeholder that matches the shape of a `<CarCard />`. Render while
 * the listings API is still resolving so the layout doesn't jump when results
 * arrive.
 */
export default function CarCardSkeleton({
  count = 6,
  className = "",
}: CarCardSkeletonProps) {
  return (
    <ul
      aria-hidden
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="h-48 w-full animate-pulse bg-gray-200" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
