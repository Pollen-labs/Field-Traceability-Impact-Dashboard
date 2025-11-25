import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PageHero } from '@/components/global/PageHero'
import { StatsBar } from '@/components/global/StatsBar'
import { TableActionsBar } from '@/components/tables/TableActionsBar'
import { ActionsTable } from '@/components/tables/ActionsTable'
import { vesselsPageTexts, vesselTypes } from '@/config/texts'
import { PartnerType } from '@/types'
import { useMediaQuery } from '@/hooks/ui/useMediaQuery'
import { DESKTOP_BREAKPOINT } from '@/config/constants'

/**
 * Creates a route for the vessels page using TanStack Router
 * This defines the component that will be rendered at the '/vessels/' path
 */
export const Route = createFileRoute('/vessels/')({
  component: VesselsComponent,
})

/**
 * VesselsComponent - Page displaying all vessel partners and their collection activities
 * 
 * Provides an overview of all vessels participating in the collection program with:
 * - Hero section with title and description
 * - Summary statistics about vessel activities
 * - Filterable table of vessels with their details and collection statistics
 * 
 * Users can filter the table by vessel type (Trawler, Small vessel, Purse seiner, etc.)
 */
function VesselsComponent() {
  // Destructure text content from config
  const { heroTitle, heroDescription } = vesselsPageTexts
  // State to track currently selected vessel type filter
  // Default is "See all" to show all vessel types initially
  const [selectedVesselType, setSelectedVesselType] = useState<PartnerType>("See all")
  // Check if the view is desktop
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  return (
    <main className='flex flex-col justify-center items-center gap-8 md:gap-16 m-auto md:pt-8 lg:pt-16 max-w-[1440px]'>
      <PageHero title={heroTitle} description={heroDescription} />
      <StatsBar pageName='Vessels'/>

      <section className='w-full'>
        {/* Filter controls for the vessels table */}
        <TableActionsBar 
          pageName='Vessels'
          partnerTypes={vesselTypes} 
          selectedPartnerType={selectedVesselType}
          setSelectedPartnerType={setSelectedVesselType}
          isDesktop={isDesktop}
        />
        
        {/* Mobile Title */}
        <h2 className="block lg:hidden text-xl font-semibold mt-8 mb-4 px-1">Vessels list</h2>

        {/* Remove top/bottom padding on mobile, keep for desktop */}
        <div className='overflow-hidden rounded-3xl lg:pt-8 lg:pb-16'>
          {/* Table displaying vessel data filtered by selected type */}
          <ActionsTable pageName='Vessels' partnerType={selectedVesselType} />
        </div>          
      </section> 
    </main>
  )
}
