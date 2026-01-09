import { Link } from "@tanstack/react-router";
import type { RelatedIndicator } from "@/server/functions/indicators";
import { Info, Calculator, TrendingUp, TrendingDown, Link2 } from "lucide-react";
import { IndicatorChart } from "./IndicatorChart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IndexIntroductionProps {
  meaning: string;
  calculation: string;
  analystUsage: string;
  relatedIndicators: RelatedIndicator[];
}

function formatValue(value: string | null) {
  if (!value) return "—";
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatPercent(value: number | null) {
  if (value === null) return null;
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function IndexIntroduction({
  meaning,
  calculation,
  analystUsage,
  relatedIndicators,
}: IndexIntroductionProps) {
  const hasContent = meaning || calculation || analystUsage || relatedIndicators.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="bg-card border border-border/50 rounded-xl p-6 mb-8 shadow-sm">
      <h2 className="text-lg font-semibold tracking-tight mb-4 flex items-center gap-2">
        <Info className="w-5 h-5 text-muted-foreground" />
        About This Indicator
      </h2>

      <div className="grid gap-4">
        {meaning && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Info className="w-4 h-4" />
              Meaning
            </div>
            <p className="text-sm text-foreground leading-relaxed">{meaning}</p>
          </div>
        )}

        {calculation && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calculator className="w-4 h-4" />
              Calculation
            </div>
            <p className="text-sm text-foreground leading-relaxed">{calculation}</p>
          </div>
        )}

        {analystUsage && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              Analyst Usage
            </div>
            <p className="text-sm text-foreground leading-relaxed">{analystUsage}</p>
          </div>
        )}

        {relatedIndicators.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Link2 className="w-4 h-4" />
              Related Indicators
            </div>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider delayDuration={200}>
                {relatedIndicators.map((indicator) => (
                  <Tooltip key={indicator.id}>
                    <TooltipTrigger asChild>
                      <Link
                        to="/indicators/$id"
                        params={{ id: String(indicator.id) }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/50 text-foreground border border-border/50 hover:bg-muted hover:border-border transition-colors"
                      >
                        <span className="text-muted-foreground">{indicator.code}</span>
                        <span>•</span>
                        <span>{indicator.cName}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom" 
                      className="w-72 p-0 bg-card border border-border shadow-lg rounded-xl overflow-hidden"
                      sideOffset={8}
                      hideArrow
                    >
                      <div className="p-4">
                        {/* Header */}
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-foreground">{indicator.cName}</h4>
                          <p className="text-xs text-muted-foreground truncate">{indicator.name}</p>
                        </div>
                        
                        {/* Value & Chart */}
                        <div className="flex items-end justify-between gap-3 mb-3">
                          <div>
                            <div className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                              {formatValue(indicator.latestValue)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {indicator.latestDate}
                            </div>
                          </div>
                          
                          {/* Mini Chart */}
                          {indicator.chartData.length > 0 && (
                            <div className="w-20 h-10 flex-shrink-0">
                              <IndicatorChart 
                                data={indicator.chartData} 
                                height={40} 
                                lineColor={indicator.yoy && indicator.yoy >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
                                areaTopColor={indicator.yoy && indicator.yoy >= 0 ? "hsl(var(--chart-1) / 0.2)" : "hsl(var(--chart-2) / 0.2)"}
                                areaBottomColor={indicator.yoy && indicator.yoy >= 0 ? "hsl(var(--chart-1) / 0)" : "hsl(var(--chart-2) / 0)"}
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* YoY */}
                        {indicator.yoy !== null && (
                          <div className={`flex items-center gap-1 text-xs font-medium ${
                            indicator.yoy >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"
                          }`}>
                            <span className="text-muted-foreground">YoY</span>
                            {indicator.yoy >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span>{formatPercent(indicator.yoy)}</span>
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
