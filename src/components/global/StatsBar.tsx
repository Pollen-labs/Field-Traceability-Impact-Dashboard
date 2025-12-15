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

  // Determine grid column layout based on number of stats
  // Provides different column configurations for various stat counts
  const gridColumns = {
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6' // Homepage: 6 stats in one row
  }[pageStats.length] || 'lg:grid-cols-4'

  // Render loading skeleton or error state if data is not available
  if (isPending) {
    // Use the same gridColumns logic for skeleton, defaulting to 6 for homepage
    const skeletonCount = pageStats.length || 6
    const skeletonGridColumns = {
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
      6: 'lg:grid-cols-6' // Homepage: 6 stats in one row
    }[skeletonCount] || 'lg:grid-cols-4'
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
        `grid grid-cols-1 ${gridColumns} gap-8 px-16 md:px-32 lg:px-4 py-8 max-w-7xl mx-auto`
      )}
    >
      {pageStats.map((stat: StatItem, index: number) => {
        // Calculate delay for staggered animation (each stat starts slightly after the previous)
        // Minimal delay for faster, more immediate start
        const animationDelay = index * 50 // 50ms delay between each stat (very quick stagger)
        
        return (
          <div
            key={stat.key}
            // Add bottom border for mobile, remove for larger screens except last item
            className={`flex flex-col items-center text-center pb-6 lg:pb-0 ${index !== pageStats.length - 1 ? 'border-b lg:border-b-0' : ''} border-darkSand`}
          >
            {/* Stat title */}
            <p className="text-lg font-extralight">{stat.title}</p>
            {/* Stat value with animated counting */}
            <p className="text-4xl md:text-5xl font-bold pt-4 pb-1">
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