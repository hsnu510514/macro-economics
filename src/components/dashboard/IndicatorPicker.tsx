"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

interface Indicator {
  id: number;
  code: string;
  name: string;
  cName: string;
  category: string;
}

interface IndicatorPickerProps {
  indicators: Indicator[];
  hiddenIndicators: number[];
  onToggle: (indicatorId: number) => void;
}

export function IndicatorPicker({
  indicators,
  hiddenIndicators,
  onToggle,
}: IndicatorPickerProps) {
  const [open, setOpen] = useState(false);

  // Group indicators by category
  const grouped = indicators.reduce(
    (acc, indicator) => {
      const category = indicator.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(indicator);
      return acc;
    },
    {} as Record<string, Indicator[]>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          Customize
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-zinc-900 border-zinc-800">
        <SheetHeader>
          <SheetTitle className="text-zinc-100">Customize Dashboard</SheetTitle>
          <SheetDescription className="text-zinc-400">
            Select which indicators to display on your dashboard.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-zinc-400 mb-2">
                {category}
              </h4>
              <div className="space-y-2">
                {items.map((indicator) => {
                  const isHidden = hiddenIndicators.includes(indicator.id);
                  return (
                    <label
                      key={indicator.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!isHidden}
                        onChange={() => onToggle(indicator.id)}
                        className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-900"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-zinc-100">
                          {indicator.cName}
                        </div>
                        <div className="text-xs text-zinc-500 truncate">
                          {indicator.name}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
