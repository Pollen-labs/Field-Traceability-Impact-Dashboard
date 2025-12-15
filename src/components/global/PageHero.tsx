import { useIntersectionObserver } from '@/hooks/ui/useIntersectionObserver'
import { clsx } from 'clsx'

/**
 * Interface for the PageHero component props
 * @property {string} title - Main heading text for the page
 * @property {string} description - Subheading or introductory text for the page
 */
interface PageHeroProps {
  title: string,
  description: string
}

/**
 * PageHero - Primary heading component for main pages
 * 
 * Creates a prominent, centered heading section at the top of main pages
 * with a large title and supporting description text.
 * 
 * Features:
 * - Responsive typography that scales based on viewport size
 * - Centered layout with consistent spacing
 * - Narrower width on larger screens for improved readability
 * - Consistent styling across the application for visual coherence
 * - Scroll-triggered fade-slide-up animations
 * 
 * Used on Home, Locations, Vessels, and About pages to establish
 * the main theme and purpose of each section.
 */
const PageHero = ({ title, description }: PageHeroProps) => {
  const [titleRef, isTitleVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  })

  const [descriptionRef, isDescriptionVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  })

  return (
    <article className={`w-full lg:w-[75%] flex flex-col justify-center items-center gap-4 text-center`}>
      {/* Main page heading with responsive typography and scroll-triggered fade-slide-up animation */}
      <h1 
        ref={titleRef}
        className={clsx(
          'w-full font-bold text-5xl md:text-7xl tracking-tight animate-on-scroll',
          isTitleVisible && 'animate-fade-slide-up'
        )}
      >
        {title}
      </h1>
      {/* Descriptive subheading with lighter weight for visual hierarchy and delayed scroll-triggered fade-slide-up animation */}
      <p 
        ref={descriptionRef}
        className={clsx(
          'w-full font-extralight text-lg md:text-xl tracking-tight leading-tight md:leading-tight animate-on-scroll',
          isDescriptionVisible && 'animate-fade-slide-up-delay'
        )}
      >
        {description}
      </p>
    </article>
  )
}

export { PageHero }