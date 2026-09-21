import { useChartData } from "@/hooks/api/useChartData"
import { useChartTicks } from "@/hooks/ui/useChartTicks"
import { useMediaQuery } from "@/hooks/ui/useMediaQuery"
import { DESKTOP_BREAKPOINT } from "@/config/constants"
import { MaterialsChartConfig, ActivitiesChartConfig } from "@/config/charts"
import { PageName, MaterialsChartRecord, ActivitiesChartRecord } from "@/types"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatCamelCaseString } from "@/utils/camelCaseFormatter"
import { calculateTooltipTotal } from "@/utils/chartTooltipCalculation"

/**
 * Interface for the CollectionChart component props
 * @property {PageName} pageName - The page type where the chart is displayed (affects data and visualization type)
 * @property {string} [partnerId] - Optional ID for partner-specific charts (used on detail pages)
 * @property {string} timeRange - Selected time range for filtering data (e.g., "All time", "Last 12 months")
 */
interface CollectionChartProps {
  pageName: PageName
  partnerId?: string;
  timeRange: string
}

/**
 * CollectionChart - Visualizes collection data as stacked area charts
 * 
 * Renders time-series visualizations of waste collection data with:
 * - Materials breakdown on Home page (plastic, metal, nets, etc.)
 * - Activities breakdown on partner detail pages (fishing for litter, beach cleanup, etc.)
 * 
 * Features:
 * - Responsive design with horizontal scrolling for small screens
 * - Interactive tooltips showing detailed breakdowns and totals
 * - Time range filtering options
 * - Dynamic X-axis tick formatting based on selected time range
 * - Loading, error, and empty data states
 * 
 * The component adapts its visualization based on the page context,
 * showing different data categories and color schemes accordingly.
 */
const CollectionChart = ({ pageName, partnerId, timeRange }: CollectionChartProps) => {
  // Fetch chart data based on page type, partner ID, and selected time range
  const { isPending, error, data } = useChartData({ pageName, partnerId, timeRange })

   // Extract and type records based on page type (Home page shows materials, detail pages show activities)
  const records = (data?.data ?? []) as (CollectionChartProps['pageName'] extends "Home" ? MaterialsChartRecord[] : ActivitiesChartRecord[])

  // Select appropriate chart configuration based on page type
  const chartConfig = pageName === "Home" ? MaterialsChartConfig : ActivitiesChartConfig

  // Get optimized X-axis ticks and formatter based on time range
  const { ticks, tickFormatter } = useChartTicks(records, timeRange)
  
  // Detect if we're on mobile/tablet (below desktop breakpoint)
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  // Helper function to convert space-separated keys to camelCase for CSS classes
  const getCssClassName = (key: string): string => {
    return key.replace(/\s+(\w)/g, (_, letter) => letter.toUpperCase());
  };
  
  // Calculate interval for x-axis labels based on screen size and data density
  // On mobile with many data points, show fewer labels to prevent overlap
  const getXAxisInterval = () => {
    if (isDesktop) {
      return 0; // Show all labels on desktop
    }
    // On mobile, show every nth label based on data density
    const dataPointCount = records.length;
    if (dataPointCount <= 6) {
      return 0; // Show all if 6 or fewer points
    } else if (dataPointCount <= 12) {
      return 1; // Show every other label for 7-12 points
    } else {
      return 2; // Show every 3rd label for more than 12 points
    }
  };

  return (
    // Scrollable container for horizontal overflow on smaller screens
    <div className="w-full overflow-x-auto px-4 md:px-fluid-md">
      <div className="w-full min-w-0 md:max-w-[650px] lg:max-w-[1500px] xl:max-w-[1700px] 2xl:max-w-[1900px] md:mx-auto">
        <Card className="border-none shadow-none"> 
          <CardContent className="p-fluid-sm md:p-fluid-lg">  
            {/* Container component for chart with consistent sizing */} 
            <ChartContainer 
              config={chartConfig} 
              className="w-full min-h-[400px] max-h-[400px]"
            >
            {/* Loading state */}
            {isPending ? (
              <div className="w-full h-full text-fluid-lg">
                Loading chart data...
              </div>
            ) : error || !records.length ? (
              // Error or empty data state
              <div className="w-[40%] md:w-full h-full flex flex-col justify-center md:items-center text-center text-fluid-lg">
                <p>😕 sorry!</p>
                <p>We were not able to build the chart you requested.</p>
                <img 
                  src="/illustrations/dolphin.svg" 
                  alt="dolphin illustration" 
                  loading="lazy"
                  className="w-[300px] h-[300px]"/>
              </div>
            ) : (
              // Main chart visualization
              <AreaChart
                accessibilityLayer
                data={records}
                margin={{ top: 10, right: isDesktop ? 30 : 30, bottom: 10, left: 10 }}
              >
                <CartesianGrid vertical={false} />
                {/* X-axis with custom tick formatting based on time range */}
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  ticks={ticks}              
                  tickFormatter={tickFormatter}
                  interval={getXAxisInterval()}
                />
                {/* Y-axis with simplified styling */}
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={4}
                />
                {/* Custom tooltip with detailed breakdown and totals */}
                <ChartTooltip 
                  cursor={false} 
                  content={
                    <ChartTooltipContent 
                      className="w-[280px] md:w-[320px] rounded-2xl md:rounded-3xl gap-1.5 md:gap-2 text-fluid-xs md:text-fluid-sm p-3 md:p-4"
                      // Format the tooltip label (month and year)
                      labelFormatter={(value) => (
                        <div className="font-light text-fluid-xs md:text-fluid-sm tracking-tight">
                          {new Date(value).toLocaleDateString("en-US", { month: "short",  year: "numeric" })}
                        </div>
                      )}
                      // Custom formatter for each data point in the tooltip
                      formatter={(value, name, item, index) => (
                        <>
                          {/* Colored indicator matching the area fill */}
                          <div className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-${getCssClassName(String(name))} flex-shrink-0`}/>
                          {/* Formatted category name (converting camelCase to space-separated sentence case) */}
                          <div className="font-medium text-fluid-xs md:text-fluid-sm tracking-tight">{formatCamelCaseString(String(name))}</div>
                          {/* Value with unit */}
                          <div className="ml-auto font-light text-fluid-xs md:text-fluid-sm tracking-tight tabular-nums">{value} Kg</div>
                          {/* Show total on the last item */}
                          {index === (pageName === "Home" ? 6 : 3) && (
                            <div className="mt-1 md:mt-1.5 flex basis-full items-center border-t border-gray-300 pt-1.5 md:pt-2 text-fluid-xs md:text-fluid-sm">
                              <span className="font-medium tracking-tight">Total</span>
                              <div className="ml-auto font-light tracking-tight tabular-nums">
                                {calculateTooltipTotal({payload: item.payload, config: chartConfig})} Kg
                              </div>
                            </div>
                          )}
                        </>
                      )}                    
                    />
                  } 
                />

                {/* Render area series for each data category in the config */}
                {Object.keys(chartConfig).map((key) => (
                  <Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    baseValue={0}
                    fill={`hsl(var(--${getCssClassName(key)}))`}
                    fillOpacity={0.4}
                    stroke={`hsl(var(--${getCssClassName(key)}))`}
                    strokeWidth={3}
                    connectNulls={true}
                  />
                ))}
              </AreaChart> 
            )}           
          </ChartContainer>       
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export { CollectionChart }
