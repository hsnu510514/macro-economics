import { jsx, jsxs } from "react/jsx-runtime";
import { b as createServerRpc, c as createServerFn } from "../server.js";
import { createFileRoute, Link } from "@tanstack/react-router";
import { I as IndicatorChart } from "./IndicatorChart-DuXoSBVZ.js";
import { P as PersonalNotes, I as IndexIntroduction } from "./PersonalNotes-BiWISW32.js";
import { b as getIndicatorById, a as getIndicatorHistory, c as getIndicatorMetrics, d as getRelatedIndicators, e as getIndicatorNotes, s as saveIndicatorNotes } from "./indicators-BgiItI-J.js";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { a as DetailPageSkeleton, B as Button } from "./Skeletons-CqO1ZJT3.js";
import { z } from "zod";
import { E as ErrorDisplay } from "./ErrorBoundary-CHqpoPYk.js";
import "node:async_hooks";
import "@tanstack/react-router/ssr/server";
import "react";
import "lightweight-charts";
import "./tooltip-TL3zXRQX.js";
import "@radix-ui/react-tooltip";
import "react-markdown";
import "./index-s3Y0O6XI.js";
import "drizzle-orm/pg-core";
import "dotenv/config";
import "drizzle-orm/node-postgres";
import "drizzle-orm";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const loadIndicatorDetail_createServerFn_handler = createServerRpc("6e3de763758e78f17a6cb1ceba141c803418d512e0d0f85a439a15b6d3efa93d", (opts, signal) => {
  return loadIndicatorDetail.__executeServer(opts, signal);
});
const loadIndicatorDetail = createServerFn({
  method: "GET"
}).inputValidator((id) => id).handler(loadIndicatorDetail_createServerFn_handler, async ({
  data: id
}) => {
  const indicatorId = parseInt(id, 10);
  const [indicator, history, metrics, relatedIndicatorsList, notes] = await Promise.all([getIndicatorById(indicatorId), getIndicatorHistory(indicatorId, 1e3), getIndicatorMetrics(indicatorId), getRelatedIndicators(indicatorId), getIndicatorNotes(indicatorId)]);
  if (!indicator) {
    throw new Error("Indicator not found");
  }
  const chartData = history.filter((h) => h.value !== ".").map((h) => ({
    time: h.date,
    value: parseFloat(h.value)
  })).reverse();
  const latestValue = history[0];
  return {
    indicator,
    chartData,
    metrics,
    latestValue: latestValue?.value ?? null,
    latestDate: latestValue?.date ?? null,
    recentHistory: history.slice(0, 20),
    relatedIndicators: relatedIndicatorsList,
    notes
  };
});
const saveNotes_createServerFn_handler = createServerRpc("4b31f34768336ef9aca76b7a0e1ee834c2cc009b9b2945f0c739ed1c4d90e18b", (opts, signal) => {
  return saveNotes.__executeServer(opts, signal);
});
const saveNotes = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  indicatorId: z.number(),
  content: z.string()
})).handler(saveNotes_createServerFn_handler, async ({
  data
}) => {
  await saveIndicatorNotes(data.indicatorId, data.content);
  return {
    success: true
  };
});
const Route = createFileRoute("/indicators/$id")({
  component: IndicatorDetailPage,
  loader: ({
    params
  }) => loadIndicatorDetail({
    data: params.id
  }),
  errorComponent: ({
    error
  }) => /* @__PURE__ */ jsx(ErrorDisplay, { error }),
  pendingComponent: () => /* @__PURE__ */ jsx(DetailPageSkeleton, {})
});
function IndicatorDetailPage() {
  const {
    indicator,
    chartData,
    metrics,
    latestValue,
    latestDate,
    recentHistory,
    relatedIndicators,
    notes
  } = Route.useLoaderData();
  const handleSaveNotes = async (content) => {
    await saveNotes({
      data: {
        indicatorId: indicator.id,
        content
      }
    });
  };
  const formatValue = (value) => {
    if (!value) return "—";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString(void 0, {
      maximumFractionDigits: 2
    });
  };
  const formatPercent = (value) => {
    if (value === null || value === void 0) return "—";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background text-foreground transition-colors duration-200", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 max-w-[1600px]", children: [
    /* @__PURE__ */ jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "gap-2 mb-6 hover:bg-muted text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
      "Back to Dashboard"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 items-start", children: [
      /* @__PURE__ */ jsx("div", { className: "xl:col-start-1", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight", children: indicator.cName }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground mt-1 font-medium", children: indicator.name })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border inline-block", children: [
          indicator.source,
          " • ",
          indicator.code
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 xl:col-start-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/50 rounded-xl p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-muted-foreground mb-2", children: "Latest Value" }),
          /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold tabular-nums tracking-tighter text-foreground", children: formatValue(latestValue) }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-medium text-muted-foreground mt-1", children: [
            indicator.unit,
            " ",
            /* @__PURE__ */ jsx("span", { className: "opacity-50", children: "•" }),
            " ",
            latestDate
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/50 rounded-xl p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-muted-foreground mb-2", children: "Year over Year" }),
          /* @__PURE__ */ jsxs("div", { className: `text-2xl font-bold tabular-nums flex items-center gap-2 tracking-tight ${(metrics?.yoy ?? 0) >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"}`, children: [
            (metrics?.yoy ?? 0) >= 0 ? /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "w-5 h-5" }),
            formatPercent(metrics?.yoy)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/50 rounded-xl p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-muted-foreground mb-2", children: "Month over Month" }),
          /* @__PURE__ */ jsxs("div", { className: `text-2xl font-bold tabular-nums flex items-center gap-2 tracking-tight ${(metrics?.mom ?? 0) >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"}`, children: [
            (metrics?.mom ?? 0) >= 0 ? /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "w-5 h-5" }),
            formatPercent(metrics?.mom)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/50 rounded-xl p-5 shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-muted-foreground mb-2", children: "Quarter over Quarter" }),
          /* @__PURE__ */ jsxs("div", { className: `text-2xl font-bold tabular-nums flex items-center gap-2 tracking-tight ${(metrics?.qoq ?? 0) >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"}`, children: [
            (metrics?.qoq ?? 0) >= 0 ? /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "w-5 h-5" }),
            formatPercent(metrics?.qoq)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/50 rounded-xl p-6 shadow-sm xl:col-start-1", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight", children: "Historical Performance" }) }),
        chartData.length > 0 ? /* @__PURE__ */ jsx("div", { className: "h-[400px] w-full", children: /* @__PURE__ */ jsx(IndicatorChart, { data: chartData, fullSize: true, lineColor: latestValue && parseFloat(latestValue) >= (parseFloat(recentHistory[recentHistory.length - 1]?.value) || 0) ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))", areaTopColor: latestValue && parseFloat(latestValue) >= (parseFloat(recentHistory[recentHistory.length - 1]?.value) || 0) ? "hsl(var(--chart-1) / 0.2)" : "hsl(var(--chart-2) / 0.2)", areaBottomColor: latestValue && parseFloat(latestValue) >= (parseFloat(recentHistory[recentHistory.length - 1]?.value) || 0) ? "hsl(var(--chart-1) / 0)" : "hsl(var(--chart-2) / 0)" }) }) : /* @__PURE__ */ jsx("div", { className: "h-96 flex items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border", children: "No chart data available" })
      ] }),
      /* @__PURE__ */ jsx(PersonalNotes, { initialContent: notes, indicatorId: indicator.id, onSave: handleSaveNotes, className: "xl:col-start-2 xl:row-start-1 xl:row-span-3 h-full min-w-0 mb-0 xl:mb-0" }),
      /* @__PURE__ */ jsx("div", { className: "xl:col-start-1", children: /* @__PURE__ */ jsx(IndexIntroduction, { meaning: indicator.meaning ?? "", calculation: indicator.calculation ?? "", analystUsage: indicator.analystUsage ?? "", relatedIndicators }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm xl:col-start-1", children: [
        /* @__PURE__ */ jsx("div", { className: "px-6 py-4 border-b border-border/50", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight", children: "Recent Data Points" }) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-muted/30 border-b border-border/50", children: [
            /* @__PURE__ */ jsx("th", { className: "text-left py-3 px-6 text-muted-foreground font-medium w-1/3", children: "Date" }),
            /* @__PURE__ */ jsx("th", { className: "text-right py-3 px-6 text-muted-foreground font-medium", children: "Value" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: recentHistory.map((row, index) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "py-3 px-6 text-foreground font-medium tabular-nums", children: row.date }),
            /* @__PURE__ */ jsx("td", { className: "py-3 px-6 text-right text-foreground font-medium tabular-nums font-mono", children: formatValue(row.value) })
          ] }, `${row.date}-${index}`)) })
        ] }) })
      ] })
    ] })
  ] }) });
}
export {
  loadIndicatorDetail_createServerFn_handler,
  saveNotes_createServerFn_handler
};
