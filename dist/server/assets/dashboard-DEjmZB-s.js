import { jsx, jsxs } from "react/jsx-runtime";
import { b as createServerRpc, c as createServerFn } from "../server.js";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { I as IndicatorPicker, D as DashboardGrid } from "./IndicatorPicker-Bi4ljF_5.js";
import { g as getAllIndicatorsWithLatest, a as getIndicatorHistory } from "./indicators-BgiItI-J.js";
import { g as getLayout, s as saveLayout } from "./layout-B6E02iZu.js";
import { E as ErrorDisplay } from "./ErrorBoundary-CHqpoPYk.js";
import { D as DashboardSkeleton } from "./Skeletons-CqO1ZJT3.js";
import "node:async_hooks";
import "@tanstack/react-router/ssr/server";
import "@dnd-kit/core";
import "@dnd-kit/sortable";
import "@dnd-kit/utilities";
import "lucide-react";
import "./IndicatorChart-DuXoSBVZ.js";
import "lightweight-charts";
import "./sheet-CFYfjqLl.js";
import "@radix-ui/react-dialog";
import "./index-s3Y0O6XI.js";
import "drizzle-orm/pg-core";
import "dotenv/config";
import "drizzle-orm/node-postgres";
import "drizzle-orm";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const loadDashboard_createServerFn_handler = createServerRpc("94b930b6f87f315f197e48e360f9e92c9d786a73504cc1935ac61723a07b4986", (opts, signal) => {
  return loadDashboard.__executeServer(opts, signal);
});
const loadDashboard = createServerFn({
  method: "GET"
}).handler(loadDashboard_createServerFn_handler, async () => {
  const indicators = await getAllIndicatorsWithLatest();
  const layout = await getLayout("default");
  const indicatorsWithCharts = await Promise.all(indicators.map(async (indicator) => {
    const history = await getIndicatorHistory(indicator.id, 30);
    const chartData = history.filter((h) => h.value !== ".").map((h) => ({
      time: h.date,
      value: parseFloat(h.value)
    })).reverse();
    return {
      ...indicator,
      chartData
    };
  }));
  return {
    indicators: indicatorsWithCharts,
    layout
  };
});
const saveLayoutFn_createServerFn_handler = createServerRpc("510293d7219a31853226fdd60f9b9d653de03fd39d3ee2dbe183869fa5a214f5", (opts, signal) => {
  return saveLayoutFn.__executeServer(opts, signal);
});
const saveLayoutFn = createServerFn({
  method: "POST"
}).inputValidator((data) => data).handler(saveLayoutFn_createServerFn_handler, async ({
  data
}) => {
  await saveLayout("default", data.order, data.hidden);
  return {
    success: true
  };
});
const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  loader: () => loadDashboard(),
  errorComponent: ({
    error
  }) => /* @__PURE__ */ jsx(ErrorDisplay, { error }),
  pendingComponent: () => /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background text-foreground transition-colors duration-200", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-8", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Macro Economics Dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1 font-medium", children: "Loading indicators..." })
    ] }) }),
    /* @__PURE__ */ jsx(DashboardSkeleton, {})
  ] }) })
});
function DashboardPage() {
  const {
    indicators: initialIndicators,
    layout
  } = Route.useLoaderData();
  const [indicatorOrder, setIndicatorOrder] = useState(layout?.indicatorOrder && layout.indicatorOrder.length > 0 ? layout.indicatorOrder : initialIndicators.map((i) => i.id));
  const [hiddenIndicators, setHiddenIndicators] = useState(layout?.hiddenIndicators ?? []);
  const sortedIndicators = [...initialIndicators].sort((a, b) => {
    const aIndex = indicatorOrder.indexOf(a.id);
    const bIndex = indicatorOrder.indexOf(b.id);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
  const visibleIndicators = sortedIndicators.filter((i) => !hiddenIndicators.includes(i.id));
  const handleReorder = useCallback(async (newOrder) => {
    setIndicatorOrder(newOrder);
    await saveLayoutFn({
      data: {
        order: newOrder,
        hidden: hiddenIndicators
      }
    });
  }, [hiddenIndicators]);
  const handleToggle = useCallback(async (indicatorId) => {
    const newHidden = hiddenIndicators.includes(indicatorId) ? hiddenIndicators.filter((id) => id !== indicatorId) : [...hiddenIndicators, indicatorId];
    setHiddenIndicators(newHidden);
    await saveLayoutFn({
      data: {
        order: indicatorOrder,
        hidden: newHidden
      }
    });
  }, [hiddenIndicators, indicatorOrder]);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background text-foreground transition-colors duration-200", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Macro Economics Dashboard" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1 font-medium", children: "Track global economic indicators in real-time" })
      ] }),
      /* @__PURE__ */ jsx(IndicatorPicker, { indicators: initialIndicators, hiddenIndicators, onToggle: handleToggle })
    ] }),
    visibleIndicators.length > 0 ? /* @__PURE__ */ jsx(DashboardGrid, { indicators: visibleIndicators, onReorder: handleReorder }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx("p", { className: "text-zinc-500", children: "No indicators to display." }),
      /* @__PURE__ */ jsx("p", { className: "text-zinc-600 text-sm mt-1", children: "Use the Customize button to add indicators." })
    ] })
  ] }) });
}
export {
  loadDashboard_createServerFn_handler,
  saveLayoutFn_createServerFn_handler
};
