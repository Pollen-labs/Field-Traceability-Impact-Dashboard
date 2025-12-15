/**
* PageHeading Component
* 
* Displays the main product information section at the top of a product page.
* Handles responsive layout with different image placement for mobile/desktop.
* Includes product details, description, and blockchain attestation information.
*/

import { useProductData } from '@/hooks/api/useProductData'
import { useMediaQuery } from '@/hooks/ui/useMediaQuery'
import { DESKTOP_BREAKPOINT } from '@/config/constants'
import { ProductData } from '@/types'
import { ArrowUpRight } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/ui/useIntersectionObserver'
import { clsx } from 'clsx'
import { ProductHeadingSkeleton } from '@/components/global/ProductHeadingSkeleton'

interface PageHeadingProps {
  productId: string               // Unique identifier for the product
  dataCategory: ProductData       // Category of product data to fetch
}

const PageHeading = ({ productId, dataCategory }: PageHeadingProps) => {
  // Check viewport size for responsive layout
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  // Fetch product data from API with loading/error states
  const { isPending, error, data } = useProductData({ productId, dataCategory })
  const { type, name, manufacturedBy, image, description, UID } = data?.product || {}

  const [headingRef, isHeadingVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  })

  /*
  * Loading/Error state view
  * Shows skeleton loader for seamless loading experience
  */
  if (isPending) {
    return <ProductHeadingSkeleton />
  }

  if (error) {
    return (
      <article className="w-full lg:h-[598px] flex flex-col justify-center items-center text-center text-lg px-10">
        <p>Sorry! We are not able to show the product information at this time.</p>
        <img src="/illustrations/dolphin.svg" alt="dolphin illustration" className="w-[300px] h-[300px]"/>
      </article>
    )
  }

  return (
    <section className="w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:gap-8 items-center">

        {/* Product Information Section */}
        <article className="lg:w-[55%] flex flex-col gap-0.5 md:gap-2 lg:gap-4 font-light">
          <p className="text-base md:text-base font-extralight">{type}</p>
          <h1 
            ref={headingRef}
            className={clsx(
              "font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight animate-on-scroll",
              isHeadingVisible && 'animate-fade-slide-up'
            )}
          >
            {name}
          </h1>
          <p className="text-base md:text-base font-extralight">Manufactured by:<strong> {manufacturedBy}</strong></p>
          
          {/* Product image for mobile view */}
          {!isDesktop && 
            <div className='rounded-3xl border border-sand overflow-hidden aspect-square'>
              <img src={image} alt="product image" className="w-full h-full object-cover object-center"/>
            </div>
          }
          
          <p className="font-extralight text-lg md:text-xl tracking-tight leading-tight md:leading-tight my-4">{description}</p>
          
          {/* Blockchain Attestation Information */}
          <div className="bg-sand rounded-xl p-4 my-4">
            <p className='text-base font-extralight pb-1'>This product has been attested with Ethereum Attestation Service on Optimism network</p>
            <a 
              href={`https://optimism.easscan.org/attestation/view/${UID}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex justify-between"
            >
              <p className='text-base font-semibold'>View Certification & Attestation</p>
              <ArrowUpRight strokeWidth={2}/>
            </a>
          </div>
        </article>

        {/* Product image for desktop view */}
        {isDesktop &&
          <article className='lg:w-[45%] rounded-3xl border border-sand overflow-hidden'>
            <img src={image} alt="product image" className="w-full h-full object-cover object-center"/>
          </article>
        }
      </div>
    </section>
  )
}

export { PageHeading }