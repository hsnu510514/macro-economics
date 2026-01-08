/// <reference types="vite/client" />
import { AppSidebar } from "@/components/app-sidebar";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import appCss from "@/styles/app.css?url";
import { seo } from "@/utils/seo";
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Macro Economic Indicators Dashboard",
        description: `A comprehensive dashboard showcasing key macroeconomic indicators from around the world, providing insights into economic trends and performance.`,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // {
      //   rel: "apple-touch-icon",
      //   sizes: "180x180",
      //   href: "/apple-touch-icon.png",
      // },
      // {
      //   rel: "icon",
      //   type: "image/png",
      //   sizes: "32x32",
      //   href: "/favicon-32x32.png",
      // },
      // {
      //   rel: "icon",
      //   type: "image/png",
      //   sizes: "16x16",
      //   href: "/favicon-16x16.png",
      // },
      // { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      // { rel: "icon", href: "/favicon.ico" },
      { rel: "icon", href: "/favicon.png" },
    ],
    scripts: [
      {
        src: "/customScript.js",
        type: "text/javascript",
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
