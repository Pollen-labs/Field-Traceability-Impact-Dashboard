import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/ui/useMediaQuery"
import { DESKTOP_BREAKPOINT } from "@/config/constants"
import { clsx } from "clsx"

/**
 * Props for TableSkeleton component
 */
interface TableSkeletonProps {
  /**
   * Number of rows to display (default: 5)
   */
  rowCount?: number
  /**
   * Number of columns (default: 4)
   */
  columnCount?: number
}

/**
 * TableSkeleton - Skeleton loader for table components
 * 
 * Displays animated placeholder rows that mimic table structure.
 * Adapts layout for mobile (cards) and desktop (table rows).
 * 
 * Features:
 * - Responsive layout (cards on mobile, table on desktop)
 * - Matches actual table dimensions
 * - Smooth shimmer animation
 */
const TableSkeleton = ({ rowCount = 5, columnCount = 4 }: TableSkeletonProps) => {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  if (isDesktop) {
    // Desktop: Show table rows
    return (
      <article className="w-full lg:h-[598px]">
        <div className="w-full overflow-x-auto">
          <div className="min-w-full">
            {/* Table header skeleton */}
            <div className="grid grid-cols-4 gap-4 pb-4 border-b border-darkSand mb-4">
              {Array.from({ length: columnCount }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-full" />
              ))}
            </div>
            {/* Table rows skeleton */}
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <div 
                key={rowIndex}
                className="grid grid-cols-4 gap-4 py-4 border-b border-darkSand"
              >
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <Skeleton 
                    key={colIndex} 
                    className={clsx(
                      "h-5",
                      colIndex === 0 && "w-3/4", // First column slightly narrower
                      colIndex === columnCount - 1 && "w-1/2" // Last column narrower
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </article>
    )
  }

  // Mobile: Show card layout
  return (
    <article className="w-full">
      <div className="flex flex-col gap-4">
        {Array.from({ length: rowCount }).map((_, index) => (
          <div
            key={index}
            className="border border-darkSand rounded-2xl p-4"
          >
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-3/4" />
              <div className="flex flex-col gap-2 mt-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export { TableSkeleton }

