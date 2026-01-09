"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { IndicatorCard } from "./IndicatorCard";
import type { IndicatorWithLatest } from "@/server/functions/indicators";

interface DashboardGridProps {
  indicators: (IndicatorWithLatest & {
    chartData?: { time: string; value: number }[];
  })[];
  onReorder: (newOrder: number[]) => void;
}

export function DashboardGrid({ indicators, onReorder }: DashboardGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = indicators.findIndex((i) => i.id === active.id);
      const newIndex = indicators.findIndex((i) => i.id === over.id);

      const newIndicators = arrayMove(indicators, oldIndex, newIndex);
      const newOrder = newIndicators.map((i) => i.id);
      onReorder(newOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={indicators.map((i) => i.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {indicators.map((indicator) => (
            <IndicatorCard
              key={indicator.id}
              id={indicator.id}
              code={indicator.code}
              name={indicator.name}
              cName={indicator.cName}
              unit={indicator.unit}
              latestValue={indicator.latestValue}
              latestDate={indicator.latestDate}
              yoy={indicator.yoy}
              mom={indicator.mom}
              chartData={indicator.chartData}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
