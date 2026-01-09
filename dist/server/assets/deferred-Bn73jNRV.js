import { jsxs, jsx } from "react/jsx-runtime";
import { Await } from "@tanstack/react-router";
import { useState, Suspense } from "react";
import { b as Route } from "./router-Cpa8nh8A.js";
import "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./Skeletons-CqO1ZJT3.js";
import "clsx";
import "tailwind-merge";
import "./sheet-CFYfjqLl.js";
import "@radix-ui/react-dialog";
import "./tooltip-TL3zXRQX.js";
import "@radix-ui/react-tooltip";
import "next-themes";
import "@tanstack/react-router-devtools";
import "../server.js";
import "node:async_hooks";
import "@tanstack/react-router/ssr/server";
import "./indicators-BgiItI-J.js";
import "./index-s3Y0O6XI.js";
import "drizzle-orm/pg-core";
import "dotenv/config";
import "drizzle-orm/node-postgres";
import "drizzle-orm";
import "./layout-B6E02iZu.js";
function Deferred() {
  const [count, setCount] = useState(0);
  const {
    deferredStuff,
    deferredPerson,
    person
  } = Route.useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "p-2", children: [
    /* @__PURE__ */ jsxs("div", { "data-testid": "regular-person", children: [
      person.name,
      " - ",
      person.randomNumber
    ] }),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading person..." }), children: /* @__PURE__ */ jsx(Await, { promise: deferredPerson, children: (data) => /* @__PURE__ */ jsxs("div", { "data-testid": "deferred-person", children: [
      data.name,
      " - ",
      data.randomNumber
    ] }) }) }),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading stuff..." }), children: /* @__PURE__ */ jsx(Await, { promise: deferredStuff, children: (data) => /* @__PURE__ */ jsx("h3", { "data-testid": "deferred-stuff", children: data }) }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      "Count: ",
      count
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("button", { onClick: () => setCount(count + 1), children: "Increment" }) })
  ] });
}
export {
  Deferred as component
};
