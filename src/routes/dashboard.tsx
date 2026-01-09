import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useCallback } from "react";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { IndicatorPicker } from "@/components/dashboard/IndicatorPicker";
import {
  getAllIndicatorsWithLatest,
  type IndicatorWithLatest,
} from "@/server/functions/indicators";
import { getLayout, saveLayout } from "@/server/functions/layout";
import { getIndicatorHistory } from "@/server/functions/indicators";

// Server function to load dashboard data
const loadDashboard = createServerFn({ method: "GET" }).handler(async () => {
  const indicators = await getAllIndicatorsWithLatest();
  const layout = await getLayout("default");

  // Fetch chart data for each indicator (last 30 days)
  const indicatorsWithCharts = await Promise.all(
    indicators.map(async (indicator) => {
      const history = await getIndicatorHistory(indicator.id, 30);
      const chartData = history
        .filter((h) => h.value !== ".")
        .map((h) => ({
          time: h.date,
          value: parseFloat(h.value),
        }))
        .reverse(); // Oldest first for chart

      return {
        ...indicator,
        chartData,
      };
    })
  );

  return {
    indicators: indicatorsWithCharts,
    layout,
  };
});

// Server function to save layout
const saveLayoutFn = createServerFn({ method: "POST" })
  .inputValidator((data: { order: number[]; hidden: number[] }) => data)
  .handler(async ({ data }) => {
    await saveLayout("default", data.order, data.hidden);
    return { success: true };
  });

import { ErrorDisplay } from "@/components/dashboard/ErrorBoundary";
import { DashboardSkeleton } from "@/components/dashboard/Skeletons";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  loader: () => loadDashboard(),
  errorComponent: ({ error }) => <ErrorDisplay error={error} />,
  pendingComponent: () => (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Macro Economics Dashboard</h1>
            <p className="text-muted-foreground mt-1 font-medium">Loading indicators...</p>
          </div>
        </div>
        <DashboardSkeleton />
      </div>
    </div>
  ),
});

function DashboardPage() {
  const { indicators: initialIndicators, layout } = Route.useLoaderData();

  const [indicatorOrder, setIndicatorOrder] = useState<number[]>(
    layout?.indicatorOrder && layout.indicatorOrder.length > 0
      ? layout.indicatorOrder
      : initialIndicators.map((i) => i.id)
  );

  const [hiddenIndicators, setHiddenIndicators] = useState<number[]>(
    layout?.hiddenIndicators ?? []
  );

  // Sort indicators based on saved order
  const sortedIndicators = [...initialIndicators].sort((a, b) => {
    const aIndex = indicatorOrder.indexOf(a.id);
    const bIndex = indicatorOrder.indexOf(b.id);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  // Filter out hidden indicators
  const visibleIndicators = sortedIndicators.filter(
    (i) => !hiddenIndicators.includes(i.id)
  );

  const handleReorder = useCallback(
    async (newOrder: number[]) => {
      setIndicatorOrder(newOrder);
      await saveLayoutFn({ data: { order: newOrder, hidden: hiddenIndicators } });
    },
    [hiddenIndicators]
  );

  const handleToggle = useCallback(
    async (indicatorId: number) => {
      const newHidden = hiddenIndicators.includes(indicatorId)
        ? hiddenIndicators.filter((id) => id !== indicatorId)
        : [...hiddenIndicators, indicatorId];

      setHiddenIndicators(newHidden);
      await saveLayoutFn({ data: { order: indicatorOrder, hidden: newHidden } });
    },
    [hiddenIndicators, indicatorOrder]
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Macro Economics Dashboard</h1>
            <p className="text-muted-foreground mt-1 font-medium">
              Track global economic indicators in real-time
            </p>
          </div>
          <IndicatorPicker
            indicators={initialIndicators}
            hiddenIndicators={hiddenIndicators}
            onToggle={handleToggle}
          />
        </div>

        {/* Grid */}
        {visibleIndicators.length > 0 ? (
          <DashboardGrid
            indicators={visibleIndicators}
            onReorder={handleReorder}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-500">No indicators to display.</p>
            <p className="text-zinc-600 text-sm mt-1">
              Use the Customize button to add indicators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
