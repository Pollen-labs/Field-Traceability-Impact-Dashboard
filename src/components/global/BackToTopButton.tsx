import { CircleArrowUp } from "lucide-react"

/**
 * BackToTopButton - Component that provides a user-friendly way to scroll back to the top of the page
 * 
 * Renders a simple button with an upward arrow icon and text that, when clicked,
 * smoothly scrolls the window back to the top of the page.
 * 
 * Features:
 * - Consistent styling with the application's design language
 * - Smooth scrolling animation for better user experience
 * - Visual cue (arrow icon) indicating the action
 * - Hover cursor change to indicate clickability
 * 
 * Typically placed at the bottom of long pages to improve navigation.
 */
const BackToTopButton = () => {
  return (
    <div 
      className='flex flex-row items-center gap-2 font-normal text-fluid-sm text-ocean cursor-pointer'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}
    >
      {/* Arrow icon pointing upward */}
      <CircleArrowUp color="#2985D0" strokeWidth={2}/>
      {/* Button text */}
      <p>Back to top</p>
    </div>
  )
}

export { BackToTopButton }
