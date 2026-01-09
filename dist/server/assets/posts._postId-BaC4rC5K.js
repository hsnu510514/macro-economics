import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { f as Route } from "./router-Cpa8nh8A.js";
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
function PostComponent() {
  const post = Route.useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold underline", children: post.title }),
    /* @__PURE__ */ jsx("div", { className: "text-sm", children: post.body }),
    /* @__PURE__ */ jsx(Link, { to: "/posts/$postId/deep", params: {
      postId: String(post.id)
    }, activeProps: {
      className: "text-black font-bold"
    }, className: "inline-block py-1 text-blue-800 hover:text-blue-600", children: "Deep View" })
  ] });
}
export {
  PostComponent as component
};
