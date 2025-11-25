import { useState } from 'react'
import { NavLogo } from './NavLogo'
import { NavLinks } from './NavLinks'
import { NavMenu } from './NavMenu'
import { Menu } from 'lucide-react'

/**
 * NavHeader - Main navigation component for the application
 * 
 * Provides responsive navigation with different layouts for mobile and desktop:
 * - Mobile: Shows logo and hamburger menu that opens a slide-in navigation panel
 * - Desktop: Shows logo and horizontal navigation links
 * 
 * The component uses conditional rendering based on screen size through Tailwind's
 * responsive classes rather than JavaScript-based media queries for efficiency.
 */
const NavHeader = () => {
  // State to control mobile menu visibility
  const [isMenuOpened, setIsMenuOpened] = useState(false)
	return (
		<>
      {/* Mobile Navigation - Only visible on small screens (below lg breakpoint) */}
      <nav className='lg:hidden flex justify-between items-center mb-10 border border-softBlack rounded-full px-8 py-3'>
        {/* Logo component - subtitle hidden on mobile for space efficiency */}
        <NavLogo showSubtitle={false}/>
        {/* Hamburger menu icon with click handler to open mobile menu */}
        <Menu onClick={() => setIsMenuOpened(true)} />
          {/* Mobile slide-in menu - Only rendered when menu is opened */}
        {isMenuOpened && <NavMenu closeMenu={() => setIsMenuOpened(false)} />}
      </nav>
      
      {/* Desktop Navigation - Only visible on large screens (lg breakpoint and above) */}
      <nav className='hidden lg:flex justify-between items-center m-auto border border-softBlack rounded-full px-14 py-4 max-w-[1440px]'>
          {/* Logo component - same as mobile but in desktop context */}
          <NavLogo showSubtitle={false}/>
          {/* Horizontal navigation links for desktop view */}
          <NavLinks />
      </nav>
		</>
	)
}

export { NavHeader }
