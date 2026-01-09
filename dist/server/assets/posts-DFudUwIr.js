import { jsxs, jsx } from "react/jsx-runtime";
import { Link, Outlet } from "@tanstack/react-router";
import { a as Route } from "./router-Cpa8nh8A.js";
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
function PostsComponent() {
  const posts = Route.useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "p-2 flex gap-2", children: [
    /* @__PURE__ */ jsx("ul", { className: "list-disc pl-4", children: [...posts, {
      id: "i-do-not-exist",
      title: "Non-existent Post"
    }].map((post) => {
      return /* @__PURE__ */ jsx("li", { className: "whitespace-nowrap", children: /* @__PURE__ */ jsx(Link, { to: "/posts/$postId", params: {
        postId: String(post.id)
      }, className: "block py-1 text-blue-800 hover:text-blue-600", activeProps: {
        className: "text-black font-bold"
      }, children: /* @__PURE__ */ jsx("div", { children: post.title.substring(0, 20) }) }) }, post.id);
    }) }),
    /* @__PURE__ */ jsx("hr", {}),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
}
export {
  PostsComponent as component
};
