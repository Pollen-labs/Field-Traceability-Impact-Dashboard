import { useStatsData } from "@/hooks/api/useStatsData"
import { PageName, StatItem } from "@/types"
import { statDescriptions } from "@/config/texts"
import { AnimatedNumber } from "./AnimatedNumber"
import { useIntersectionObserver } from "@/hooks/ui/useIntersectionObserver"
import { clsx } from "clsx"
import { useEffect, useState } from "react"
import { StatsSkeleton } from "./StatsSkeleton"

/**
 * Interface for the StatsBar component props
 * @property {PageName} pageName - The page type where the stats are displayed
 * @property {string} [partnerId] - Optional ID for partner-specific stats (used on detail pages)
 */
interface StatsBarProps {
  pageName: PageName
  partnerId?: string
}

/**
 * StatsBar - Displays key statistical information for different pages
 * 
 * Renders a responsive grid of statistical items with:
 * - Dynamic layout based on number of stats
 * - Adaptive formatting for large numbers (K notation)
 * - Optional descriptive text for each statistic
 * 
 * Features:
 * - Responsive grid layout (1 column on mobile, multiple columns on larger screens)
 * - Loading and error states
 * - Automatic number formatting
 * - Descriptive text pulled from configuration
 * 
 * The component adapts its visualization based on the page context,
 * showing different stats and layouts accordingly.
 */
const StatsBar = ({ pageName, partnerId }: StatsBarProps) => {
  // Fetch stats data based on page type and optional partner ID
  const { isPending, error, data } = useStatsData({ pageName, partnerId })
  // Ensure records are an array, defaulting to empty array if no data
  const records: StatItem[] = data?.data ?? []
  // Enrich stat objects with descriptive text from configuration
  const pageStats = records.map((stat) => ({
    ...stat,
    // Add description if available for the current page and stat key
    description: statDescriptions[pageName] ? statDescriptions[pageName][stat.key] : null
  }))

  // Intersection Observer for the entire stats bar container
  const [containerRef, isContainerVisible] = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: '300px',
    triggerOnce: true,
  })

  // Fallback: Auto-start animation after component mounts (ensures it always works)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  
  useEffect(() => {
    // Start animation after a short delay to ensure component is mounted
    const timer = setTimeout(() => {
      setShouldAnimate(true)
    }, 300) // 300ms delay to allow intersection observer to trigger first

    return () => clearTimeout(timer)
  }, [])

  // Use intersection observer if it triggered, otherwise use fallback
  const isVisible = isContainerVisible || shouldAnimate

  // Dynamic grid column layout based on number of stats
  // Logic:
  // - 3-5 stats: Use that many columns (single row)
  // - 6 stats: Use 3 columns (wraps to 2 rows: 3x2)
  // - More than 6 stats: Use 2 columns (wraps to multiple rows)
  const getGridColumns = (count: number): string => {
    // Map count to Tailwind grid column classes
    // Using explicit class names so Tailwind JIT can detect them
    const gridColumnMap: Record<number, string> = {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
    }
    
    if (count <= 5) {
      // For 3, 4, or 5 stats: use that many columns in a single row
      return gridColumnMap[count] || 'lg:grid-cols-3'
    } else if (count === 6) {
      // For 6 stats: use 3 columns, which wraps to 2 rows (3x2)
      return 'lg:grid-cols-3'
    } else {
      // For more than 6 stats: use 2 columns, wraps to multiple rows
      return 'lg:grid-cols-2'
    }
  }

  const gridColumns = getGridColumns(pageStats.length)

  // Render loading skeleton or error state if data is not available
  if (isPending) {
    // Use the same gridColumns logic for skeleton
    const skeletonCount = pageStats.length || 6
    const skeletonGridColumns = getGridColumns(skeletonCount)
    return <StatsSkeleton count={skeletonCount} gridColumns={skeletonGridColumns} />
  }

  if (error || !pageStats.length) {
    return (
      <article className="w-full min-h-[200px] flex justify-center items-center text-center text-xl px-16">
        <div>Sorry, we aren't able to load the statistics right now.</div>
      </article>
    )
  }

  // Render grid of statistics with responsive layout
  return (
    <article 
      ref={containerRef}
      data-stats-container
      className={clsx(
        `grid grid-cols-2 ${gridColumns} gap-4 md:gap-8 px-4 md:px-16 lg:px-4 py-8 max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto`
      )}
    >
      {pageStats.map((stat: StatItem, index: number) => {
        // Calculate delay for staggered animation (each stat starts slightly after the previous)
        // Minimal delay for faster, more immediate start
        const animationDelay = index * 50 // 50ms delay between each stat (very quick stagger)
        
        return (
          <div
            key={stat.key}
            // Remove borders on mobile (2 columns), keep clean layout
            className="flex flex-col items-center text-center pb-4 md:pb-6 lg:pb-0"
          >
            {/* Stat title */}
            <p className="text-fluid-lg font-extralight">{stat.title}</p>
            {/* Stat value with animated counting */}
            <p className="text-fluid-4xl font-bold pt-4 pb-1">
              <AnimatedNumber
                value={stat.value}
                duration={800}
                delay={animationDelay}
                formatLargeNumbers={true}
                isVisible={isVisible}
              />
            </p>
            {/* Optional descriptive text for the statistic */}
            {stat.description && (
              <p className="text-sm font-extralight leading-tight">{stat.description}</p>
            )}
          </div>
        )
      })}
    </article>
  )
}

export { StatsBar }