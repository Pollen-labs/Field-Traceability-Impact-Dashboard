import { NavLinks } from './NavLinks'
import { X } from 'lucide-react'

/**
 * NavMenu - Mobile slide-in navigation menu component
 * 
 * Creates a full-screen overlay menu for mobile navigation that displays:
 * - Close button (X icon) in the top-right corner
 * - Navigation links from the NavLinks component
 * 
 * The menu appears as a fixed position overlay over the entire screen
 * with a dark background and light text for contrast.
 * 
 * @param {Object} props - Component props
 * @param {() => void} props.closeMenu - Callback function to close the menu
 */
const NavMenu = ({ closeMenu }: { closeMenu: () => void }) => {
	return (
		<div className='fixed z-10 top-0 left-0 w-full h-full bg-softBlack px-10 py-6'>
      <div className='flex flex-col gap-10 items-end text-white text-fluid-xl'>
        {/* Close button - positioned in the top right corner */}
        <X color="white" size={40} onClick={closeMenu}/>
        {/* Navigation links - passing closeMenu function to close when a link is clicked */}
        <NavLinks closeMenu={closeMenu}/>
      </div>
		</div>
	)
}

export { NavMenu }