import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Options for the Intersection Observer hook
 */
interface UseIntersectionObserverOptions {
  /**
   * Threshold for triggering the intersection (0-1)
   * 0 means trigger as soon as any part enters viewport
   * 1 means trigger only when fully visible
   */
  threshold?: number
  /**
   * Root margin for the intersection observer
   * Useful for triggering animations slightly before element enters viewport
   */
  rootMargin?: string
  /**
   * Whether to trigger only once (default: true)
   * If false, will trigger every time element enters viewport
   */
  triggerOnce?: boolean
}

/**
 * Custom hook that uses Intersection Observer API to detect when an element enters the viewport
 * 
 * @param options - Configuration options for the intersection observer
 * @returns A tuple containing [ref, isIntersecting] where:
 *   - ref: Ref callback to attach to the element
 *   - isIntersecting: Boolean indicating if element is currently intersecting
 * 
 * @example
 * ```tsx
 * const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })
 * return <h1 ref={ref} className={isVisible ? 'animate-fade-slide-up' : ''}>Title</h1>
 * ```
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): [React.RefCallback<HTMLElement>, boolean] => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options

  const [isIntersecting, setIsIntersecting] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)
  const hasTriggeredRef = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((node: HTMLElement | null) => {
    // Clean up previous observer if element changed
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    elementRef.current = node

    if (!node) {
      setIsIntersecting(false)
      return
    }

    // If triggerOnce is true and we've already triggered, don't observe again
    if (triggerOnce && hasTriggeredRef.current) {
      setIsIntersecting(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true)
            if (triggerOnce) {
              hasTriggeredRef.current = true
              observer.unobserve(node)
            }
          } else if (!triggerOnce) {
            setIsIntersecting(false)
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observerRef.current = observer
    observer.observe(node)
  }, [threshold, rootMargin, triggerOnce])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return [ref, isIntersecting]
}

