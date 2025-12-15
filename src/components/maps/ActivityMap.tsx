import { useState, useEffect, useRef } from 'react'
import { useMapData } from '@/hooks/api/useMapData'
import { useMapState } from '@/hooks/ui/useMapState'
import { useProcessedRecords } from '@/hooks/ui/useProcessedRecords'
import { MapStateController } from '@/components/maps/MapStateController'
import { MapSizeHandler } from '@/components/maps/MapSizeHandler'
import { LocationMarker } from '@/components/maps/LocationMarker'
import { TracingLines } from '@/components/maps/TracingLines'
import { MapSkeleton } from '@/components/global/MapSkeleton'
import { PageName, PartnerType, MapItem, TraceItem, ProductPageData } from "@/types"
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L, { LatLngBoundsExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

/**
 * Interface for the ActivityMap component props
 * @property {PageName} pageName - Determines which data to fetch and display
 * @property {PartnerType} [partnerType] - Optional filter for location types on the Locations page
 * @property {string} [productId] - Required for Product page to fetch specific product data
 */
interface ActivityMapProps {
  pageName: PageName              
  partnerType?: PartnerType      
  productId? : string             
}

/**
 * ActivityMap - Interactive map component for visualizing location data
 * 
 * Uses Leaflet/React-Leaflet to render an OpenStreetMap-based visualization of:
 * - Partner locations as map markers
 * - Supply chain connections as trace lines (for product pages)
 * 
 * The component adapts its data and appearance based on the page context,
 * fetching different data sets and applying appropriate styling.
 */
const ActivityMap = ({ pageName, partnerType, productId }: ActivityMapProps) => {
  // Track tile loading errors for error handling UI
  const [tileError, setTileError] = useState(false)
  // Fetch map data based on current page context and product ID
  const { isPending, error, data} = useMapData({ pageName, productId })
  
  /**
   * Type guard to differentiate between Product page data structure and other pages' data structures
   * Product pages have a nested structure with both locations and traces
   */
  const isProductPage = (responseData: any): responseData is ProductPageData => {
    return responseData && 'locations' in responseData && 'traces' in responseData;
  }

  // Extract and normalize location data based on page type
  const records: MapItem[] = isProductPage(data?.data) 
    ? data?.data?.locations ?? [] 
    : data?.data ?? []

  // Extract trace data for Product page, empty array for other pages
  const traces: TraceItem[] = isProductPage(data?.data) 
    ? data?.data?.traces ?? [] 
    : []

  // Get map configuration (center, zoom) based on page type - Note: center/zoom are now handled dynamically
  // const [mapState] = useMapState(pageName) // <-- REMOVED (or keep if needed for initial non-fitted state)

  // Apply location filtering only when partnerType is provided (Locations page)
  const displayedLocations = partnerType
    ? useProcessedRecords(records, partnerType)
    : records

  // Add style for map tiles saturation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-tile-pane {
        filter: saturate(1.6) !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Helper component to fit map bounds
  // Only fits bounds if there's no saved map state (first time viewing)
  const MapBoundsFitter = ({ locations }: { locations: MapItem[] }) => {
    const map = useMap();
    const [mapState] = useMapState(pageName);
    const hasFittedRef = useRef(false); // Track if we've already fitted bounds

    useEffect(() => {
      if (!locations || locations.length === 0) return;
      if (hasFittedRef.current) return; // Don't refit if we've already done it

      // Filter out locations with invalid coordinates before calculating bounds
      const validLocations = locations.filter(loc => 
        loc.coordinates && loc.coordinates.length === 2 && 
        typeof loc.coordinates[0] === 'number' && 
        typeof loc.coordinates[1] === 'number'
      );
      
      if (validLocations.length === 0) return;

      // Only fit bounds if there's no saved state (first time viewing this page)
      // If there's saved state, MapStateController will handle the positioning
      if (!mapState) {
        const bounds = L.latLngBounds(validLocations.map(loc => loc.coordinates as L.LatLngTuple));
        
        if (bounds.isValid()) {
          // Use a small delay to ensure map is fully initialized and MapStateController has run
          const timeoutId = setTimeout(() => {
            // Double-check mapState hasn't been set in the meantime
            // Note: mapState check here is stale closure, but that's okay - 
            // we check it before setting timeout
            map.fitBounds(bounds, { padding: [50, 50], animate: false });
            hasFittedRef.current = true;
          }, 200); // Increased delay to let MapStateController run first

          return () => clearTimeout(timeoutId);
        } else if (validLocations.length === 1) {
          // If only one marker, center on it with a reasonable zoom level
          const timeoutId = setTimeout(() => {
            map.setView(validLocations[0].coordinates as L.LatLngTuple, 13, { animate: false });
            hasFittedRef.current = true;
          }, 200);

          return () => clearTimeout(timeoutId);
        }
      } else {
        // There's saved state, so MapStateController will handle positioning
        // Just mark as fitted to prevent future refits
        hasFittedRef.current = true;
      }

    }, [locations, map, mapState]); // Rerun when locations, map, or mapState changes

    return null; // This component doesn't render anything itself
  }

  // Display loading skeleton or error state
  if (isPending) {
    return <MapSkeleton />
  }

  if (error) {
    return (
      <article className='w-full h-[400px] md:h-[500px] lg:h-[700px] pt-3 text-center flex flex-col justify-center items-center'>
        <p className="text-lg">An error has occurred: {error.message}</p>
      </article>
    )
  }

	return (
    // Map container with responsive height and conditional styling based on page type
    <article className={`w-full h-[400px] md:h-[500px] lg:h-[700px] ${pageName==='Home' ? 'pt-3': 'overflow-hidden rounded-3xl'}`}>
      <MapContainer 
        className='h-full z-0' 
        // center={mapState.center} // <-- REMOVED
        // zoom={mapState.zoom} // <-- REMOVED
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        touchZoom={true}
        zoomControl={true}
        keyboard={true}
        attributionControl={true}
      >
        {/* OpenStreetMap tile layer with error handling */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="[filter:saturate(1.1)]"
          eventHandlers={{
            tileerror: () => {
              setTileError(true);
              console.error('Failed to load map tiles');
            }
          }}
        />
        {tileError && (
          <div className="absolute bottom-4 left-4 bg-red-50 text-red-600 px-4 py-2 rounded-md shadow-sm z-[1000]">
            Failed to load map tiles. Map functionality may be limited.
          </div>
        )}
        {/* Utility components for map resizing and state management */}
        <MapSizeHandler />
        <MapStateController  pageName={pageName}/>
        {/* Render location markers or empty state message if no locations available*/}
        {displayedLocations.length ?
          displayedLocations.map((record) => (
            <LocationMarker key={record.id} record={record} />
        ))
        : 
          <div className='flex flex-col text-center text-lg md:text-2xl font-semibold px-20 pt-28 md:pt-72'>
            <p>sorry!</p>
            <p>We aren't able to mark our locations right now.</p>
          </div>
        }
        {/* Render trace lines (only visible on Product page) */}
        <TracingLines traces={traces}/>
        {/* Add the bounds fitter component */}
        <MapBoundsFitter locations={displayedLocations} />
      </MapContainer>
    </article>
	)
}

export { ActivityMap }