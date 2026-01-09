import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { IndicatorChart } from "@/components/dashboard/IndicatorChart";
import { IndexIntroduction } from "@/components/dashboard/IndexIntroduction";
import { PersonalNotes } from "@/components/dashboard/PersonalNotes";
import {
  getIndicatorById,
  getIndicatorHistory,
  getIndicatorMetrics,
  getRelatedIndicators,
  getIndicatorNotes,
  saveIndicatorNotes,
} from "@/server/functions/indicators";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";

// Server function to load indicator detail
const loadIndicatorDetail = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const indicatorId = parseInt(id, 10);

    const [indicator, history, metrics, relatedIndicatorsList, notes] = await Promise.all([
      getIndicatorById(indicatorId),
      getIndicatorHistory(indicatorId, 1000),
      getIndicatorMetrics(indicatorId),
      getRelatedIndicators(indicatorId),
      getIndicatorNotes(indicatorId),
    ]);

    if (!indicator) {
      throw new Error("Indicator not found");
    }

    const chartData = history
      .filter((h) => h.value !== ".")
      .map((h) => ({
        time: h.date,
        value: parseFloat(h.value),
      }))
      .reverse();

    const latestValue = history[0];

    return {
      indicator,
      chartData,
      metrics,
      latestValue: latestValue?.value ?? null,
      latestDate: latestValue?.date ?? null,
      recentHistory: history.slice(0, 20),
      relatedIndicators: relatedIndicatorsList,
      notes,
    };
  });

// Server function to save notes
const saveNotes = createServerFn({ method: "POST" })
  .inputValidator(z.object({ indicatorId: z.number(), content: z.string() }))
  .handler(async ({ data }) => {
    await saveIndicatorNotes(data.indicatorId, data.content);
    return { success: true };
  });

import { ErrorDisplay } from "@/components/dashboard/ErrorBoundary";
import { DetailPageSkeleton } from "@/components/dashboard/Skeletons";

export const Route = createFileRoute("/indicators/$id")({
  component: IndicatorDetailPage,
  loader: ({ params }) => loadIndicatorDetail({ data: params.id }),
  errorComponent: ({ error }) => <ErrorDisplay error={error} />,
  pendingComponent: () => <DetailPageSkeleton />,
});

function IndicatorDetailPage() {
  const { indicator, chartData, metrics, latestValue, latestDate, recentHistory, relatedIndicators, notes } =
    Route.useLoaderData();

  const handleSaveNotes = async (content: string) => {
    await saveNotes({ data: { indicatorId: indicator.id, content } });
  };

  const formatValue = (value: string | null) => {
    if (!value) return "—";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "—";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 max-w-[1600px]">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 mb-6 hover:bg-muted text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        {/* Header - Full width on mobile, part of left col on desktop */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-x-8 gap-y-12 items-stretch">
          
          {/* Top Row - Main Info and Chart + Personal Notes */}
          <div className="xl:contents">
            <div className="space-y-8 min-w-0">
              {/* Header */}
              <div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{indicator.cName}</h1>
                    <p className="text-lg text-muted-foreground mt-1 font-medium">{indicator.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border inline-block">
                      {indicator.source} • {indicator.code}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Latest Value</div>
                  <div className="text-3xl font-bold tabular-nums tracking-tighter text-foreground">
                    {formatValue(latestValue)}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mt-1">
                    {indicator.unit} <span className="opacity-50">•</span> {latestDate}
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Year over Year</div>
                  <div className={`text-2xl font-bold tabular-nums flex items-center gap-2 tracking-tight ${
                      (metrics?.yoy ?? 0) >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"
                    }`}>
                    {(metrics?.yoy ?? 0) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {formatPercent(metrics?.yoy)}
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Month over Month</div>
                  <div className={`text-2xl font-bold tabular-nums flex items-center gap-2 tracking-tight ${
                      (metrics?.mom ?? 0) >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"
                    }`}>
                    {(metrics?.mom ?? 0) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {formatPercent(metrics?.mom)}
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-xl p-5 shadow-sm">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Quarter over Quarter</div>
                  <div className={`text-2xl font-bold tabular-nums flex items-center gap-2 tracking-tight ${
                      (metrics?.qoq ?? 0) >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"
                    }`}>
                    {(metrics?.qoq ?? 0) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {formatPercent(metrics?.qoq)}
                  </div>
                </div>
              </div>

              {/* Main Chart */}
              <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold tracking-tight">Historical Performance</h2>
                </div>
                {chartData.length > 0 ? (
                  <div className="h-[400px] w-full">
                    <IndicatorChart 
                      data={chartData} 
                      fullSize 
                      lineColor={latestValue && parseFloat(latestValue) >= (parseFloat(recentHistory[recentHistory.length - 1]?.value) || 0) 
                        ? "hsl(var(--chart-1))" 
                        : "hsl(var(--chart-2))"
                      }
                      areaTopColor={latestValue && parseFloat(latestValue) >= (parseFloat(recentHistory[recentHistory.length - 1]?.value) || 0)
                        ? "hsl(var(--chart-1) / 0.2)"
                        : "hsl(var(--chart-2) / 0.2)"
                      }
                      areaBottomColor={latestValue && parseFloat(latestValue) >= (parseFloat(recentHistory[recentHistory.length - 1]?.value) || 0)
                        ? "hsl(var(--chart-1) / 0)"
                        : "hsl(var(--chart-2) / 0)"
                      }
                    />
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border">
                    No chart data available
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Personal Notes */}
            <div className="xl:sticky xl:top-6 min-w-0 h-full">
              <PersonalNotes
                initialContent={notes}
                indicatorId={indicator.id}
                onSave={handleSaveNotes}
                className="h-full max-h-[calc(100vh-10rem)]"
              />
            </div>
          </div>

          {/* Bottom Row content */}
          <div className="space-y-8 min-w-0">
            {/* Index Introduction */}
            <IndexIntroduction
              meaning={indicator.meaning ?? ""}
              calculation={indicator.calculation ?? ""}
              analystUsage={indicator.analystUsage ?? ""}
              relatedIndicators={relatedIndicators}
            />

            {/* Recent Data Table */}
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border/50">
                <h2 className="text-lg font-semibold tracking-tight">Recent Data Points</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/50">
                      <th className="text-left py-3 px-6 text-muted-foreground font-medium w-1/3">
                        Date
                      </th>
                      <th className="text-right py-3 px-6 text-muted-foreground font-medium">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentHistory.map((row: { date: string; value: string }, index: number) => (
                      <tr
                        key={`${row.date}-${index}`}
                        className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-6 text-foreground font-medium tabular-nums">{row.date}</td>
                        <td className="py-3 px-6 text-right text-foreground font-medium tabular-nums font-mono">
                          {formatValue(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Empty right column for the bottom row on xl screens */}
          <div className="hidden xl:block" />

        </div>
      </div>
    </div>
  );
}
