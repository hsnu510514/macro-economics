"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function IndicatorCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-6 w-6" />
      </div>

      {/* Value */}
      <div className="mb-3">
        <Skeleton className="h-8 w-20 mb-1" />
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Metrics badges */}
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-5 w-16 rounded" />
      </div>

      {/* Mini chart */}
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <IndicatorCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-2" />
          <Skeleton className="h-3 w-48" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>

        {/* Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <Skeleton className="h-6 w-24 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-zinc-800/50">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
