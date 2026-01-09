import { jsx, jsxs } from "react/jsx-runtime";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function IndicatorCardSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24 mb-1" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-40" })
      ] }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-6" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-20 mb-1" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-32" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-3", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-16 rounded" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-16 rounded" })
    ] }),
    /* @__PURE__ */ jsx(Skeleton, { className: "h-16 w-full" })
  ] });
}
function DashboardSkeleton() {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(IndicatorCardSkeleton, {}, i)) });
}
function DetailPageSkeleton() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-zinc-950 text-zinc-100", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-32 mb-4" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-64 mb-2" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-96 mb-2" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-48" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-20 mb-2" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-24 mb-1" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-16" })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-32 mb-4" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-96 w-full" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-4", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24 mb-4" }),
      Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-2 border-b border-zinc-800/50", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-16" })
      ] }, i))
    ] })
  ] }) });
}
export {
  Button as B,
  DashboardSkeleton as D,
  DetailPageSkeleton as a,
  cn as c
};
