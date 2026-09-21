import { Skeleton } from "@/components/ui/skeleton"

/**
 * ChartSkeleton - Skeleton loader for MaterialBreakdownChart component
 * 
 * Displays animated placeholder rectangles that mimic the chart layout.
 * Includes title, description, chart area, and legend placeholders.
 * 
 * Features:
 * - Matches chart component structure
 * - Responsive layout
 * - Smooth shimmer animation
 */
const ChartSkeleton = () => {
  return (
    <div className="self-stretch rounded-[40px] flex flex-col justify-start items-start gap-8">
      {/* Title and Description Container */}
      <div className="self-stretch px-4 md:px-10 lg:px-12 pt-2 text-center">
        {/* Title skeleton */}
        <Skeleton className="h-10 w-96 mx-auto mb-4" />
        {/* Description skeleton */}
        <div className="flex flex-col gap-2 md:px-12">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5 mx-auto" />
        </div>
      </div>
      
      {/* Chart Bar Section skeleton */}
      <div className="w-full">
        <Skeleton className="w-full h-[160px] rounded-3xl" />
      </div>
     
      {/* Legend skeleton */}
      <div className="self-stretch py-8 px-4 md:px-12">
        <div className="max-w-screen-lg xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-x-12 gap-y-12">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex items-start gap-2">
              <Skeleton className="w-3 h-6 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { ChartSkeleton }

