import { jsxs, jsx } from "react/jsx-runtime";
import { e as Route } from "./router-Cpa8nh8A.js";
import "@tanstack/react-router";
import "lucide-react";
import "react";
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
function UserComponent() {
  const user = Route.useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold underline", children: user.name }),
    /* @__PURE__ */ jsx("div", { className: "text-sm", children: user.email }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("a", { href: `/api/users/${user.id}`, className: "text-blue-800 hover:text-blue-600 underline", children: "View as JSON" }) })
  ] });
}
export {
  UserComponent as component
};
