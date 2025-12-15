import { materialsChartLegendDescriptions, activitesChartLegendDescriptions } from "@/config/texts"
import { formatCamelCaseString } from "@/utils/camelCaseFormatter"

/**
 * Interface for the CustomChartLegend component props
 * @property {string} category - Determines which legend to display ("materials" or "activities")
 */
interface ChartLegendProps {
  category: string
}

/**
 * CustomChartLegend - Component that displays explanatory legend for charts
 * 
 * Renders a responsive grid of legend items with:
 * - Color indicators matching chart elements
 * - Category names with proper formatting
 * - Detailed descriptions of each category
 * 
 * The component supports two different legend types:
 * - "materials": Explains different material types (plastic, metal, nets, etc.)
 * - "activities": Explains different collection activities (fishing for litter, beach cleanup, etc.)
 * 
 * The grid layout adapts to screen size:
 * - 1 column on mobile
 * - 2 columns on tablets
 * - 4 columns on desktop
 */
const CustomChartLegend = ({ category }: ChartLegendProps) => {
  // Select the appropriate legend data based on category prop
  const legendInfo = category === "materials" ? materialsChartLegendDescriptions : activitesChartLegendDescriptions;
  
  // Helper function to convert space-separated keys to camelCase for CSS classes
  const getCssClassName = (key: string): string => {
    return key.replace(/\s+(\w)/g, (_, letter) => letter.toUpperCase());
  };
  
  return (
    <article className="w-full flex justify-center px-4 py-8 md:px-6 lg:px-8 lg:py-0">
      {/* Responsive grid layout with different column counts based on screen size */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl xl:max-w-7xl 2xl:max-w-[1400px]">
        {/* Map through legend items and create entry for each */}
        {Object.entries(legendInfo).map(([type, description]) => (
          <div key={type} className="flex items-start gap-2">
            {/* Color indicator circle matching chart colors */}
            <div className="flex-shrink-0">
              <div className={`h-6 w-6 rounded-full bg-${getCssClassName(type)}`}></div>
            </div>
            <div>
              {/* Category name with camelCase formatting (e.g., "mixedPlastic" → "Mixed plastic") */}
              <h3 className="text-fluid-lg font-bold">{formatCamelCaseString(type)}</h3>
              {/* Detailed description of the category */}
              <p className="text-fluid-sm font-extralight leading-tight">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export { CustomChartLegend }