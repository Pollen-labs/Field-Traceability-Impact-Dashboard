import { Skeleton } from "@/components/ui/skeleton"
import { clsx } from "clsx"

/**
 * Props for StatsSkeleton component
 */
interface StatsSkeletonProps {
  /**
   * Number of stat items to display (default: 6)
   */
  count?: number
  /**
   * Grid columns configuration (default: 'lg:grid-cols-4')
   */
  gridColumns?: string
}

/**
 * StatsSkeleton - Skeleton loader for StatsBar component
 * 
 * Displays animated placeholder rectangles that mimic the stats bar layout.
 * Matches the structure of actual stat items with title, value, and description placeholders.
 * 
 * Features:
 * - Responsive grid layout matching StatsBar
 * - Matches actual stat card dimensions
 * - Uses provided gridColumns to match actual layout
 */
const StatsSkeleton = ({ count = 6, gridColumns = 'lg:grid-cols-4' }: StatsSkeletonProps) => {
  // Use the provided gridColumns directly to match StatsBar layout
  const finalGridColumns = gridColumns

  return (
    <article 
      className={clsx(
        `grid grid-cols-1 ${finalGridColumns} gap-8 px-16 md:px-32 lg:px-4 py-8 max-w-7xl mx-auto`
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            "flex flex-col items-center text-center pb-6 lg:pb-0",
            index !== count - 1 && "border-b lg:border-b-0 border-darkSand"
          )}
        >
          {/* Stat title skeleton */}
          <Skeleton className="h-5 w-24 mb-4" />
          {/* Stat value skeleton */}
          <Skeleton className="h-12 md:h-14 w-32 mb-2" />
          {/* Optional description skeleton (randomly show for some items) */}
          {index % 2 === 0 && (
            <Skeleton className="h-4 w-40 mt-2" />
          )}
        </div>
      ))}
    </article>
  )
}

export { StatsSkeleton }

