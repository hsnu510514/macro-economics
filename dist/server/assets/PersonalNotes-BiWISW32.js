import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Info, Calculator, TrendingUp, Link2, TrendingDown, FileText, Pencil, X, Save } from "lucide-react";
import { I as IndicatorChart } from "./IndicatorChart-DuXoSBVZ.js";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent } from "./tooltip-TL3zXRQX.js";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { B as Button } from "./Skeletons-CqO1ZJT3.js";
function formatValue(value) {
  if (!value) return "—";
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString(void 0, { maximumFractionDigits: 2 });
}
function formatPercent(value) {
  if (value === null) return null;
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
function IndexIntroduction({
  meaning,
  calculation,
  analystUsage,
  relatedIndicators
}) {
  const hasContent = meaning || calculation || analystUsage || relatedIndicators.length > 0;
  if (!hasContent) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/50 rounded-xl p-6 mb-8 shadow-sm", children: [
    /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold tracking-tight mb-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-muted-foreground" }),
      "About This Indicator"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
      meaning && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
          "Meaning"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground leading-relaxed", children: meaning })
      ] }),
      calculation && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Calculator, { className: "w-4 h-4" }),
          "Calculation"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground leading-relaxed", children: calculation })
      ] }),
      analystUsage && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4" }),
          "Analyst Usage"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground leading-relaxed", children: analystUsage })
      ] }),
      relatedIndicators.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Link2, { className: "w-4 h-4" }),
          "Related Indicators"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 200, children: relatedIndicators.map((indicator) => /* @__PURE__ */ jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/indicators/$id",
              params: { id: String(indicator.id) },
              className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/50 text-foreground border border-border/50 hover:bg-muted hover:border-border transition-colors",
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: indicator.code }),
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: indicator.cName })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(
            TooltipContent,
            {
              side: "bottom",
              className: "w-72 p-0 bg-card border border-border shadow-lg rounded-xl overflow-hidden",
              sideOffset: 8,
              hideArrow: true,
              children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-foreground", children: indicator.cName }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: indicator.name })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-3 mb-3", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-foreground tabular-nums tracking-tight", children: formatValue(indicator.latestValue) }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: indicator.latestDate })
                  ] }),
                  indicator.chartData.length > 0 && /* @__PURE__ */ jsx("div", { className: "w-20 h-10 flex-shrink-0", children: /* @__PURE__ */ jsx(
                    IndicatorChart,
                    {
                      data: indicator.chartData,
                      height: 40,
                      lineColor: indicator.yoy && indicator.yoy >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))",
                      areaTopColor: indicator.yoy && indicator.yoy >= 0 ? "hsl(var(--chart-1) / 0.2)" : "hsl(var(--chart-2) / 0.2)",
                      areaBottomColor: indicator.yoy && indicator.yoy >= 0 ? "hsl(var(--chart-1) / 0)" : "hsl(var(--chart-2) / 0)"
                    }
                  ) })
                ] }),
                indicator.yoy !== null && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1 text-xs font-medium ${indicator.yoy >= 0 ? "text-[color:var(--color-chart-1)]" : "text-[color:var(--color-chart-2)]"}`, children: [
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "YoY" }),
                  indicator.yoy >= 0 ? /* @__PURE__ */ jsx(TrendingUp, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(TrendingDown, { className: "w-3 h-3" }),
                  /* @__PURE__ */ jsx("span", { children: formatPercent(indicator.yoy) })
                ] })
              ] })
            }
          )
        ] }, indicator.id)) }) })
      ] })
    ] })
  ] });
}
function PersonalNotes({ initialContent, indicatorId, onSave, className }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const handleEdit = () => {
    setEditContent(content);
    setIsEditing(true);
  };
  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editContent);
      setContent(editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setIsSaving(false);
    }
  };
  const isEmpty = !content.trim();
  return /* @__PURE__ */ jsxs("div", { className: `bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 flex-shrink-0", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold tracking-tight flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-muted-foreground" }),
        "Personal Notes"
      ] }),
      !isEditing && /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: handleEdit,
          className: "gap-2 text-muted-foreground hover:text-foreground",
          children: [
            /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" }),
            isEmpty ? "Add Note" : "Edit"
          ]
        }
      )
    ] }),
    isEditing ? /* @__PURE__ */ jsxs("div", { className: "space-y-4 flex-1 flex flex-col min-h-0", children: [
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: editContent,
          onChange: (e) => setEditContent(e.target.value),
          placeholder: "Write your notes here... (Markdown supported)",
          className: "w-full h-full p-4 rounded-lg border border-border bg-background text-foreground text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent flex-1"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 flex-shrink-0", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: handleCancel,
            disabled: isSaving,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }),
              "Cancel"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            size: "sm",
            onClick: handleSave,
            disabled: isSaving,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
              isSaving ? "Saving..." : "Save"
            ]
          }
        )
      ] })
    ] }) : isEmpty ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 text-muted-foreground flex-1 flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx(FileText, { className: "w-12 h-12 mx-auto mb-3 opacity-50" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: 'No notes yet. Click "Add Note" to start.' })
    ] }) : /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto min-h-0 -mr-2 pr-2", children: /* @__PURE__ */ jsx("div", { className: "prose prose-sm dark:prose-invert max-w-none", children: /* @__PURE__ */ jsx(
      ReactMarkdown,
      {
        components: {
          h1: ({ children }) => /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold mt-4 mb-2 text-foreground", children }),
          h2: ({ children }) => /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mt-3 mb-2 text-foreground", children }),
          h3: ({ children }) => /* @__PURE__ */ jsx("h3", { className: "text-base font-medium mt-2 mb-1 text-foreground", children }),
          p: ({ children }) => /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground leading-relaxed mb-2", children }),
          ul: ({ children }) => /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside text-sm text-foreground mb-2", children }),
          ol: ({ children }) => /* @__PURE__ */ jsx("ol", { className: "list-decimal list-inside text-sm text-foreground mb-2", children }),
          li: ({ children }) => /* @__PURE__ */ jsx("li", { className: "mb-1", children }),
          strong: ({ children }) => /* @__PURE__ */ jsx("strong", { className: "font-semibold text-foreground", children }),
          em: ({ children }) => /* @__PURE__ */ jsx("em", { className: "italic", children }),
          code: ({ children }) => /* @__PURE__ */ jsx("code", { className: "px-1.5 py-0.5 rounded bg-muted text-sm font-mono", children }),
          pre: ({ children }) => /* @__PURE__ */ jsx("pre", { className: "p-3 rounded-lg bg-muted overflow-x-auto text-sm", children }),
          blockquote: ({ children }) => /* @__PURE__ */ jsx("blockquote", { className: "border-l-4 border-border pl-4 italic text-muted-foreground", children })
        },
        children: content
      }
    ) }) })
  ] });
}
export {
  IndexIntroduction as I,
  PersonalNotes as P
};
