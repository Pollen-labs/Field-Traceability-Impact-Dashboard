import { createFileRoute } from '@tanstack/react-router'
import { PageHero } from '@/components/global/PageHero'
import { Card } from '@/components/about/Card'
import { BackToTopButton } from '@/components/global/BackToTopButton'
import { ArrowUpRight } from 'lucide-react'
import { aboutPageTexts, aboutCardInfo, aboutPageLinks } from '@/config/texts'
import { formatTextWithBold } from '@/utils/formatTextWithBold'
import { useIntersectionObserver } from '@/hooks/ui/useIntersectionObserver'
import { clsx } from 'clsx'

/**
 * Creates a route for the about page using TanStack Router
 * This defines the component that will be rendered at the '/about' path
 */
export const Route = createFileRoute('/about')({
  component: AboutComponent,
})
/**
 * AboutComponent - Information page describing the project's mission and process
 * 
 * Displays comprehensive information about the project with:
 * - Hero section with title, description and feature image
 * - Hub flow section explaining the material collection and processing workflow
 * - Collaboration section highlighting partnerships with external links
 * 
 * Layout is responsive with different arrangements for mobile and desktop views
 */
function AboutComponent() {
  // Destructure text content from config
  const { 
    heroTitle, 
    heroDescription, 
    hubFlowSectionTitle, 
    hubFlowSectionDescription, 
    collabSectionTitle, 
    collabSectionDescription1, 
    collabSectionDescription2 
  } = aboutPageTexts

  const [hubFlowHeadingRef, isHubFlowHeadingVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  })

  const [collabHeadingRef, isCollabHeadingVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  })

  return (
    <main className='flex flex-col justify-center items-center gap-8 m-auto pb-16 lg:pb-24 md:pt-8 lg:pt-16 max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1920px]'>      
      {/* Hero Section - Displays page title, description and hero image */}
      <section className='flex flex-col items-center gap-10'>
        <PageHero title={heroTitle} description={heroDescription}/>
        <img 
          src='/images/about_hero.jpg' 
          alt="photo of port operations" 
          className='object-cover bg-center h-[350px] md:h-[550px] lg:h-auto w-full rounded-3xl overflow-hidden'
        />
      </section> 
      {/* Hub Flow Section - Explains the material collection and processing workflow */}
      <section className='text-center my-10 md:my-24'>
        <h2 
          ref={hubFlowHeadingRef}
          className={clsx(
            'w-full font-bold text-fluid-5xl tracking-tight leading-tight px-16 pb-6 animate-on-scroll',
            isHubFlowHeadingVisible && 'animate-fade-slide-up'
          )}
        >
          {hubFlowSectionTitle}
        </h2>
        <p className='w-full font-extralight text-fluid-lg tracking-tight leading-tight px-10 md:px-16'>{formatTextWithBold(hubFlowSectionDescription)}</p>
        {/* Card grid showing the step-by-step process */}
        <div className='flex flex-col lg:flex-row gap-4 md:justify-between pt-8'>
          {aboutCardInfo.map(({ image, title, description }) => (
            <Card key={title} image={image} title={title} description={description}/>
          ))}
        </div>
      </section>
      {/* Collaboration Section - Highlights partnerships with resources to connect with Pollen Labs */}
      <section className='relative w-full min-h-[1000px] lg:min-h-[600px] overflow-hidden rounded-3xl'>
        {/* Background image with text overlay - absolutely positioned so it always fills the section top to bottom, even if content grows taller than the min-height */}
        <img
          src='/images/about_collab.jpg'
          alt="photo of sun shining on the ocean"
          className='absolute inset-0 object-cover bg-center h-full w-full'
          loading="lazy"
        />
        <div className='relative flex flex-col lg:flex-row items-start justify-start lg:justify-between p-4 pt-12 pb-10 md:p-10 md:pb-16'>
          <div className='lg:w-[75%]'>
            <h2 
              ref={collabHeadingRef}
              className={clsx(
                'flex items-center gap-4 font-bold text-fluid-5xl tracking-tight leading-tight animate-on-scroll',
                isCollabHeadingVisible && 'animate-fade-slide-up'
              )}
            >
              <img
                src="/logos/pollen_labs_logo.png"
                alt="Pollen Labs logo"
                className="h-16 w-auto"
                loading="lazy"
              />
              <span>{collabSectionTitle}</span>
            </h2>
            <p className='font-extralight text-fluid-base tracking-tight leading-tight pt-8'>
              {formatTextWithBold(collabSectionDescription1)}
            </p>
            <p
              className='font-extralight text-fluid-base tracking-tight leading-tight py-4'
              dangerouslySetInnerHTML={{ __html: collabSectionDescription2 }}
            />
          </div>
          <div className='flex flex-col gap-6 pt-8 pb-8 lg:pt-60 lg:pb-10 lg:w-[22%]'>
            {aboutPageLinks.map(({ text, url }) => (
              <a 
                key={text}
                href={url}
                target="_blank"
                rel="noopener noreferrer" 
                className='flex justify-between items-center border-b border-softBlack py-2 group'
              >
                <p className='text-fluid-base'>{text}</p>
                <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* Button to scroll back to top of page */}
      <BackToTopButton />

    </main> 
  )
}
