import { cn } from "@/lib/utils"

/**
 * Props for Skeleton component
 */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Skeleton - Base skeleton loader component with shimmer animation
 * 
 * Creates an animated grey placeholder rectangle that mimics content loading.
 * Uses a subtle shimmer effect for a polished loading experience.
 * 
 * Features:
 * - Smooth shimmer/pulse animation
 * - Uses design system colors (sand/darkSand)
 * - Fully customizable with className prop
 * - Responsive and accessible
 * 
 * @example
 * ```tsx
 * <Skeleton className="h-12 w-full" />
 * <Skeleton className="h-8 w-3/4 rounded-full" />
 * ```
 */
const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-sand",
        className
      )}
      {...props}
      aria-label="Loading..."
      aria-live="polite"
    />
  )
}

export { Skeleton }

