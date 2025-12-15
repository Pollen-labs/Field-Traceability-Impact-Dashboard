import { useEffect, useState, useRef } from 'react'

/**
 * Props for AnimatedNumber component
 */
interface AnimatedNumberProps {
  /**
   * The target number to count up to
   */
  value: number
  /**
   * Duration of the counting animation in milliseconds
   * Default: 800ms
   */
  duration?: number
  /**
   * Delay before starting the animation in milliseconds
   * Default: 0ms
   */
  delay?: number
  /**
   * Whether to format large numbers with K notation (e.g., 1000 -> 1K)
   * Default: true
   */
  formatLargeNumbers?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * External visibility control - when true, animation starts
   */
  isVisible: boolean
}

/**
 * AnimatedNumber - Component that animates a number counting up from 0
 * 
 * Features:
 * - Smooth counting animation from 0 to target value
 * - Scroll-triggered (controlled by parent's intersection observer)
 * - One-time animation (doesn't repeat)
 * - Optional formatting for large numbers (K notation)
 * - Fast, responsive animation
 */
const AnimatedNumber = ({
  value,
  duration = 1500,
  delay = 150,
  formatLargeNumbers = true,
  className = '',
  isVisible,
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0)
  const hasAnimatedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Don't animate if not visible or already animated
    if (!isVisible || hasAnimatedRef.current) {
      return
    }

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Start animation after delay
    timeoutRef.current = setTimeout(() => {
      hasAnimatedRef.current = true
      startTimeRef.current = Date.now()

      const animate = () => {
        if (!startTimeRef.current) return

        const elapsed = Date.now() - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)

        // Easing function for smooth animation (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentValue = Math.floor(easeOut * value)

        setDisplayValue(currentValue)

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          // Ensure final value is set exactly
          setDisplayValue(value)
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }
        }
      }

      // Start animation immediately
      animationFrameRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isVisible, value, duration, delay])

  // Format the display value
  const formatValue = (num: number): string => {
    if (formatLargeNumbers && num > 9999) {
      return `${Math.round(num / 1000)}K`
    }
    return num.toString()
  }

  return (
    <span className={className}>
      {formatValue(displayValue)}
    </span>
  )
}

export { AnimatedNumber }
