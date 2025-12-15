import { NavLogo } from './NavLogo'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

/**
 * FooterNavLinks - Navigation links specific to the footer layout
 *
 * Renders internal navigation links plus external GitHub and Attestations links.
 * Uses flexbox wrapping so links reflow across lines as the viewport narrows,
 * matching the responsive behaviour shown in the footer mockups.
 */
const FooterNavLinks = () => {
  return (
    <div className="flex flex-col items-center gap-4 text-fluid-base font-extralight text-center lg:flex-row lg:flex-nowrap lg:justify-end lg:gap-10 lg:text-right">
      <Link
        to="/locations"
        activeProps={{
          className: 'font-bold',
        }}
      >
        Locations
      </Link>
      <Link
        to="/vessels"
        activeProps={{
          className: 'font-bold',
        }}
      >
        Collectors
      </Link>
      <Link
        to="/about"
        activeProps={{
          className: 'font-bold',
        }}
      >
        About
      </Link>
      <a
        href="https://github.com/Pollen-labs/BFlow"
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <div className="flex items-center justify-center gap-1 xl:justify-end">
          <p>Github</p>
          <ArrowUpRight
            strokeWidth={1}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </a>
      <a
        href="https://optimism.easscan.org/schema/view/0x1ac0face1fc9aabf1c2f9b46d3a8decb51ca0c3d06ef1f68a85d04c90820975b"
        target="_blank"
        rel="noopener noreferrer"
        className="group"
      >
        <div className="flex items-center justify-center gap-1 xl:justify-end">
          <p>Attestations</p>
          <ArrowUpRight
            strokeWidth={1}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </a>
    </div>
  )
}

/**
 * NavFooter - Footer navigation component for the application
 *
 * Provides a responsive footer that:
 * - Shows the logo with subtitle on the left
 * - Displays navigation links that wrap across lines as space becomes constrained
 * - Includes a text GitHub link with external arrow icon in the footer menu
 * - Shows a Pollen Labs credit row with logo at the bottom
 */
const NavFooter = () => {
	return (
		<footer className="px-8 pt-12 pb-16">
      <div className="m-auto flex max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1920px] flex-col gap-10">
        {/* Top area: logo and navigation (side-by-side on large screens and above) */}
        <div className="flex flex-col items-center gap-8 text-center md:gap-10 lg:flex-row lg:items-start lg:justify-between">
          {/* Logo with subtitle keeps consistent branding in the footer */}
          <NavLogo showSubtitle={true} />
          {/* Navigation links: full-width below logo on smaller screens, beside on wide */}
          <div className="mt-2 w-full xl:mt-0 xl:max-w-[60%]">
            <FooterNavLinks />
          </div>
        </div>

        {/* Bottom row: Pollen Labs credit */}
        <div className="flex flex-col items-center gap-2 border-t border-softBlack pt-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-fluid-sm font-extralight">
            Conceptualised and built by
          </p>
          <a
            href="https://pollenlabs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <img
              src="/logos/pollen_labs.svg"
              alt="Pollen Labs logo"
              className="h-14 w-auto transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </footer>
	);
};

export { NavFooter }
