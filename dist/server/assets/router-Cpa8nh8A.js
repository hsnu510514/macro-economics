import { jsx, jsxs } from "react/jsx-runtime";
import { Link, useRouter, useMatch, rootRouteId, ErrorComponent, createRootRoute, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, notFound, createRouter } from "@tanstack/react-router";
import { PanelLeftIcon, TrendingUp, BarChart3, Settings, Sun, Moon } from "lucide-react";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { c as cn, B as Button, D as DashboardSkeleton, a as DetailPageSkeleton } from "./Skeletons-CqO1ZJT3.js";
import { S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle, d as SheetDescription } from "./sheet-CFYfjqLl.js";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent } from "./tooltip-TL3zXRQX.js";
import { ThemeProvider as ThemeProvider$1, useTheme } from "next-themes";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn, j as json, a as getRequestHeaders } from "../server.js";
import { g as getAllIndicatorsWithLatest, a as getIndicatorHistory, b as getIndicatorById, c as getIndicatorMetrics, d as getRelatedIndicators, e as getIndicatorNotes } from "./indicators-BgiItI-J.js";
import { g as getLayout } from "./layout-B6E02iZu.js";
import { d as db, s as syncLogs, i as indicatorValues, a as indicatorMetrics } from "./index-s3Y0O6XI.js";
import { desc, eq } from "drizzle-orm";
const createMiddleware = (options, __opts) => {
  const resolvedOptions = {
    type: "request",
    ...__opts || options
  };
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { middleware })
      );
    },
    inputValidator: (inputValidator) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { inputValidator })
      );
    },
    client: (client) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { client })
      );
    },
    server: (server) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { server })
      );
    }
  };
};
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn(
        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
        className
      ),
      ...props,
      children
    }
  ) }) });
}
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        "data-slot": "sidebar",
        className: cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        ),
        ...props,
        children
      }
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxs(
      SheetContent,
      {
        "data-sidebar": "sidebar",
        "data-slot": "sidebar",
        "data-mobile": "true",
        className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side,
        children: [
          /* @__PURE__ */ jsxs(SheetHeader, { className: "sr-only", children: [
            /* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }),
            /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group peer text-sidebar-foreground hidden md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "sidebar-gap",
            className: cn(
              "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "sidebar-container",
            className: cn(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            ),
            ...props,
            children: /* @__PURE__ */ jsx(
              "div",
              {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar-inner",
                className: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
                children
              }
            )
          }
        )
      ]
    }
  );
}
function SidebarTrigger({
  className,
  onClick,
  ...props
}) {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      className: cn("size-7", className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(PanelLeftIcon, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx(
    "button",
    {
      "data-sidebar": "rail",
      "data-slot": "sidebar-rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      ),
      ...props
    }
  );
}
function SidebarHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
}
function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "sidebar-group-label",
      "data-sidebar": "group-label",
      className: cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
}
function SidebarGroupContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      className: cn("w-full text-sm", className),
      ...props
    }
  );
}
function SidebarMenu({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: cn("flex w-full min-w-0 flex-col gap-1", className),
      ...props
    }
  );
}
function SidebarMenuItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: cn("group/menu-item relative", className),
      ...props
    }
  );
}
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();
  const button = /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props
    }
  );
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx(
      TooltipContent,
      {
        side: "right",
        align: "center",
        hidden: state !== "collapsed" || isMobile,
        ...tooltip
      }
    )
  ] });
}
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3
  }
];
function AppSidebar() {
  return /* @__PURE__ */ jsxs(Sidebar, { variant: "inset", collapsible: "icon", children: [
    /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { size: "lg", asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: "/dashboard", children: [
      /* @__PURE__ */ jsx("div", { className: "group-data-[collapsible=icon]:-ml-2 flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground", children: /* @__PURE__ */ jsx(TrendingUp, { className: "size-4" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5 leading-none", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: "MacroView" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Finance v1.0" })
      ] })
    ] }) }) }) }) }),
    /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsxs(SidebarGroup, { children: [
      /* @__PURE__ */ jsx(SidebarGroupLabel, { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 mb-2", children: "Analytics" }),
      /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: items.map((item) => /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(
        SidebarMenuButton,
        {
          asChild: true,
          tooltip: item.title,
          className: "hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
          children: /* @__PURE__ */ jsxs(Link, { to: item.url, activeProps: { className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }, children: [
            /* @__PURE__ */ jsx(item.icon, { className: "text-muted-foreground" }),
            /* @__PURE__ */ jsx("span", { children: item.title })
          ] })
        }
      ) }, item.title)) }) })
    ] }) }),
    /* @__PURE__ */ jsxs(SidebarFooter, { children: [
      /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, children: /* @__PURE__ */ jsxs("div", { className: "cursor-pointer", children: [
        /* @__PURE__ */ jsx(Settings, { className: "text-muted-foreground" }),
        /* @__PURE__ */ jsx("span", { children: "Settings" })
      ] }) }) }) }),
      /* @__PURE__ */ jsx("div", { className: "px-4 py-2 group-data-[collapsible=icon]:hidden", children: /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://www.tradingview.com/",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-[10px] text-muted-foreground hover:text-primary transition-colors",
          children: "Charts by TradingView"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(SidebarRail, {})
  ] });
}
function DefaultCatchBoundary({ error }) {
  const router2 = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId
  });
  console.error("DefaultCatchBoundary Error:", error);
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6", children: [
    /* @__PURE__ */ jsx(ErrorComponent, { error }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center flex-wrap", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
          },
          className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`,
          children: "Try Again"
        }
      ),
      isRoot ? /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`,
          children: "Home"
        }
      ) : /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`,
          onClick: (e) => {
            e.preventDefault();
            window.history.back();
          },
          children: "Go Back"
        }
      )
    ] })
  ] });
}
function NotFound({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-2", children: [
    /* @__PURE__ */ jsx("div", { className: "text-gray-600 dark:text-gray-400", children: children || /* @__PURE__ */ jsx("p", { children: "The page you are looking for does not exist." }) }),
    /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.history.back(),
          className: "bg-emerald-500 text-white px-2 py-1 rounded-sm uppercase font-black text-sm",
          children: "Go back"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "bg-cyan-600 text-white px-2 py-1 rounded-sm uppercase font-black text-sm",
          children: "Start Over"
        }
      )
    ] })
  ] });
}
function ThemeProvider({
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(ThemeProvider$1, { ...props, children });
}
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "ghost",
      size: "icon",
      onClick: () => setTheme(theme === "light" ? "dark" : "light"),
      className: "rounded-full w-9 h-9 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800",
      children: [
        /* @__PURE__ */ jsx(Sun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }),
        /* @__PURE__ */ jsx(Moon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle theme" })
      ]
    }
  );
}
const appCss = "/assets/app-Boevdebs.css";
const seo = ({
  title,
  description,
  keywords,
  image
}) => {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: "@tannerlinsley" },
    { name: "twitter:site", content: "@tannerlinsley" },
    { name: "og:type", content: "website" },
    { name: "og:title", content: title },
    { name: "og:description", content: description },
    ...image ? [
      { name: "twitter:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "og:image", content: image }
    ] : []
  ];
  return tags;
};
const Route$k = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      ...seo({
        title: "Macro Economic Indicators Dashboard",
        description: `A comprehensive dashboard showcasing key macroeconomic indicators from around the world, providing insights into economic trends and performance.`
      })
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
      { rel: "icon", href: "/favicon.png" }
    ],
    scripts: [
      {
        src: "/customScript.js",
        type: "text/javascript"
      }
    ]
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => /* @__PURE__ */ jsx(NotFound, {}),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(
        ThemeProvider,
        {
          attribute: "class",
          defaultTheme: "system",
          enableSystem: true,
          disableTransitionOnChange: true,
          children: /* @__PURE__ */ jsxs(SidebarProvider, { children: [
            /* @__PURE__ */ jsx(AppSidebar, {}),
            /* @__PURE__ */ jsxs("main", { className: "flex-1 flex flex-col h-screen overflow-hidden", children: [
              /* @__PURE__ */ jsxs("header", { className: "flex h-14 items-center gap-2 border-b bg-background px-4 shrink-0 justify-between", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(SidebarTrigger, {}) }),
                /* @__PURE__ */ jsx(ThemeToggle, {})
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto", children })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx(TanStackRouterDevtools, { position: "bottom-right" }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$e = () => import("./users-dvfPtJKw.js");
const Route$j = createFileRoute("/users")({
  loader: async () => {
    const res = await fetch("/api/users");
    if (!res.ok) {
      throw new Error("Unexpected status code");
    }
    const data = await res.json();
    return data;
  },
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const Route$i = createFileRoute("/redirect")({
  beforeLoad: () => {
    throw redirect({
      to: "/posts"
    });
  }
});
const createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const fn = async (...args) => {
    const serverFn = await getServerFnById(functionId);
    return serverFn(...args);
  };
  return Object.assign(fn, {
    url,
    functionId,
    [TSS_SERVER_FUNCTION]: true
  });
};
const fetchPost_createServerFn_handler = createSsrRpc("0029094260fc8f554fa3ac223696de0e9591567ec6420250e896c91244c812c5");
const fetchPost = createServerFn({
  method: "POST"
}).inputValidator((d) => d).handler(fetchPost_createServerFn_handler, async ({
  data,
  context
}) => {
  console.log("Request context:", context);
  console.info(`Fetching post with id ${data}...`);
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${data}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw notFound();
    }
    throw new Error("Failed to fetch post");
  }
  const post = await res.json();
  return post;
});
const fetchPosts_createServerFn_handler = createSsrRpc("cbb8ca69048418e62742f2c511faa56326b80ace384144a35bb3e0bf5e8124be");
const fetchPosts = createServerFn().handler(fetchPosts_createServerFn_handler, async () => {
  console.info("Fetching posts...");
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  const posts = await res.json();
  return posts.slice(0, 10);
});
const $$splitComponentImporter$d = () => import("./posts-DFudUwIr.js");
const Route$h = createFileRoute("/posts")({
  loader: async () => fetchPosts(),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./deferred-Bn73jNRV.js");
const personServerFn_createServerFn_handler = createSsrRpc("f76e8f8721c12c8547a3ced6a10916f5b5076c1a10dcbeaa607360ce419d0a48");
const personServerFn = createServerFn({
  method: "GET"
}).inputValidator((d) => d).handler(personServerFn_createServerFn_handler, ({
  data: name
}) => {
  return {
    name,
    randomNumber: Math.floor(Math.random() * 100)
  };
});
const slowServerFn_createServerFn_handler = createSsrRpc("fc3988c64f434639dfd4eab3f926b87ee39cc0c14f65b4d0e852c7fd73279a3b");
const slowServerFn = createServerFn({
  method: "GET"
}).inputValidator((d) => d).handler(slowServerFn_createServerFn_handler, async ({
  data: name
}) => {
  await new Promise((r) => setTimeout(r, 1e3));
  return {
    name,
    randomNumber: Math.floor(Math.random() * 100)
  };
});
const Route$g = createFileRoute("/deferred")({
  loader: async () => {
    return {
      deferredStuff: new Promise((r) => setTimeout(() => r("Hello deferred!"), 2e3)),
      deferredPerson: slowServerFn({
        data: "Tanner Linsley"
      }),
      person: await personServerFn({
        data: "John Doe"
      })
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitErrorComponentImporter$4 = () => import("./dashboard-C0YdD-Ee.js");
const $$splitComponentImporter$b = () => import("./dashboard-DKOgZSQ8.js");
const loadDashboard_createServerFn_handler = createSsrRpc("94b930b6f87f315f197e48e360f9e92c9d786a73504cc1935ac61723a07b4986");
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
const Route$f = createFileRoute("/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component"),
  loader: () => loadDashboard(),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$4, "errorComponent"),
  pendingComponent: () => /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background text-foreground transition-colors duration-200", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-8", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Macro Economics Dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1 font-medium", children: "Loading indicators..." })
    ] }) }),
    /* @__PURE__ */ jsx(DashboardSkeleton, {})
  ] }) })
});
const Route$e = createFileRoute("/customScript.js")({
  server: {
    handlers: {
      GET: () => {
        return new Response('console.log("Hello from customScript.js!")', {
          headers: {
            "Content-Type": "application/javascript"
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$a = () => import("./_pathlessLayout-BhrcpZGS.js");
const Route$d = createFileRoute("/_pathlessLayout")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./index-BTU5dmpx.js");
const Route$c = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/dashboard"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./users.index-Bef-9o5f.js");
const Route$b = createFileRoute("/users/")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./posts.index-DU8oxB5n.js");
const Route$a = createFileRoute("/posts/")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitNotFoundComponentImporter$1 = () => import("./users._userId-BK8as6p8.js");
const $$splitComponentImporter$6 = () => import("./users._userId-D6YU-Aa7.js");
const $$splitErrorComponentImporter$3 = () => import("./users._userId-CG2IqJzb.js");
const Route$9 = createFileRoute("/users/$userId")({
  loader: async ({
    params: {
      userId
    }
  }) => {
    try {
      const res = await fetch("/api/users/" + userId);
      if (!res.ok) {
        throw new Error("Unexpected status code");
      }
      const data = await res.json();
      return data;
    } catch {
      throw new Error("Failed to fetch user");
    }
  },
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent")
});
const $$splitNotFoundComponentImporter = () => import("./posts._postId-CB06dAGW.js");
const $$splitComponentImporter$5 = () => import("./posts._postId-BaC4rC5K.js");
const $$splitErrorComponentImporter$2 = () => import("./posts._postId-C9z5TBp-.js");
const Route$8 = createFileRoute("/posts/$postId")({
  loader: ({
    params: {
      postId
    }
  }) => fetchPost({
    data: postId
  }),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$5, "component"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const $$splitErrorComponentImporter$1 = () => import("./indicators._id-C0YdD-Ee.js");
const $$splitComponentImporter$4 = () => import("./indicators._id-C3wg97z6.js");
const loadIndicatorDetail_createServerFn_handler = createSsrRpc("6e3de763758e78f17a6cb1ceba141c803418d512e0d0f85a439a15b6d3efa93d");
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
const Route$7 = createFileRoute("/indicators/$id")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
  loader: ({
    params
  }) => loadIndicatorDetail({
    data: params.id
  }),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  pendingComponent: () => /* @__PURE__ */ jsx(DetailPageSkeleton, {})
});
const userLoggerMiddleware = createMiddleware().server(async ({
  next
}) => {
  console.info("In: /users");
  console.info("Request Headers:", getRequestHeaders());
  const result = await next();
  result.response.headers.set("x-users", "true");
  console.info("Out: /users");
  return result;
});
const testParentMiddleware = createMiddleware().server(async ({
  next
}) => {
  console.info("In: testParentMiddleware");
  const result = await next();
  result.response.headers.set("x-test-parent", "true");
  console.info("Out: testParentMiddleware");
  return result;
});
const testMiddleware = createMiddleware().middleware([testParentMiddleware]).server(async ({
  next
}) => {
  console.info("In: testMiddleware");
  const result = await next();
  result.response.headers.set("x-test", "true");
  console.info("Out: testMiddleware");
  return result;
});
const Route$6 = createFileRoute("/api/users")({
  server: {
    middleware: [testMiddleware, userLoggerMiddleware],
    handlers: {
      GET: async ({
        request
      }) => {
        console.info("GET /api/users @", request.url);
        console.info("Fetching users... @", request.url);
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await res.json();
        const list = data.slice(0, 10);
        return json(list.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email
        })));
      }
    }
  }
});
async function fetchFredSeries(seriesId, startDate) {
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: process.env.FRED_API_KEY,
    file_type: "json"
  });
  if (startDate) {
    params.set("observation_start", startDate);
  }
  const res = await fetch(
    `https://api.stlouisfed.org/fred/series/observations?${params.toString()}`
  );
  if (!res.ok) {
    throw new Error(`FRED API error: ${res.status}`);
  }
  const json2 = await res.json();
  return json2.observations;
}
async function syncIndicatorData(indicatorId, seriesId) {
  const lastValue = await db.query.indicatorValues.findFirst({
    where: eq(indicatorValues.indicator_id, indicatorId),
    orderBy: desc(indicatorValues.date)
  });
  let startDate;
  if (lastValue?.date) {
    const lastDate = new Date(lastValue.date);
    lastDate.setDate(lastDate.getDate() + 1);
    startDate = lastDate.toISOString().slice(0, 10);
  }
  const observations = await fetchFredSeries(seriesId, startDate);
  const existingValues = await db.query.indicatorValues.findMany({
    where: eq(indicatorValues.indicator_id, indicatorId),
    columns: { date: true }
  });
  const existingDates = new Set(existingValues.map((v) => v.date));
  const newRows = observations.filter((o) => o.value !== "." && !existingDates.has(o.date)).map((o) => ({
    indicator_id: indicatorId,
    date: o.date,
    value: o.value
  }));
  if (newRows.length > 0) {
    await db.insert(indicatorValues).values(newRows);
  }
  const latestDate = newRows.length > 0 ? newRows[newRows.length - 1].date : null;
  return { synced: newRows.length, latestDate };
}
async function updateIndicatorMetrics(indicatorId) {
  const values = await db.query.indicatorValues.findMany({
    where: eq(indicatorValues.indicator_id, indicatorId),
    orderBy: desc(indicatorValues.date),
    limit: 400
    // ~1 year of daily data + buffer
  });
  if (values.length < 2) return;
  const latest = parseFloat(values[0].value);
  const latestDate = new Date(values[0].date);
  const monthAgoValue = values.find((v) => {
    const daysDiff = (latestDate.getTime() - new Date(v.date).getTime()) / (1e3 * 60 * 60 * 24);
    return daysDiff >= 28 && daysDiff <= 35;
  });
  const yearAgoValue = values.find((v) => {
    const daysDiff = (latestDate.getTime() - new Date(v.date).getTime()) / (1e3 * 60 * 60 * 24);
    return daysDiff >= 360 && daysDiff <= 370;
  });
  const quarterAgoValue = values.find((v) => {
    const daysDiff = (latestDate.getTime() - new Date(v.date).getTime()) / (1e3 * 60 * 60 * 24);
    return daysDiff >= 85 && daysDiff <= 95;
  });
  const calcChange = (current, previous) => {
    if (previous === void 0 || previous === 0) return 0;
    return (current - previous) / Math.abs(previous) * 100;
  };
  const yoy = calcChange(latest, yearAgoValue ? parseFloat(yearAgoValue.value) : void 0);
  const mom = calcChange(latest, monthAgoValue ? parseFloat(monthAgoValue.value) : void 0);
  const qoq = calcChange(latest, quarterAgoValue ? parseFloat(quarterAgoValue.value) : void 0);
  const existing = await db.query.indicatorMetrics.findFirst({
    where: eq(indicatorMetrics.indicator_id, indicatorId)
  });
  if (existing) {
    await db.update(indicatorMetrics).set({ yoy, mom, qoq, updatedAt: /* @__PURE__ */ new Date() }).where(eq(indicatorMetrics.indicator_id, indicatorId));
  } else {
    await db.insert(indicatorMetrics).values({
      indicator_id: indicatorId,
      yoy,
      mom,
      qoq
    });
  }
}
async function syncAllIndicators() {
  const allIndicators = await db.query.indicators.findMany();
  const results = [];
  for (const indicator of allIndicators) {
    try {
      const { synced, latestDate } = await syncIndicatorData(
        indicator.id,
        indicator.code
      );
      await updateIndicatorMetrics(indicator.id);
      const result = {
        code: indicator.code,
        status: "success",
        recordsSynced: synced,
        latestDate: latestDate ?? void 0
      };
      results.push(result);
      await db.insert(syncLogs).values({
        indicatorCode: indicator.code,
        status: "success",
        recordsSynced: synced
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const result = {
        code: indicator.code,
        status: "error",
        error: errorMessage
      };
      results.push(result);
      await db.insert(syncLogs).values({
        indicatorCode: indicator.code,
        status: "error",
        errorMessage: errorMessage.slice(0, 1e3)
      });
    }
  }
  return results;
}
const Route$5 = createFileRoute("/api/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("Authorization");
        const expectedToken = `Bearer ${process.env.CRON_SECRET}`;
        if (!process.env.CRON_SECRET || authHeader !== expectedToken) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
        try {
          const results = await syncAllIndicators();
          const summary = {
            total: results.length,
            success: results.filter((r) => r.status === "success").length,
            error: results.filter((r) => r.status === "error").length,
            totalRecordsSynced: results.reduce(
              (sum, r) => sum + (r.recordsSynced ?? 0),
              0
            )
          };
          return json({ summary, results });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          return new Response(
            JSON.stringify({ error: "Sync failed", message: errorMessage }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
      }
    }
  }
});
const $$splitComponentImporter$3 = () => import("./_nested-layout-BocDAsiI.js");
const Route$4 = createFileRoute("/_pathlessLayout/_nested-layout")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./posts_._postId.deep-CB1QEDJY.js");
const $$splitErrorComponentImporter = () => import("./posts_._postId.deep-C9z5TBp-.js");
const Route$3 = createFileRoute("/posts_/$postId/deep")({
  loader: async ({
    params: {
      postId
    }
  }) => fetchPost({
    data: postId
  }),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const Route$2 = createFileRoute("/api/users/$userId")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        console.info(`Fetching users by id=${params.userId}... @`, request.url);
        try {
          const res = await fetch(
            "https://jsonplaceholder.typicode.com/users/" + params.userId
          );
          if (!res.ok) {
            throw new Error("Failed to fetch user");
          }
          const user = await res.json();
          return json({
            id: user.id,
            name: user.name,
            email: user.email
          });
        } catch (e) {
          console.error(e);
          return json({ error: "User not found" }, { status: 404 });
        }
      }
    }
  }
});
const $$splitComponentImporter$1 = () => import("./route-b-CsHX6n6-.js");
const Route$1 = createFileRoute("/_pathlessLayout/_nested-layout/route-b")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./route-a-xd-e2Wm0.js");
const Route = createFileRoute("/_pathlessLayout/_nested-layout/route-a")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UsersRoute = Route$j.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => Route$k
});
const RedirectRoute = Route$i.update({
  id: "/redirect",
  path: "/redirect",
  getParentRoute: () => Route$k
});
const PostsRoute = Route$h.update({
  id: "/posts",
  path: "/posts",
  getParentRoute: () => Route$k
});
const DeferredRoute = Route$g.update({
  id: "/deferred",
  path: "/deferred",
  getParentRoute: () => Route$k
});
const DashboardRoute = Route$f.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$k
});
const CustomScriptDotjsRoute = Route$e.update({
  id: "/customScript.js",
  path: "/customScript.js",
  getParentRoute: () => Route$k
});
const PathlessLayoutRoute = Route$d.update({
  id: "/_pathlessLayout",
  getParentRoute: () => Route$k
});
const IndexRoute = Route$c.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$k
});
const UsersIndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => UsersRoute
});
const PostsIndexRoute = Route$a.update({
  id: "/",
  path: "/",
  getParentRoute: () => PostsRoute
});
const UsersUserIdRoute = Route$9.update({
  id: "/$userId",
  path: "/$userId",
  getParentRoute: () => UsersRoute
});
const PostsPostIdRoute = Route$8.update({
  id: "/$postId",
  path: "/$postId",
  getParentRoute: () => PostsRoute
});
const IndicatorsIdRoute = Route$7.update({
  id: "/indicators/$id",
  path: "/indicators/$id",
  getParentRoute: () => Route$k
});
const ApiUsersRoute = Route$6.update({
  id: "/api/users",
  path: "/api/users",
  getParentRoute: () => Route$k
});
const ApiSyncRoute = Route$5.update({
  id: "/api/sync",
  path: "/api/sync",
  getParentRoute: () => Route$k
});
const PathlessLayoutNestedLayoutRoute = Route$4.update({
  id: "/_nested-layout",
  getParentRoute: () => PathlessLayoutRoute
});
const PostsPostIdDeepRoute = Route$3.update({
  id: "/posts_/$postId/deep",
  path: "/posts/$postId/deep",
  getParentRoute: () => Route$k
});
const ApiUsersUserIdRoute = Route$2.update({
  id: "/$userId",
  path: "/$userId",
  getParentRoute: () => ApiUsersRoute
});
const PathlessLayoutNestedLayoutRouteBRoute = Route$1.update({
  id: "/route-b",
  path: "/route-b",
  getParentRoute: () => PathlessLayoutNestedLayoutRoute
});
const PathlessLayoutNestedLayoutRouteARoute = Route.update({
  id: "/route-a",
  path: "/route-a",
  getParentRoute: () => PathlessLayoutNestedLayoutRoute
});
const PathlessLayoutNestedLayoutRouteChildren = {
  PathlessLayoutNestedLayoutRouteARoute,
  PathlessLayoutNestedLayoutRouteBRoute
};
const PathlessLayoutNestedLayoutRouteWithChildren = PathlessLayoutNestedLayoutRoute._addFileChildren(
  PathlessLayoutNestedLayoutRouteChildren
);
const PathlessLayoutRouteChildren = {
  PathlessLayoutNestedLayoutRoute: PathlessLayoutNestedLayoutRouteWithChildren
};
const PathlessLayoutRouteWithChildren = PathlessLayoutRoute._addFileChildren(
  PathlessLayoutRouteChildren
);
const PostsRouteChildren = {
  PostsPostIdRoute,
  PostsIndexRoute
};
const PostsRouteWithChildren = PostsRoute._addFileChildren(PostsRouteChildren);
const UsersRouteChildren = {
  UsersUserIdRoute,
  UsersIndexRoute
};
const UsersRouteWithChildren = UsersRoute._addFileChildren(UsersRouteChildren);
const ApiUsersRouteChildren = {
  ApiUsersUserIdRoute
};
const ApiUsersRouteWithChildren = ApiUsersRoute._addFileChildren(
  ApiUsersRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  PathlessLayoutRoute: PathlessLayoutRouteWithChildren,
  CustomScriptDotjsRoute,
  DashboardRoute,
  DeferredRoute,
  PostsRoute: PostsRouteWithChildren,
  RedirectRoute,
  UsersRoute: UsersRouteWithChildren,
  ApiSyncRoute,
  ApiUsersRoute: ApiUsersRouteWithChildren,
  IndicatorsIdRoute,
  PostsPostIdDeepRoute
};
const routeTree = Route$k._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => /* @__PURE__ */ jsx(NotFound, {}),
    scrollRestoration: true
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  NotFound as N,
  Route$j as R,
  Route$h as a,
  Route$g as b,
  Route$f as c,
  createSsrRpc as d,
  Route$9 as e,
  Route$8 as f,
  Route$7 as g,
  Route$3 as h,
  router as r
};
