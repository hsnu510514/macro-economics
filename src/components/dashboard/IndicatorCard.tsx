"use client";

import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, TrendingUp, TrendingDown } from "lucide-react";
import { IndicatorChart } from "./IndicatorChart";
import { Link } from "@tanstack/react-router";

interface IndicatorCardProps {
  id: number;
  code: string;
  name: string;
  cName: string;
  unit: string;
  latestValue: string | null;
  latestDate: string | null;
  yoy: number | null;
  mom: number | null;
  chartData?: { time: string; value: number }[];
  isOverlay?: boolean;
}

export const IndicatorCard = memo(function IndicatorCard({
  id,
  code,
  name,
  cName,
  unit,
  latestValue,
  latestDate,
  yoy,
  mom,
  chartData = [],
  isOverlay = false,
}: IndicatorCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isOverlay });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isOverlay ? 100 : undefined,
  };

  const formatValue = (value: string | null) => {
    if (!value) return "—";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return null;
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-card border border-border/50 rounded-xl p-5 shadow-sm transition-all duration-200 ${
        isOverlay ? "shadow-xl border-zinc-400 dark:border-zinc-700 cursor-grabbing scale-105" : "hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-md"
      }`}
    >
      {/* Drag Handle - Visible on Hover */}
      <button
        {...attributes}
        {...listeners}
        className={`absolute top-3 right-3 text-muted-foreground/30 hover:text-foreground transition-opacity cursor-grab active:cursor-grabbing p-1 ${
          isOverlay ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="flex flex-col mb-4 pr-6">
        <Link
          to="/indicators/$id"
          params={{ id: String(id) }}
          className="block"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-foreground tracking-tight truncate">
              {cName}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground truncate font-medium">{name}</p>
        </Link>
      </div>

      {/* Value & Chart Row */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-3xl font-bold text-foreground tabular-nums tracking-tighter mb-1">
            {formatValue(latestValue)}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            {unit} <span className="opacity-50">•</span> {latestDate}
          </div>
        </div>
        
        {/* Mini Chart */}
        {chartData.length > 0 && (
          <div className="w-24 h-12 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <IndicatorChart 
              data={chartData} 
              height={48} 
              lineColor={yoy && yoy >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
              areaTopColor={yoy && yoy >= 0 ? "hsl(var(--chart-1) / 0.2)" : "hsl(var(--chart-2) / 0.2)"}
              areaBottomColor={yoy && yoy >= 0 ? "hsl(var(--chart-1) / 0)" : "hsl(var(--chart-2) / 0)"}
            />
          </div>
        )}
      </div>

      {/* Metrics Footer */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-3">
        {yoy !== null && (
          <div className={`flex items-baseline gap-1.5 text-xs font-medium tabular-nums ${
            yoy >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"
          }`}>
            <span className="opacity-70 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">YoY</span>
            <span className="flex items-center gap-0.5">
              {yoy >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {formatPercent(yoy)}
            </span>
          </div>
        )}
        {mom !== null && (
          <div className={`flex items-baseline gap-1.5 text-xs font-medium tabular-nums ${
            mom >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"
          }`}>
            <span className="opacity-70 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">MoM</span>
            <span className="flex items-center gap-0.5">
              {mom >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {formatPercent(mom)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});
