"use client";

import { useEffect, useRef, memo } from "react";
import { createChart, ColorType, LineSeries, type IChartApi, type ISeriesApi } from "lightweight-charts";

/**
 * Attribution Notice:
 * This application uses Lightweight Charts™ (c) 2018-2024 TradingView, Inc. 
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

interface ChartDataPoint {
  time: string;
  value: number;
}

interface IndicatorChartProps {
  data: ChartDataPoint[];
  height?: number;
  width?: number;
  fullSize?: boolean;
  lineColor?: string;
  areaTopColor?: string;
  areaBottomColor?: string;
}

export const IndicatorChart = memo(function IndicatorChart({
  data,
  height = 100,
  width,
  fullSize = false,
  lineColor = "hsl(var(--primary))",
  areaTopColor = "hsl(var(--primary) / 0.2)",
  areaBottomColor = "hsl(var(--primary) / 0)",
}: IndicatorChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartHeight = fullSize ? 400 : height;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: fullSize },
        horzLines: { visible: fullSize },
      },
      width: width ?? chartContainerRef.current.clientWidth,
      height: chartHeight,
      rightPriceScale: {
        visible: fullSize,
        borderVisible: false,
      },
      timeScale: {
        visible: fullSize,
        borderVisible: false,
      },
      handleScroll: fullSize,
      handleScale: fullSize,
      crosshair: {
        mode: fullSize ? 1 : 0, // 1 = Normal, 0 = Hidden
      },
    });

    const series = chart.addSeries(LineSeries, {
      color: lineColor,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: fullSize,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [height, width, fullSize, lineColor]); // Only re-init if layout props change

  // Update data
  useEffect(() => {
    if (seriesRef.current && data) {
      const chartData = data.map((d) => ({
        time: d.time,
        value: d.value,
      }));
      seriesRef.current.setData(chartData as any);
      chartRef.current?.timeScale().fitContent();
    }
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full"
      style={{ height: fullSize ? 400 : height }}
    />
  );
});
