import * as React from "react";

interface ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  };
}

interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

const useChart = () => {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer");
  }
  return context;
};

interface ChartContainerProps {
  children: React.ReactNode;
  config: ChartConfig;
  className?: string;
}

const ChartContainer = ({ children, config, className }: ChartContainerProps) => {
  return (
    <ChartContext.Provider value={{ config }}>
      <div className={`w-full ${className || ''}`}>
        {children}
      </div>
    </ChartContext.Provider>
  );
};

interface ChartTooltipProps {
  content?: React.ComponentType<any>;
}

const ChartTooltip = ({ content }: ChartTooltipProps) => {
  // For recharts compatibility, we need to pass the content prop directly
  // This component is just a wrapper that returns the content prop
  return content || null;
};

const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        {label && (
          <div className="font-medium">{label}</div>
        )}
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  useChart,
};