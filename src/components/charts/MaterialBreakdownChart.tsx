import React, { useState, useRef, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { MaterialsChartConfig } from '@/config/charts';
import { MaterialBreakdownData, MaterialBreakdownItem } from '@/hooks/api/useHomeMaterialBreakdown';
import { ChartConfig } from "@/components/ui/chart";
import { useIntersectionObserver } from '@/hooks/ui/useIntersectionObserver';
import { clsx } from 'clsx';

// Helper to map API material names to config keys
const getMaterialConfigKey = (materialName: string): string => {
  // Direct mapping for new uppercase/specific names
  const directMapping: { [key: string]: string } = {
    "PP": "PP",
    "PA": "PA",
    "PET": "PET",
    "Net": "NET", // Map API "Net" to config "NET"
    "PS": "PS",
    "PE": "PE",
    "LDPE": "LDPE",
    "HDPE": "HDPE",
    "Non-Recyclable": "NON_RECYCLABLE", // Map API "Non-Recyclable" to config "NON_RECYCLABLE"
  };

  if (directMapping[materialName]) {
    return directMapping[materialName];
  }

  // Fallback mapping for older names or variations
  const fallbackMapping: { [key: string]: string } = {
    "Mixed Plastic": "mixedPlastic",
    "Metal": "metal",
    "Rubber": "rubber",
    "Prevention Net": "preventionNet",
    "Ghost Net": "ghostNet",
    "Rope": "rope",
  };

  // Handle potential variations like 'Other' or 'Other-2'
  if (materialName.startsWith("Other")) return "other";

  // Try fallback mapping
  if (fallbackMapping[materialName]) {
    return fallbackMapping[materialName];
  }

  // Default to 'other' if no match found
  console.warn(`No config key found for material: ${materialName}. Defaulting to 'other'.`);
  return "other";
};

// Helper to get label from config key
const getMaterialLabel = (configKey: string): React.ReactNode => {
    // Ensure configKey exists in the config before accessing label
    const config = MaterialsChartConfig as ChartConfig; // Cast to ChartConfig for broader type access
    if (config[configKey]) {
        return config[configKey].label;
    }
    console.warn(`Label not found for config key: ${configKey}. Returning key.`);
    return configKey; // Fallback to key if label not found
};

interface MaterialBreakdownChartProps {
  data: MaterialBreakdownData;
  title: string;
  description?: string | React.ReactNode;
}

// Manual Tooltip Component
const HoverTooltip = ({ hoveredKey, data }: { hoveredKey: string | null; data: MaterialBreakdownData | null }) => {
  if (!hoveredKey || !data) return null;

  const item = data.breakdown.find(d => getMaterialConfigKey(d.material) === hoveredKey);
  if (!item) return null; 

  const configKey = hoveredKey;
  const percentage = item.percentage;
  const materialLabel = getMaterialLabel(configKey);
  const colorEntry = MaterialsChartConfig[configKey as keyof typeof MaterialsChartConfig];
  const color = colorEntry ? colorEntry.color : MaterialsChartConfig.other.color;

  // Final tooltip style (compact, rounded-full)
  return (
    <div className="w-auto bg-white rounded-full flex items-center justify-between space-x-4 whitespace-nowrap" style={{ border: '0.75px solid #BFBFBF', boxShadow: '15px 15px 45px -15px rgb(0 0 0 / 0.22)', padding: '12px 24px' }}>
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        ></div>
        <span className="font-bold text-base">{materialLabel}</span>
      </div>
      <span className="font-light text-base">
        {`${percentage?.toFixed(1)}%`}
      </span>
    </div>
  );
};

export const MaterialBreakdownChart: React.FC<MaterialBreakdownChartProps> = ({ data, title, description }) => {
  const [hoveredMaterialKey, setHoveredMaterialKey] = useState<string | null>(null);
  // Updated mouse position state to include container width
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number; containerWidth: number } | null>(null);
  // Ref for the chart container div
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll-triggered animation
  const [headingRef, isHeadingVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px',
    triggerOnce: true,
  });

  const chartData = [
    data.breakdown.reduce((acc: { [key: string]: number }, item: MaterialBreakdownItem) => {
      acc[getMaterialConfigKey(item.material)] = item.percentage;
      return acc;
    }, {} as { [key: string]: number })
  ];

  const materialsWithPercentage = data.breakdown.filter(item => item.percentage > 0);
  const allMaterialsForLegend = data.breakdown;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top, 
        containerWidth: rect.width 
    });
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
    setHoveredMaterialKey(null);
  };
  
  // Calculate tooltip style based on position
  const getTooltipStyle = () => {
      if (!mousePosition) return {};
      
      const { x, y, containerWidth } = mousePosition;
      const tooltipOffset = 10; // Offset from cursor
      // Threshold to flip tooltip (e.g., 66% of container width)
      const flipThreshold = containerWidth * 0.66; 
      
      let left = x + tooltipOffset;
      let top = y + tooltipOffset;
      let transform = 'translateX(0%)';

      if (x > flipThreshold) {
          // Position to the left of the cursor
          left = x - tooltipOffset;
          transform = 'translateX(-100%)'; 
      }
      
      return {
          position: 'absolute' as const,
          top: top,
          left: left,
          transform: transform,
          zIndex: 50,
          pointerEvents: 'none' as const,
      };
  }

  return (
    <div className="self-stretch rounded-[40px] flex flex-col justify-start items-start space-fluid-xl"> 
      {/* Title and Description Container */}
      <div className="self-stretch px-4 md:px-10 lg:px-12 pt-fluid-lg text-center"> 
        <h2 
          ref={headingRef}
          className={clsx(
            "text-black font-bold text-fluid-4xl tracking-tight leading-tight pb-fluid-md animate-on-scroll",
            isHeadingVisible && 'animate-fade-slide-up'
          )}
        >
          {title}
        </h2>
        {/* Description moved here */}
        {description && (
          <div className="text-fluid-xl font-extralight tracking-tight leading-tight md:px-12 pt-fluid-sm">
            {description}
          </div>
        )}
      </div>
      
      {/* Chart Bar Section - Apply rounding and overflow to container */}
      <div 
         ref={chartContainerRef} 
         className="w-full relative" 
         onMouseMove={handleMouseMove} 
         onMouseLeave={handleMouseLeave}
      >
        {/* Added rounded-full and ensured overflow-hidden, corrected my-0 typo */}
        <div className="w-full h-[160px] bg-sand-beige overflow-hidden rounded-3xl py-0 my-0"> 
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                stackOffset="expand"
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barCategoryGap={0}
              >
                <XAxis type="number" hide />
                <YAxis type="category" hide />
                {materialsWithPercentage.map((item: MaterialBreakdownItem) => {
                  const configKey = getMaterialConfigKey(item.material);
                  const colorEntry = MaterialsChartConfig[configKey as keyof typeof MaterialsChartConfig];
                  const color = colorEntry ? colorEntry.color : '#808080';
                  const isActive = hoveredMaterialKey === configKey;
                  const opacity = hoveredMaterialKey === null ? 0.4 : (isActive ? 1 : 0.4);

                  return (
                    <Bar
                      key={configKey}
                      dataKey={configKey}
                      stackId="a"
                      fill={color}
                      fillOpacity={opacity}
                      // Removed radius prop - using container rounding
                      onMouseEnter={() => setHoveredMaterialKey(configKey)}
                      isAnimationActive={false}
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
            {/* Manual Tooltip */} 
            {hoveredMaterialKey && mousePosition && (
              <div style={getTooltipStyle()}>
                <HoverTooltip hoveredKey={hoveredMaterialKey} data={data} />
              </div>
            )}
          </div>
      </div>
     
      {/* Outer container for padding */}
      <div className="self-stretch py-8 px-4 md:px-12">
        {/* Legend Layout: 2-col grid mobile, centered flex wrap desktop */}
        <div className="max-w-screen-lg xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto grid grid-cols-2 justify-items-start md:flex md:flex-wrap md:justify-center gap-x-12 gap-y-12"> 
          {allMaterialsForLegend.map((item: MaterialBreakdownItem) => {
            const configKey = getMaterialConfigKey(item.material);
            const colorEntry = MaterialsChartConfig[configKey as keyof typeof MaterialsChartConfig];
            const color = colorEntry ? colorEntry.color : '#808080'; 
            return (
              <div key={item.material} className="flex items-start gap-2"> 
                 <span
                  className="inline-block w-3 h-full rounded-[64px] flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="inline-flex flex-col justify-start items-start gap-1">
                  <span className="text-black text-fluid-base font-light leading-normal">{item.material}</span> 
                  <div className="inline-flex justify-start items-baseline gap-0.5">
                    <span className="text-black text-fluid-xl font-bold leading-tight">{new Intl.NumberFormat().format(item.weight)}</span> 
                    <span className="text-black text-fluid-base leading-tight">Kg</span> 
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 