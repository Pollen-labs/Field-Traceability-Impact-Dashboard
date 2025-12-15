import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { PageHero } from '@/components/global/PageHero'
import { StatsBar } from '@/components/global/StatsBar'
import { ActivityMap } from '../components/maps/ActivityMap'
import { CollectionChart } from '@/components/charts/CollectionChart'
import { CustomChartLegend } from '@/components/charts/CustomChartLegend'
import { MaterialBreakdownChart } from '@/components/charts/MaterialBreakdownChart'
import { useHomeMaterialBreakdown } from '@/hooks/api/useHomeMaterialBreakdown'
import { Button } from "@/components/ui/button"
import { BackToTopButton } from '@/components/global/BackToTopButton'
import { homePageTexts, dateChoices } from '@/config/texts'
import { useIntersectionObserver } from '@/hooks/ui/useIntersectionObserver'
import { clsx } from 'clsx'
import { ChartSkeleton } from '@/components/global/ChartSkeleton'

/**
 * Creates a route for the home page using TanStack Router
 * This defines the component that will be rendered at the '/' path
 */
export const Route = createFileRoute('/')({
  component: HomeComponent,
})

/**
 * HomeComponent - Main landing page for the application
 * 
 * Displays an overview of the application with:
 * - Hero section with title and description
 * - Impact visualization section with stats and map
 * - Waste collection data charts with time range filtering
 * - Collaboration section with links to more information
 * 
 * Layout is responsive with different arrangements for mobile and desktop
 */

function HomeComponent() {
  // Destructure text content from config
  const { 
    heroTitle, 
    heroDescription, 
    impactSectionTitle, 
    impactSectionDescription, 
    wasteChartTitle, 
    wasteChartDescription,
    collabSectionTitle,
    collabSectionDescription
  } = homePageTexts

  // State for chart date range filter with default value "All time"
  const [selectedChartDates, setSelectedChartDates] = useState('All time')

  // Fetch material breakdown data
  const { 
    data: materialData, 
    isPending: isLoadingMaterials, 
    error: materialError 
  } = useHomeMaterialBreakdown();

  // Format the total weight for the description
  const formattedTotalWeight = materialData?.totalWeight !== undefined 
    ? new Intl.NumberFormat().format(materialData.totalWeight)
    : null;
  
  // Construct the dynamic description with bolded weight
  const breakdownDescription = formattedTotalWeight
    ? (
      <>
        Thanks to our partners, exactly{" "}
        <span className="font-bold">
          {formattedTotalWeight}kg
        </span>
        {" "}of waste has been sorted by recyclers across all locations. This breakdown gives a live look at what types of plastic are making it into the recycling stream, from PET to LDPE, helping us understand what's actually being recovered and reused.
      </>
    )
    : "While all waste has been collected through the efforts of our partner fishermen, the total sorted weight is being calculated. This chart will break down sorted plastic by specific material types..." // Adjusted fallback text

  // Intersection Observer hooks for scroll-triggered animations
  const [heroButtonRef, isHeroButtonVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  })

  const [impactHeadingRef, isImpactHeadingVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  })

  const [wasteChartHeadingRef, isWasteChartHeadingVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  })

  const [collabHeadingRef, isCollabHeadingVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  })

  const [collabButtonRef, isCollabButtonVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  })

  return (
    <main className='flex flex-col justify-center items-center gap-8 m-auto pb-16 md:pb-24 md:pt-8 lg:pt-16 max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1920px]'>
      {/* Hero Section - Displays page title, description and scrolling helper */}
      <section className='flex flex-col items-center gap-6 w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px]'>
        <PageHero title={heroTitle} description={heroDescription}/>
        <Link 
          to="/products/$id" 
          params={{ id: '4767' }}
        >
          <Button 
            ref={heroButtonRef}
            className={clsx(
              'px-8 mb-8 animate-on-scroll',
              isHeroButtonVisible && 'animate-fade-slide-up-button'
            )}
          >
            See sustainable tracing in action
          </Button>
        </Link>
      </section>
      {/* Impact Visualization Section - Shows key stats and activity map */}
      <section className='overflow-hidden border border-primary rounded-3xl w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1920px]'>
        {/* Hero image with overlay text */}
        <article className='relative w-full pb-8'>
          <img 
            src='/images/home.jpg' 
            alt="photo of port operations" 
            className='object-cover bg-center h-[350px] md:h-[450px] lg:h-auto w-full'
          />
          <div className='absolute inset-0 flex flex-col items-center justify-center text-center text-sand'>
            <p 
              ref={impactHeadingRef}
              className={clsx(
                'w-full font-bold text-fluid-6xl tracking-tight leading-tight px-10 pt-4 md:pt-10 animate-on-scroll',
                isImpactHeadingVisible && 'animate-fade-slide-up'
              )}
            >
              {impactSectionTitle}
            </p>
            <p className='w-[90%] md:w-[60%] font-extralight text-fluid-lg tracking-tight leading-tight py-2 md:py-6'>{impactSectionDescription}</p>
          </div>
        </article>
        <StatsBar pageName='Home'/>
        <ActivityMap pageName='Home'/>
      </section>
      {/* Waste Collection Data Section - Displays charts with time filtering */}
      <section className='flex flex-col border border-primary rounded-3xl pb-fluid-sm'>
        {/* Chart header with title, description and time range filters */}
        <article className='px-4 pt-fluid-2xl pb-fluid-lg md:px-fluid-md text-center'>
          <p 
            ref={wasteChartHeadingRef}
            className={clsx(
              'font-bold text-fluid-4xl tracking-tight leading-tight pb-fluid-md animate-on-scroll',
              isWasteChartHeadingVisible && 'animate-fade-slide-up'
            )}
          >
            {wasteChartTitle}
          </p>
          <div className='flex flex-col items-center space-fluid-md'>
            <p className='font-extralight text-fluid-xl tracking-tight leading-tight text-center md:px-20 pt-fluid-sm'>{wasteChartDescription}</p>
            {/* Time range filter buttons */}
            <div className='flex flex-row justify-center gap-1 md:gap-2'>        
              {dateChoices.map((choice) => (
                <Button 
                  key={choice}
                  variant={selectedChartDates === choice ? "default" : "outline"}
                  className='text-fluid-xs'
                  onClick={() => setSelectedChartDates(choice)}
                >
                  {choice}
                </Button>
              ))}
            </div>
          </div>
        </article>
        
        <CollectionChart pageName='Home' timeRange={selectedChartDates}/>
        <CustomChartLegend category='materials' />

        <article className='font-extralight text-fluid-base text-center py-fluid-xl px-4 md:px-fluid-lg'>
          <p>
            To explore the individual collection activities of our partners, please view our
            <Link to="/locations" className='font-bold'>&nbsp;&nbsp;locations page</Link>
          </p>
        </article>
      </section>
      {/* --- New Section for Material Breakdown Chart --- */}
      <section className='w-full border border-primary rounded-3xl overflow-hidden pt-fluid-2xl px-6 pb-6 md:px-12 md:pb-12'> 
        {isLoadingMaterials ? (
          <ChartSkeleton />
        ) : materialError ? (
          <div className="text-center text-fluid-lg py-8">Error loading material breakdown: {materialError.message}</div>
        ) : materialData ? (
          <MaterialBreakdownChart 
            data={materialData} 
            title="All sorted materials till this very minute"
            description={breakdownDescription}
          />
        ) : (
          <div className="text-center text-fluid-lg py-8">No material breakdown data available.</div>
        )}
      </section>
      {/* --- End New Section --- */}

      {/* Collaboration Section - Information about the project with CTA */}
      <section className='flex flex-col items-center gap-8 m-auto w-full lg:w-[85%] text-center tracking-tight px-4 md:px-0 mt-20 mb-16'>
        <p 
          ref={collabHeadingRef}
          className={clsx(
            'font-bold text-fluid-4xl tracking-tight leading-tight animate-on-scroll',
            isCollabHeadingVisible && 'animate-fade-slide-up'
          )}
        >
          {collabSectionTitle}
        </p>
        <p className='w-full text-fluid-lg font-extralight leading-tight'>{collabSectionDescription}</p>
        <Link to="/about" >
          <Button 
            ref={collabButtonRef}
            className={clsx(
              'px-8 animate-on-scroll',
              isCollabButtonVisible && 'animate-fade-slide-up-button'
            )}
          >
            Learn more about how the hub works
          </Button>        
        </Link>
        {/* Button to scroll back to top of page */}
        <BackToTopButton />
      </section>
    </main>
  )
}
