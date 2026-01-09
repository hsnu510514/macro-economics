import { jsxs, jsx } from "react/jsx-runtime";
import "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { B as Button } from "./Skeletons-CqO1ZJT3.js";
function ErrorDisplay({ error, onRetry }) {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-zinc-950 flex flex-col items-center justify-center py-16 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-8 h-8 text-red-400" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-zinc-100 mb-2", children: "Failed to load data" }),
    /* @__PURE__ */ jsx("p", { className: "text-zinc-500 max-w-sm mb-2", children: "There was a problem loading the economic data." }),
    error && /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-600 max-w-md mb-6 font-mono", children: error.message }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: onRetry || (() => window.location.reload()),
        variant: "outline",
        className: "gap-2",
        children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }),
          "Try Again"
        ]
      }
    )
  ] });
}
export {
  ErrorDisplay as E
};
