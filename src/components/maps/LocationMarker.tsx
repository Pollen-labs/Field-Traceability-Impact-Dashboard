import { Marker, Popup } from 'react-leaflet'
import { Link } from '@tanstack/react-router'
import { Icon } from "leaflet"
import { MapItem } from '@/types'
import { useEffect } from 'react'

/**
 * Interface for the LocationMarker component props
 * @property {MapItem} record - Location data to be displayed as a map marker
 */
interface LocationMarkerProps {
  record: MapItem
}

/**
 * LocationMarker - Component for rendering interactive location markers on the map
 * 
 * Creates a map marker with a popup that displays:
 * - Location name with link to detail page
 * - Location type (text only, no icon)
 * - Activity metrics (for product page maps)
 * 
 * Features:
 * - Custom icons based on location type (Port, Recycler, Manufacturer)
 * - Interactive popups with location details
 * - Direct navigation to location detail pages
 * - Activity metrics visualization (when available)
 * - Validation to prevent rendering markers with invalid coordinates
 */
export const LocationMarker = ({ record }: LocationMarkerProps) => {
  // Add styles for Leaflet popup shadow and min-width
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .leaflet-popup-content-wrapper {
        box-shadow: 15px 15px 45px -15px rgb(0 0 0 / 0.22) !important;
        min-width: 200px !important;
        border-radius: 24px !important;
        border: 0.75px solid #BFBFBF !important;
      }
      .leaflet-popup-content {
        margin: 24px !important;
        min-width: 200px !important;
      }
      .leaflet-marker-icon {
        cursor: pointer !important;
      }
      .leaflet-popup-tip {
        display: none !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Destructure location data from the record
  const { id, name, country, coordinates, type, wallet_addresses, events } = record

  // Don't render marker if coordinates are invalid
  // This prevents map errors and ensures only valid locations are displayed
  if (!coordinates?.length || coordinates.length !== 2 || typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number' ) {
    console.warn(`LocationMarker: Invalid coordinates for location ID ${id}, Name: ${name}:`, coordinates);
    return null
  }

  // Map the type to the correct icon filename
  const getIconFilename = (type: string) => {
    const pinIcon = {
      manufacturer: 'map-pin-factory.svg',
      port: 'map-pin-port.svg',
      recycler: 'map-pin-recycler.svg'
    }[type.toLowerCase()] || 'map-pin-factory.svg';

    return pinIcon;
  }

  const pinIcon = getIconFilename(type || '')

  // Create custom marker icon based on location type
  const markerIcon = new Icon({
    iconUrl: `/partner-icons/${pinIcon}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -50],
    className: 'cursor-pointer'
  })

  return (
    <Marker 
      key={id} 
      position={coordinates as [number, number]} // Use original coordinates
      icon={markerIcon} // Keep custom icon
    >
      <Popup className="rounded-3xl" closeButton={false}>
        <div className="p-0 w-full relative inline-flex flex-col justify-start items-start gap-6">
          {/* Location name and type section */}
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            {/* Location name and arrow */}
            <div className="self-stretch inline-flex justify-between items-center gap-4">
              <Link 
                to="/locations/$id"
                params={{ id }}
                search={{ 
                  name,
                  country,
                  coordinates,
                  type,
                  addresses: wallet_addresses 
                }}
                className="group flex-1"
              >
                <div className="justify-start text-[hsl(var(--foreground))] text-3xl font-bold leading-7">{name}</div>
              </Link>
              <Link 
                to="/locations/$id"
                params={{ id }}
                search={{ 
                  name,
                  country,
                  coordinates,
                  type,
                  addresses: wallet_addresses 
                }}
                className="group flex-shrink-0"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M21.3265 12.0001C21.3265 11.749 21.2261 11.5179 21.0251 11.3271L14.3756 4.68756C14.1546 4.46659 13.9336 4.38623 13.6925 4.38623C13.2004 4.38623 12.8187 4.74782 12.8187 5.25006C12.8187 5.49113 12.899 5.72213 13.0598 5.88289L15.3098 8.17304L18.6948 11.2567L16.264 11.1061H3.55751C3.04524 11.1061 2.67358 11.4777 2.67358 12.0001C2.67358 12.5224 3.04524 12.894 3.55751 12.894H16.264L18.7048 12.7434L15.3098 15.8271L13.0598 18.1172C12.899 18.2679 12.8187 18.509 12.8187 18.7501C12.8187 19.2523 13.2004 19.6139 13.6925 19.6139C13.9336 19.6139 14.1446 19.5235 14.3455 19.3327L21.0251 12.673C21.2261 12.4822 21.3265 12.2512 21.3265 12.0001Z" fill="#0D0D0D"/>
                </svg>
              </Link>
            </div>
            {/* Location type text - no icon */}
            <div className="self-stretch inline-flex justify-start items-center">
              <div className="text-center justify-start text-[hsl(var(--foreground))] text-sm font-light leading-4 capitalize">{type}</div>
            </div>
          </div>

          {/* Actions section - only rendered if events data exists */}
          {events && (
            <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="flex-1 justify-start text-[hsl(var(--foreground))] text-lg font-bold leading-5">Actions</div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-1">
                {Object.entries(events).map(([action, value]) => {
                  const actionColors: Record<string, string> = {
                    batch: 'bg-[hsl(var(--batch))]',
                    sorting: 'bg-[hsl(var(--sorting))]',
                    pelletizing: 'bg-[hsl(var(--pelletizing))]',
                    shredding: 'bg-[hsl(var(--shredding))]',
                    manufacturing: 'bg-[hsl(var(--manufacturing))]'
                  };
                  
                  return (
                    <div key={action} className="self-stretch pr-[5px] inline-flex justify-between items-start">
                      <div className="flex justify-start items-center gap-1">
                        <div className={`w-4 h-4 rounded-full ${actionColors[action.toLowerCase()] || 'bg-gray-200'}`} />
                        <div className="justify-start text-[hsl(var(--foreground))] text-lg font-medium leading-5 capitalize">{action}</div>
                      </div>
                      <div className="text-right justify-start text-[hsl(var(--foreground))] text-lg font-medium leading-5">{value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* Custom popup pointer - positioned outside content wrapper */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{ bottom: '-20px', zIndex: 2 }}>
          <svg width="42" height="21" viewBox="0 0 42 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.2021 18.6239C19.1068 20.5759 22.2456 20.5758 24.1504 18.6239L39.9912 2.3915H1.36426L17.2021 18.6239ZM23.6133 18.1005C22.0028 19.7504 19.3496 19.7505 17.7393 18.1005L3.14355 3.1415H38.2119L23.6133 18.1005Z" fill="#BFBFBF"/>
            <path d="M17.7453 18.1171C19.3546 19.7602 21.9998 19.7602 23.6091 18.1171L41.3545 0H0L17.7453 18.1171Z" fill="#FFFFFF"/>
          </svg>
        </div>
      </Popup>
    </Marker>
    
  )
}