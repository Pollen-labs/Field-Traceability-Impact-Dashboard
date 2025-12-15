import { createFileRoute } from '@tanstack/react-router'
import { PageHeading } from '@/components/products/PageHeading'
import { Metadata } from '@/components/products/Metadata'
import { ActivityMap } from '@/components/maps/ActivityMap'
import { AttestationsTable, ColumnDef } from '@/components/tables/AttestationsTable'
import { AttestationItem } from '@/types'
import { useAttestationData } from "@/hooks/api/useAttestationData"
import { ArrowUpRight } from 'lucide-react'
import { BackToTopButton } from '@/components/global/BackToTopButton'
import { Separator } from '@/components/ui/separator'
import { attestationDescriptions } from '@/config/texts'

/**
 * Creates a route for the product detail page using TanStack Router
 * This defines the component that will be rendered at the '/products/$id' path
 * The $id parameter is a dynamic route segment that represents the product's unique identifier
 */
export const Route = createFileRoute('/products/$id')({
  component: ProductDetailComponent
})

/**
 * ProductDetailComponent - Detailed information page for a specific product
 * 
 * Displays comprehensive data about an individual product including:
 * - Product identification and header information
 * - Interactive map showing the supply chain and traceability
 * - Product metadata and batch information
 * - Blockchain attestations verifying product authenticity
 * 
 * The page uses a consistent section layout pattern through the Section component
 * to maintain visual consistency across different information categories
 */
function ProductDetailComponent() {
  // Extract product ID from route parameters
  const { id } = Route.useParams()

  // --- Fetch Attestation Data for Product --- 
  const { isPending: isLoadingAttestations, error: attestationsError, data: attestationsResponse } = 
    useAttestationData({ pageName: 'Product', partnerId: id })
  
  const attestationsData: AttestationItem[] = attestationsResponse?.data ?? []
  const totalAttestationRecords = attestationsResponse?.count ?? 0
  // --- End Fetch Attestation Data ---

  // --- Define Columns for Product Table --- (5 columns)
  const productColumns: ColumnDef<AttestationItem>[] = [
    {
      id: 'actionDate',
      header: 'Action date',
      cell: (item) => item.dateFormatted || 'N/A', 
      width: 'w-[18%]', // Adjusted width
      isSortable: true,
      sortAccessor: (item) => item.timestamp ? new Date(item.timestamp) : null,
    },
    {
      id: 'action',
      header: 'Action type',
      cell: (item) => item.action || 'N/A',
      width: 'w-[18%]', // Adjusted width
    },
    {
      id: 'company',
      header: 'Company',
      cell: (item) => item.company || 'N/A', // Added company column
      width: 'w-[20%]', // Adjusted width
    },
    {
      id: 'submittedBy',
      header: 'Submitted by',
      cell: (item) => item.submittedBy ? formatAddress(item.submittedBy, 4, 5) : 'N/A',
      width: 'w-[24%]', // Adjusted width
    },
    {
      id: 'attestationUid',
      header: 'Attestation UID',
      cell: (item) => (
        <div className="flex items-center justify-between">
           <span>{item.id ? formatAddress(item.id, 10, 10) : 'N/A'}</span>
           <ArrowUpRight size={16} strokeWidth={1.5} className="ml-2 flex-shrink-0" />
        </div>
      ),
      width: 'w-[20%]', // Adjusted width
    },
  ]
  // --- End Define Columns ---

  // --- Define Mobile Card Renderer for Product --- 
  const renderProductMobileCard = (item: AttestationItem) => {
      const attestationUrl = `https://optimism.easscan.org/attestation/view/${item.id}`
      return (
          <a 
            href={attestationUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block text-current no-underline hover:text-current"
          >
            {/* Same card structure, add company info */}
            <div className='border border-darkSand rounded-2xl p-4 text-sm'> 
                <div className='flex justify-between items-start mb-1'>
                    <span className='text-sm text-gray-600'>{item.dateFormatted || 'N/A'}</span>
                </div>
                <p className='font-semibold text-2xl mb-1'>{item.action || 'N/A'}</p> {/* Reduced margin */}
                {/* Add Company info */}
                <p className='text-sm text-gray-800 mb-6'>By: {item.company || 'N/A'}</p> 
                <p className='text-sm text-gray-700 mb-1'>
                    Submitted by: {item.submittedBy ? formatAddress(item.submittedBy, 4, 5) : 'N/A'}
                </p>
                <div className='text-sm text-gray-700 flex items-center'>
                    Attestation UID: {item.id ? formatAddress(item.id, 10, 10) : 'N/A'}
                    <ArrowUpRight size={14} strokeWidth={1.5} className="ml-1 flex-shrink-0" />
                </div>
            </div>
          </a>
      )
  }
  // --- End Define Mobile Card Renderer ---

  return (
    <main className='flex flex-col justify-center items-center gap-8 m-auto pb-16 md:pb-24 md:pt-8 lg:pt-16 max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1920px]'>
      {/* Product Header - Displays product name and primary information */} 
      <PageHeading productId={id} dataCategory="Heading"/>
      {/* Traceability Section - Shows interactive map of product journey */}
      <Section 
        title='Traceability'
        description='Actions performed by each partner contributing to this product.'
        children={<ActivityMap pageName='Product' productId={id} />}
      />
      {/* Batch Information Section - Displays product specs and composition */}
      <Section 
        title='Batch information'
        description='Key production and compostion info for this product.'
        children={<Metadata productId={id} dataCategory="Metadata" />}
      />  
      {/* Attestations Section - Shows blockchain verification records */}
      <Section 
        title='Attestations'
        description={attestationDescriptions["Product"]}
        children={
          <AttestationsTable
            data={attestationsData}
            columns={productColumns}
            renderMobileCard={renderProductMobileCard}
            isLoading={isLoadingAttestations}
            error={attestationsError}
            totalRecords={totalAttestationRecords}
          />
        }
      />
      {/* Button to scroll back to top of page */}
      <BackToTopButton />
    </main>
  )
}

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

// reusable component for product page sections with standarized styling
const Section = ({ title, description, children }: SectionProps) => (
  <section className='flex flex-col gap-3 w-full'>
    <h2 className='font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight'>{title}</h2>
    <p className='w-full md:w-[70%] font-extralight tracking-tight leading-tight md:leading-tight'>
      {description}
    </p>
    <Separator className='bg-softBlack my-1'/>
    {children}
  </section>
)

// --- Helper Function (Placeholder) ---
// Simple address formatting utility
// TODO: Replace with actual utility from @/utils/formatAddress if it exists
const formatAddress = (address: string | undefined | null, startChars = 4, endChars = 4): string => {
  if (!address) return 'N/A';

  const trimmedAddress = address.trim();
  const internalAddress = "0x7AbcB357d8a022811e0040358E19e43137cBad72";
  const isInternal = trimmedAddress.toLowerCase() === internalAddress.toLowerCase();

  // Check if total length is less than Ox + start + end + ...
  if (trimmedAddress.length <= 2 + startChars + endChars && !isInternal) return trimmedAddress; 

  const truncated = `${trimmedAddress.substring(0, startChars + 2)}...${trimmedAddress.substring(trimmedAddress.length - endChars)}`;
  
  return isInternal ? `${truncated} / Enaleia Internal` : truncated;
};
// --- End Helper Function ---
