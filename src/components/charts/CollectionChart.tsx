import { useChartData } from "@/hooks/api/useChartData"
import { useChartTicks } from "@/hooks/ui/useChartTicks"
import { MaterialsChartConfig, ActivitiesChartConfig } from "@/config/charts"
import { PageName, MaterialsChartRecord, ActivitiesChartRecord } from "@/types"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
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

  // Helper function to convert space-separated keys to camelCase for CSS classes
  const getCssClassName = (key: string): string => {
    return key.replace(/\s+(\w)/g, (_, letter) => letter.toUpperCase());
  };

  return (
    // Scrollable container for horizontal overflow on smaller screens
    <ScrollArea className="max-w-[350px] md:max-w-[650px] lg:max-w-[1500px] xl:max-w-[1700px] 2xl:max-w-[1900px]">
      <Card className="border-none shadow-none"> 
        <CardContent className="md:p-12">  
          {/* Container component for chart with consistent sizing */} 
          <ChartContainer 
            config={chartConfig} 
            className=" w-full min-h-[400px] max-h-[400px]"
          >
            {/* Loading state */}
            {isPending ? (
              <div className="w-full h-full text-lg">
                Loading chart data...
              </div>
            ) : error || !records.length ? (
              // Error or empty data state
              <div className="w-[40%] md:w-full h-full flex flex-col justify-center md:items-center text-center text-lg">
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
                margin={{ right: 30 }}
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
                  interval={0}
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
                      className="w-[320px] rounded-3xl gap-2 md:gap-3 text-sm md:text-lg p-4 md:p-6"
                      // Format the tooltip label (month and year)
                      labelFormatter={(value) => (
                        <div className="font-light">
                          {new Date(value).toLocaleDateString("en-US", { month: "short",  year: "numeric" })}
                        </div>
                      )}
                      // Custom formatter for each data point in the tooltip
                      formatter={(value, name, item, index) => (
                        <>
                          {/* Colored indicator matching the area fill */}
                          <div className={`h-3 w-3 md:h-4 md:w-4 rounded-full bg-${getCssClassName(String(name))}`}/>
                          {/* Formatted category name (converting camelCase to space-separated sentence case) */}
                          <div className="font-semibold text-base">{formatCamelCaseString(String(name))}</div>
                          {/* Value with unit */}
                          <div className="ml-auto font-light text-base">{value} Kg</div>
                          {/* Show total on the last item */}
                          {index === (pageName === "Home" ? 6 : 3) && (
                            <div className="mt-1.5 flex basis-full items-center border-t border-gray-400 pt-1.5 text-sm md:text-lg">
                              Total
                              <div className="ml-auto font-extralight">
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
      {/* Horizontal scrollbar for small screens */}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export { CollectionChart }
