import { useIntersectionObserver } from '@/hooks/ui/useIntersectionObserver'
import { clsx } from 'clsx'

/**
 * Props for AnimatedHeading component
 */
interface AnimatedHeadingProps {
  /**
   * The heading level (1-3)
   */
  level: 1 | 2 | 3
  /**
   * The heading text content
   */
  children: React.ReactNode
  /**
   * Additional CSS classes to apply
   */
  className?: string
  /**
   * Whether to apply a delay to the animation (for staggered effects)
   */
  delay?: boolean
  /**
   * Threshold for intersection observer (0-1)
   * Default: 0.1 (triggers when 10% of element is visible)
   */
  threshold?: number
  /**
   * Root margin for intersection observer
   * Default: '0px' (triggers exactly when element enters viewport)
   */
  rootMargin?: string
}

/**
 * AnimatedHeading - Reusable heading component with scroll-triggered fade-slide-up animation
 * 
 * Automatically animates when the heading scrolls into view using Intersection Observer.
 * Animation only triggers once - if user scrolls back up and down again, it won't re-animate.
 * 
 * Features:
 * - Fade-in and gentle slide-up animation
 * - Scroll-triggered (only animates when element enters viewport)
 * - One-time animation (doesn't loop when scrolling back)
 * - Supports h1, h2, h3 heading levels
 * - Optional delay for staggered effects
 * 
 * @example
 * ```tsx
 * <AnimatedHeading level={1} className="text-4xl font-bold">
 *   Page Title
 * </AnimatedHeading>
 * 
 * <AnimatedHeading level={2} delay className="text-2xl">
 *   Section Title
 * </AnimatedHeading>
 * ```
 */
const AnimatedHeading = ({
  level,
  children,
  className,
  delay = false,
  threshold = 0.1,
  rootMargin = '0px',
}: AnimatedHeadingProps) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
  })

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  const animationClass = delay ? 'animate-fade-slide-up-delay' : 'animate-fade-slide-up'

  return (
    <HeadingTag
      ref={ref}
      className={clsx(
        'animate-on-scroll',
        isVisible && animationClass,
        className
      )}
    >
      {children}
    </HeadingTag>
  )
}

export { AnimatedHeading }

