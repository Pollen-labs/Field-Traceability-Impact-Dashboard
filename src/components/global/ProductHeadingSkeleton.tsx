import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/ui/useMediaQuery"
import { DESKTOP_BREAKPOINT } from "@/config/constants"

/**
 * ProductHeadingSkeleton - Skeleton loader for PageHeading component
 * 
 * Displays animated placeholder rectangles that mimic the product heading layout.
 * Adapts for mobile (image below) and desktop (image beside) layouts.
 * 
 * Features:
 * - Responsive layout matching PageHeading
 * - Matches actual product info dimensions
 * - Smooth shimmer animation
 */
const ProductHeadingSkeleton = () => {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  return (
    <section className="w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:gap-8 items-center">
        {/* Product Information Section */}
        <article className="lg:w-[55%] flex flex-col gap-0.5 md:gap-2 lg:gap-4 font-light">
          {/* Type skeleton */}
          <Skeleton className="h-5 w-32" />
          {/* Product name skeleton */}
          <Skeleton className="h-16 md:h-20 lg:h-24 w-3/4" />
          {/* Manufacturer skeleton */}
          <Skeleton className="h-5 w-64" />
          
          {/* Product image for mobile view */}
          {!isDesktop && (
            <Skeleton className="rounded-3xl aspect-square w-full" />
          )}
          
          {/* Description skeleton */}
          <div className="flex flex-col gap-2 my-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          {/* Blockchain Attestation Information skeleton */}
          <div className="bg-sand rounded-xl p-4 my-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
        </article>

        {/* Product image for desktop view */}
        {isDesktop && (
          <article className="lg:w-[45%]">
            <Skeleton className="rounded-3xl aspect-square w-full" />
          </article>
        )}
      </div>
    </section>
  )
}

export { ProductHeadingSkeleton }

