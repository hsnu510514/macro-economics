"use client";

import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = "No indicators found",
  description = "There are no economic indicators to display.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
        <TrendingUp className="w-8 h-8 text-zinc-500" />
      </div>
      <h3 className="text-lg font-medium text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-500 max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}
