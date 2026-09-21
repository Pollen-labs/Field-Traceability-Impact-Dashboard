import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/ui/useMediaQuery"
import { DESKTOP_BREAKPOINT } from "@/config/constants"

/**
 * Interface for the NavLinks component props
 * @property {(closeMenu: boolean) => void} [closeMenu] - Optional callback function to close the mobile menu
 */
interface NavLinksProps {
  closeMenu?: (closeMenu: boolean) => void
}

/**
 * NavLinks - Component that renders navigation links for the application
 * 
 * Provides a collection of navigation links used in both the header and footer.
 * Adapts its display based on the context (mobile menu vs desktop navigation):
 * - Mobile: Vertical arrangement with larger text and "Home" link included
 * - Desktop: Horizontal arrangement with smaller text and "Home" link omitted (as logo serves this purpose)
 * 
 * Each link closes the mobile menu when clicked if the closeMenu prop is provided.
 * Active links are highlighted with bold text.
 */
const NavLinks = ({ closeMenu }: NavLinksProps) => {
  // Check if viewport is desktop size for conditional rendering
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  return (
    <div className='flex flex-col lg:flex-row gap-6 text-right lg:text-center md:gap-8 text-fluid-2xl lg:text-fluid-base font-extralight'>
      {/* Home link - Only shown in mobile menu (not in desktop navigation) */}
      {!isDesktop && 
        <Link
          to="/"
          onClick={() => closeMenu && closeMenu(true)}
          activeProps={{
            className: 'font-bold',
          }}
        >
          Home
        </Link>
      }
      {/* Locations page link */}
      <Link
        to="/locations"
        onClick={() => closeMenu && closeMenu(true)}
        activeProps={{
          className: 'font-bold',
        }}
      >
        Locations
      </Link>
      {/* Vessels/Collectors page link */}
      <Link
        to="/vessels"
        onClick={() => closeMenu && closeMenu(true)}
        activeProps={{
          className: 'font-bold',
        }}
      >
        Collectors
      </Link>
      {/* Circular Economy page link, commented out to save for future release */}
      {/* <Link
        to="/economy"
        onClick={() => closeMenu && closeMenu(true)}
        activeProps={{
          className: 'font-bold',
        }}
      >
        Circular Economy
      </Link> */}
      {/* About page link */}
      <Link
        to="/about"
        onClick={() => closeMenu && closeMenu(true)}
        activeProps={{
          className: 'font-bold',
        }}
      >
        About
      </Link>
      {/* External link to attestations with arrow icon */}
      <a 
        href='https://optimism.easscan.org/schema/view/0x1ac0face1fc9aabf1c2f9b46d3a8decb51ca0c3d06ef1f68a85d04c90820975b'
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => closeMenu && closeMenu(true)}
        className="group"
      >
        <div className='flex gap-1 justify-end'>
          <p>Attestations</p>
          <ArrowUpRight strokeWidth={1} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
        </div>
      </a>
    </div>
  )
}

export { NavLinks }
