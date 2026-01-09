import { jsxs, jsx } from "react/jsx-runtime";
import { useSensors, useSensor, PointerSensor, KeyboardSensor, DndContext, closestCenter } from "@dnd-kit/core";
import { useSortable, sortableKeyboardCoordinates, SortableContext, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, TrendingUp, TrendingDown, Settings2 } from "lucide-react";
import { I as IndicatorChart } from "./IndicatorChart-DuXoSBVZ.js";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { S as Sheet, e as SheetTrigger, a as SheetContent, b as SheetHeader, c as SheetTitle, d as SheetDescription } from "./sheet-CFYfjqLl.js";
import { B as Button } from "./Skeletons-CqO1ZJT3.js";
function IndicatorCard({
  id,
  code,
  name,
  cName,
  unit,
  latestValue,
  latestDate,
  yoy,
  mom,
  chartData = []
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const formatValue = (value) => {
    if (!value) return "—";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString(void 0, { maximumFractionDigits: 2 });
  };
  const formatPercent = (value) => {
    if (value === null) return null;
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: setNodeRef,
      style,
      className: "group relative bg-card border border-border/50 rounded-xl p-5 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm hover:shadow-md",
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            ...attributes,
            ...listeners,
            className: "absolute top-3 right-3 text-muted-foreground/30 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1",
            children: /* @__PURE__ */ jsx(GripVertical, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col mb-4 pr-6", children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/indicators/$id",
            params: { id: String(id) },
            className: "block",
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-1", children: /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground tracking-tight truncate", children: cName }) }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate font-medium", children: name })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-foreground tabular-nums tracking-tighter mb-1", children: formatValue(latestValue) }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground font-medium", children: [
              unit,
              " ",
              /* @__PURE__ */ jsx("span", { className: "opacity-50", children: "•" }),
              " ",
              latestDate
            ] })
          ] }),
          chartData.length > 0 && /* @__PURE__ */ jsx("div", { className: "w-24 h-12 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
            IndicatorChart,
            {
              data: chartData,
              height: 48,
              lineColor: yoy && yoy >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))",
              areaTopColor: yoy && yoy >= 0 ? "hsl(var(--chart-1) / 0.2)" : "hsl(var(--chart-2) / 0.2)",
              areaBottomColor: yoy && yoy >= 0 ? "hsl(var(--chart-1) / 0)" : "hsl(var(--chart-2) / 0)"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-3 border-t border-border/50 flex items-center gap-3", children: [
          yoy !== null && /* @__PURE__ */ jsxs("div", { className: `flex items-baseline gap-1.5 text-xs font-medium tabular-nums ${yoy >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"}`, children: [
            /* @__PURE__ */ jsx("span", { className: "opacity-70 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground", children: "YoY" }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5", children: [
              yoy >= 0 ? /* @__PURE__ */ jsx(TrendingUp, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "w-3 h-3" }),
              formatPercent(yoy)
            ] })
          ] }),
          mom !== null && /* @__PURE__ */ jsxs("div", { className: `flex items-baseline gap-1.5 text-xs font-medium tabular-nums ${mom >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"}`, children: [
            /* @__PURE__ */ jsx("span", { className: "opacity-70 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground", children: "MoM" }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-0.5", children: [
              mom >= 0 ? /* @__PURE__ */ jsx(TrendingUp, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "w-3 h-3" }),
              formatPercent(mom)
            ] })
          ] })
        ] })
      ]
    }
  );
}
function DashboardGrid({ indicators, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = indicators.findIndex((i) => i.id === active.id);
      const newIndex = indicators.findIndex((i) => i.id === over.id);
      const newIndicators = arrayMove(indicators, oldIndex, newIndex);
      const newOrder = newIndicators.map((i) => i.id);
      onReorder(newOrder);
    }
  };
  return /* @__PURE__ */ jsx(
    DndContext,
    {
      sensors,
      collisionDetection: closestCenter,
      onDragEnd: handleDragEnd,
      children: /* @__PURE__ */ jsx(
        SortableContext,
        {
          items: indicators.map((i) => i.id),
          strategy: rectSortingStrategy,
          children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: indicators.map((indicator) => /* @__PURE__ */ jsx(
            IndicatorCard,
            {
              id: indicator.id,
              code: indicator.code,
              name: indicator.name,
              cName: indicator.cName,
              unit: indicator.unit,
              latestValue: indicator.latestValue,
              latestDate: indicator.latestDate,
              yoy: indicator.yoy,
              mom: indicator.mom,
              chartData: indicator.chartData
            },
            indicator.id
          )) })
        }
      )
    }
  );
}
function IndicatorPicker({
  indicators,
  hiddenIndicators,
  onToggle
}) {
  const [open, setOpen] = useState(false);
  const grouped = indicators.reduce(
    (acc, indicator) => {
      const category = indicator.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(indicator);
      return acc;
    },
    {}
  );
  return /* @__PURE__ */ jsxs(Sheet, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "gap-2", children: [
      /* @__PURE__ */ jsx(Settings2, { className: "w-4 h-4" }),
      "Customize"
    ] }) }),
    /* @__PURE__ */ jsxs(SheetContent, { className: "bg-zinc-900 border-zinc-800", children: [
      /* @__PURE__ */ jsxs(SheetHeader, { children: [
        /* @__PURE__ */ jsx(SheetTitle, { className: "text-zinc-100", children: "Customize Dashboard" }),
        /* @__PURE__ */ jsx(SheetDescription, { className: "text-zinc-400", children: "Select which indicators to display on your dashboard." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-6", children: Object.entries(grouped).map(([category, items]) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-zinc-400 mb-2", children: category }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: items.map((indicator) => {
          const isHidden = hiddenIndicators.includes(indicator.id);
          return /* @__PURE__ */ jsxs(
            "label",
            {
              className: "flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors",
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: !isHidden,
                    onChange: () => onToggle(indicator.id),
                    className: "w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-900"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-100", children: indicator.cName }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-zinc-500 truncate", children: indicator.name })
                ] })
              ]
            },
            indicator.id
          );
        }) })
      ] }, category)) })
    ] })
  ] });
}
export {
  DashboardGrid as D,
  IndicatorPicker as I
};
