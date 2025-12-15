import { createFileRoute, useSearch } from '@tanstack/react-router'
import { VesselSearchParams, AttestationItem } from '@/types'
import { useState } from 'react'
import { DetailPageHeading } from '@/components/global/DetailPageHeading'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { StatsBar } from '@/components/global/StatsBar'
import { CollectionChart } from '@/components/charts/CollectionChart'
import { MaterialBreakdownChart } from '@/components/charts/MaterialBreakdownChart'
import { CustomChartLegend } from '@/components/charts/CustomChartLegend'
import { AttestationsTable, ColumnDef } from '@/components/tables/AttestationsTable'
import { useAttestationData } from "@/hooks/api/useAttestationData"
import { useVesselMaterialBreakdown } from '@/hooks/api/useVesselMaterialBreakdown'
import { ArrowUpRight } from 'lucide-react'
import { DetailPageBackNav } from '@/components/global/DetailPageBackNav'
import { BackToTopButton } from '@/components/global/BackToTopButton'
import { dateChoices, partnerDetailInfo, attestationDescriptions } from '@/config/texts'

/**
 * Creates a route for the vessel detail page using TanStack Router
 * This defines the component that will be rendered at the '/vessels/$id' path
 * The $id parameter is a dynamic route segment that represents the vessel's unique identifier
 */
export const Route = createFileRoute('/vessels/$id')({
  component: VesselDetailComponent,
})

/**
 * VesselDetailComponent - Detailed information page for a specific vessel
 * 
 * Displays comprehensive data about an individual vessel including:
 * - Vessel identification and registration details
 * - Collection statistics and performance metrics
 * - Time-series charts of waste collection activities
 * - Blockchain attestations for verification of collection activities
 * 
 * Data is loaded dynamically based on the vessel ID from the URL parameter
 * and additional vessel details from the search/query parameters
 */
function VesselDetailComponent() {
  // Extract vessel ID from route parameters
  const { id } = Route.useParams()
  // Extract vessel details from search/query parameters
  const search = useSearch({ from: `/vessels/$id` }) as VesselSearchParams
  const { name, country, port, type, collector_identity } = search
  // State for chart date range filter with default value "All time"
  const [selectedChartDates, setSelectedChartDates] = useState('All time')
  // Destructure text content from config
  const { heading, statSubtitle, statDescription } = partnerDetailInfo["Vessel"]

  // --- Fetch Attestation Data for Vessel ---
  const { isPending: isLoadingAttestations, error: attestationsError, data: attestationsResponse } = 
    useAttestationData({ pageName: 'VesselDetail', partnerId: id });
  
  const attestationsData: AttestationItem[] = attestationsResponse?.data ?? [];
  const totalAttestationRecords = attestationsResponse?.count ?? 0;

  // --- Fetch Material Breakdown Data ---
  const { 
    isPending: isLoadingMaterialBreakdown, 
    error: materialBreakdownError, 
    data: materialBreakdownData 
  } = useVesselMaterialBreakdown(id);

  // --- Define Columns for Vessel Table --- (5 columns)
  const vesselColumns: ColumnDef<AttestationItem>[] = [
    {
      id: 'actionDate',
      header: 'Action date',
      cell: (item) => item.dateFormatted || 'N/A', 
      width: 'w-[20%]', // Adjusted width
      isSortable: true,
      sortAccessor: (item) => item.timestamp ? new Date(item.timestamp) : null,
    },
    {
      id: 'action',
      header: 'Action type',
      cell: (item) => item.action || 'N/A',
      width: 'w-[20%]', // Adjusted width
    },
    {
      id: 'totalWeight',
      header: 'Waste collected',
      // Access totalInputWeight, append Kg
      cell: (item) => item.totalInputWeight !== undefined ? `${item.totalInputWeight} Kg` : 'N/A', 
      width: 'w-[20%]', // Adjusted width
    },
    {
      id: 'submittedBy',
      header: 'Submitted by',
      cell: (item) => item.submittedBy ? formatAddress(item.submittedBy, 4, 5) : 'N/A',
      width: 'w-[20%]', // Adjusted width
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
  ];
  // --- End Define Columns ---

  // --- Define Mobile Card Renderer for Vessel --- 
  const renderVesselMobileCard = (item: AttestationItem) => {
      const attestationUrl = `https://optimism.easscan.org/attestation/view/${item.id}`;
      return (
          <a 
            href={attestationUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block text-current no-underline hover:text-current"
          >
            {/* Add Waste Collected info */}
            <div className='border border-darkSand rounded-2xl p-4 text-fluid-sm'> 
                <div className='flex justify-between items-start mb-1'>
                    <span className='text-fluid-sm text-gray-600'>{item.dateFormatted || 'N/A'}</span>
                </div>
                <p className='font-semibold text-fluid-2xl mb-1'>{item.action || 'N/A'}</p>
                {/* Add Waste Collected info */}
                <p className='text-fluid-base text-gray-800 mb-6'>Wasted collected: {item.totalInputWeight !== undefined ? `${item.totalInputWeight} Kg` : 'N/A'}</p> 
                <p className='text-fluid-sm text-gray-700 mb-1'>
                    Submitted by: {item.submittedBy ? formatAddress(item.submittedBy, 4, 5) : 'N/A'}
                </p>
                <div className='text-fluid-sm text-gray-700 flex items-center'>
                    Attestation UID: {item.id ? formatAddress(item.id, 10, 10) : 'N/A'}
                    <ArrowUpRight size={14} strokeWidth={1.5} className="ml-1 flex-shrink-0" />
                </div>
            </div>
          </a>
      );
  };
  // --- End Define Mobile Card Renderer ---

  return (
    <main className='flex flex-col justify-center items-center gap-8 m-auto pt-0 pb-16 lg:pb-32 md:pt-8 lg:pt-16 max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1920px]'>
      {/* Vessel Header - Displays vessel name, country, port, type and collector ID */}      
      <DetailPageHeading name={name} country={country} registered_port={port} type={type} collector_id={collector_identity} />
      
      {/* Statistics Section - Shows key metrics about the vessel's activities */}
      <section className="border border-primary rounded-3xl overflow-hidden text-center w-full">
        <h2 className="font-bold text-fluid-4xl tracking-tight leading-tight pt-12 lg:pb-12 px-4 md:px-10 lg:px-20">{heading}</h2>
        {/* Stats dashboard with vessel-specific metrics */}
        <StatsBar pageName='VesselDetail' partnerId={id}/>
        <Separator />
        {/* Additional contextual information about the statistics */}
        <div className='py-12 px-4 md:px-10 lg:px-20'>
          <h3 className='font-bold text-fluid-xl tracking-tight leading-tight px-12 pb-2'>{statSubtitle}</h3>
          <p className='font-extralight text-fluid-base tracking-tight leading-tight'>{statDescription}</p>
        </div>
      </section>

      {/* Collection Activity Chart Section - Visualizes collection data by action type */}
      <section className="w-full border border-primary rounded-3xl overflow-hidden pb-4 md:pb-14">
        {/* Chart header with title and time range filters */}
        <article className='px-4 py-8 md:p-12 md:pb-0 text-center'>
          <div className='flex flex-col items-center gap-4'>
            <h2 className='font-bold text-fluid-4xl tracking-tight leading-tight pb-4'>Waste removed by action type</h2>
            {/* Time range filter buttons */}
            <div className="flex flex-row justify-center gap-1 md:gap-2">
              {dateChoices.map((choice) => (
                <Button
                  key={choice}
                  variant={selectedChartDates === choice ? 'default' : 'outline'}
                  className='text-fluid-xs'
                  onClick={() => setSelectedChartDates(choice)}
                >
                  {choice}
                </Button>
              ))}
            </div>
          </div>
        </article>

        <CollectionChart
          pageName='VesselDetail'
          partnerId={id}
          timeRange={selectedChartDates}
        />
        <CustomChartLegend category="activities" />
      </section>

      {/* Material Breakdown Chart Section - NEW SECTION */}
      <section className="w-full border border-primary rounded-3xl overflow-hidden p-6 md:p-12">
        {isLoadingMaterialBreakdown ? (
          <div>Loading material breakdown...</div>
        ) : materialBreakdownError ? (
          <div>Error loading material breakdown: {materialBreakdownError.message}</div>
        ) : materialBreakdownData && materialBreakdownData.breakdown.length > 0 ? (
           <MaterialBreakdownChart 
             data={materialBreakdownData} 
             title="What this collector collected at sea" 
             description="This chart shows what this fishing crew pulled from the ocean. Each material—like ghost nets or mixed plastic—represents a piece of marine waste that's no longer drifting at sea. It's a snapshot of the impact made by just one vessel out on the water."
           />
        ) : (
          <div>No material breakdown data available for this vessel.</div>
        )}
      </section>

      {/* Attestations Section - Displays blockchain verification records */}
      <section className='flex flex-col gap-3 my-6 md:my-20 w-full md:w-[100%]'>
        <h2 className='font-bold text-fluid-4xl tracking-tight leading-tight'>Attestations</h2>
        <p className='w-full md:w-[70%] font-extralight text-fluid-base tracking-tight leading-tight'>{attestationDescriptions["Vessel"]}</p>
        <Separator className='bg-softBlack my-1'/>
        <AttestationsTable
          data={attestationsData}
          columns={vesselColumns}
          renderMobileCard={renderVesselMobileCard}
          isLoading={isLoadingAttestations}
          error={attestationsError}
          totalRecords={totalAttestationRecords}
        />
      </section>

      {/* Navigation back to vessels listing page */}   
      <DetailPageBackNav detailType='vessel'/>
      {/* Button to scroll back to top of page */}
      <BackToTopButton />
    </main>
  )
}

// --- Helper Function (Placeholder) ---
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
